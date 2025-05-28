import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  Star,
  GitFork,
  Github,
  Wrench,
  Zap,
  Cpu,
  Building,
  Anchor,
  Music,
  Laptop,
  Brain,
  Code,
} from "lucide-react"

export function ProjectCard({ project, showLearnMore = true }) {
  // Helper function to determine the icon based on project tags
  const getProjectIcon = (tags) => {
    if (
      tags.some((tag) => ["Dance", "Drama", "Music", "Magic", "Mimicry", "Comedy", "Cultural", "Art"].includes(tag))
    ) {
      return <Music className="h-6 w-6 text-purple-600" />
    } else if (tags.includes("Mechanical")) {
      return <Wrench className="h-6 w-6 text-orange-600" />
    } else if (tags.some((tag) => ["EEE", "Electrical"].includes(tag))) {
      return <Zap className="h-6 w-6 text-yellow-600" />
    } else if (tags.some((tag) => ["ECE", "Electronics"].includes(tag))) {
      return <Cpu className="h-6 w-6 text-blue-600" />
    } else if (tags.includes("Civil")) {
      return <Building className="h-6 w-6 text-green-600" />
    } else if (tags.includes("Marine")) {
      return <Anchor className="h-6 w-6 text-cyan-600" />
    } else if (tags.some((tag) => ["AI", "Machine Learning", "NLP"].includes(tag))) {
      return <Brain className="h-6 w-6 text-red-600" />
    } else if (tags.some((tag) => ["Web Development", "Web", "Full Stack"].includes(tag))) {
      return <Laptop className="h-6 w-6 text-indigo-600" />
    } else {
      return <Code className="h-6 w-6 text-green-600" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <div className="bg-muted p-2 rounded-full">{getProjectIcon(project.tags)}</div>
            <CardTitle>{project.name}</CardTitle>
          </div>
          <Badge variant={project.joined ? "outline" : "secondary"}>{project.status}</Badge>
        </div>
        <CardDescription>{project.description}</CardDescription>
      </CardHeader>
      <CardContent>
        {project.team && (
          <div className="mb-3">
            <span className="text-sm font-medium">Team: </span>
            <span className="text-sm text-muted-foreground">{project.team}</span>
          </div>
        )}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tech.map((tech, index) => (
            <Badge key={index} variant="secondary">
              {tech}
            </Badge>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags.map((tag, index) => (
            <Badge key={index} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="flex justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{project.members} members</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4" />
              <span>{project.stars}</span>
            </div>
            <div className="flex items-center gap-1">
              <GitFork className="h-4 w-4" />
              <span>{project.forks}</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        {project.joined ? (
          <Button variant="outline" className="w-full" asChild>
            <Link href={`/projects/${project.id}`}>View Project</Link>
          </Button>
        ) : (
          <Button variant="default" className="w-full" asChild>
            <Link href={`/projects/join/${project.id}`}>Join Project</Link>
          </Button>
        )}
        {showLearnMore && (
          <Button variant="outline" size="icon" asChild>
            <Link href={`/projects/${project.id}`} aria-label="Learn more about this project">
              <Github className="h-4 w-4" />
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
