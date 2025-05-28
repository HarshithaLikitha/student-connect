import { createServerSupabaseClient } from '@/lib/supabase'
import { redirect } from 'next/navigation'

export async function getSession() {
  const supabase = createServerSupabaseClient()
  try {
    const { data: { session } } = await supabase.auth.getSession()
    return session
  } catch (error) {
    console.error("Error getting session:", error)
    return null
  }
}

export async function requireAuth() {
  const session = await getSession()
  if (!session) {
    redirect("/auth/login")
  }
  return session
}

export async function getUserProfile(userId: string) {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", userId)
    .single()
  
  if (error) {
    console.error("Error fetching user profile:", error)
    return null
  }
  
  return data
}

export async function createUserProfile(userId: string, profileData: any) {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from("user_profiles")
    .insert([
      {
        id: userId,
        ...profileData
      }
    ])
    .select()
  
  if (error) {
    console.error("Error creating user profile:", error)
    return null
  }
  
  return data[0]
}

export async function updateUserProfile(userId: string, profileData: any) {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from("user_profiles")
    .update(profileData)
    .eq("id", userId)
    .select()
  
  if (error) {
    console.error("Error updating user profile:", error)
    return null
  }
  
  return data[0]
}
