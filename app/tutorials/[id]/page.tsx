"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  BookOpen,
  Clock,
  BarChart,
  CheckCircle2,
  Play,
  Download,
  MessageSquare,
  ThumbsUp,
  FileText,
  File,
} from "lucide-react"

// Mock tutorial data
const tutorials = [
  {
    id: 1,
    title: "Introduction to Web Development",
    description: "Learn the basics of HTML, CSS, and JavaScript to build your first website.",
    duration: "2 hours",
    level: "Beginner",
    category: "Web Development",
    rating: 4.8,
    students: 1245,
    image: "/placeholder.svg?height=200&width=300",
    instructor: {
      name: "John Smith",
      avatar: "/placeholder.svg?height=40&width=40",
      title: "Senior Web Developer",
      bio: "John has 10+ years of experience in web development and has taught over 50,000 students online.",
    },
    lessons: [
      {
        id: 1,
        title: "Introduction to HTML",
        duration: "20 min",
        completed: true,
      },
      {
        id: 2,
        title: "HTML Structure and Elements",
        duration: "25 min",
        completed: true,
      },
      {
        id: 3,
        title: "Introduction to CSS",
        duration: "30 min",
        completed: false,
      },
      {
        id: 4,
        title: "CSS Styling and Selectors",
        duration: "35 min",
        completed: false,
      },
      {
        id: 5,
        title: "Introduction to JavaScript",
        duration: "25 min",
        completed: false,
      },
      {
        id: 6,
        title: "JavaScript Basics",
        duration: "30 min",
        completed: false,
      },
      {
        id: 7,
        title: "Building Your First Web Page",
        duration: "45 min",
        completed: false,
      },
    ],
    resources: [
      {
        id: 1,
        title: "HTML Cheat Sheet",
        type: "PDF",
        size: "1.2 MB",
      },
      {
        id: 2,
        title: "CSS Reference Guide",
        type: "PDF",
        size: "1.5 MB",
      },
      {
        id: 3,
        title: "JavaScript Basics Code Examples",
        type: "ZIP",
        size: "3.4 MB",
      },
      {
        id: 4,
        title: "Web Development Tools Setup Guide",
        type: "PDF",
        size: "0.8 MB",
      },
    ],
    reviews: [
      {
        id: 1,
        user: "Alex Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
        rating: 5,
        date: "2023-09-15",
        comment: "Great tutorial for beginners! The explanations are clear and the examples are practical.",
      },
      {
        id: 2,
        user: "Sarah Williams",
        avatar: "/placeholder.svg?height=40&width=40",
        rating: 4,
        date: "2023-09-10",
        comment: "Very helpful content. I would have liked more exercises, but overall it's excellent.",
      },
      {
        id: 3,
        user: "Michael Chen",
        avatar: "/placeholder.svg?height=40&width=40",
        rating: 5,
        date: "2023-09-05",
        comment:
          "This tutorial helped me understand web development concepts that I've been struggling with for months.",
      },
    ],
  },
]

function FileIcon({ type }) {
  switch (type) {
    case "PDF":
      return <FileText className="h-5 w-5 text-red-500" />
    case "ZIP":
      return <File className="h-5 w-5 text-blue-500" />
    default:
      return <File className="h-5 w-5 text-gray-500" />
  }
}

export default function TutorialPage({ params }) {
  const tutorial = tutorials.find((tutorial) => tutorial.id === Number(params.id))
  const [activeTab, setActiveTab] = useState("content")
  const [lessons, setLessons] = useState(tutorial?.lessons || [])

  if (!tutorial) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Tutorial Not Found</h1>
        <p className="mb-6">The tutorial you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link href="/tutorials">Back to Tutorials</Link>
        </Button>
      </div>
    )
  }

  const completedLessons = lessons.filter((lesson) => lesson.completed).length
  const progress = Math.round((completedLessons / lessons.length) * 100)

  const toggleLessonCompletion = (lessonId) => {
    setLessons(lessons.map((lesson) => (lesson.id === lessonId ? { ...lesson, completed: !lesson.completed } : lesson)))
  }

  return (
    <div className="container py-8">
      <Link href="/tutorials" className="flex items-center text-sm mb-6 hover:underline">
        ← Back to all tutorials
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="mb-6">
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge>{tutorial.category}</Badge>
              <Badge variant="outline">{tutorial.level}</Badge>
            </div>
            <h1 className="text-3xl font-bold mb-2">{tutorial.title}</h1>
            <p className="text-muted-foreground mb-4">{tutorial.description}</p>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{tutorial.duration}</span>
              </div>
              <div className="flex items-center gap-1">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <span>{tutorial.lessons.length} lessons</span>
              </div>
              <div className="flex items-center gap-1">
                <BarChart className="h-4 w-4 text-muted-foreground" />
                <span>{tutorial.level}</span>
              </div>
              <div className="flex items-center gap-1">
                <ThumbsUp className="h-4 w-4 text-yellow-500" />
                <span>
                  {tutorial.rating} ({tutorial.reviews?.length || 0} reviews)
                </span>
              </div>
            </div>
          </div>

          <Card className="mb-6">
            <CardHeader className="pb-2">
              <CardTitle>Your Progress</CardTitle>
              <CardDescription>
                {completedLessons} of {lessons.length} lessons completed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-1">
                <Progress value={progress} className="h-2" />
                <span className="text-sm font-medium">{progress}%</span>
              </div>
              {progress === 100 ? (
                <p className="text-sm text-green-500 flex items-center gap-1 mt-2">
                  <CheckCircle2 className="h-4 w-4" /> You've completed this tutorial!
                </p>
              ) : (
                <p className="text-sm text-muted-foreground mt-2">Continue learning to complete this tutorial</p>
              )}
            </CardContent>
          </Card>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="instructor">Instructor</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Tutorial Content</CardTitle>
                  <CardDescription>
                    {tutorial.lessons.length} lessons • {tutorial.duration} total
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {lessons.map((lesson, index) => (
                      <li key={lesson.id}>
                        <div className="flex items-center justify-between p-3 rounded-md hover:bg-muted">
                          <div className="flex items-center gap-3">
                            <Checkbox
                              checked={lesson.completed}
                              onCheckedChange={() => toggleLessonCompletion(lesson.id)}
                              id={`lesson-${lesson.id}`}
                            />
                            <div>
                              <label
                                htmlFor={`lesson-${lesson.id}`}
                                className={`font-medium cursor-pointer ${
                                  lesson.completed ? "line-through text-muted-foreground" : ""
                                }`}
                              >
                                {index + 1}. {lesson.title}
                              </label>
                              <p className="text-sm text-muted-foreground">{lesson.duration}</p>
                            </div>
                          </div>
                          <Button size="sm" variant="ghost" className="flex items-center gap-1">
                            <Play className="h-4 w-4" />
                            <span>Start</span>
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="resources" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Tutorial Resources</CardTitle>
                  <CardDescription>Downloadable materials to support your learning</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {tutorial.resources.map((resource) => (
                      <li key={resource.id}>
                        <div className="flex items-center justify-between p-3 rounded-md hover:bg-muted">
                          <div className="flex items-center gap-3">
                            <div className="bg-muted p-2 rounded">
                              <FileIcon type={resource.type} />
                            </div>
                            <div>
                              <p className="font-medium">{resource.title}</p>
                              <p className="text-sm text-muted-foreground">
                                {resource.type} • {resource.size}
                              </p>
                            </div>
                          </div>
                          <Button size="sm" variant="outline" className="flex items-center gap-1">
                            <Download className="h-4 w-4" />
                            <span>Download</span>
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Student Reviews</CardTitle>
                  <CardDescription>
                    {tutorial.reviews?.length || 0} reviews • {tutorial.rating} average rating
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {tutorial.reviews?.map((review) => (
                      <div key={review.id} className="border-b pb-4 last:border-0 last:pb-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={review.avatar || "/placeholder.svg"} alt={review.user} />
                              <AvatarFallback>{review.user.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{review.user}</span>
                          </div>
                          <div className="flex items-center">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <ThumbsUp
                                key={i}
                                className={`h-4 w-4 ${i < review.rating ? "text-yellow-500" : "text-gray-300"}`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{review.date}</p>
                        <p>{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Write a Review
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="instructor" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>About the Instructor</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-4 items-start">
                    <Avatar className="h-20 w-20">
                      <AvatarImage
                        src={tutorial.instructor.avatar || "/placeholder.svg"}
                        alt={tutorial.instructor.name}
                      />
                      <AvatarFallback>{tutorial.instructor.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl font-bold">{tutorial.instructor.name}</h3>
                      <p className="text-muted-foreground mb-4">{tutorial.instructor.title}</p>
                      <p>{tutorial.instructor.bio}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <img
                src={tutorial.image || "/placeholder.svg"}
                alt={tutorial.title}
                className="w-full h-40 object-cover rounded-md mb-4"
              />
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold">Free</span>
                  <Badge variant="outline">{tutorial.students} enrolled</Badge>
                </div>
                <Button className="w-full">{progress > 0 ? "Continue Learning" : "Start Learning"}</Button>
                <p className="text-sm text-center text-muted-foreground">Free access to all content</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>What You'll Learn</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                  <span>Understand the fundamentals of HTML, CSS, and JavaScript</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                  <span>Build responsive web pages from scratch</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                  <span>Learn modern web development best practices</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                  <span>Create interactive user interfaces</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                  <span>Deploy your website to the internet</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-foreground mt-2" />
                  <span>No prior programming experience required</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-foreground mt-2" />
                  <span>Basic computer skills</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-foreground mt-2" />
                  <span>A computer with internet access</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-foreground mt-2" />
                  <span>Any modern web browser (Chrome, Firefox, Safari, etc.)</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
