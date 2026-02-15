import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import connectToDatabase from '@/lib/db'
import Note from '@/models/Note'

// GET all notes for logged-in user
export async function GET() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    await connectToDatabase()
    const notes = await Note.find({ userId }).sort({ createdAt: -1 })
    return NextResponse.json(notes)
    
  } catch (error: any) {
    console.error("❌ Error fetching notes:", error)
    return NextResponse.json({ error: "Failed to fetch notes" }, { status: 500 })
  }
}

// POST - Create new note
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    await connectToDatabase()
    const body = await req.json()
    const note = await Note.create({ 
      ...body, 
      userId
    })
    
    console.log("💾 Note Saved!")
    return NextResponse.json(note)
    
  } catch (error: any) {
    console.error("❌ Database Error:", error)
    return NextResponse.json({ error: "Database Save Failed" }, { status: 500 })
  }
}

// PUT - Update existing note
export async function PUT(req: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    const { id, title, content, tags } = await req.json()
    
    await connectToDatabase()
    const note = await Note.findOneAndUpdate(
      { _id: id, userId },
      { title, content, tags },
      { new: true }
    )
    
    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 })
    }
    
    return NextResponse.json(note)
    
  } catch (error: any) {
    console.error("❌ Update Error:", error)
    return NextResponse.json({ error: "Failed to update note" }, { status: 500 })
  }
}

// DELETE - Remove note
export async function DELETE(req: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    
    await connectToDatabase()
    const note = await Note.findOneAndDelete({ _id: id, userId })
    
    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 })
    }
    
    return NextResponse.json({ message: "Note deleted successfully" })
    
  } catch (error: any) {
    console.error("❌ Delete Error:", error)
    return NextResponse.json({ error: "Failed to delete note" }, { status: 500 })
  }
}