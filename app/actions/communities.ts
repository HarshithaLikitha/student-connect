import { createServerSupabaseClient } from '@/lib/supabase'
import { z } from 'zod'

const communitySchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
})

export async function getCommunities(limit = 10) {
  const supabase = createServerSupabaseClient()
  
  const { data, error } = await supabase
    .from('communities')
    .select(`
      id, 
      name, 
      description,
      created_at,
      creator_id,
      user_profiles!communities_creator_id_fkey(full_name, profile_image_url)
    `)
    .order('created_at', { ascending: false })
    .limit(limit)
  
  if (error) {
    console.error('Error fetching communities:', error)
    return []
  }
  
  // Get tags and member count for each community
  const communitiesWithDetails = await Promise.all(data.map(async (community) => {
    // Get tags
    const { data: tags, error: tagsError } = await supabase
      .from('community_tags')
      .select('tag')
      .eq('community_id', community.id)
    
    // Get member count
    const { count: memberCount, error: memberError } = await supabase
      .from('community_members')
      .select('user_id', { count: 'exact', head: true })
      .eq('community_id', community.id)
    
    // Get post count
    const { count: postCount, error: postError } = await supabase
      .from('community_posts')
      .select('id', { count: 'exact', head: true })
      .eq('community_id', community.id)
    
    return {
      ...community,
      tags: tagsError ? [] : tags.map(t => t.tag),
      members: memberError ? 0 : memberCount,
      posts: postError ? 0 : postCount
    }
  }))
  
  return communitiesWithDetails
}

export async function getUserCommunities(userId) {
  const supabase = createServerSupabaseClient()
  
  // Get communities where user is a member
  const { data: memberCommunities, error: memberError } = await supabase
    .from('community_members')
    .select('community_id')
    .eq('user_id', userId)
  
  if (memberError) {
    console.error('Error fetching user community memberships:', memberError)
    return []
  }
  
  const communityIds = memberCommunities.map(c => c.community_id)
  
  if (communityIds.length === 0) {
    return []
  }
  
  // Get full community details
  const { data, error } = await supabase
    .from('communities')
    .select(`
      id, 
      name, 
      description,
      created_at,
      creator_id
    `)
    .in('id', communityIds)
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching user communities:', error)
    return []
  }
  
  // Get tags and member count for each community
  const communitiesWithDetails = await Promise.all(data.map(async (community) => {
    // Get tags
    const { data: tags, error: tagsError } = await supabase
      .from('community_tags')
      .select('tag')
      .eq('community_id', community.id)
    
    // Get member count
    const { count: memberCount, error: memberError } = await supabase
      .from('community_members')
      .select('user_id', { count: 'exact', head: true })
      .eq('community_id', community.id)
    
    // Get post count
    const { count: postCount, error: postError } = await supabase
      .from('community_posts')
      .select('id', { count: 'exact', head: true })
      .eq('community_id', community.id)
    
    // Get user's role in the community
    const { data: userRole, error: roleError } = await supabase
      .from('community_members')
      .select('role')
      .eq('community_id', community.id)
      .eq('user_id', userId)
      .single()
    
    return {
      ...community,
      tags: tagsError ? [] : tags.map(t => t.tag),
      members: memberError ? 0 : memberCount,
      posts: postError ? 0 : postCount,
      role: roleError ? null : userRole.role
    }
  }))
  
  return communitiesWithDetails
}

export async function getCommunity(id) {
  const supabase = createServerSupabaseClient()
  
  const { data: community, error } = await supabase
    .from('communities')
    .select(`
      id, 
      name, 
      description,
      created_at,
      updated_at,
      creator_id,
      user_profiles!communities_creator_id_fkey(id, full_name, profile_image_url)
    `)
    .eq('id', id)
    .single()
  
  if (error) {
    console.error('Error fetching community:', error)
    return null
  }
  
  // Get tags
  const { data: tags, error: tagsError } = await supabase
    .from('community_tags')
    .select('tag')
    .eq('community_id', id)
  
  // Get members
  const { data: members, error: membersError } = await supabase
    .from('community_members')
    .select(`
      user_id,
      role,
      joined_at,
      user_profiles!community_members_user_id_fkey(id, full_name, profile_image_url)
    `)
    .eq('community_id', id)
  
  // Get post count
  const { count: postCount, error: postError } = await supabase
    .from('community_posts')
    .select('id', { count: 'exact', head: true })
    .eq('community_id', id)
  
  return {
    ...community,
    tags: tagsError ? [] : tags.map(t => t.tag),
    members: membersError ? [] : members,
    posts: postError ? 0 : postCount
  }
}

// Rest of the file remains the same
