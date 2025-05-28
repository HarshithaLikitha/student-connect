import { createServerSupabaseClient } from '@/lib/supabase'
import { z } from 'zod'

const tutorialSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  content: z.string().min(50, { message: "Content must be at least 50 characters" }),
  duration: z.string().optional(),
  level: z.enum(['Beginner', 'Intermediate', 'Advanced']),
  category: z.string().min(2, { message: "Category is required" }),
  featured_image_url: z.string().optional().nullable(),
})

export async function getTutorials(limit = 10) {
  const supabase = createServerSupabaseClient()
  
  const { data, error } = await supabase
    .from('tutorials')
    .select(`
      id, 
      title, 
      description,
      duration,
      level,
      category,
      featured_image_url,
      created_at,
      author_id,
      user_profiles!tutorials_author_id_fkey(full_name, profile_image_url)
    `)
    .order('created_at', { ascending: false })
    .limit(limit)
  
  if (error) {
    console.error('Error fetching tutorials:', error)
    return []
  }
  
  // Get student count for each tutorial
  const tutorialsWithDetails = await Promise.all(data.map(async (tutorial) => {
    // Get student count
    const { count: studentCount, error: countError } = await supabase
      .from('user_tutorial_progress')
      .select('user_id', { count: 'exact', head: true })
      .eq('tutorial_id', tutorial.id)
    
    // Get average rating
    const { data: ratings, error: ratingsError } = await supabase
      .from('user_tutorial_progress')
      .select('rating')
      .eq('tutorial_id', tutorial.id)
      .not('rating', 'is', null)
    
    let averageRating = 0
    if (!ratingsError && ratings.length > 0) {
      const sum = ratings.reduce((acc, curr) => acc + curr.rating, 0)
      averageRating = sum / ratings.length
    }
    
    return {
      ...tutorial,
      students: countError ? 0 : studentCount,
      rating: averageRating
    }
  }))
  
  return tutorialsWithDetails
}

export async function getTutorialsByCategory(category, limit = 10) {
  const supabase = createServerSupabaseClient()
  
  const { data, error } = await supabase
    .from('tutorials')
    .select(`
      id, 
      title, 
      description,
      duration,
      level,
      category,
      featured_image_url,
      created_at,
      author_id,
      user_profiles!tutorials_author_id_fkey(full_name, profile_image_url)
    `)
    .eq('category', category)
    .order('created_at', { ascending: false })
    .limit(limit)
  
  if (error) {
    console.error('Error fetching tutorials by category:', error)
    return []
  }
  
  // Get student count for each tutorial
  const tutorialsWithDetails = await Promise.all(data.map(async (tutorial) => {
    // Get student count
    const { count: studentCount, error: countError } = await supabase
      .from('user_tutorial_progress')
      .select('user_id', { count: 'exact', head: true })
      .eq('tutorial_id', tutorial.id)
    
    // Get average rating
    const { data: ratings, error: ratingsError } = await supabase
      .from('user_tutorial_progress')
      .select('rating')
      .eq('tutorial_id', tutorial.id)
      .not('rating', 'is', null)
    
    let averageRating = 0
    if (!ratingsError && ratings.length > 0) {
      const sum = ratings.reduce((acc, curr) => acc + curr.rating, 0)
      averageRating = sum / ratings.length
    }
    
    return {
      ...tutorial,
      students: countError ? 0 : studentCount,
      rating: averageRating
    }
  }))
  
  return tutorialsWithDetails
}

export async function getTutorialById(id) {
  const supabase = createServerSupabaseClient()
  
  const { data: tutorial, error } = await supabase
    .from('tutorials')
    .select(`
      id, 
      title, 
      description,
      content,
      duration,
      level,
      category,
      featured_image_url,
      created_at,
      updated_at,
      author_id,
      user_profiles!tutorials_author_id_fkey(id, full_name, profile_image_url)
    `)
    .eq('id', id)
    .single()
  
  if (error) {
    console.error('Error fetching tutorial:', error)
    return null
  }
  
  // Get sections
  const { data: sections, error: sectionsError } = await supabase
    .from('tutorial_sections')
    .select('id, title, content, order_index')
    .eq('tutorial_id', id)
    .order('order_index', { ascending: true })
  
  // Get student count
  const { count: studentCount, error: countError } = await supabase
    .from('user_tutorial_progress')
    .select('user_id', { count: 'exact', head: true })
    .eq('tutorial_id', id)
  
  // Get average rating
  const { data: ratings, error: ratingsError } = await supabase
    .from('user_tutorial_progress')
    .select('rating')
    .eq('tutorial_id', id)
    .not('rating', 'is', null)
  
  let averageRating = 0
  if (!ratingsError && ratings.length > 0) {
    const sum = ratings.reduce((acc, curr) => acc + curr.rating, 0)
    averageRating = sum / ratings.length
  }
  
  return {
    ...tutorial,
    sections: sectionsError ? [] : sections,
    students: countError ? 0 : studentCount,
    rating: averageRating
  }
}

export async function getUserTutorialProgress(tutorialId, userId) {
  const supabase = createServerSupabaseClient()
  
  const { data, error } = await supabase
    .from('user_tutorial_progress')
    .select('completed_sections, started_at, last_accessed_at, completed_at, rating')
    .eq('tutorial_id', tutorialId)
    .eq('user_id', userId)
    .single()
  
  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching user tutorial progress:', error)
    return null
  }
  
  return data || null
}

export async function createTutorial(authorId, tutorialData, sections = []) {
  try {
    const supabase = createServerSupabaseClient()
    
    // Validate tutorial data
    const validatedData = tutorialSchema.parse(tutorialData)
    
    // Start a transaction by using a single call with multiple operations
    // First, insert the tutorial
    const { data: tutorial, error: tutorialError } = await supabase
      .from('tutorials')
      .insert([
        {
          author_id: authorId,
          title: validatedData.title,
          description: validatedData.description,
          content: validatedData.content,
          duration: validatedData.duration,
          level: validatedData.level,
          category: validatedData.category,
          featured_image_url: validatedData.featured_image_url,
        }
      ])
      .select()
    
    if (tutorialError) throw tutorialError
    
    const tutorialId = tutorial[0].id
    
    // Add sections if provided
    if (sections && sections.length > 0) {
      const sectionEntries = sections.map((section, index) => ({
        tutorial_id: tutorialId,
        title: section.title,
        content: section.content,
        order_index: index
      }))
      
      const { error: sectionsError } = await supabase
        .from('tutorial_sections')
        .insert(sectionEntries)
      
      if (sectionsError) throw sectionsError
    }
    
    return { success: true, tutorial: tutorial[0] }
  } catch (error) {
    console.error('Error creating tutorial:', error)
    return { success: false, error: error.message }
  }
}

export async function updateTutorial(id, authorId, tutorialData, sections = []) {
  try {
    const supabase = createServerSupabaseClient()
    
    // Validate tutorial data
    const validatedData = tutorialSchema.parse(tutorialData)
    
    // Check if user is the author
    const { data: existingTutorial, error: fetchError } = await supabase
      .from('tutorials')
      .select('id')
      .eq('id', id)
      .eq('author_id', authorId)
      .single()
    
    if (fetchError || !existingTutorial) {
      throw new Error('Tutorial not found or you do not have permission to edit it')
    }
    
    // Update tutorial
    const { data: tutorial, error: tutorialError } = await supabase
      .from('tutorials')
      .update({
        title: validatedData.title,
        description: validatedData.description,
        content: validatedData.content,
        duration: validatedData.duration,
        level: validatedData.level,
        category: validatedData.category,
        featured_image_url: validatedData.featured_image_url,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
    
    if (tutorialError) throw tutorialError
    
    // Update sections - first delete existing entries
    const { error: deleteSectionsError } = await supabase
      .from('tutorial_sections')
      .delete()
      .eq('tutorial_id', id)
    
    if (deleteSectionsError) throw deleteSectionsError
    
    // Add new sections
    if (sections && sections.length > 0) {
      const sectionEntries = sections.map((section, index) => ({
        tutorial_id: id,
        title: section.title,
        content: section.content,
        order_index: index
      }))
      
      const { error: sectionsError } = await supabase
        .from('tutorial_sections')
        .insert(sectionEntries)
      
      if (sectionsError) throw sectionsError
    }
    
    return { success: true, tutorial: tutorial[0] }
  } catch (error) {
    console.error('Error updating tutorial:', error)
    return { success: false, error: error.message }
  }
}

export async function deleteTutorial(id, authorId) {
  try {
    const supabase = createServerSupabaseClient()
    
    // Check if user is the author
    const { data: existingTutorial, error: fetchError } = await supabase
      .from('tutorials')
      .select('id')
      .eq('id', id)
      .eq('author_id', authorId)
      .single()
    
    if (fetchError || !existingTutorial) {
      throw new Error('Tutorial not found or you do not have permission to delete it')
    }
    
    // Delete tutorial - cascade will handle related records
    const { error } = await supabase
      .from('tutorials')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    
    return { success: true }
  } catch (error) {
    console.error('Error deleting tutorial:', error)
    return { success: false, error: error.message }
  }
}

export async function startTutorial(tutorialId, userId) {
  try {
    const supabase = createServerSupabaseClient()
    
    // Check if user has already started this tutorial
    const { data: existingProgress, error: checkError } = await supabase
      .from('user_tutorial_progress')
      .select('id')
      .eq('tutorial_id', tutorialId)
      .eq('user_id', userId)
      .single()
    
    if (existingProgress) {
      // Update last accessed time
      const { error: updateError } = await supabase
        .from('user_tutorial_progress')
        .update({ last_accessed_at: new Date().toISOString() })
        .eq('id', existingProgress.id)
      
      if (updateError) throw updateError
      
      return { success: true }
    }
    
    // Create new progress entry
    const { error } = await supabase
      .from('user_tutorial_progress')
      .insert([
        {
          tutorial_id: tutorialId,
          user_id: userId,
          completed_sections: [],
        }
      ])
    
    if (error) throw error
    
    return { success: true }
  } catch (error) {
    console.error('Error starting tutorial:', error)
    return { success: false, error: error.message }
  }
}

export async function updateTutorialProgress(tutorialId, userId, completedSections, isCompleted = false) {
  try {
    const supabase = createServerSupabaseClient()
    
    // Check if user has started this tutorial
    const { data: existingProgress, error: checkError } = await supabase
      .from('user_tutorial_progress')
      .select('id, completed_sections')
      .eq('tutorial_id', tutorialId)
      .eq('user_id', userId)
      .single()
    
    if (checkError || !existingProgress) {
      throw new Error('You have not started this tutorial yet')
    }
    
    // Update progress
    const updates = {
      completed_sections: completedSections,
      last_accessed_at: new Date().toISOString(),
    }
    
    if (isCompleted) {
      updates.completed_at = new Date().toISOString()
    }
    
    const { error } = await supabase
      .from('user_tutorial_progress')
      .update(updates)
      .eq('id', existingProgress.id)
    
    if (error) throw error
    
    return { success: true }
  } catch (error) {
    console.error('Error updating tutorial progress:', error)
    return { success: false, error: error.message }
  }
}

export async function rateTutorial(tutorialId, userId, rating) {
  try {
    const supabase = createServerSupabaseClient()
    
    if (rating < 1 || rating > 5) {
      throw new Error('Rating must be between 1 and 5')
    }
    
    // Check if user has started this tutorial
    const { data: existingProgress, error: checkError } = await supabase
      .from('user_tutorial_progress')
      .select('id')
      .eq('tutorial_id', tutorialId)
      .eq('user_id', userId)
      .single()
    
    if (checkError || !existingProgress) {
      throw new Error('You have not started this tutorial yet')
    }
    
    // Update rating
    const { error } = await supabase
      .from('user_tutorial_progress')
      .update({ rating })
      .eq('id', existingProgress.id)
    
    if (error) throw error
    
    return { success: true }
  } catch (error) {
    console.error('Error rating tutorial:', error)
    return { success: false, error: error.message }
  }
}

export async function getUserTutorials(userId) {
  const supabase = createServerSupabaseClient()
  
  // Get tutorials where user has progress
  const { data: progress, error: progressError } = await supabase
    .from('user_tutorial_progress')
    .select(`
      tutorial_id,
      completed_sections,
      started_at,
      last_accessed_at,
      completed_at,
      rating
    `)
    .eq('user_id', userId)
  
  if (progressError) {
    console.error('Error fetching user tutorial progress:', progressError)
    return []
  }
  
  const tutorialIds = progress.map(p => p.tutorial_id)
  
  if (tutorialIds.length === 0) {
    return []
  }
  
  // Get tutorial details
  const { data: tutorials, error: tutorialsError } = await supabase
    .from('tutorials')
    .select(`
      id, 
      title, 
      description,
      duration,
      level,
      category,
      featured_image_url
    `)
    .in('id', tutorialIds)
  
  if (tutorialsError) {
    console.error('Error fetching user tutorials:', tutorialsError)
    return []
  }
  
  // Combine tutorial details with progress
  const tutorialsWithProgress = tutorials.map(tutorial => {
    const userProgress = progress.find(p => p.tutorial_id === tutorial.id)
    
    // Calculate completion percentage
    let completionPercentage = 0
    if (userProgress.completed_at) {
      completionPercentage = 100
    } else if (userProgress.completed_sections && userProgress.completed_sections.length > 0) {
      // Get total sections count
      const { data: sections, error: sectionsError } = supabase
        .from('tutorial_sections')
        .select('id', { count: 'exact', head: true })
        .eq('tutorial_id', tutorial.id)
      
      if (!sectionsError && sections > 0) {
        completionPercentage = (userProgress.completed_sections.length / sections) * 100
      }
    }
    
    return {
      ...tutorial,
      progress: {
        completed_sections: userProgress.completed_sections || [],
        started_at: userProgress.started_at,
        last_accessed_at: userProgress.last_accessed_at,
        completed_at: userProgress.completed_at,
        rating: userProgress.rating,
        completion_percentage: completionPercentage
      }
    }
  })
  
  return tutorialsWithProgress
}

export async function getCategories() {
  const supabase = createServerSupabaseClient()
  
  const { data, error } = await supabase
    .from('tutorials')
    .select('category')
    .order('category', { ascending: true })
  
  if (error) {
    console.error('Error fetching tutorial categories:', error)
    return []
  }
  
  // Extract unique categories
  const categories = [...new Set(data.map(item => item.category))]
  
  return categories
}
