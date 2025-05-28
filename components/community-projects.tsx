import { ProjectCard } from "@/components/project-card"
import { getProjects } from "@/app/actions/projects"

export async function CommunityProjects({ communityId, communityTags }) {
  // Get all projects
  const allProjects = await getProjects()

  // Filter projects related to this community based on tags
  const relatedProjects = allProjects.filter((project) => project.tags.some((tag) => communityTags.includes(tag)))

  if (relatedProjects.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium mb-2">No projects found for this community</h3>
        <p className="text-muted-foreground">Create a new project related to this community</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {relatedProjects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  )
}
