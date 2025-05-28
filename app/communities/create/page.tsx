"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { createCommunity } from "@/app/actions/communities"

export default function CreateCommunityPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    tags: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const result = await createCommunity(new FormData(e.target))
      if (result.success) {
        router.push(`/communities/${result.community.id}`)
      }
    } catch (error) {
      console.error("Error creating community:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container py-8">
      <div className="max-w-2xl mx-auto">
        <Link href="/communities" className="flex items-center text-sm mb-6 hover:underline">
          ← Back to communities
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>Create a New Community</CardTitle>
            <CardDescription>
              Create a space for students to connect, share knowledge, and collaborate on topics they're passionate
              about.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form id="create-community-form" onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Community Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Web Development, Machine Learning, UI/UX Design"
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
                  placeholder="Describe what your community is about and what members can expect."
                  rows={4}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="e.g., JavaScript, React, Web Design"
                  required
                />
                <p className="text-sm text-muted-foreground">Add relevant tags to help students find your community.</p>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" asChild>
              <Link href="/communities">Cancel</Link>
            </Button>
            <Button type="submit" form="create-community-form" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Community"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
