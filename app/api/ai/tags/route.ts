import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!)

export async function POST(req: NextRequest) {
  try {
    const { content, title } = await req.json()
    
    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 })
    }
    
    // ✅ Use gemini-2.5-flash (same as summarize)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })
    const prompt = `Generate 3-5 relevant single-word tags for this note. Return ONLY comma-separated words:\n\nTitle: ${title}\nContent: ${content}`
    
    const result = await model.generateContent(prompt)
    const tagsText = result.response.text()
    const tags = tagsText.split(',').map(tag => tag.trim()).filter(Boolean)
    
    return NextResponse.json({ tags })
    
  } catch (error: any) {
    console.error("❌ AI Error:", error)
    return NextResponse.json({ 
      error: "Failed to generate tags" 
    }, { status: 500 })
  }
}