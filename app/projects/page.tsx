import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getProjects } from "@/app/actions/projects"

export default async function ProjectsPage() {
  let projects = []
  let error = null

  try {
    projects = await getProjects()
  } catch (err) {
    console.error("Error fetching projects:", err)
    error = err

    // Fallback mock data
    projects = [
      {
        id: "1",
        name: "Campus Connect App",
        description: "A mobile application to help students navigate campus resources and connect with peers.",
        members: 5,
        tech: ["React Native", "Node.js", "MongoDB"],
        tags: ["Mobile", "Full Stack", "Education"],
        stars: 24,
        forks: 8,
        status: "In Progress",
      },
      {
        id: "2",
        name: "Smart Career Mapping Tool",
        description:
          "An AI-powered tool that analyzes student skills and interests to suggest optimal career paths and learning opportunities.",
        members: 4,
        tech: ["Python", "TensorFlow", "Flask", "React"],
        tags: ["AI", "Education", "Career Development"],
        stars: 22,
        forks: 7,
        status: "In Progress",
        team: "Inquisitive Minds",
      },
      {
        id: "3",
        name: "Blockchain Voting System",
        description: "A secure and transparent voting system for student elections using blockchain technology.",
        members: 4,
        tech: ["Solidity", "Ethereum", "Web3.js", "React"],
        tags: ["Blockchain", "Web3", "Security"],
        stars: 15,
        forks: 3,
        status: "Planning",
      },
    ]
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground mt-2">
            Discover exciting projects to join or create your own to find collaborators.
          </p>
        </div>
        <Link href="/projects/create">
          <Button>Create Project</Button>
        </Link>
      </div>

      {error && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-8">
          <p className="text-yellow-800 dark:text-yellow-200">
            There was an error loading projects. Showing sample data instead.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">{project.name}</CardTitle>
                <Badge>{project.status}</Badge>
              </div>
              <CardDescription className="line-clamp-2">{project.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <p className="text-sm font-medium mb-1">Tech Stack:</p>
                <div className="flex flex-wrap gap-1">
                  {project.tech.slice(0, 3).map((tech) => (
                    <Badge key={tech} variant="outline" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                  {project.tech.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{project.tech.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-1 mb-4">
                {project.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <p>{project.members} members</p>
                <p>
                  ⭐ {project.stars} • 🍴 {project.forks}
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Link href={`/projects/${project.id}`} className="w-full">
                <Button variant="outline" className="w-full">
                  View Project
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
