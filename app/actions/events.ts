import { createServerSupabaseClient } from '@/lib/supabase'
import { z } from 'zod'

const eventSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  event_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Date must be in YYYY-MM-DD format" }),
  start_time: z.string().regex(/^\d{2}:\d{2}$/, { message: "Start time must be in HH:MM format" }),
  end_time: z.string().regex(/^\d{2}:\d{2}$/, { message: "End time must be in HH:MM format" }),
  location: z.string().min(3, { message: "Location must be at least 3 characters" }),
  type: z.enum(['Hackathon', 'Workshop', 'Conference', 'Meetup', 'Other']),
  max_participants: z.number().int().positive().optional().nullable(),
})

export async function getEvents(limit = 10) {
  const supabase = createServerSupabaseClient()
  
  const { data, error } = await supabase
    .from('events')
    .select(`
      id, 
      name, 
      description,
      event_date,
      start_time,
      end_time,
      location,
      type,
      max_participants,
      created_at,
      organizer_id,
      user_profiles!events_organizer_id_fkey(full_name, profile_image_url)
    `)
    .order('event_date', { ascending: true })
    .gte('event_date', new Date().toISOString().split('T')[0]) // Only future events
    .limit(limit)
  
  if (error) {
    console.error('Error fetching events:', error)
    return []
  }
  
  // Get tags and participant count for each event
  const eventsWithDetails = await Promise.all(data.map(async (event) => {
    // Get tags
    const { data: tags, error: tagsError } = await supabase
      .from('event_tags')
      .select('tag')
      .eq('event_id', event.id)
    
    // Get participant count
    const { count: participantCount, error: participantError } = await supabase
      .from('event_registrations')
      .select('user_id', { count: 'exact', head: true })
      .eq('event_id', event.id)
    
    return {
      ...event,
      tags: tagsError ? [] : tags.map(t => t.tag),
      participants: participantError ? 0 : participantCount
    }
  }))
  
  return eventsWithDetails
}

export async function getEvent(id) {
  const supabase = createServerSupabaseClient()
  
  const { data: event, error } = await supabase
    .from('events')
    .select(`
      id, 
      name, 
      description,
      event_date,
      start_time,
      end_time,
      location,
      type,
      max_participants,
      created_at,
      updated_at,
      organizer_id,
      user_profiles!events_organizer_id_fkey(id, full_name, profile_image_url)
    `)
    .eq('id', id)
    .single()
  
  if (error) {
    console.error('Error fetching event:', error)
    return null
  }
  
  // Get tags
  const { data: tags, error: tagsError } = await supabase
    .from('event_tags')
    .select('tag')
    .eq('event_id', id)
  
  // Get participants
  const { data: participants, error: participantsError } = await supabase
    .from('event_registrations')
    .select(`
      user_id,
      status,
      registration_date,
      user_profiles!event_registrations_user_id_fkey(id, full_name, profile_image_url)
    `)
    .eq('event_id', id)
  
  return {
    ...event,
    tags: tagsError ? [] : tags.map(t => t.tag),
    participants: participantsError ? [] : participants,
    participant_count: participantsError ? 0 : participants.length
  }
}

export async function cancelRegistration(eventId, userId) {
  try {
    const supabase = createServerSupabaseClient()
    
    // Check if user is registered
    const { data: existingRegistration, error: checkError } = await supabase
      .from('event_registrations')
      .select('id')
      .eq('event_id', eventId)
      .eq('user_id', userId)
      .single()
    
    if (checkError || !existingRegistration) {
      throw new Error('You are not registered for this event')
    }
    
    // Update registration status to cancelled
    const { error } = await supabase
      .from('event_registrations')
      .update({ status: 'Cancelled' })
      .eq('id', existingRegistration.id)
    
    if (error) throw error
    
    // If there are waitlisted participants, move one to registered
    const { data: waitlisted, error: waitlistedError } = await supabase
      .from('event_registrations')
      .select('id')
      .eq('event_id', eventId)
      .eq('status', 'Waitlisted')
      .order('registration_date', { ascending: true })
      .limit(1)
    
    if (!waitlistedError && waitlisted.length > 0) {
      await supabase
        .from('event_registrations')
        .update({ status: 'Registered' })
        .eq('id', waitlisted[0].id)
    }
    
    return { success: true }
  } catch (error) {
    console.error('Error cancelling registration:', error)
    return { success: false, error: error.message }
  }
}

// Alias for cancelRegistration to match import in event page
export const unregisterFromEvent = cancelRegistration;

// Rest of the file remains the same
