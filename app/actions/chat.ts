import { createServerSupabaseClient } from '@/lib/supabase'
import { generateText } from 'ai'
import { openai } from '@ai-sdk/openai'

export async function createChatSession(userId) {
  try {
    const supabase = createServerSupabaseClient()
    
    const { data, error } = await supabase
      .from('chat_sessions')
      .insert([{ user_id: userId }])
      .select()
    
    if (error) throw error
    
    return { success: true, session: data[0] }
  } catch (error) {
    console.error('Error creating chat session:', error)
    return { success: false, error: error.message }
  }
}

export async function getChatSessions(userId) {
  const supabase = createServerSupabaseClient()
  
  const { data, error } = await supabase
    .from('chat_sessions')
    .select('id, created_at, updated_at')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching chat sessions:', error)
    return []
  }
  
  return data
}

export async function getChatSessionMessages(sessionId, userId) {
  const supabase = createServerSupabaseClient()
  
  // Verify the session belongs to the user
  const { data: session, error: sessionError } = await supabase
    .from('chat_sessions')
    .select('id')
    .eq('id', sessionId)
    .eq('user_id', userId)
    .single()
  
  if (sessionError || !session) {
    console.error('Chat session not found or does not belong to user')
    return []
  }
  
  const { data, error } = await supabase
    .from('chat_messages')
    .select('id, is_user, content, created_at')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true })
  
  if (error) {
    console.error('Error fetching chat messages:', error)
    return []
  }
  
  return data.map(message => ({
    id: message.id,
    role: message.is_user ? 'user' : 'assistant',
    content: message.content,
    timestamp: message.created_at
  }))
}

export async function sendChatMessage(sessionId, userId, message) {
  try {
    const supabase = createServerSupabaseClient()
    
    if (!message || message.trim().length < 1) {
      throw new Error('Message content cannot be empty')
    }
    
    // Verify the session belongs to the user
    const { data: session, error: sessionError } = await supabase
      .from('chat_sessions')
      .select('id')
      .eq('id', sessionId)
      .eq('user_id', userId)
      .single()
    
    if (sessionError || !session) {
      throw new Error('Chat session not found or does not belong to user')
    }
    
    // Save user message
    const { data: userMessage, error: userMessageError } = await supabase
      .from('chat_messages')
      .insert([
        {
          session_id: sessionId,
          is_user: true,
          content: message
        }
      ])
      .select()
    
    if (userMessageError) throw userMessageError
    
    // Update session's updated_at timestamp
    await supabase
      .from('chat_sessions')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', sessionId)
    
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
    
    // Get previous messages for context
    const { data: previousMessages, error: previousMessagesError } = await supabase
      .from('chat_messages')
      .select('is_user, content')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true })
      .limit(10)
    
    let conversationHistory = ''
    if (!previousMessagesError && previousMessages.length > 0) {
      conversationHistory = previousMessages
        .map(msg => `${msg.is_user ? 'User' : 'Assistant'}: ${msg.content}`)
        .join('\n\n')
    }
    
    // Generate AI response
    const { text } = await generateText({
      model: openai('gpt-4o'),
      prompt: `${context}\n\nConversation history:\n${conversationHistory}\n\nUser: ${message}\n\nAssistant:`,
      maxTokens: 500,
    })
    
    // Save assistant response
    const { data: assistantMessage, error: assistantMessageError } = await supabase
      .from('chat_messages')
      .insert([
        {
          session_id: sessionId,
          is_user: false,
          content: text
        }
      ])
      .select()
    
    if (assistantMessageError) throw assistantMessageError
    
    // Generate suggestions for follow-up questions
    const suggestions = await generateSuggestions(text, message)
    
    return { 
      success: true, 
      userMessage: {
        id: userMessage[0].id,
        role: 'user',
        content: userMessage[0].content,
        timestamp: userMessage[0].created_at
      },
      assistantMessage: {
        id: assistantMessage[0].id,
        role: 'assistant',
        content: assistantMessage[0].content,
        timestamp: assistantMessage[0].created_at,
        suggestions
      }
    }
  } catch (error) {
    console.error('Error sending chat message:', error)
    return { success: false, error: error.message }
  }
}

async function generateSuggestions(assistantResponse, userMessage) {
  try {
    const { text } = await generateText({
      model: openai('gpt-4o'),
      prompt: `Based on this conversation:\n\nUser: ${userMessage}\n\nAssistant: ${assistantResponse}\n\nGenerate 3 short follow-up questions the user might want to ask. Each question should be 5-10 words. Return only the questions as a comma-separated list with no numbering or additional text.`,
      maxTokens: 100,
    })
    
    // Parse the response and return as an array
    return text.split(',').map(q => q.trim()).filter(q => q.length > 0).slice(0, 3)
  } catch (error) {
    console.error('Error generating suggestions:', error)
    return []
  }
}
