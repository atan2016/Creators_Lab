import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { postId } = await params
    const post = await prisma.forumPost.findUnique({
      where: { id: postId },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        classroom: true,
        viewers: { select: { userId: true } },
        replies: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
              },
            },
            replies: {
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
              orderBy: { createdAt: 'asc' },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    })

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    // Verify user has access to classroom
    const userId = (session.user as any).id
    const role = (session.user as any).role

    const isCreator = post.classroom.creatorId === userId
    const membership = await prisma.classroomMember.findUnique({
      where: {
        classroomId_userId: {
          classroomId: post.classroom.id,
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

    // Non-announcement: only allow if user is in viewers, or is author, or is admin
    if (!post.isAnnouncement && role !== 'ADMIN' && post.authorId !== userId) {
      const canView = post.viewers.some((v) => v.userId === userId)
      if (!canView) {
        return NextResponse.json(
          { error: 'You do not have access to this post' },
          { status: 403 }
        )
      }
    }

    return NextResponse.json({ post })
  } catch (error) {
    console.error('Error fetching forum post:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/** Recursively delete a post and all its replies (children first for FK). */
async function deletePostAndReplies(postId: string) {
  const children = await prisma.forumPost.findMany({
    where: { parentId: postId },
    select: { id: true },
  })
  for (const child of children) {
    await deletePostAndReplies(child.id)
  }
  await prisma.forumPost.delete({ where: { id: postId } })
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const role = (session.user as any).role
    if (role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Only admins can delete forum posts' },
        { status: 403 }
      )
    }

    const { postId } = await params
    const post = await prisma.forumPost.findUnique({
      where: { id: postId },
      select: { id: true },
    })

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    await deletePostAndReplies(postId)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting forum post:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
