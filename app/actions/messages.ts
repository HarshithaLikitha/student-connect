import { createServerSupabaseClient } from '@/lib/supabase'
import { z } from 'zod'

export async function getConversations(userId) {
  const supabase = createServerSupabaseClient()
  
  // Get all conversations where the user is a participant
  const { data: participations, error: participationError } = await supabase
    .from('conversation_participants')
    .select('conversation_id')
    .eq('user_id', userId)
  
  if (participationError) {
    console.error('Error fetching user conversations:', participationError)
    return []
  }
  
  const conversationIds = participations.map(p => p.conversation_id)
  
  if (conversationIds.length === 0) {
    return []
  }
  
  // Get conversation details
  const { data: conversations, error: conversationsError } = await supabase
    .from('conversations')
    .select('id, name, is_group, created_at, updated_at')
    .in('id', conversationIds)
    .order('updated_at', { ascending: false })
  
  if (conversationsError) {
    console.error('Error fetching conversations:', conversationsError)
    return []
  }
  
  // Enhance conversations with additional details
  const enhancedConversations = await Promise.all(conversations.map(async (conversation) => {
    // Get participants
    const { data: participants, error: participantsError } = await supabase
      .from('conversation_participants')
      .select(`
        user_id,
        user_profiles!conversation_participants_user_id_fkey(id, full_name, profile_image_url)
      `)
      .eq('conversation_id', conversation.id)
    
    // Get the latest message
    const { data: latestMessages, error: messagesError } = await supabase
      .from('messages')
      .select(`
        id,
        content,
        created_at,
        sender_id,
        read_by
      `)
      .eq('conversation_id', conversation.id)
      .order('created_at', { ascending: false })
      .limit(1)
    
    const latestMessage = messagesError || latestMessages.length === 0 ? null : latestMessages[0]
    
    // Count unread messages
    const { count: unreadCount, error: unreadError } = await supabase
      .from('messages')
      .select('id', { count: 'exact', head: true })
      .eq('conversation_id', conversation.id)
      .not('read_by', 'cs', `{"${userId}"}`)
    
    // For non-group conversations, use the other participant's name as conversation name
    let displayName = conversation.name
    let avatar = null
    
    if (!conversation.is_group && participants && participants.length > 0) {
      const otherParticipant = participants.find(p => p.user_id !== userId)
      if (otherParticipant && otherParticipant.user_profiles) {
        displayName = otherParticipant.user_profiles.full_name
        avatar = otherParticipant.user_profiles.profile_image_url
      }
    }
    
    return {
      ...conversation,
      name: displayName,
      avatar: avatar,
      participants: participantsError ? [] : participants,
      lastMessage: latestMessage ? {
        content: latestMessage.content,
        time: latestMessage.created_at,
        senderId: latestMessage.sender_id,
        isRead: latestMessage.read_by && latestMessage.read_by.includes(userId)
      } : null,
      unread: unreadError ? 0 : unreadCount
    }
  }))
  
  return enhancedConversations
}

export async function getConversation(id, userId) {
  const supabase = createServerSupabaseClient()
  
  // Check if user is a participant
  const { data: participation, error: participationError } = await supabase
    .from('conversation_participants')
    .select('conversation_id')
    .eq('conversation_id', id)
    .eq('user_id', userId)
    .single()
  
  if (participationError || !participation) {
    console.error('User is not a participant in this conversation')
    return null
  }
  
  // Get conversation details
  const { data: conversation, error: conversationError } = await supabase
    .from('conversations')
    .select('id, name, is_group, created_at, updated_at')
    .eq('id', id)
    .single()
  
  if (conversationError) {
    console.error('Error fetching conversation:', conversationError)
    return null
  }
  
  // Get participants
  const { data: participants, error: participantsError } = await supabase
    .from('conversation_participants')
    .select(`
      user_id,
      joined_at,
      user_profiles!conversation_participants_user_id_fkey(id, full_name, profile_image_url)
    `)
    .eq('conversation_id', id)
  
  // For non-group conversations, use the other participant's name as conversation name
  let displayName = conversation.name
  let avatar = null
  
  if (!conversation.is_group && participants && participants.length > 0) {
    const otherParticipant = participants.find(p => p.user_id !== userId)
    if (otherParticipant && otherParticipant.user_profiles) {
      displayName = otherParticipant.user_profiles.full_name
      avatar = otherParticipant.user_profiles.profile_image_url
    }
  }
  
  return {
    ...conversation,
    name: displayName,
    avatar: avatar,
    participants: participantsError ? [] : participants
  }
}

export async function getMessages(conversationId, userId, limit = 50) {
  const supabase = createServerSupabaseClient()
  
  // Check if user is a participant
  const { data: participation, error: participationError } = await supabase
    .from('conversation_participants')
    .select('conversation_id')
    .eq('conversation_id', conversationId)
    .eq('user_id', userId)
    .single()
  
  if (participationError || !participation) {
    console.error('User is not a participant in this conversation')
    return []
  }
  
  // Get messages
  const { data: messages, error: messagesError } = await supabase
    .from('messages')
    .select(`
      id,
      content,
      created_at,
      sender_id,
      read_by,
      user_profiles!messages_sender_id_fkey(id, full_name, profile_image_url)
    `)
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: false })
    .limit(limit)
  
  if (messagesError) {
    console.error('Error fetching messages:', messagesError)
    return []
  }
  
  // Mark messages as read
  const messagesToMark = messages
    .filter(msg => msg.sender_id !== userId && (!msg.read_by || !msg.read_by.includes(userId)))
    .map(msg => msg.id)
  
  if (messagesToMark.length > 0) {
    await Promise.all(messagesToMark.map(async (messageId) => {
      const { data: message, error: fetchError } = await supabase
        .from('messages')
        .select('read_by')
        .eq('id', messageId)
        .single()
      
      if (!fetchError) {
        const readBy = message.read_by || []
        if (!readBy.includes(userId)) {
          readBy.push(userId)
          await supabase
            .from('messages')
            .update({ read_by: readBy })
            .eq('id', messageId)
        }
      }
    }))
  }
  
  // Format messages for the client
  const formattedMessages = messages.map(message => ({
    id: message.id,
    content: message.content,
    timestamp: message.created_at,
    sender: {
      id: message.sender_id,
      name: message.user_profiles?.full_name || 'Unknown User',
      avatar: message.user_profiles?.profile_image_url || null
    },
    isRead: message.read_by && message.read_by.includes(userId),
    isMine: message.sender_id === userId
  }))
  
  // Return in chronological order
  return formattedMessages.reverse()
}

export async function sendMessage(conversationId, senderId, content) {
  try {
    const supabase = createServerSupabaseClient()
    
    if (!content || content.trim().length < 1) {
      throw new Error('Message content cannot be empty')
    }
    
    // Check if user is a participant
    const { data: participation, error: participationError } = await supabase
      .from('conversation_participants')
      .select('conversation_id')
      .eq('conversation_id', conversationId)
      .eq('user_id', senderId)
      .single()
    
    if (participationError || !participation) {
      throw new Error('You are not a participant in this conversation')
    }
    
    // Send message
    const { data, error } = await supabase
      .from('messages')
      .insert([
        {
          conversation_id: conversationId,
          sender_id: senderId,
          content,
          read_by: [senderId] // Sender has read their own message
        }
      ])
      .select()
    
    if (error) throw error
    
    // Update conversation's updated_at timestamp
    await supabase
      .from('conversations')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', conversationId)
    
    return { success: true, message: data[0] }
  } catch (error) {
    console.error('Error sending message:', error)
    return { success: false, error: error.message }
  }
}

export async function createConversation(creatorId, name = null, isGroup = false, participantIds = []) {
  try {
    const supabase = createServerSupabaseClient()
    
    // For non-group conversations, ensure there are exactly 2 participants
    if (!isGroup && participantIds.length !== 1) {
      throw new Error('Non-group conversations must have exactly one other participant')
    }
    
    // For non-group conversations, check if a conversation already exists
    if (!isGroup) {
      const otherUserId = participantIds[0]
      
      // Find conversations where both users are participants
      const { data: creatorConversations, error: creatorError } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('user_id', creatorId)
      
      if (!creatorError && creatorConversations.length > 0) {
        const creatorConversationIds = creatorConversations.map(c => c.conversation_id)
        
        const { data: sharedConversations, error: sharedError } = await supabase
          .from('conversation_participants')
          .select('conversation_id')
          .eq('user_id', otherUserId)
          .in('conversation_id', creatorConversationIds)
        
        if (!sharedError && sharedConversations.length > 0) {
          // Check if any of these are non-group conversations
          for (const shared of sharedConversations) {
            const { data: conversation, error: convError } = await supabase
              .from('conversations')
              .select('id, is_group')
              .eq('id', shared.conversation_id)
              .single()
            
            if (!convError && !conversation.is_group) {
              // Return the existing conversation
              return { 
                success: true, 
                conversation: conversation,
                existing: true
              }
            }
          }
        }
      }
    }
    
    // Create new conversation
    const { data: conversation, error: conversationError } = await supabase
      .from('conversations')
      .insert([
        {
          name: isGroup ? name : null,
          is_group: isGroup
        }
      ])
      .select()
    
    if (conversationError) throw conversationError
    
    const conversationId = conversation[0].id
    
    // Add creator as participant
    const { error: creatorError } = await supabase
      .from('conversation_participants')
      .insert([
        {
          conversation_id: conversationId,
          user_id: creatorId
        }
      ])
    
    if (creatorError) throw creatorError
    
    // Add other participants
    if (participantIds.length > 0) {
      const participantEntries = participantIds.map(userId => ({
        conversation_id: conversationId,
        user_id: userId
      }))
      
      const { error: participantsError } = await supabase
        .from('conversation_participants')
        .insert(participantEntries)
      
      if (participantsError) throw participantsError
    }
    
    return { success: true, conversation: conversation[0], existing: false }
  } catch (error) {
    console.error('Error creating conversation:', error)
    return { success: false, error: error.message }
  }
}

export async function addParticipant(conversationId, userId, newParticipantId) {
  try {
    const supabase = createServerSupabaseClient()
    
    // Check if the conversation is a group
    const { data: conversation, error: conversationError } = await supabase
      .from('conversations')
      .select('is_group')
      .eq('id', conversationId)
      .single()
    
    if (conversationError || !conversation) {
      throw new Error('Conversation not found')
    }
    
    if (!conversation.is_group) {
      throw new Error('Cannot add participants to non-group conversations')
    }
    
    // Check if user is a participant
    const { data: participation, error: participationError } = await supabase
      .from('conversation_participants')
      .select('conversation_id')
      .eq('conversation_id', conversationId)
      .eq('user_id', userId)
      .single()
    
    if (participationError || !participation) {
      throw new Error('You are not a participant in this conversation')
    }
    
    // Check if new participant is already in the conversation
    const { data: existingParticipation, error: existingError } = await supabase
      .from('conversation_participants')
      .select('conversation_id')
      .eq('conversation_id', conversationId)
      .eq('user_id', newParticipantId)
      .single()
    
    if (existingParticipation) {
      throw new Error('User is already a participant in this conversation')
    }
    
    // Add new participant
    const { error: addError } = await supabase
      .from('conversation_participants')
      .insert([
        {
          conversation_id: conversationId,
          user_id: newParticipantId
        }
      ])
    
    if (addError) throw addError
    
    return { success: true }
  } catch (error) {
    console.error('Error adding participant:', error)
    return { success: false, error: error.message }
  }
}

export async function leaveConversation(conversationId, userId) {
  try {
    const supabase = createServerSupabaseClient()
    
    // Remove user from conversation
    const { error } = await supabase
      .from('conversation_participants')
      .delete()
      .eq('conversation_id', conversationId)
      .eq('user_id', userId)
    
    if (error) throw error
    
    return { success: true }
  } catch (error) {
    console.error('Error leaving conversation:', error)
    return { success: false, error: error.message }
  }
}
