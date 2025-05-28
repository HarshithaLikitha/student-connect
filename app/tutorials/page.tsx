import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, BookOpen, Star, BarChart } from "lucide-react"

// Mock tutorials data
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
  },
  {
    id: 2,
    title: "Python for Data Science",
    description: "Master Python programming for data analysis and visualization.",
    duration: "3.5 hours",
    level: "Intermediate",
    category: "Data Science",
    rating: 4.7,
    students: 987,
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 3,
    title: "Mobile App Development with React Native",
    description: "Build cross-platform mobile applications using React Native.",
    duration: "4 hours",
    level: "Intermediate",
    category: "Mobile Development",
    rating: 4.6,
    students: 756,
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 4,
    title: "Introduction to Machine Learning",
    description: "Understand the fundamentals of machine learning algorithms and applications.",
    duration: "5 hours",
    level: "Advanced",
    category: "AI & Machine Learning",
    rating: 4.9,
    students: 1102,
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 5,
    title: "UI/UX Design Principles",
    description: "Learn the core principles of user interface and user experience design.",
    duration: "2.5 hours",
    level: "Beginner",
    category: "Design",
    rating: 4.7,
    students: 834,
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 6,
    title: "Git & GitHub for Version Control",
    description: "Master version control with Git and collaboration with GitHub.",
    duration: "1.5 hours",
    level: "Beginner",
    category: "Development Tools",
    rating: 4.5,
    students: 1567,
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 7,
    title: "Database Design with SQL",
    description: "Learn how to design and query relational databases using SQL.",
    duration: "3 hours",
    level: "Intermediate",
    category: "Databases",
    rating: 4.6,
    students: 921,
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 8,
    title: "Cloud Computing with AWS",
    description: "Explore cloud services and deployment using Amazon Web Services.",
    duration: "4.5 hours",
    level: "Advanced",
    category: "Cloud Computing",
    rating: 4.8,
    students: 678,
    image: "/placeholder.svg?height=200&width=300",
  },
]

export default function TutorialsPage() {
  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Tutorials</h1>
          <p className="text-muted-foreground">Learn new skills with step-by-step guides</p>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
          <Button variant="outline">All Categories</Button>
          <Button variant="outline">Web Development</Button>
          <Button variant="outline">Data Science</Button>
          <Button variant="outline">Mobile Development</Button>
          <Button variant="outline">AI & ML</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {tutorials.map((tutorial) => (
          <Card key={tutorial.id} className="overflow-hidden flex flex-col">
            <div className="relative h-40">
              <img
                src={tutorial.image || "/placeholder.svg"}
                alt={tutorial.title}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute top-2 right-2">
                <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                  {tutorial.level}
                </Badge>
              </div>
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="line-clamp-2 text-lg">{tutorial.title}</CardTitle>
              <CardDescription className="line-clamp-2">{tutorial.description}</CardDescription>
            </CardHeader>
            <CardContent className="pb-2 pt-0">
              <div className="flex justify-between text-sm">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{tutorial.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span>{tutorial.rating}</span>
                </div>
                <div className="flex items-center gap-1">
                  <BarChart className="h-4 w-4 text-muted-foreground" />
                  <span>{tutorial.level}</span>
                </div>
              </div>
              <Badge variant="outline" className="mt-2">
                {tutorial.category}
              </Badge>
            </CardContent>
            <CardFooter className="mt-auto pt-2">
              <Button className="w-full" asChild>
                <Link href={`/tutorials/${tutorial.id}`}>
                  <BookOpen className="mr-2 h-4 w-4" /> Start Learning
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
