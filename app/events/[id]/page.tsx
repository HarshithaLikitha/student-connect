"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, MapPin, Clock, Users, UserPlus, UserMinus } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"
import { getEvent, registerForEvent, unregisterFromEvent } from "@/app/actions/events"

export default function EventDetailPage() {
  const params = useParams()
  const eventId = params.id as string
  const { user } = useAuth()
  const { toast } = useToast()

  const [event, setEvent] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRegistered, setIsRegistered] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)
  const [isUnregistering, setIsUnregistering] = useState(false)

  useEffect(() => {
    const fetchEventData = async () => {
      setIsLoading(true)

      try {
        // Fetch event details
        const eventData = await getEvent(eventId)
        setEvent(eventData)

        // For demo purposes, set isRegistered based on the event data
        setIsRegistered(eventData?.registered || false)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchEventData()
  }, [eventId])

  const handleRegisterForEvent = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to register for this event",
        variant: "destructive",
      })
      return
    }

    setIsRegistering(true)

    try {
      const result = await registerForEvent(eventId)

      if (result.success) {
        setIsRegistered(true)
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
      console.error("Error registering for event:", error)
      toast({
        title: "Error",
        description: "Failed to register for event. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsRegistering(false)
    }
  }

  const handleUnregisterFromEvent = async () => {
    setIsUnregistering(true)

    try {
      const result = await unregisterFromEvent(eventId)

      if (result.success) {
        setIsRegistered(false)
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
      console.error("Error unregistering from event:", error)
      toast({
        title: "Error",
        description: "Failed to unregister from event. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUnregistering(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading event details...</p>
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Event not found</p>
        </div>
      </div>
    )
  }

  // Mock participants data
  const participants = [
    {
      user_id: "1",
      registered_at: "2023-05-20T00:00:00Z",
      users: {
        username: "johndoe",
        full_name: "John Doe",
        avatar_url: "/placeholder.svg?height=40&width=40",
      },
    },
    {
      user_id: "2",
      registered_at: "2023-05-21T00:00:00Z",
      users: {
        username: "janedoe",
        full_name: "Jane Doe",
        avatar_url: "/placeholder.svg?height=40&width=40",
      },
    },
    {
      user_id: "3",
      registered_at: "2023-05-22T00:00:00Z",
      users: {
        username: "bobsmith",
        full_name: "Bob Smith",
        avatar_url: "/placeholder.svg?height=40&width=40",
      },
    },
  ]

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Event Info */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">{event.name}</CardTitle>
                  <CardDescription className="mt-2">Organized by {event.organizer}</CardDescription>
                </div>
                {isRegistered ? (
                  <Button variant="outline" onClick={handleUnregisterFromEvent} disabled={isUnregistering}>
                    <UserMinus className="mr-2 h-4 w-4" />
                    {isUnregistering ? "Cancelling..." : "Cancel Registration"}
                  </Button>
                ) : (
                  <Button onClick={handleRegisterForEvent} disabled={isRegistering}>
                    <UserPlus className="mr-2 h-4 w-4" />
                    {isRegistering ? "Registering..." : "Register Now"}
                  </Button>
                )}
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                {event.tags?.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex flex-col gap-4 md:flex-row md:gap-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <span>{event.participants || 0} participants</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">About this event</h3>
                  <p className="text-muted-foreground">{event.description}</p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Participants</h3>
                  {participants.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {participants.map((participant) => (
                        <div key={participant.user_id} className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={participant.users?.avatar_url || "/placeholder.svg"} />
                            <AvatarFallback>
                              {participant.users?.username?.charAt(0).toUpperCase() || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="text-sm">{participant.users?.full_name || participant.users?.username}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No participants yet</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Event Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">Date & Time</h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(event.date).toLocaleDateString()} at {event.time}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium">Location</h3>
                  <p className="text-sm text-muted-foreground">{event.location}</p>
                </div>
                <div>
                  <h3 className="font-medium">Event Type</h3>
                  <p className="text-sm text-muted-foreground">{event.type}</p>
                </div>
                <div>
                  <h3 className="font-medium">Participants</h3>
                  <p className="text-sm text-muted-foreground">{event.participants || 0} registered</p>
                </div>
              </div>

              {isRegistered ? (
                <div className="mt-6 p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-900 rounded-md">
                  <p className="text-sm text-green-800 dark:text-green-300">
                    You are registered for this event. We look forward to seeing you there!
                  </p>
                </div>
              ) : (
                <Button className="w-full mt-6" onClick={handleRegisterForEvent} disabled={isRegistering}>
                  {isRegistering ? "Registering..." : "Register Now"}
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
