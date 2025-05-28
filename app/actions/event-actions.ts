"use server"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"

// Get server-side Supabase client
async function getServerSupabase() {
  const cookieStore = cookies()
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: any) {
        cookieStore.set({ name, value, ...options })
      },
      remove(name: string, options: any) {
        cookieStore.set({ name, value: "", ...options })
      },
    },
  })
}

export async function registerForEvent(eventId: string) {
  const supabase = await getServerSupabase()

  // Get current user
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    return { success: false, message: "You must be logged in to register for an event" }
  }

  const userId = session.user.id

  // Check if user is already registered
  const { data: existingRegistration, error: checkError } = await supabase
    .from("event_participants")
    .select("*")
    .eq("user_id", userId)
    .eq("event_id", eventId)
    .single()

  if (checkError && checkError.code !== "PGRST116") {
    console.error("Error checking registration:", checkError)
    return { success: false, message: "Failed to check registration status" }
  }

  if (existingRegistration) {
    return { success: false, message: "You are already registered for this event" }
  }

  // Register for the event
  const { error: registerError } = await supabase.from("event_participants").insert({
    id: crypto.randomUUID(),
    user_id: userId,
    event_id: eventId,
    registered_at: new Date().toISOString(),
  })

  if (registerError) {
    console.error("Error registering for event:", registerError)
    return { success: false, message: "Failed to register for event" }
  }

  // Update participant count
  await supabase.rpc("increment_event_participants", { p_event_id: eventId })

  // Create notification
  await supabase.from("notifications").insert({
    id: crypto.randomUUID(),
    user_id: userId,
    type: "event_registration",
    content: "You have successfully registered for an event",
    reference_id: eventId,
    reference_type: "event",
    created_at: new Date().toISOString(),
    is_read: false,
  })

  revalidatePath(`/events/${eventId}`)

  return { success: true, message: "Successfully registered for event" }
}

export async function unregisterFromEvent(eventId: string) {
  const supabase = await getServerSupabase()

  // Get current user
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    return { success: false, message: "You must be logged in to unregister from an event" }
  }

  const userId = session.user.id

  // Check if user is registered
  const { data: existingRegistration, error: checkError } = await supabase
    .from("event_participants")
    .select("*")
    .eq("user_id", userId)
    .eq("event_id", eventId)
    .single()

  if (checkError) {
    if (checkError.code === "PGRST116") {
      return { success: false, message: "You are not registered for this event" }
    }
    console.error("Error checking registration:", checkError)
    return { success: false, message: "Failed to check registration status" }
  }

  // Unregister from the event
  const { error: unregisterError } = await supabase
    .from("event_participants")
    .delete()
    .eq("user_id", userId)
    .eq("event_id", eventId)

  if (unregisterError) {
    console.error("Error unregistering from event:", unregisterError)
    return { success: false, message: "Failed to unregister from event" }
  }

  // Update participant count
  await supabase.rpc("decrement_event_participants", { p_event_id: eventId })

  revalidatePath(`/events/${eventId}`)

  return { success: true, message: "Successfully unregistered from event" }
}

export async function isEventParticipant(eventId: string) {
  const supabase = await getServerSupabase()

  // Get current user
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    return false
  }

  const userId = session.user.id

  // Check if user is registered
  const { data, error } = await supabase
    .from("event_participants")
    .select("*")
    .eq("user_id", userId)
    .eq("event_id", eventId)
    .single()

  if (error) {
    if (error.code === "PGRST116") {
      return false
    }
    console.error("Error checking registration:", error)
    return false
  }

  return true
}
