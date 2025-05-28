import { createServerSupabaseClient } from '@/lib/supabase'

// Define user roles
export const UserRole = {
  USER: 'user',
  MODERATOR: 'moderator',
  ADMIN: 'admin'
}

// Get user role from database
export async function getUserRole(userId) {
  const supabase = createServerSupabaseClient()
  
  const { data, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .single()
  
  if (error) {
    console.error('Error fetching user role:', error)
    return UserRole.USER // Default to regular user if error
  }
  
  return data?.role || UserRole.USER
}

// Check if user has admin permissions
export async function isAdmin(userId) {
  const role = await getUserRole(userId)
  return role === UserRole.ADMIN
}

// Check if user has moderator permissions (or higher)
export async function isModerator(userId) {
  const role = await getUserRole(userId)
  return role === UserRole.MODERATOR || role === UserRole.ADMIN
}

// Assign role to user
export async function assignUserRole(targetUserId, role, adminUserId) {
  try {
    const supabase = createServerSupabaseClient()
    
    // Check if the requesting user is an admin
    const isRequestorAdmin = await isAdmin(adminUserId)
    if (!isRequestorAdmin) {
      throw new Error('Only administrators can assign roles')
    }
    
    // Check if role is valid
    if (!Object.values(UserRole).includes(role)) {
      throw new Error('Invalid role specified')
    }
    
    // Check if user already has a role
    const { data: existingRole, error: checkError } = await supabase
      .from('user_roles')
      .select('id')
      .eq('user_id', targetUserId)
      .single()
    
    if (existingRole) {
      // Update existing role
      const { error } = await supabase
        .from('user_roles')
        .update({ role })
        .eq('id', existingRole.id)
      
      if (error) throw error
    } else {
      // Create new role
      const { error } = await supabase
        .from('user_roles')
        .insert([{ user_id: targetUserId, role }])
      
      if (error) throw error
    }
    
    return { success: true }
  } catch (error) {
    console.error('Error assigning user role:', error)
    return { success: false, error: error.message }
  }
}

// Get all users with their roles
export async function getUsersWithRoles(adminUserId) {
  try {
    const supabase = createServerSupabaseClient()
    
    // Check if the requesting user is an admin
    const isRequestorAdmin = await isAdmin(adminUserId)
    if (!isRequestorAdmin) {
      throw new Error('Only administrators can view all user roles')
    }
    
    const { data, error } = await supabase
      .from('user_profiles')
      .select(`
        id,
        full_name,
        university,
        profile_image_url,
        user_roles(role)
      `)
    
    if (error) throw error
    
    // Format the response
    const usersWithRoles = data.map(user => ({
      id: user.id,
      full_name: user.full_name,
      university: user.university,
      profile_image_url: user.profile_image_url,
      role: user.user_roles && user.user_roles.length > 0 
        ? user.user_roles[0].role 
        : UserRole.USER
    }))
    
    return { success: true, users: usersWithRoles }
  } catch (error) {
    console.error('Error fetching users with roles:', error)
    return { success: false, error: error.message }
  }
}

// Event management permissions

// Check if user can manage an event
export async function canManageEvent(userId, eventId) {
  try {
    const supabase = createServerSupabaseClient()
    
    // Admins can manage any event
    const userIsAdmin = await isAdmin(userId)
    if (userIsAdmin) {
      return true
    }
    
    // Moderators can manage any event
    const userIsModerator = await isModerator(userId)
    if (userIsModerator) {
      return true
    }
    
    // Event organizers can manage their own events
    const { data, error } = await supabase
      .from('events')
      .select('id')
      .eq('id', eventId)
      .eq('organizer_id', userId)
      .single()
    
    return !!data
  } catch (error) {
    console.error('Error checking event management permission:', error)
    return false
  }
}

// Check if user can create events
export async function canCreateEvents(userId) {
  // All authenticated users can create events
  return true
}

// Check if user can feature an event (make it appear at the top)
export async function canFeatureEvent(userId) {
  // Only admins and moderators can feature events
  return await isAdmin(userId) || await isModerator(userId)
}

// Feature an event
export async function featureEvent(eventId, userId) {
  try {
    const supabase = createServerSupabaseClient()
    
    // Check if user has permission
    const hasPermission = await canFeatureEvent(userId)
    if (!hasPermission) {
      throw new Error('You do not have permission to feature events')
    }
    
    // Update event to featured
    const { error } = await supabase
      .from('events')
      .update({ is_featured: true })
      .eq('id', eventId)
    
    if (error) throw error
    
    return { success: true }
  } catch (error) {
    console.error('Error featuring event:', error)
    return { success: false, error: error.message }
  }
}

// Unfeature an event
export async function unfeatureEvent(eventId, userId) {
  try {
    const supabase = createServerSupabaseClient()
    
    // Check if user has permission
    const hasPermission = await canFeatureEvent(userId)
    if (!hasPermission) {
      throw new Error('You do not have permission to unfeature events')
    }
    
    // Update event to unfeatured
    const { error } = await supabase
      .from('events')
      .update({ is_featured: false })
      .eq('id', eventId)
    
    if (error) throw error
    
    return { success: true }
  } catch (error) {
    console.error('Error unfeaturing event:', error)
    return { success: false, error: error.message }
  }
}

// Get featured events
export async function getFeaturedEvents(limit = 5) {
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
      is_featured,
      organizer_id,
      user_profiles!events_organizer_id_fkey(full_name, profile_image_url)
    `)
    .eq('is_featured', true)
    .order('event_date', { ascending: true })
    .gte('event_date', new Date().toISOString().split('T')[0]) // Only future events
    .limit(limit)
  
  if (error) {
    console.error('Error fetching featured events:', error)
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

// Check if user can approve/reject events
export async function canApproveEvents(userId) {
  // Only admins and moderators can approve/reject events
  return await isAdmin(userId) || await isModerator(userId)
}

// Approve an event
export async function approveEvent(eventId, userId) {
  try {
    const supabase = createServerSupabaseClient()
    
    // Check if user has permission
    const hasPermission = await canApproveEvents(userId)
    if (!hasPermission) {
      throw new Error('You do not have permission to approve events')
    }
    
    // Update event to approved
    const { error } = await supabase
      .from('events')
      .update({ status: 'approved', approved_by: userId, approved_at: new Date().toISOString() })
      .eq('id', eventId)
    
    if (error) throw error
    
    return { success: true }
  } catch (error) {
    console.error('Error approving event:', error)
    return { success: false, error: error.message }
  }
}

// Reject an event
export async function rejectEvent(eventId, userId, reason) {
  try {
    const supabase = createServerSupabaseClient()
    
    // Check if user has permission
    const hasPermission = await canApproveEvents(userId)
    if (!hasPermission) {
      throw new Error('You do not have permission to reject events')
    }
    
    // Update event to rejected
    const { error } = await supabase
      .from('events')
      .update({ 
        status: 'rejected', 
        rejected_by: userId, 
        rejected_at: new Date().toISOString(),
        rejection_reason: reason || 'No reason provided'
      })
      .eq('id', eventId)
    
    if (error) throw error
    
    return { success: true }
  } catch (error) {
    console.error('Error rejecting event:', error)
    return { success: false, error: error.message }
  }
}

// Get events pending approval
export async function getPendingEvents(userId) {
  try {
    const supabase = createServerSupabaseClient()
    
    // Check if user has permission
    const hasPermission = await canApproveEvents(userId)
    if (!hasPermission) {
      throw new Error('You do not have permission to view pending events')
    }
    
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
        status,
        created_at,
        organizer_id,
        user_profiles!events_organizer_id_fkey(full_name, profile_image_url)
      `)
      .eq('status', 'pending')
      .order('created_at', { ascending: true })
    
    if (error) throw error
    
    return { success: true, events: data }
  } catch (error) {
    console.error('Error fetching pending events:', error)
    return { success: false, error: error.message }
  }
}

// Get event analytics
export async function getEventAnalytics(eventId, userId) {
  try {
    const supabase = createServerSupabaseClient()
    
    // Check if user can manage this event
    const hasPermission = await canManageEvent(userId, eventId)
    if (!hasPermission) {
      throw new Error('You do not have permission to view analytics for this event')
    }
    
    // Get event details
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .single()
    
    if (eventError) throw eventError
    
    // Get registrations by status
    const { data: registrations, error: regError } = await supabase
      .from('event_registrations')
      .select('status')
      .eq('event_id', eventId)
    
    if (regError) throw regError
    
    // Calculate statistics
    const stats = {
      total_registrations: registrations.length,
      registered: registrations.filter(r => r.status === 'Registered').length,
      waitlisted: registrations.filter(r => r.status === 'Waitlisted').length,
      cancelled: registrations.filter(r => r.status === 'Cancelled').length,
      attended: registrations.filter(r => r.status === 'Attended').length,
    }
    
    // Calculate registration rate if max_participants is set
    if (event.max_participants) {
      stats.registration_rate = (stats.registered / event.max_participants) * 100
    }
    
    return { 
      success: true, 
      event,
      stats
    }
  } catch (error) {
    console.error('Error getting event analytics:', error)
    return { success: false, error: error.message }
  }
}

// Mark attendance for an event
export async function markAttendance(eventId, userId, attendeeId) {
  try {
    const supabase = createServerSupabaseClient()
    
    // Check if user can manage this event
    const hasPermission = await canManageEvent(userId, eventId)
    if (!hasPermission) {
      throw new Error('You do not have permission to mark attendance for this event')
    }
    
    // Check if attendee is registered
    const { data: registration, error: regError } = await supabase
      .from('event_registrations')
      .select('id')
      .eq('event_id', eventId)
      .eq('user_id', attendeeId)
      .single()
    
    if (regError || !registration) {
      throw new Error('User is not registered for this event')
    }
    
    // Update registration status to attended
    const { error } = await supabase
      .from('event_registrations')
      .update({ status: 'Attended' })
      .eq('id', registration.id)
    
    if (error) throw error
    
    return { success: true }
  } catch (error) {
    console.error('Error marking attendance:', error)
    return { success: false, error: error.message }
  }
}

// Export event attendees
export async function exportEventAttendees(eventId, userId) {
  try {
    const supabase = createServerSupabaseClient()
    
    // Check if user can manage this event
    const hasPermission = await canManageEvent(userId, eventId)
    if (!hasPermission) {
      throw new Error('You do not have permission to export attendees for this event')
    }
    
    // Get event details
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('name, event_date')
      .eq('id', eventId)
      .single()
    
    if (eventError) throw eventError
    
    // Get registrations with user details
    const { data: registrations, error: regError } = await supabase
      .from('event_registrations')
      .select(`
        status,
        registration_date,
        user_profiles!event_registrations_user_id_fkey(
          id,
          full_name,
          email,
          university,
          major
        )
      `)
      .eq('event_id', eventId)
    
    if (regError) throw regError
    
    // Format data for export
    const attendees = registrations.map(reg => ({
      full_name: reg.user_profiles.full_name,
      email: reg.user_profiles.email,
      university: reg.user_profiles.university,
      major: reg.user_profiles.major,
      status: reg.status,
      registration_date: reg.registration_date
    }))
    
    return { 
      success: true, 
      event_name: event.name,
      event_date: event.event_date,
      attendees
    }
  } catch (error) {
    console.error('Error exporting event attendees:', error)
    return { success: false, error: error.message }
  }
}
