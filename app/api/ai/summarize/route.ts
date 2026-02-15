/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

export async function POST(req: NextRequest) {
  try {
    const { content } = await req.json();
    console.log("🤖 Request received for content:", content?.substring(0, 20));

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    // Use gemini-pro for text summarization (most stable)
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `Summarize this note in exactly one short, professional sentence:\n\n${content}`;

    const result = await model.generateContent(prompt);
    const summary = result.response.text();

    console.log("✅ Summary generated successfully:", summary);
    return NextResponse.json({ summary });
  } catch (error: any) {
    console.error("❌ AI Error Details:", error);
    return NextResponse.json(
      {
        error: error?.message || "AI Generation Failed",
        details: JSON.stringify(error, null, 2), // helpful for debugging
      },
      { status: 500 }
    );
  }
}