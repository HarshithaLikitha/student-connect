import { createServerSupabaseClient } from '@/lib/supabase'
import { z } from 'zod'

const blogSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  content: z.string().min(10, { message: "Content must be at least 10 characters" }),
  featured_image_url: z.string().optional(),
  published: z.boolean().default(false),
})

export async function getBlogPosts(limit = 10) {
  const supabase = createServerSupabaseClient()
  
  const { data, error } = await supabase
    .from('blog_posts')
    .select(`
      id, 
      title, 
      content,
      featured_image_url,
      published,
      created_at,
      updated_at,
      author_id,
      user_profiles(full_name, profile_image_url)
    `)
    .eq('published', true)
    .order('created_at', { ascending: false })
    .limit(limit)
  
  if (error) {
    console.error('Error fetching blog posts:', error)
    return []
  }
  
  return data
}

export async function getUserBlogPosts(userId) {
  const supabase = createServerSupabaseClient()
  
  const { data, error } = await supabase
    .from('blog_posts')
    .select(`
      id, 
      title, 
      content,
      featured_image_url,
      published,
      created_at,
      updated_at
    `)
    .eq('author_id', userId)
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching user blog posts:', error)
    return []
  }
  
  return data
}

export async function getBlogPostById(id) {
  const supabase = createServerSupabaseClient()
  
  const { data, error } = await supabase
    .from('blog_posts')
    .select(`
      id, 
      title, 
      content,
      featured_image_url,
      published,
      created_at,
      updated_at,
      author_id,
      user_profiles(id, full_name, profile_image_url)
    `)
    .eq('id', id)
    .single()
  
  if (error) {
    console.error('Error fetching blog post:', error)
    return null
  }
  
  return data
}

export async function createBlogPost(authorId, blogData) {
  try {
    const supabase = createServerSupabaseClient()
    
    // Validate blog data
    const validatedData = blogSchema.parse(blogData)
    
    const { data, error } = await supabase
      .from('blog_posts')
      .insert([
        {
          author_id: authorId,
          title: validatedData.title,
          content: validatedData.content,
          featured_image_url: validatedData.featured_image_url,
          published: validatedData.published,
        }
      ])
      .select()
    
    if (error) throw error
    
    return { success: true, post: data[0] }
  } catch (error) {
    console.error('Error creating blog post:', error)
    return { success: false, error: error.message }
  }
}

export async function updateBlogPost(id, authorId, blogData) {
  try {
    const supabase = createServerSupabaseClient()
    
    // Validate blog data
    const validatedData = blogSchema.parse(blogData)
    
    // First check if the post exists and belongs to the author
    const { data: existingPost, error: fetchError } = await supabase
      .from('blog_posts')
      .select('id')
      .eq('id', id)
      .eq('author_id', authorId)
      .single()
    
    if (fetchError || !existingPost) {
      throw new Error('Blog post not found or you do not have permission to edit it')
    }
    
    const { data, error } = await supabase
      .from('blog_posts')
      .update({
        title: validatedData.title,
        content: validatedData.content,
        featured_image_url: validatedData.featured_image_url,
        published: validatedData.published,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
    
    if (error) throw error
    
    return { success: true, post: data[0] }
  } catch (error) {
    console.error('Error updating blog post:', error)
    return { success: false, error: error.message }
  }
}

export async function deleteBlogPost(id, authorId) {
  try {
    const supabase = createServerSupabaseClient()
    
    // First check if the post exists and belongs to the author
    const { data: existingPost, error: fetchError } = await supabase
      .from('blog_posts')
      .select('id')
      .eq('id', id)
      .eq('author_id', authorId)
      .single()
    
    if (fetchError || !existingPost) {
      throw new Error('Blog post not found or you do not have permission to delete it')
    }
    
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    
    return { success: true }
  } catch (error) {
    console.error('Error deleting blog post:', error)
    return { success: false, error: error.message }
  }
}

export async function getBlogComments(blogId) {
  const supabase = createServerSupabaseClient()
  
  const { data, error } = await supabase
    .from('blog_comments')
    .select(`
      id,
      content,
      created_at,
      author_id,
      user_profiles(full_name, profile_image_url)
    `)
    .eq('post_id', blogId)
    .order('created_at', { ascending: true })
  
  if (error) {
    console.error('Error fetching blog comments:', error)
    return []
  }
  
  return data
}

export async function addBlogComment(blogId, authorId, content) {
  try {
    const supabase = createServerSupabaseClient()
    
    if (!content || content.trim().length < 1) {
      throw new Error('Comment content cannot be empty')
    }
    
    const { data, error } = await supabase
      .from('blog_comments')
      .insert([
        {
          post_id: blogId,
          author_id: authorId,
          content,
        }
      ])
      .select()
    
    if (error) throw error
    
    return { success: true, comment: data[0] }
  } catch (error) {
    console.error('Error adding blog comment:', error)
    return { success: false, error: error.message }
  }
}
