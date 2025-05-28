import { createServerSupabaseClient } from '@/lib/supabase'
import { z } from 'zod'

const projectSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  status: z.enum(['Planning', 'In Progress', 'Completed', 'On Hold']),
  github_repo: z.string().optional().nullable(),
  website_url: z.string().optional().nullable(),
})

export async function getProjects(limit = 10) {
  const supabase = createServerSupabaseClient()
  
  const { data, error } = await supabase
    .from('projects')
    .select(`
      id, 
      name, 
      description,
      status,
      github_repo,
      website_url,
      created_at,
      creator_id,
      user_profiles!projects_creator_id_fkey(full_name, profile_image_url)
    `)
    .order('created_at', { ascending: false })
    .limit(limit)
  
  if (error) {
    console.error('Error fetching projects:', error)
    return []
  }
  
  // Get tech stack and tags for each project
  const projectsWithDetails = await Promise.all(data.map(async (project) => {
    // Get tech stack
    const { data: techStack, error: techError } = await supabase
      .from('project_tech_stack')
      .select('tech')
      .eq('project_id', project.id)
    
    // Get tags
    const { data: tags, error: tagsError } = await supabase
      .from('project_tags')
      .select('tag')
      .eq('project_id', project.id)
    
    // Get member count
    const { count: memberCount, error: memberError } = await supabase
      .from('project_members')
      .select('user_id', { count: 'exact', head: true })
      .eq('project_id', project.id)
    
    return {
      ...project,
      tech: techError ? [] : techStack.map(t => t.tech),
      tags: tagsError ? [] : tags.map(t => t.tag),
      members: memberError ? 0 : memberCount
    }
  }))
  
  return projectsWithDetails
}

export async function getProject(id) {
  const supabase = createServerSupabaseClient()
  
  const { data: project, error } = await supabase
    .from('projects')
    .select(`
      id, 
      name, 
      description,
      status,
      github_repo,
      website_url,
      created_at,
      updated_at,
      creator_id,
      user_profiles!projects_creator_id_fkey(id, full_name, profile_image_url)
    `)
    .eq('id', id)
    .single()
  
  if (error) {
    console.error('Error fetching project:', error)
    return null
  }
  
  // Get tech stack
  const { data: techStack, error: techError } = await supabase
    .from('project_tech_stack')
    .select('tech')
    .eq('project_id', id)
  
  // Get tags
  const { data: tags, error: tagsError } = await supabase
    .from('project_tags')
    .select('tag')
    .eq('project_id', id)
  
  // Get members
  const { data: members, error: membersError } = await supabase
    .from('project_members')
    .select(`
      user_id,
      role,
      joined_at,
      user_profiles!project_members_user_id_fkey(id, full_name, profile_image_url)
    `)
    .eq('project_id', id)
  
  return {
    ...project,
    tech: techError ? [] : techStack.map(t => t.tech),
    tags: tagsError ? [] : tags.map(t => t.tag),
    members: membersError ? [] : members
  }
}

// Rest of the file remains the same
