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

export async function joinCommunity(communityId: string) {
  const supabase = await getServerSupabase()

  // Get current user
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    return { success: false, message: "You must be logged in to join a community" }
  }

  const userId = session.user.id

  // Check if user is already a member
  const { data: existingMember, error: checkError } = await supabase
    .from("community_members")
    .select("*")
    .eq("user_id", userId)
    .eq("community_id", communityId)
    .single()

  if (checkError && checkError.code !== "PGRST116") {
    console.error("Error checking membership:", checkError)
    return { success: false, message: "Failed to check membership status" }
  }

  if (existingMember) {
    return { success: false, message: "You are already a member of this community" }
  }

  // Join the community
  const { error: joinError } = await supabase.from("community_members").insert({
    id: crypto.randomUUID(),
    user_id: userId,
    community_id: communityId,
    joined_at: new Date().toISOString(),
  })

  if (joinError) {
    console.error("Error joining community:", joinError)
    return { success: false, message: "Failed to join community" }
  }

  // Update member count
  await supabase.rpc("increment_community_members", { p_community_id: communityId })

  // Create notification
  await supabase.from("notifications").insert({
    id: crypto.randomUUID(),
    user_id: userId,
    type: "community_join",
    content: "You have successfully joined a new community",
    reference_id: communityId,
    reference_type: "community",
    created_at: new Date().toISOString(),
    is_read: false,
  })

  revalidatePath(`/communities/${communityId}`)

  return { success: true, message: "Successfully joined community" }
}

export async function leaveCommunity(communityId: string) {
  const supabase = await getServerSupabase()

  // Get current user
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    return { success: false, message: "You must be logged in to leave a community" }
  }

  const userId = session.user.id

  // Check if user is a member
  const { data: existingMember, error: checkError } = await supabase
    .from("community_members")
    .select("*")
    .eq("user_id", userId)
    .eq("community_id", communityId)
    .single()

  if (checkError) {
    if (checkError.code === "PGRST116") {
      return { success: false, message: "You are not a member of this community" }
    }
    console.error("Error checking membership:", checkError)
    return { success: false, message: "Failed to check membership status" }
  }

  // Leave the community
  const { error: leaveError } = await supabase
    .from("community_members")
    .delete()
    .eq("user_id", userId)
    .eq("community_id", communityId)

  if (leaveError) {
    console.error("Error leaving community:", leaveError)
    return { success: false, message: "Failed to leave community" }
  }

  // Update member count
  await supabase.rpc("decrement_community_members", { p_community_id: communityId })

  revalidatePath(`/communities/${communityId}`)

  return { success: true, message: "Successfully left community" }
}

export async function isCommunityMember(communityId: string) {
  const supabase = await getServerSupabase()

  // Get current user
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    return false
  }

  const userId = session.user.id

  // Check if user is a member
  const { data, error } = await supabase
    .from("community_members")
    .select("*")
    .eq("user_id", userId)
    .eq("community_id", communityId)
    .single()

  if (error) {
    if (error.code === "PGRST116") {
      return false
    }
    console.error("Error checking membership:", error)
    return false
  }

  return true
}
