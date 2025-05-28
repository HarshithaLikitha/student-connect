"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Calendar, Code, MessageSquare, UserPlus, UserMinus } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"
import { getCommunity, joinCommunity, leaveCommunity } from "@/app/actions/communities"

export default function CommunityDetailPage() {
  const params = useParams()
  const communityId = params.id as string
  const { user } = useAuth()
  const { toast } = useToast()

  const [community, setCommunity] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isMember, setIsMember] = useState(false)
  const [isJoining, setIsJoining] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)

  useEffect(() => {
    const fetchCommunityData = async () => {
      setIsLoading(true)

      try {
        // Fetch community details
        const communityData = await getCommunity(communityId)
        setCommunity(communityData)

        // For demo purposes, set isMember to false initially
        setIsMember(false)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCommunityData()
  }, [communityId])

  const handleJoinCommunity = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to join this community",
        variant: "destructive",
      })
      return
    }

    setIsJoining(true)

    try {
      const result = await joinCommunity(communityId)

      if (result.success) {
        setIsMember(true)
        toast({
          title: "Success",
          description: result.message,
        })
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error joining community:", error)
      toast({
        title: "Error",
        description: "Failed to join community. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsJoining(false)
    }
  }

  const handleLeaveCommunity = async () => {
    setIsLeaving(true)

    try {
      const result = await leaveCommunity(communityId)

      if (result.success) {
        setIsMember(false)
        toast({
          title: "Success",
          description: result.message,
        })
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error leaving community:", error)
      toast({
        title: "Error",
        description: "Failed to leave community. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLeaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading community details...</p>
        </div>
      </div>
    )
  }

  if (!community) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Community not found</p>
        </div>
      </div>
    )
  }

  // Mock members data
  const members = [
    {
      user_id: "1",
      joined_at: "2023-01-20T00:00:00Z",
      users: {
        username: "johndoe",
        full_name: "John Doe",
        avatar_url: "/placeholder.svg?height=40&width=40",
      },
    },
    {
      user_id: "2",
      joined_at: "2023-02-15T00:00:00Z",
      users: {
        username: "janedoe",
        full_name: "Jane Doe",
        avatar_url: "/placeholder.svg?height=40&width=40",
      },
    },
    {
      user_id: "3",
      joined_at: "2023-03-10T00:00:00Z",
      users: {
        username: "bobsmith",
        full_name: "Bob Smith",
        avatar_url: "/placeholder.svg?height=40&width=40",
      },
    },
  ]

  // Mock projects data
  const projects = [
    {
      id: "1",
      name: "Community Website",
      description: "A website for our community to share resources and events.",
    },
    {
      id: "2",
      name: "Study Group App",
      description: "An app to help community members form study groups.",
    },
  ]

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Community Info */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">{community.name}</CardTitle>
                  <CardDescription className="mt-2">{community.members || 0} members</CardDescription>
                </div>
                {isMember ? (
                  <Button variant="outline" onClick={handleLeaveCommunity} disabled={isLeaving}>
                    <UserMinus className="mr-2 h-4 w-4" />
                    {isLeaving ? "Leaving..." : "Leave Community"}
                  </Button>
                ) : (
                  <Button onClick={handleJoinCommunity} disabled={isJoining}>
                    <UserPlus className="mr-2 h-4 w-4" />
                    {isJoining ? "Joining..." : "Join Community"}
                  </Button>
                )}
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                {community.tags?.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{community.description}</p>
            </CardContent>
          </Card>

          <Tabs defaultValue="members" className="mt-6">
            <TabsList>
              <TabsTrigger value="members">
                <Users className="mr-2 h-4 w-4" />
                Members
              </TabsTrigger>
              <TabsTrigger value="projects">
                <Code className="mr-2 h-4 w-4" />
                Projects
              </TabsTrigger>
              <TabsTrigger value="events">
                <Calendar className="mr-2 h-4 w-4" />
                Events
              </TabsTrigger>
              <TabsTrigger value="discussions">
                <MessageSquare className="mr-2 h-4 w-4" />
                Discussions
              </TabsTrigger>
            </TabsList>

            <TabsContent value="members" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Community Members</CardTitle>
                </CardHeader>
                <CardContent>
                  {members.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {members.map((member) => (
                        <div key={member.user_id} className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={member.users?.avatar_url || "/placeholder.svg"} />
                            <AvatarFallback>{member.users?.username?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{member.users?.full_name || member.users?.username}</p>
                            <p className="text-xs text-muted-foreground">
                              Joined {new Date(member.joined_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No members found</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="projects" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Community Projects</CardTitle>
                </CardHeader>
                <CardContent>
                  {projects.length > 0 ? (
                    <div className="space-y-4">
                      {projects.map((project) => (
                        <div key={project.id} className="border rounded-lg p-4">
                          <h3 className="font-medium">{project.name}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No projects found</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="events" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Community Events</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">No upcoming events</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="discussions" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Community Discussions</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">No discussions yet</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>About this Community</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">Created</h3>
                  <p className="text-sm text-muted-foreground">{new Date(community.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <h3 className="font-medium">Members</h3>
                  <p className="text-sm text-muted-foreground">{community.members || 0} members</p>
                </div>
                <div>
                  <h3 className="font-medium">Projects</h3>
                  <p className="text-sm text-muted-foreground">{projects.length} projects</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
