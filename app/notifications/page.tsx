"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

export default function NotificationsPage() {
  const router = useRouter()
  const [notifications, setNotifications] = useState([
    {
      id: "1",
      content: "You have been invited to join the Web Development community",
      is_read: false,
      created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
      reference_type: "community",
      reference_id: "1",
    },
    {
      id: "2",
      content: "New event: Web Dev Hackathon is happening next week",
      is_read: false,
      created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
      reference_type: "event",
      reference_id: "1",
    },
    {
      id: "3",
      content: "Your project application has been accepted",
      is_read: true,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      reference_type: "project",
      reference_id: "2",
    },
    {
      id: "4",
      content: "Sarah Johnson commented on your project",
      is_read: true,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
      reference_type: "project",
      reference_id: "1",
    },
    {
      id: "5",
      content: "New tutorial available: Introduction to React Hooks",
      is_read: true,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
      reference_type: "tutorial",
      reference_id: "1",
    },
  ])
  const [unreadCount, setUnreadCount] = useState(2)

  const markAsRead = async (id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)))
    setUnreadCount((prev) => Math.max(0, prev - 1))
  }

  const markAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
    setUnreadCount(0)
  }

  const getNotificationLink = (notification) => {
    switch (notification.reference_type) {
      case "community":
        return `/communities/${notification.reference_id}`
      case "event":
        return `/events/${notification.reference_id}`
      case "project":
        return `/projects/${notification.reference_id}`
      case "message":
        return `/messages`
      case "tutorial":
        return `/tutorials/${notification.reference_id}`
      default:
        return "#"
    }
  }

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now - date) / 1000)

    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60)
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""} ago`
    }

    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? "s" : ""} ago`
    }

    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 30) {
      return `${diffInDays} day${diffInDays !== 1 ? "s" : ""} ago`
    }

    const diffInMonths = Math.floor(diffInDays / 30)
    return `${diffInMonths} month${diffInMonths !== 1 ? "s" : ""} ago`
  }

  const handleNotificationClick = (notification) => {
    if (!notification.is_read) {
      markAsRead(notification.id)
    }
    router.push(getNotificationLink(notification))
  }

  return (
    <div className="container py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Notifications</CardTitle>
          <CardDescription>Stay updated with the latest activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div>
              {unreadCount > 0 && (
                <span className="text-sm text-muted-foreground">
                  You have {unreadCount} unread notification{unreadCount !== 1 && "s"}
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <Button variant="outline" size="sm" onClick={markAllAsRead}>
                Mark all as read
              </Button>
            )}
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="w-full max-w-md grid grid-cols-2 mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="unread">Unread {unreadCount > 0 && `(${unreadCount})`}</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              {notifications.length > 0 ? (
                <div className="space-y-1 divide-y">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={cn(
                        "py-4 px-2 cursor-pointer hover:bg-muted/50 rounded-md transition-colors",
                        !notification.is_read && "bg-muted/30",
                      )}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="text-sm">{notification.content}</p>
                          <p className="text-xs text-muted-foreground mt-1">{formatTimeAgo(notification.created_at)}</p>
                        </div>
                        {!notification.is_read && (
                          <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-2"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">No notifications</div>
              )}
            </TabsContent>
            <TabsContent value="unread">
              {notifications.filter((n) => !n.is_read).length > 0 ? (
                <div className="space-y-1 divide-y">
                  {notifications
                    .filter((n) => !n.is_read)
                    .map((notification) => (
                      <div
                        key={notification.id}
                        className="py-4 px-2 cursor-pointer hover:bg-muted/50 rounded-md transition-colors bg-muted/30"
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="text-sm">{notification.content}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {formatTimeAgo(notification.created_at)}
                            </p>
                          </div>
                          <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-2"></div>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">No unread notifications</div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
