import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { validateGoogleDriveUrl } from '@/lib/googledrive'

// PUT - Update Document Drive link
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const link = await prisma.googleDriveLink.findUnique({
      where: { id },
    })

    if (!link) {
      return NextResponse.json({ error: 'Document Drive link not found' }, { status: 404 })
    }

    const body = await request.json()
    const { name, driveUrl, description } = body

    if (!name || !driveUrl) {
      return NextResponse.json(
        { error: 'Name and Drive URL are required' },
        { status: 400 }
      )
    }

    if (!validateGoogleDriveUrl(driveUrl)) {
      return NextResponse.json(
        { error: 'Invalid Document Drive URL format' },
        { status: 400 }
      )
    }

    const updatedLink = await prisma.googleDriveLink.update({
      where: { id },
      data: {
        name,
        driveUrl,
        description: description || null,
      },
    })

    return NextResponse.json({ link: updatedLink })
  } catch (error: any) {
    console.error('Error updating Google Drive link:', error)
    return NextResponse.json(
      { error: error?.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Delete Document Drive link
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const link = await prisma.googleDriveLink.findUnique({
      where: { id },
    })

    if (!link) {
      return NextResponse.json({ error: 'Document Drive link not found' }, { status: 404 })
    }

    await prisma.googleDriveLink.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting Google Drive link:', error)
    return NextResponse.json(
      { error: error?.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
