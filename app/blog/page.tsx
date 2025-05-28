import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock } from "lucide-react"

// Mock blog posts data
const blogPosts = [
  {
    id: 1,
    title: "How to Make the Most of Your University Experience",
    excerpt:
      "Discover strategies for balancing academics, extracurriculars, and social life during your university years.",
    date: "2023-10-15",
    readTime: "5 min read",
    author: {
      name: "Sarah Williams",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    category: "Student Life",
    image: "/placeholder.svg?height=400&width=600",
    featured: true,
  },
  {
    id: 2,
    title: "Top 10 Programming Languages to Learn in 2023",
    excerpt:
      "Explore the most in-demand programming languages that will boost your career prospects in the tech industry.",
    date: "2023-10-10",
    readTime: "8 min read",
    author: {
      name: "Alex Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    category: "Technology",
    image: "/placeholder.svg?height=400&width=600",
    featured: false,
  },
  {
    id: 3,
    title: "Building Your Professional Network as a Student",
    excerpt:
      "Learn effective networking strategies that will help you establish valuable connections for your future career.",
    date: "2023-10-05",
    readTime: "6 min read",
    author: {
      name: "Michael Chen",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    category: "Career Development",
    image: "/placeholder.svg?height=400&width=600",
    featured: false,
  },
  {
    id: 4,
    title: "The Impact of AI on Higher Education",
    excerpt:
      "Explore how artificial intelligence is transforming teaching methods and learning experiences in universities.",
    date: "2023-09-28",
    readTime: "7 min read",
    author: {
      name: "Emily Rodriguez",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    category: "Education",
    image: "/placeholder.svg?height=400&width=600",
    featured: false,
  },
  {
    id: 5,
    title: "Effective Study Techniques Based on Cognitive Science",
    excerpt: "Discover research-backed study methods that can help you retain information better and ace your exams.",
    date: "2023-09-20",
    readTime: "9 min read",
    author: {
      name: "David Kim",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    category: "Academic Success",
    image: "/placeholder.svg?height=400&width=600",
    featured: false,
  },
  {
    id: 6,
    title: "Managing Student Finances: Tips and Tools",
    excerpt:
      "Learn practical strategies for budgeting, saving, and making smart financial decisions during your student years.",
    date: "2023-09-15",
    readTime: "6 min read",
    author: {
      name: "Jessica Taylor",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    category: "Finance",
    image: "/placeholder.svg?height=400&width=600",
    featured: false,
  },
]

export default function BlogPage() {
  const featuredPost = blogPosts.find((post) => post.featured)
  const regularPosts = blogPosts.filter((post) => !post.featured)

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Blog</h1>
          <p className="text-muted-foreground">Insights, tips, and stories from the Student Connect community</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">All Posts</Button>
          <Button variant="outline">Student Life</Button>
          <Button variant="outline">Technology</Button>
          <Button variant="outline">Career</Button>
        </div>
      </div>

      {featuredPost && (
        <Card className="mb-8">
          <div className="md:flex">
            <div className="md:w-1/2">
              <img
                src={featuredPost.image || "/placeholder.svg"}
                alt={featuredPost.title}
                className="h-64 w-full object-cover md:h-full rounded-t-lg md:rounded-l-lg md:rounded-t-none"
              />
            </div>
            <div className="md:w-1/2 p-6">
              <Badge className="mb-2">{featuredPost.category}</Badge>
              <h2 className="text-2xl font-bold mb-2">{featuredPost.title}</h2>
              <p className="text-muted-foreground mb-4">{featuredPost.excerpt}</p>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage
                      src={featuredPost.author.avatar || "/placeholder.svg"}
                      alt={featuredPost.author.name}
                    />
                    <AvatarFallback>{featuredPost.author.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{featuredPost.author.name}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{featuredPost.date}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{featuredPost.readTime}</span>
                </div>
              </div>
              <Button asChild>
                <Link href={`/blog/${featuredPost.id}`}>Read More</Link>
              </Button>
            </div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {regularPosts.map((post) => (
          <Card key={post.id} className="overflow-hidden">
            <div className="relative h-48">
              <img
                src={post.image || "/placeholder.svg"}
                alt={post.title}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
            <CardHeader>
              <div className="flex justify-between items-start">
                <Badge>{post.category}</Badge>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{post.readTime}</span>
                </div>
              </div>
              <CardTitle className="line-clamp-2">{post.title}</CardTitle>
              <CardDescription className="line-clamp-3">{post.excerpt}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={post.author.avatar || "/placeholder.svg"} alt={post.author.name} />
                  <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-sm">{post.author.name}</span>
                <span className="text-sm text-muted-foreground">•</span>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>{post.date}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full" asChild>
                <Link href={`/blog/${post.id}`}>Read More</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
