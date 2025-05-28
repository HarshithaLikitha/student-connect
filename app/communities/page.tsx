import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getCommunities } from "@/app/actions/communities"

export default async function CommunitiesPage() {
  let communities = []
  let error = null

  try {
    communities = await getCommunities()
  } catch (err) {
    console.error("Error fetching communities:", err)
    error = err

    // Fallback mock data
    communities = [
      {
        id: "1",
        name: "Web Development",
        description: "Learn and discuss web development technologies, frameworks, and best practices.",
        members: 1243,
        tags: ["JavaScript", "React", "CSS", "HTML", "Node.js"],
        created_at: "2023-01-15",
      },
      {
        id: "2",
        name: "Machine Learning",
        description: "Explore machine learning algorithms, models, and applications.",
        members: 876,
        tags: ["Python", "TensorFlow", "PyTorch", "Data Science"],
        created_at: "2023-02-20",
      },
      {
        id: "3",
        name: "UI/UX Design",
        description: "Share and discuss UI/UX design principles, tools, and case studies.",
        members: 654,
        tags: ["Figma", "Adobe XD", "Design Systems", "Prototyping"],
        created_at: "2023-03-10",
      },
    ]
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Communities</h1>
          <p className="text-muted-foreground mt-2">
            Join skill-based communities to connect with peers, share knowledge, and collaborate on projects.
          </p>
        </div>
        <Link href="/communities/create">
          <Button>Create Community</Button>
        </Link>
      </div>

      {error && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-8">
          <p className="text-yellow-800 dark:text-yellow-200">
            There was an error loading communities. Showing sample data instead.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {communities.map((community) => (
          <Card key={community.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl">{community.name}</CardTitle>
              <CardDescription className="line-clamp-2">{community.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1 mb-4">
                {community.tags.slice(0, 4).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {community.tags.length > 4 && (
                  <Badge variant="outline" className="text-xs">
                    +{community.tags.length - 4} more
                  </Badge>
                )}
              </div>
              <div className="text-sm text-muted-foreground">
                <p>{community.members} members</p>
              </div>
            </CardContent>
            <CardFooter>
              <Link href={`/communities/${community.id}`} className="w-full">
                <Button variant="outline" className="w-full">
                  View Community
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
