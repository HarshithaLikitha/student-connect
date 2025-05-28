"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/auth-provider"
import { Users, Code, Calendar, MessageCircle, TrendingUp, Star } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/login")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const firstName = user.user_metadata?.first_name || user.user_metadata?.full_name?.split(" ")[0] || "Student"

  const stats = [
    { label: "Communities Joined", value: "5", icon: Users, color: "text-blue-600" },
    { label: "Active Projects", value: "3", icon: Code, color: "text-green-600" },
    { label: "Events Registered", value: "8", icon: Calendar, color: "text-purple-600" },
    { label: "Messages", value: "24", icon: MessageCircle, color: "text-orange-600" },
  ]

  const recentActivity = [
    { type: "community", title: "Joined Web Development Community", time: "2 hours ago" },
    { type: "project", title: "Started working on Smart Career Tool", time: "1 day ago" },
    { type: "event", title: "Registered for AI Workshop", time: "2 days ago" },
    { type: "message", title: "New message from project team", time: "3 days ago" },
  ]

  const recommendations = [
    { type: "community", title: "Machine Learning Hub", description: "Based on your AI interests" },
    { type: "project", title: "Campus Navigation App", description: "Looking for React developers" },
    { type: "event", title: "Startup Pitch Competition", description: "Perfect for entrepreneurs" },
  ]

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, {firstName}!</h1>
        <p className="text-muted-foreground mt-2">Here's what's happening in your student community today.</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Recent Activity
              </CardTitle>
              <CardDescription>Your latest interactions and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-muted/50">
                    <div className="flex-1">
                      <p className="font-medium">{activity.title}</p>
                      <p className="text-sm text-muted-foreground">{activity.time}</p>
                    </div>
                    <Badge variant="outline">{activity.type}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recommendations */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Recommended for You
              </CardTitle>
              <CardDescription>Discover new opportunities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recommendations.map((rec, index) => (
                  <div key={index} className="p-3 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{rec.title}</h4>
                      <Badge variant="secondary">{rec.type}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{rec.description}</p>
                    <Button size="sm" variant="outline" className="w-full">
                      Explore
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/communities">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <Users className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <h3 className="font-medium">Explore Communities</h3>
                <p className="text-sm text-muted-foreground">Find your tribe</p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/projects">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <Code className="h-8 w-8 mx-auto mb-2 text-green-600" />
                <h3 className="font-medium">Browse Projects</h3>
                <p className="text-sm text-muted-foreground">Collaborate & build</p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/events">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <Calendar className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                <h3 className="font-medium">Upcoming Events</h3>
                <p className="text-sm text-muted-foreground">Learn & network</p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/messages">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <MessageCircle className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                <h3 className="font-medium">Messages</h3>
                <p className="text-sm text-muted-foreground">Stay connected</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}
