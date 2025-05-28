"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, ArrowLeft, Brain, Code, Cpu } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { joinProject, getProject } from "@/app/actions/projects"

export default function JoinProjectPage({ params }) {
  const router = useRouter()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    skills: "",
    experience: "",
    availability: "part-time",
    interests: "",
    agreeToGuidelines: false,
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  // Fetch project data
  useState(() => {
    const fetchProject = async () => {
      try {
        const projectData = await getProject(params.id)
        if (!projectData) {
          setError("Project not found")
        } else {
          setProject(projectData)
        }
      } catch (err) {
        setError("Failed to load project")
      } finally {
        setLoading(false)
      }
    }

    fetchProject()
  }, [params.id])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setSubmitError(null)

    try {
      // Validate form
      if (!formData.name || !formData.email || !formData.skills || !formData.experience) {
        throw new Error("Please fill in all required fields")
      }

      if (!formData.agreeToGuidelines) {
        throw new Error("You must agree to the project guidelines")
      }

      // Join the project
      const result = await joinProject(params.id)

      if (result.success) {
        // Redirect to project page
        router.push(`/projects/${params.id}?joined=true`)
      } else {
        throw new Error(result.message || "Failed to join project")
      }
    } catch (err) {
      setSubmitError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="container py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="mt-4 text-muted-foreground">Loading project information...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
          </Button>
        </div>
      </div>
    )
  }

  // Get project icon based on tags
  const getProjectIcon = (tags) => {
    if (tags.some((tag) => ["AI", "Machine Learning", "NLP"].includes(tag))) {
      return <Brain className="h-6 w-6 text-red-600" />
    } else if (tags.some((tag) => ["Web Development", "Web", "Full Stack"].includes(tag))) {
      return <Code className="h-6 w-6 text-indigo-600" />
    } else if (tags.some((tag) => ["IoT", "Embedded Systems"].includes(tag))) {
      return <Cpu className="h-6 w-6 text-blue-600" />
    } else {
      return <Code className="h-6 w-6 text-green-600" />
    }
  }

  return (
    <div className="container py-8">
      <div className="mb-6">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="bg-muted p-2 rounded-full">{getProjectIcon(project.tags)}</div>
                <CardTitle>{project.name}</CardTitle>
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
              <div className="text-sm text-muted-foreground">
                <p>Current Members: {project.members}</p>
                <p>Status: {project.status}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Join Project: {project.name}</CardTitle>
              <CardDescription>
                Please provide some information about yourself to help the project team understand your skills and
                interests.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {submitError && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{submitError}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john.doe@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="skills">Skills *</Label>
                    <Textarea
                      id="skills"
                      name="skills"
                      value={formData.skills}
                      onChange={handleChange}
                      placeholder="List your relevant skills (e.g., JavaScript, React, Python, UI/UX Design)"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="experience">Relevant Experience *</Label>
                    <Textarea
                      id="experience"
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      placeholder="Briefly describe your relevant experience for this project"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="availability">Availability</Label>
                    <Select
                      value={formData.availability}
                      onValueChange={(value) => handleSelectChange("availability", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your availability" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full-time">Full-time (20+ hours/week)</SelectItem>
                        <SelectItem value="part-time">Part-time (10-20 hours/week)</SelectItem>
                        <SelectItem value="limited">Limited (5-10 hours/week)</SelectItem>
                        <SelectItem value="weekends">Weekends only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="interests">Why are you interested in this project?</Label>
                    <Textarea
                      id="interests"
                      name="interests"
                      value={formData.interests}
                      onChange={handleChange}
                      placeholder="Tell us why you're interested in joining this project"
                    />
                  </div>

                  <Separator />

                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="agreeToGuidelines"
                      name="agreeToGuidelines"
                      checked={formData.agreeToGuidelines}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({ ...prev, agreeToGuidelines: checked === true }))
                      }
                    />
                    <div className="grid gap-1.5 leading-none">
                      <Label
                        htmlFor="agreeToGuidelines"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        I agree to the project guidelines and code of conduct
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        By joining this project, you agree to collaborate respectfully and contribute to the best of
                        your abilities.
                      </p>
                    </div>
                  </div>
                </div>

                <CardFooter className="px-0 pt-4">
                  <div className="flex flex-col sm:flex-row gap-4 w-full">
                    <Button type="submit" className="w-full" disabled={submitting}>
                      {submitting ? "Submitting..." : "Join Project"}
                    </Button>
                    <Button type="button" variant="outline" className="w-full" onClick={() => router.back()}>
                      Cancel
                    </Button>
                  </div>
                </CardFooter>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
