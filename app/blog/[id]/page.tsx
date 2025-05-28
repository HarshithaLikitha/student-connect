import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Clock, MessageSquare, ThumbsUp, Share2, Bookmark } from "lucide-react"

// Mock blog posts data
const blogPosts = [
  {
    id: 1,
    title: "How to Make the Most of Your University Experience",
    content: `
      <p>University life is a transformative journey that extends far beyond the classroom. It's a time of personal growth, exploration, and building the foundation for your future. Here are some strategies to help you make the most of your university experience:</p>
      
      <h2>Balance Academics and Extracurriculars</h2>
      <p>While academic success is important, university offers countless opportunities outside the classroom. Join clubs, sports teams, or student organizations that align with your interests. These activities not only provide a break from studying but also help you develop soft skills, build friendships, and create a well-rounded resume.</p>
      
      <h2>Build Meaningful Connections</h2>
      <p>The relationships you form during university can last a lifetime. Make an effort to connect with professors, teaching assistants, and peers. Attend office hours, participate in class discussions, and collaborate on projects. These connections can lead to mentorship opportunities, recommendation letters, and even job offers after graduation.</p>
      
      <h2>Take Advantage of Resources</h2>
      <p>Universities offer a wealth of resources that many students overlook. From career centers and writing labs to counseling services and research opportunities, these resources are designed to support your success. Take the time to explore what's available and don't hesitate to ask for help when needed.</p>
      
      <h2>Step Outside Your Comfort Zone</h2>
      <p>University is the perfect time to try new things and challenge yourself. Take courses outside your major, study abroad, attend campus events, or volunteer in the community. These experiences can broaden your perspective, help you discover new passions, and develop resilience.</p>
      
      <h2>Practice Self-Care</h2>
      <p>With the demands of coursework, extracurriculars, and social life, it's easy to neglect your well-being. Prioritize sleep, exercise, and healthy eating habits. Learn to manage stress through mindfulness, time management, and setting boundaries. Remember that taking care of yourself is essential for long-term success.</p>
      
      <h2>Set Goals and Reflect</h2>
      <p>Take time to reflect on your experiences and set goals for your university journey. What do you hope to achieve academically, personally, and professionally? Regularly assess your progress and adjust your approach as needed. This intentional reflection can help you stay focused and make the most of your time at university.</p>
      
      <p>By embracing these strategies, you can create a university experience that is not only academically rewarding but also personally fulfilling. Remember that university is what you make of it—so make it count!</p>
    `,
    excerpt:
      "Discover strategies for balancing academics, extracurriculars, and social life during your university years.",
    date: "2023-10-15",
    readTime: "5 min read",
    author: {
      name: "Sarah Williams",
      avatar: "/placeholder.svg?height=40&width=40",
      bio: "Education specialist with 10+ years of experience in student success strategies.",
    },
    category: "Student Life",
    tags: ["University Life", "Student Success", "Personal Growth"],
    image: "/placeholder.svg?height=400&width=600",
    featured: true,
    likes: 124,
    comments: 18,
    relatedPosts: [2, 6],
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

export default function BlogPostPage({ params }) {
  const post = blogPosts.find((post) => post.id === Number(params.id))

  if (!post) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Blog Post Not Found</h1>
        <p className="mb-6">The blog post you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link href="/blog">Back to Blog</Link>
        </Button>
      </div>
    )
  }

  const relatedPosts = post.relatedPosts
    ? blogPosts.filter((relatedPost) => post.relatedPosts.includes(relatedPost.id))
    : []

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/blog" className="flex items-center text-sm mb-6 hover:underline">
          ← Back to all posts
        </Link>

        <div className="mb-8">
          <Badge className="mb-4">{post.category}</Badge>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={post.author.avatar || "/placeholder.svg"} alt={post.author.name} />
                <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{post.author.name}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{post.date}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{post.readTime}</span>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <img
            src={post.image || "/placeholder.svg"}
            alt={post.title}
            className="w-full h-[300px] md:h-[400px] object-cover rounded-lg"
          />
        </div>

        <div className="prose max-w-none mb-8" dangerouslySetInnerHTML={{ __html: post.content }} />

        <div className="flex flex-wrap gap-2 mb-8">
          {post.tags?.map((tag, index) => (
            <Badge key={index} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex justify-between items-center border-t border-b py-4 mb-8">
          <div className="flex gap-4">
            <Button variant="ghost" size="sm" className="flex items-center gap-1">
              <ThumbsUp className="h-4 w-4" />
              <span>{post.likes || 0}</span>
            </Button>
            <Button variant="ghost" size="sm" className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4" />
              <span>{post.comments || 0}</span>
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="flex items-center gap-1">
              <Share2 className="h-4 w-4" />
              <span>Share</span>
            </Button>
            <Button variant="ghost" size="sm" className="flex items-center gap-1">
              <Bookmark className="h-4 w-4" />
              <span>Save</span>
            </Button>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">About the Author</h2>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={post.author.avatar || "/placeholder.svg"} alt={post.author.name} />
                  <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-bold">{post.author.name}</h3>
                  <p className="text-muted-foreground">{post.author.bio || "Author at Student Connect"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {relatedPosts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Related Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Card key={relatedPost.id} className="overflow-hidden">
                  <div className="relative h-48">
                    <img
                      src={relatedPost.image || "/placeholder.svg"}
                      alt={relatedPost.title}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <Badge className="mb-2">{relatedPost.category}</Badge>
                    <h3 className="text-lg font-bold mb-2">{relatedPost.title}</h3>
                    <p className="text-muted-foreground mb-4 line-clamp-2">{relatedPost.excerpt}</p>
                    <Button variant="outline" asChild>
                      <Link href={`/blog/${relatedPost.id}`}>Read More</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
