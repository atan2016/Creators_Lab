import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sendEmail } from '@/lib/email'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    // Verify user has access to classroom
    const userId = (session.user as any).id
    const role = (session.user as any).role

    const classroom = await prisma.classroom.findUnique({
      where: { id },
    })

    if (!classroom) {
      return NextResponse.json(
        { error: 'Classroom not found' },
        { status: 404 }
      )
    }

    const isCreator = classroom.creatorId === userId
    const membership = await prisma.classroomMember.findUnique({
      where: {
        classroomId_userId: {
          classroomId: id,
          userId,
        },
      },
    })

    if (!isCreator && !membership && role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    // Get all top-level posts (not replies), with viewers for visibility filtering
    const allPosts = await prisma.forumPost.findMany({
      where: {
        classroomId: id,
        parentId: null,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        viewers: { select: { userId: true } },
        _count: {
          select: {
            replies: true,
          },
        },
      },
      orderBy: [
        { isAnnouncement: 'desc' }, // Announcements first
        { createdAt: 'desc' },
      ],
    })

    // Non-announcements: only show if user is in viewers list, or is author, or is admin
    const posts = allPosts.filter((p) => {
      if (p.isAnnouncement) return true
      if (role === 'ADMIN') return true
      if (p.authorId === userId) return true
      return p.viewers.some((v) => v.userId === userId)
    })

    return NextResponse.json({ posts })
  } catch (error) {
    console.error('Error fetching forum posts:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    const body = await request.json()
    const { title, content, isAnnouncement, parentId, visibleToUserIds } = body

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      )
    }

    // Verify user has access to classroom
    const userId = (session.user as any).id
    const role = (session.user as any).role

    const classroom = await prisma.classroom.findUnique({
      where: { id },
    })

    if (!classroom) {
      return NextResponse.json(
        { error: 'Classroom not found' },
        { status: 404 }
      )
    }

    const isCreator = classroom.creatorId === userId
    const membership = await prisma.classroomMember.findUnique({
      where: {
        classroomId_userId: {
          classroomId: id,
          userId,
        },
      },
    })

    if (!isCreator && !membership && role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    // Only teachers in the classroom or admins can create announcements
    if (isAnnouncement) {
      const isAdmin = role === 'ADMIN'
      const isTeacherInClassroom = role === 'TEACHER' && (isCreator || !!membership)
      if (!isAdmin && !isTeacherInClassroom) {
        return NextResponse.json(
          { error: 'Only teachers in this classroom or admins can post announcements.' },
          { status: 403 }
        )
      }
    }

    // If parentId is provided, verify it exists and belongs to this classroom
    if (parentId) {
      const parentPost = await prisma.forumPost.findUnique({
        where: { id: parentId },
      })

      if (!parentPost || parentPost.classroomId !== id) {
        return NextResponse.json(
          { error: 'Invalid parent post' },
          { status: 400 }
        )
      }
    }

    // For non-announcements, validate visibleToUserIds are all in this classroom
    const allowedViewerIds = new Set<string>()
    if (!isAnnouncement && Array.isArray(visibleToUserIds) && visibleToUserIds.length > 0) {
      allowedViewerIds.add(classroom.creatorId)
      const memberUsers = await prisma.classroomMember.findMany({
        where: { classroomId: id },
        select: { userId: true },
      })
      memberUsers.forEach((m) => allowedViewerIds.add(m.userId))
      const invalid = (visibleToUserIds as string[]).filter((uid) => !allowedViewerIds.has(uid))
      if (invalid.length > 0) {
        return NextResponse.json(
          { error: 'All selected viewers must be in this classroom.' },
          { status: 400 }
        )
      }
    }

    const post = await prisma.forumPost.create({
      data: {
        title,
        content,
        isAnnouncement: isAnnouncement || false,
        parentId: parentId || null,
        classroomId: id,
        authorId: userId,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    })

    // For non-announcements, create viewer records (author always included)
    if (!isAnnouncement) {
      const viewerIds = new Set<string>([userId])
      if (Array.isArray(visibleToUserIds)) {
        visibleToUserIds.forEach((uid: string) => viewerIds.add(uid))
      }
      await prisma.forumPostViewer.createMany({
        data: [...viewerIds].map((uid) => ({ postId: post.id, userId: uid })),
        skipDuplicates: true,
      })
    }

    // When an announcement is posted, email all students and admins
    if (isAnnouncement && post.author?.email) {
      const baseUrl =
        process.env.NEXT_PUBLIC_SITE_URL ||
        (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://www.creators-lab.org')
      const forumUrl = `${baseUrl}/student/classrooms/${id}/forum`

      const members = await prisma.classroomMember.findMany({
        where: { classroomId: id },
        include: {
          user: { select: { email: true, role: true } },
        },
      })
      const studentEmails = members.filter((m) => m.user.role === 'STUDENT').map((m) => m.user.email)
      const teacherEmailsFromMembers = members
        .filter((m) => m.user.role === 'TEACHER')
        .map((m) => m.user.email)
      const creator = await prisma.user.findUnique({
        where: { id: classroom.creatorId },
        select: { email: true },
      })
      const teacherEmails = [...new Set([
        ...teacherEmailsFromMembers,
        ...(creator ? [creator.email] : []),
      ])]
      const admins = await prisma.user.findMany({
        where: { role: 'ADMIN' },
        select: { email: true },
      })
      const adminEmails = admins.map((a) => a.email)
      const recipientEmails = [...new Set([
        ...studentEmails,
        ...teacherEmails,
        ...adminEmails,
      ])].filter((e): e is string => Boolean(e?.trim()))

      if (recipientEmails.length === 0) {
        console.warn(`[Forum announcement] No recipients for "${title}" in ${classroom.name} (no students/teachers/admins with emails)`)
      }

      const subject = `[${classroom.name}] ${title}`
      const authorName = post.author.name || 'Your teacher'
      const text = `${authorName} posted an announcement in ${classroom.name}:\n\n${title}\n\n${content}\n\nView in forum: ${forumUrl}`
      const html = `
        <p><strong>${authorName}</strong> posted an announcement in <strong>${classroom.name}</strong>:</p>
        <h2>${title}</h2>
        <div style="white-space: pre-wrap;">${content}</div>
        <p><a href="${forumUrl}">View in forum</a></p>
      `

      // Use default From (SMTP config); many providers reject custom From. Reply-To = posting teacher.
      let sent = 0
      let failed = 0
      for (const to of recipientEmails) {
        try {
          await sendEmail({
            to,
            subject,
            text,
            html,
            replyTo: post.author.email,
          })
          sent++
        } catch (err) {
          failed++
          console.error(`[Forum announcement] Failed to send to ${to}:`, err)
        }
      }
      if (recipientEmails.length > 0) {
        console.log(
          `[Forum announcement] "${title}" – sent ${sent}/${recipientEmails.length} emails` +
            (failed > 0 ? `, ${failed} failed` : '')
        )
      }
    }

    return NextResponse.json({ post }, { status: 201 })
  } catch (error) {
    console.error('Error creating forum post:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
