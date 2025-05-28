"use client"

import { useState } from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

export function NotificationsPopover() {
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
  ])
  const [unreadCount, setUnreadCount] = useState(2)
  const [isOpen, setIsOpen] = useState(false)

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
      default:
        return "/notifications"
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

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h4 className="font-medium">Notifications</h4>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              Mark all as read
            </Button>
          )}
        </div>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread {unreadCount > 0 && `(${unreadCount})`}</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="max-h-[300px] overflow-y-auto">
            {notifications.length > 0 ? (
              <div className="divide-y">
                {notifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    markAsRead={markAsRead}
                    getLink={getNotificationLink}
                    formatTime={formatTimeAgo}
                    setIsOpen={setIsOpen}
                    router={router}
                  />
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-muted-foreground">No notifications</div>
            )}
          </TabsContent>
          <TabsContent value="unread" className="max-h-[300px] overflow-y-auto">
            {notifications.filter((n) => !n.is_read).length > 0 ? (
              <div className="divide-y">
                {notifications
                  .filter((n) => !n.is_read)
                  .map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      markAsRead={markAsRead}
                      getLink={getNotificationLink}
                      formatTime={formatTimeAgo}
                      setIsOpen={setIsOpen}
                      router={router}
                    />
                  ))}
              </div>
            ) : (
              <div className="p-4 text-center text-muted-foreground">No unread notifications</div>
            )}
          </TabsContent>
        </Tabs>
        <div className="p-2 border-t text-center">
          <Button
            variant="link"
            size="sm"
            onClick={() => {
              setIsOpen(false)
              router.push("/notifications")
            }}
          >
            View all notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

function NotificationItem({ notification, markAsRead, getLink, formatTime, setIsOpen, router }) {
  const handleClick = (e) => {
    e.preventDefault()
    if (!notification.is_read) {
      markAsRead(notification.id)
    }
    setIsOpen(false)
    router.push(getLink(notification))
  }

  return (
    <div
      className={cn(
        "block p-4 hover:bg-muted transition-colors cursor-pointer",
        !notification.is_read && "bg-muted/50",
      )}
      onClick={handleClick}
    >
      <div className="flex justify-between items-start gap-2">
        <p className="text-sm">{notification.content}</p>
        {!notification.is_read && <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1"></div>}
      </div>
      <p className="text-xs text-muted-foreground mt-1">{formatTime(notification.created_at)}</p>
    </div>
  )
}
