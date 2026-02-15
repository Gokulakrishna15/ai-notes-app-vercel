import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!)

export async function POST(req: NextRequest) {
  try {
    const { content } = await req.json()
    
    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 })
    }
    
    // ✅ Use gemini-2.5-flash (same as summarize)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })
    const prompt = `Improve this text by fixing grammar, improving clarity, and making it more professional. Keep the same meaning. Return ONLY the improved text:\n\n${content}`
    
    const result = await model.generateContent(prompt)
    const improved = result.response.text().trim()
    
    return NextResponse.json({ improved })
    
  } catch (error: any) {
    console.error("❌ AI Error:", error)
    return NextResponse.json({ 
      error: "Failed to improve content" 
    }, { status: 500 })
  }
}