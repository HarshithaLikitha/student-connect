import { NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { supabase } from "@/lib/supabase"

export async function POST(req: Request) {
  try {
    const { message, sessionId } = await req.json()

    // Prepare context about the platform
    const context = `
      Student Connect is a platform for students to connect, collaborate, and grow together.
      Features include:
      - Skill-based communities where students can join based on interests
      - Project collaboration opportunities
      - Events and hackathons
      - Messaging system
      - Resource sharing
      
      The platform helps students network, find team members for projects, and develop professional skills.
    `

    // Generate AI response
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: `${context}\n\nUser: ${message}\n\nAssistant:`,
      maxTokens: 500,
    })

    // Save the conversation to the database if sessionId is provided
    if (sessionId) {
      // Save user message
      await supabase.from("chat_messages").insert({
        session_id: sessionId,
        is_user: true,
        content: message,
      })

      // Save assistant response
      await supabase.from("chat_messages").insert({
        session_id: sessionId,
        is_user: false,
        content: text,
      })
    }

    return NextResponse.json({ response: text })
  } catch (error) {
    console.error("Error in chat API:", error)
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 })
  }
}
