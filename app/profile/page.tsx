"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Github, Linkedin, MapPin, Briefcase, GraduationCap, Calendar, Edit, Users, Code } from "lucide-react"

// Mock user data
const userData = {
  name: "Alex Johnson",
  username: "alexj",
  avatar: "/placeholder.svg?height=128&width=128",
  bio: "Computer Science student passionate about web development, AI, and open source. Currently working on projects to improve student life on campus.",
  university: "Stanford University",
  major: "Computer Science",
  year: "Junior",
  location: "Palo Alto, CA",
  email: "alex.johnson@stanford.edu",
  github: "github.com/alexjohnson",
  linkedin: "linkedin.com/in/alexjohnson",
  skills: [
    "JavaScript",
    "React",
    "Node.js",
    "Python",
    "TensorFlow",
    "UI/UX Design",
    "Git",
    "MongoDB",
    "Express",
    "Next.js",
  ],
  interests: [
    "Web Development",
    "Artificial Intelligence",
    "Open Source",
    "Hackathons",
    "Mobile Development",
    "Data Science",
  ],
  communities: [
    { id: 1, name: "Web Development" },
    { id: 2, name: "AI Research Group" },
    { id: 3, name: "Open Source Club" },
  ],
  projects: [
    { id: 1, name: "Campus Connect App", role: "Frontend Developer" },
    { id: 2, name: "Student Mental Health Tracker", role: "Project Lead" },
  ],
  events: [
    { id: 1, name: "Annual Hackathon 2023", date: "Nov 15, 2023" },
    { id: 2, name: "Web Dev Workshop", date: "Oct 28, 2023" },
  ],
}

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: userData.name,
    bio: userData.bio,
    university: userData.university,
    major: userData.major,
    year: userData.year,
    location: userData.location,
    email: userData.email,
    github: userData.github,
    linkedin: userData.linkedin,
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // In a real app, we would send this data to an API
    console.log("Updated profile:", formData)
    setIsEditing(false)
  }

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-32 w-32 mb-4">
                  <AvatarImage src={userData.avatar || "/placeholder.svg"} alt={userData.name} />
                  <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <h2 className="text-2xl font-bold">{userData.name}</h2>
                <p className="text-muted-foreground">@{userData.username}</p>
                <div className="flex items-center mt-2 text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{userData.location}</span>
                </div>
                <div className="flex items-center mt-2 text-muted-foreground">
                  <GraduationCap className="h-4 w-4 mr-1" />
                  <span>{userData.university}</span>
                </div>
                <div className="flex items-center mt-2 text-muted-foreground">
                  <Briefcase className="h-4 w-4 mr-1" />
                  <span>
                    {userData.major}, {userData.year}
                  </span>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`https://${userData.github}`} target="_blank" rel="noopener noreferrer">
                      <Github className="h-4 w-4 mr-2" />
                      GitHub
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`https://${userData.linkedin}`} target="_blank" rel="noopener noreferrer">
                      <Linkedin className="h-4 w-4 mr-2" />
                      LinkedIn
                    </Link>
                  </Button>
                </div>
                <Button variant="outline" className="mt-4 w-full" onClick={() => setIsEditing(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {userData.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Interests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {userData.interests.map((interest, index) => (
                  <Badge key={index} variant="outline">
                    {interest}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {isEditing ? (
            <Card>
              <CardHeader>
                <CardTitle>Edit Profile</CardTitle>
                <CardDescription>Update your personal information</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Full Name
                    </label>
                    <Input id="name" name="name" value={formData.name} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="bio" className="text-sm font-medium">
                      Bio
                    </label>
                    <Textarea id="bio" name="bio" value={formData.bio} onChange={handleChange} rows={4} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="university" className="text-sm font-medium">
                        University
                      </label>
                      <Input id="university" name="university" value={formData.university} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="major" className="text-sm font-medium">
                        Major
                      </label>
                      <Input id="major" name="major" value={formData.major} onChange={handleChange} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="year" className="text-sm font-medium">
                        Year
                      </label>
                      <Input id="year" name="year" value={formData.year} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="location" className="text-sm font-medium">
                        Location
                      </label>
                      <Input id="location" name="location" value={formData.location} onChange={handleChange} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email
                    </label>
                    <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="github" className="text-sm font-medium">
                      GitHub Profile
                    </label>
                    <Input id="github" name="github" value={formData.github} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="linkedin" className="text-sm font-medium">
                      LinkedIn Profile
                    </label>
                    <Input id="linkedin" name="linkedin" value={formData.linkedin} onChange={handleChange} />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit">Save Changes</Button>
                    <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          ) : (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>About Me</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{userData.bio}</p>
                </CardContent>
              </Card>

              <Tabs defaultValue="communities" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="communities">
                    <Users className="h-4 w-4 mr-2" />
                    Communities
                  </TabsTrigger>
                  <TabsTrigger value="projects">
                    <Code className="h-4 w-4 mr-2" />
                    Projects
                  </TabsTrigger>
                  <TabsTrigger value="events">
                    <Calendar className="h-4 w-4 mr-2" />
                    Events
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="communities">
                  <Card>
                    <CardHeader>
                      <CardTitle>My Communities</CardTitle>
                      <CardDescription>Communities you've joined</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-4">
                        {userData.communities.map((community) => (
                          <li key={community.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="bg-purple-100 p-2 rounded-full">
                                <Users className="h-5 w-5 text-purple-600" />
                              </div>
                              <span className="font-medium">{community.name}</span>
                            </div>
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={`/communities/${community.id}`}>View</Link>
                            </Button>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full" asChild>
                        <Link href="/communities">Explore More Communities</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                <TabsContent value="projects">
                  <Card>
                    <CardHeader>
                      <CardTitle>My Projects</CardTitle>
                      <CardDescription>Projects you're working on</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-4">
                        {userData.projects.map((project) => (
                          <li key={project.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="bg-green-100 p-2 rounded-full">
                                <Code className="h-5 w-5 text-green-600" />
                              </div>
                              <div>
                                <p className="font-medium">{project.name}</p>
                                <p className="text-sm text-muted-foreground">{project.role}</p>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={`/projects/${project.id}`}>View</Link>
                            </Button>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full" asChild>
                        <Link href="/projects">Explore More Projects</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                <TabsContent value="events">
                  <Card>
                    <CardHeader>
                      <CardTitle>My Events</CardTitle>
                      <CardDescription>Events you're registered for</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-4">
                        {userData.events.map((event) => (
                          <li key={event.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="bg-blue-100 p-2 rounded-full">
                                <Calendar className="h-5 w-5 text-blue-600" />
                              </div>
                              <div>
                                <p className="font-medium">{event.name}</p>
                                <p className="text-sm text-muted-foreground">{event.date}</p>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={`/events/${event.id}`}>View</Link>
                            </Button>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full" asChild>
                        <Link href="/events">Explore More Events</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
