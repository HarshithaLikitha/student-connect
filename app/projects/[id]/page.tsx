import { Suspense } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  ArrowLeft,
  Brain,
  Building,
  Calendar,
  Code,
  Cpu,
  FileText,
  Github,
  GitFork,
  Laptop,
  Link2,
  MessageSquare,
  Star,
  Users,
  Wrench,
  Zap,
  Music,
  Anchor,
} from "lucide-react"
import { getProject } from "@/app/actions/projects"

export default function ProjectPage({ params, searchParams }) {
  const justJoined = searchParams?.joined === "true"

  return (
    <div className="container py-8">
      <div className="mb-6">
        <Button variant="outline" asChild>
          <Link href="/projects">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
          </Link>
        </Button>
      </div>

      <Suspense fallback={<ProjectDetailSkeleton />}>
        <ProjectDetail id={params.id} justJoined={justJoined} />
      </Suspense>
    </div>
  )
}

async function ProjectDetail({ id, justJoined }) {
  const project = await getProject(id)

  if (!project) {
    notFound()
  }

  // Helper function to determine the icon based on project tags
  const getProjectIcon = (tags) => {
    if (
      tags.some((tag) => ["Dance", "Drama", "Music", "Magic", "Mimicry", "Comedy", "Cultural", "Art"].includes(tag))
    ) {
      return <Music className="h-8 w-8 text-purple-600" />
    } else if (tags.includes("Mechanical")) {
      return <Wrench className="h-8 w-8 text-orange-600" />
    } else if (tags.some((tag) => ["EEE", "Electrical"].includes(tag))) {
      return <Zap className="h-8 w-8 text-yellow-600" />
    } else if (tags.some((tag) => ["ECE", "Electronics"].includes(tag))) {
      return <Cpu className="h-8 w-8 text-blue-600" />
    } else if (tags.includes("Civil")) {
      return <Building className="h-8 w-8 text-green-600" />
    } else if (tags.includes("Marine")) {
      return <Anchor className="h-8 w-8 text-cyan-600" />
    } else if (tags.some((tag) => ["AI", "Machine Learning", "NLP"].includes(tag))) {
      return <Brain className="h-8 w-8 text-red-600" />
    } else if (tags.some((tag) => ["Web Development", "Web", "Full Stack"].includes(tag))) {
      return <Laptop className="h-8 w-8 text-indigo-600" />
    } else {
      return <Code className="h-8 w-8 text-green-600" />
    }
  }

  // Mock team members data
  const teamMembers = [
    {
      id: 1,
      name: "Alex Johnson",
      role: "Project Lead",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 2,
      name: "Sarah Chen",
      role: "Frontend Developer",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 3,
      name: "Michael Rodriguez",
      role: "Backend Developer",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ]

  // Mock project updates
  const projectUpdates = [
    {
      id: 1,
      date: "2023-11-15",
      title: "Project Kickoff",
      content: "We had our first team meeting and defined the project scope and initial tasks.",
    },
    {
      id: 2,
      date: "2023-11-22",
      title: "Design Phase Complete",
      content: "The UI/UX designs have been finalized and approved by all stakeholders.",
    },
    {
      id: 3,
      date: "2023-12-01",
      title: "Development Started",
      content: "We've begun implementing the core features of the application.",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Project Overview */}
      <div className="md:col-span-2">
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="bg-muted p-3 rounded-full">{getProjectIcon(project.tags)}</div>
              <div>
                <CardTitle className="text-2xl">{project.name}</CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={project.status === "In Progress" ? "default" : "outline"}>{project.status}</Badge>
                  {project.team && <Badge variant="secondary">{project.team}</Badge>}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="mb-6">{project.description}</p>

            {justJoined && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900 rounded-md p-4 mb-6">
                <p className="text-green-800 dark:text-green-300 font-medium">
                  You have successfully joined this project! The team will review your application and reach out soon.
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-medium mb-2">Technologies</h3>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tech, index) => (
                    <Badge key={index} variant="secondary">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-2">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, index) => (
                    <Badge key={index} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                <span>
                  <strong>{project.members}</strong> Members
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-muted-foreground" />
                <span>
                  <strong>{project.stars}</strong> Stars
                </span>
              </div>
              <div className="flex items-center gap-2">
                <GitFork className="h-5 w-5 text-muted-foreground" />
                <span>
                  <strong>{project.forks}</strong> Forks
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="updates">Updates</TabsTrigger>
            <TabsTrigger value="discussions">Discussions</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Project Goals</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Create a user-friendly interface for students to access campus resources</li>
                  <li>Implement real-time notifications for important campus events</li>
                  <li>Develop a mobile-responsive design that works across all devices</li>
                  <li>Integrate with existing university systems for seamless data flow</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Current Milestones</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium">Design Phase</h4>
                      <Badge>Completed</Badge>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div className="bg-green-500 h-2.5 rounded-full" style={{ width: "100%" }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium">Frontend Development</h4>
                      <Badge variant="outline">In Progress</Badge>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: "60%" }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium">Backend Development</h4>
                      <Badge variant="outline">In Progress</Badge>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: "40%" }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium">Testing</h4>
                      <Badge variant="secondary">Not Started</Badge>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div className="bg-gray-500 h-2.5 rounded-full" style={{ width: "0%" }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="updates" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Project Updates</CardTitle>
                <CardDescription>Latest news and progress updates from the team</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {projectUpdates.map((update) => (
                    <div key={update.id} className="border-b pb-4 last:border-0 last:pb-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {new Date(update.date).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="font-medium mb-1">{update.title}</h3>
                      <p className="text-sm">{update.content}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="discussions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Project Discussions</CardTitle>
                <CardDescription>Join the conversation with team members</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <Button className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Start a New Discussion
                    </Button>
                  </div>
                  <p className="text-center text-muted-foreground">
                    No discussions have been started yet. Be the first to start a conversation!
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resources" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Project Resources</CardTitle>
                <CardDescription>Documentation and helpful links</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 border rounded-md">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <div className="flex-1">
                      <h4 className="font-medium">Project Documentation</h4>
                      <p className="text-sm text-muted-foreground">Technical specifications and guidelines</p>
                    </div>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </div>
                  <div className="flex items-center gap-3 p-3 border rounded-md">
                    <Github className="h-5 w-5" />
                    <div className="flex-1">
                      <h4 className="font-medium">GitHub Repository</h4>
                      <p className="text-sm text-muted-foreground">Source code and issue tracking</p>
                    </div>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </div>
                  <div className="flex items-center gap-3 p-3 border rounded-md">
                    <Link2 className="h-5 w-5 text-green-600" />
                    <div className="flex-1">
                      <h4 className="font-medium">Design Mockups</h4>
                      <p className="text-sm text-muted-foreground">UI/UX designs and prototypes</p>
                    </div>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Project Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {project.joined ? (
              <>
                <Button className="w-full">View Project Dashboard</Button>
                <Button variant="outline" className="w-full">
                  <Github className="mr-2 h-4 w-4" />
                  View Repository
                </Button>
              </>
            ) : (
              <>
                <Button className="w-full" asChild>
                  <Link href={`/projects/join/${project.id}`}>Join This Project</Link>
                </Button>
                <Button variant="outline" className="w-full">
                  <Github className="mr-2 h-4 w-4" />
                  View Repository
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {teamMembers.map((member) => (
                <div key={member.id} className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{member.name}</p>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                  </div>
                </div>
              ))}
              {project.members > 3 && (
                <Button variant="ghost" className="w-full text-sm" size="sm">
                  View all {project.members} members
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Related Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-2 rounded-md hover:bg-muted">
                <div className="bg-muted p-1.5 rounded-full">
                  <Code className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">Student Marketplace</p>
                  <p className="text-xs text-muted-foreground">6 members</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2 rounded-md hover:bg-muted">
                <div className="bg-muted p-1.5 rounded-full">
                  <Brain className="h-4 w-4 text-red-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">AI Study Assistant</p>
                  <p className="text-xs text-muted-foreground">4 members</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2 rounded-md hover:bg-muted">
                <div className="bg-muted p-1.5 rounded-full">
                  <Laptop className="h-4 w-4 text-indigo-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">Campus Connect App</p>
                  <p className="text-xs text-muted-foreground">5 members</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function ProjectDetailSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="bg-muted h-12 w-12 rounded-full animate-pulse"></div>
              <div className="space-y-2">
                <div className="h-6 bg-muted rounded w-48 animate-pulse"></div>
                <div className="h-4 bg-muted rounded w-24 animate-pulse"></div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-4 bg-muted rounded w-full mb-2 animate-pulse"></div>
            <div className="h-4 bg-muted rounded w-full mb-2 animate-pulse"></div>
            <div className="h-4 bg-muted rounded w-3/4 mb-6 animate-pulse"></div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <div>
                <div className="h-4 bg-muted rounded w-24 mb-2 animate-pulse"></div>
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-6 bg-muted rounded w-16 animate-pulse"></div>
                  ))}
                </div>
              </div>
              <div>
                <div className="h-4 bg-muted rounded w-24 mb-2 animate-pulse"></div>
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-6 bg-muted rounded w-16 animate-pulse"></div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="h-5 bg-muted rounded w-32 animate-pulse"></div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-10 bg-muted rounded w-full animate-pulse"></div>
            <div className="h-10 bg-muted rounded w-full animate-pulse"></div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
