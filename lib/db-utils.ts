import { supabase } from "./supabase"

// User functions
export async function getUserById(id: string) {
  const { data, error } = await supabase.from("users").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching user:", error)
    return null
  }

  return data
}

export async function getUserByEmail(email: string) {
  const { data, error } = await supabase.from("users").select("*").eq("email", email).single()

  if (error && error.code !== "PGRST116") {
    console.error("Error fetching user by email:", error)
    return null
  }

  return data
}

export async function updateUserProfile(userId: string, updates: any) {
  const { data, error } = await supabase
    .from("users")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId)
    .select()
    .single()

  if (error) {
    console.error("Error updating user profile:", error)
    throw error
  }

  return data
}

// Community functions
export async function getCommunities() {
  const { data, error } = await supabase
    .from("communities")
    .select(`
      *,
      community_tags(tag),
      created_by:users(id, username, full_name, avatar_url),
      member_count:community_members(count)
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching communities:", error)
    return []
  }

  return data.map((community) => ({
    ...community,
    tags: community.community_tags.map((t) => t.tag),
    members: community.member_count[0]?.count || 0,
  }))
}

export async function getCommunityById(id: string) {
  const { data, error } = await supabase
    .from("communities")
    .select(`
      *,
      community_tags(tag),
      created_by:users(id, username, full_name, avatar_url),
      member_count:community_members(count)
    `)
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching community:", error)
    return null
  }

  return {
    ...data,
    tags: data.community_tags.map((t) => t.tag),
    members: data.member_count[0]?.count || 0,
  }
}

export async function createCommunity(name: string, description: string, tags: string[], userId: string) {
  const { data: community, error } = await supabase
    .from("communities")
    .insert({
      name,
      description,
      created_by: userId,
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating community:", error)
    throw error
  }

  // Add tags
  if (tags.length > 0) {
    const { error: tagsError } = await supabase.from("community_tags").insert(
      tags.map((tag) => ({
        community_id: community.id,
        tag: tag.trim(),
      })),
    )

    if (tagsError) {
      console.error("Error adding community tags:", tagsError)
    }
  }

  // Add creator as first member
  const { error: memberError } = await supabase.from("community_members").insert({
    community_id: community.id,
    user_id: userId,
  })

  if (memberError) {
    console.error("Error adding creator as member:", memberError)
  }

  return community
}

export async function joinCommunity(communityId: string, userId: string) {
  const { error } = await supabase.from("community_members").insert({
    community_id: communityId,
    user_id: userId,
  })

  if (error) {
    if (error.code === "23505") {
      // Unique constraint violation
      throw new Error("Already a member of this community")
    }
    console.error("Error joining community:", error)
    throw error
  }

  return { success: true }
}

export async function leaveCommunity(communityId: string, userId: string) {
  const { error } = await supabase
    .from("community_members")
    .delete()
    .eq("community_id", communityId)
    .eq("user_id", userId)

  if (error) {
    console.error("Error leaving community:", error)
    throw error
  }

  return { success: true }
}

// Project functions
export async function getProjects() {
  const { data, error } = await supabase
    .from("projects")
    .select(`
      *,
      project_tags(tag),
      project_tech(tech),
      created_by:users(id, username, full_name, avatar_url),
      member_count:project_members(count)
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching projects:", error)
    return []
  }

  return data.map((project) => ({
    ...project,
    tags: project.project_tags.map((t) => t.tag),
    tech: project.project_tech.map((t) => t.tech),
    members: project.member_count[0]?.count || 0,
  }))
}

export async function getProjectById(id: string) {
  const { data, error } = await supabase
    .from("projects")
    .select(`
      *,
      project_tags(tag),
      project_tech(tech),
      created_by:users(id, username, full_name, avatar_url),
      member_count:project_members(count)
    `)
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching project:", error)
    return null
  }

  return {
    ...data,
    tags: data.project_tags.map((t) => t.tag),
    tech: data.project_tech.map((t) => t.tech),
    members: data.member_count[0]?.count || 0,
  }
}

export async function createProject(
  name: string,
  description: string,
  tech: string[],
  tags: string[],
  status: string,
  teamName: string,
  userId: string,
) {
  const { data: project, error } = await supabase
    .from("projects")
    .insert({
      name,
      description,
      status,
      team_name: teamName,
      created_by: userId,
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating project:", error)
    throw error
  }

  // Add technologies
  if (tech.length > 0) {
    const { error: techError } = await supabase.from("project_tech").insert(
      tech.map((t) => ({
        project_id: project.id,
        tech: t.trim(),
      })),
    )

    if (techError) {
      console.error("Error adding project tech:", techError)
    }
  }

  // Add tags
  if (tags.length > 0) {
    const { error: tagsError } = await supabase.from("project_tags").insert(
      tags.map((tag) => ({
        project_id: project.id,
        tag: tag.trim(),
      })),
    )

    if (tagsError) {
      console.error("Error adding project tags:", tagsError)
    }
  }

  // Add creator as first member
  const { error: memberError } = await supabase.from("project_members").insert({
    project_id: project.id,
    user_id: userId,
    role: "Project Lead",
  })

  if (memberError) {
    console.error("Error adding creator as member:", memberError)
  }

  return project
}

export async function joinProject(projectId: string, userId: string) {
  const { error } = await supabase.from("project_members").insert({
    project_id: projectId,
    user_id: userId,
  })

  if (error) {
    if (error.code === "23505") {
      throw new Error("Already a member of this project")
    }
    console.error("Error joining project:", error)
    throw error
  }

  return { success: true }
}

export async function leaveProject(projectId: string, userId: string) {
  const { error } = await supabase.from("project_members").delete().eq("project_id", projectId).eq("user_id", userId)

  if (error) {
    console.error("Error leaving project:", error)
    throw error
  }

  return { success: true }
}

// Event functions
export async function getEvents() {
  const { data, error } = await supabase
    .from("events")
    .select(`
      *,
      event_tags(tag),
      created_by:users(id, username, full_name, avatar_url),
      participant_count:event_participants(count)
    `)
    .order("date", { ascending: true })

  if (error) {
    console.error("Error fetching events:", error)
    return []
  }

  return data.map((event) => ({
    ...event,
    tags: event.event_tags.map((t) => t.tag),
    participants: event.participant_count[0]?.count || 0,
  }))
}

export async function getEventById(id: string) {
  const { data, error } = await supabase
    .from("events")
    .select(`
      *,
      event_tags(tag),
      created_by:users(id, username, full_name, avatar_url),
      participant_count:event_participants(count)
    `)
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching event:", error)
    return null
  }

  return {
    ...data,
    tags: data.event_tags.map((t) => t.tag),
    participants: data.participant_count[0]?.count || 0,
  }
}

export async function createEvent(
  name: string,
  description: string,
  date: string,
  startTime: string,
  endTime: string,
  location: string,
  type: string,
  organizer: string,
  tags: string[],
  capacity: number,
  userId: string,
) {
  const { data: event, error } = await supabase
    .from("events")
    .insert({
      name,
      description,
      date,
      start_time: startTime,
      end_time: endTime,
      location,
      type,
      organizer,
      capacity,
      created_by: userId,
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating event:", error)
    throw error
  }

  // Add tags
  if (tags.length > 0) {
    const { error: tagsError } = await supabase.from("event_tags").insert(
      tags.map((tag) => ({
        event_id: event.id,
        tag: tag.trim(),
      })),
    )

    if (tagsError) {
      console.error("Error adding event tags:", tagsError)
    }
  }

  // Register creator as first participant
  const { error: participantError } = await supabase.from("event_participants").insert({
    event_id: event.id,
    user_id: userId,
  })

  if (participantError) {
    console.error("Error adding creator as participant:", participantError)
  }

  return event
}

export async function registerForEvent(eventId: string, userId: string) {
  const { error } = await supabase.from("event_participants").insert({
    event_id: eventId,
    user_id: userId,
  })

  if (error) {
    if (error.code === "23505") {
      throw new Error("Already registered for this event")
    }
    console.error("Error registering for event:", error)
    throw error
  }

  return { success: true }
}

export async function unregisterFromEvent(eventId: string, userId: string) {
  const { error } = await supabase.from("event_participants").delete().eq("event_id", eventId).eq("user_id", userId)

  if (error) {
    console.error("Error unregistering from event:", error)
    throw error
  }

  return { success: true }
}

// Chat functions
export async function createChatSession(userId: string) {
  const { data, error } = await supabase.from("chat_sessions").insert({ user_id: userId }).select().single()

  if (error) {
    console.error("Error creating chat session:", error)
    throw error
  }

  return data
}

export async function saveChatMessage(sessionId: string, isUser: boolean, content: string) {
  const { data, error } = await supabase
    .from("chat_messages")
    .insert({
      session_id: sessionId,
      is_user: isUser,
      content: content,
    })
    .select()
    .single()

  if (error) {
    console.error("Error saving chat message:", error)
    throw error
  }

  return data
}

// Blog functions
export async function getBlogPosts() {
  const { data, error } = await supabase
    .from("blog_posts")
    .select(`
      *,
      blog_tags(tag),
      author:users(id, username, full_name, avatar_url)
    `)
    .eq("published", true)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching blog posts:", error)
    return []
  }

  return data.map((post) => ({
    ...post,
    tags: post.blog_tags.map((t) => t.tag),
  }))
}

export async function getBlogPostById(id: string) {
  const { data, error } = await supabase
    .from("blog_posts")
    .select(`
      *,
      blog_tags(tag),
      author:users(id, username, full_name, avatar_url)
    `)
    .eq("id", id)
    .eq("published", true)
    .single()

  if (error) {
    console.error("Error fetching blog post:", error)
    return null
  }

  return {
    ...data,
    tags: data.blog_tags.map((t) => t.tag),
  }
}

// Tutorial functions
export async function getTutorials() {
  const { data, error } = await supabase
    .from("tutorials")
    .select(`
      *,
      tutorial_tags(tag),
      author:users(id, username, full_name, avatar_url)
    `)
    .eq("published", true)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching tutorials:", error)
    return []
  }

  return data.map((tutorial) => ({
    ...tutorial,
    tags: tutorial.tutorial_tags.map((t) => t.tag),
  }))
}

export async function getTutorialById(id: string) {
  const { data, error } = await supabase
    .from("tutorials")
    .select(`
      *,
      tutorial_tags(tag),
      author:users(id, username, full_name, avatar_url)
    `)
    .eq("id", id)
    .eq("published", true)
    .single()

  if (error) {
    console.error("Error fetching tutorial:", error)
    return null
  }

  return {
    ...data,
    tags: data.tutorial_tags.map((t) => t.tag),
  }
}

// FAQ functions
export async function getFAQs() {
  const { data, error } = await supabase.from("faqs").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching FAQs:", error)
    return []
  }

  return data
}

// Support functions
export async function createSupportTicket(userId: string, subject: string, message: string, priority = "medium") {
  const { data, error } = await supabase
    .from("support_tickets")
    .insert({
      user_id: userId,
      subject,
      message,
      priority,
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating support ticket:", error)
    throw error
  }

  return data
}

export async function getUserSupportTickets(userId: string) {
  const { data, error } = await supabase
    .from("support_tickets")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching user support tickets:", error)
    return []
  }

  return data
}
