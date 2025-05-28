"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createProject } from "@/app/actions/projects"

export default function CreateProjectPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    tech: "",
    tags: "",
    status: "Planning",
    category: "computer-science",
    team: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Update tags based on category
    if (name === "category") {
      let defaultTags = ""
      switch (value) {
        case "computer-science":
          defaultTags = "Web, Mobile, AI, Blockchain"
          break
        case "mechanical":
          defaultTags = "Mechanical, Engineering, Manufacturing"
          break
        case "electrical":
          defaultTags = "EEE, Electrical, Power Systems"
          break
        case "electronics":
          defaultTags = "ECE, Electronics, Communication"
          break
        case "civil":
          defaultTags = "Civil, Construction, Structures"
          break
        case "marine":
          defaultTags = "Marine, Naval, Maritime"
          break
        case "dance":
          defaultTags = "Dance, Performance, Cultural"
          break
        case "drama":
          defaultTags = "Drama, Theater, Cultural"
          break
        case "music":
          defaultTags = "Music, Singing, Cultural"
          break
        case "magic":
          defaultTags = "Magic, Illusion, Cultural"
          break
        case "comedy":
          defaultTags = "Comedy, Mimicry, Cultural"
          break
        case "ai":
          defaultTags = "AI, Machine Learning, Data Science"
          break
        case "web":
          defaultTags = "Web Development, Frontend, Backend"
          break
        case "iot":
          defaultTags = "IoT, Sensors, Embedded Systems"
          break
      }
      setFormData((prev) => ({ ...prev, tags: defaultTags }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formDataObj = new FormData(e.target)
      const result = await createProject(formDataObj)
      if (result.success) {
        router.push(`/projects/${result.project.id}`)
      }
    } catch (error) {
      console.error("Error creating project:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container py-8">
      <div className="max-w-2xl mx-auto">
        <Link href="/projects" className="flex items-center text-sm mb-6 hover:underline">
          ← Back to projects
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>Create a New Project</CardTitle>
            <CardDescription>Start a new project and collaborate with other students.</CardDescription>
          </CardHeader>
          <CardContent>
            <form id="create-project-form" onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Project Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Campus Connect App, Solar-Powered Vehicle"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your project, its goals, and what you're looking to achieve."
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="team">Team Name (Optional)</Label>
                <Input
                  id="team"
                  name="team"
                  value={formData.team}
                  onChange={handleChange}
                  placeholder="e.g., Tech Enthusiasts, Inquisitive Minds"
                />
                <p className="text-sm text-muted-foreground">Give your team a name to make it more recognizable.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Project Category</Label>
                <Select
                  name="category"
                  value={formData.category}
                  onValueChange={(value) => handleSelectChange("category", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="computer-science">Computer Science</SelectItem>
                    <SelectItem value="ai">Artificial Intelligence</SelectItem>
                    <SelectItem value="web">Web Development</SelectItem>
                    <SelectItem value="iot">Internet of Things</SelectItem>
                    <SelectItem value="mechanical">Mechanical Engineering</SelectItem>
                    <SelectItem value="electrical">Electrical Engineering</SelectItem>
                    <SelectItem value="electronics">Electronics & Communication</SelectItem>
                    <SelectItem value="civil">Civil Engineering</SelectItem>
                    <SelectItem value="marine">Marine Engineering</SelectItem>
                    <SelectItem value="dance">Dance</SelectItem>
                    <SelectItem value="drama">Drama & Theater</SelectItem>
                    <SelectItem value="music">Music & Singing</SelectItem>
                    <SelectItem value="magic">Magic & Illusion</SelectItem>
                    <SelectItem value="comedy">Comedy & Mimicry</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tech">Technologies (comma separated)</Label>
                <Input
                  id="tech"
                  name="tech"
                  value={formData.tech}
                  onChange={handleChange}
                  placeholder="e.g., React, Node.js, Arduino, CAD"
                  required
                />
                <p className="text-sm text-muted-foreground">
                  List the technologies, tools, or skills needed for this project.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="e.g., Web, Mobile, Mechanical, Cultural"
                  required
                />
                <p className="text-sm text-muted-foreground">Add relevant tags to help students find your project.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Project Status</Label>
                <Select
                  name="status"
                  value={formData.status}
                  onValueChange={(value) => handleSelectChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Planning">Planning</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" asChild>
              <Link href="/projects">Cancel</Link>
            </Button>
            <Button type="submit" form="create-project-form" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Project"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
