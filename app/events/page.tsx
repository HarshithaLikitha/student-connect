import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users } from "lucide-react"
import { getEvents } from "@/app/actions/events"

export default async function EventsPage() {
  let events = []
  let error = null

  try {
    events = await getEvents()
  } catch (err) {
    console.error("Error fetching events:", err)
    error = err

    // Fallback mock data
    events = [
      {
        id: "1",
        name: "Annual Hackathon 2023",
        description: "A 48-hour hackathon where students build innovative projects and compete for prizes.",
        date: "2023-11-15",
        time: "09:00 AM - 5:00 PM",
        location: "University Main Campus",
        participants: 120,
        organizer: "Computer Science Department",
        type: "Hackathon",
        tags: ["Coding", "Innovation", "Teamwork"],
      },
      {
        id: "2",
        name: "Web Dev Workshop",
        description: "Learn the latest web development technologies and frameworks from industry experts.",
        date: "2023-10-28",
        time: "2:00 PM - 5:00 PM",
        location: "Engineering Building, Room 302",
        participants: 45,
        organizer: "Web Development Club",
        type: "Workshop",
        tags: ["JavaScript", "React", "Frontend"],
      },
      {
        id: "3",
        name: "AI Conference",
        description: "Explore the latest advancements in artificial intelligence and machine learning.",
        date: "2023-12-05",
        time: "10:00 AM - 4:00 PM",
        location: "Science Center Auditorium",
        participants: 78,
        organizer: "AI Research Group",
        type: "Conference",
        tags: ["AI", "Machine Learning", "Research"],
      },
    ]
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Events & Hackathons</h1>
          <p className="text-muted-foreground mt-2">
            Discover upcoming events, workshops, hackathons, and conferences.
          </p>
        </div>
        <Link href="/events/create">
          <Button>Create Event</Button>
        </Link>
      </div>

      {error && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-8">
          <p className="text-yellow-800 dark:text-yellow-200">
            There was an error loading events. Showing sample data instead.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  )
}

function EventCard({ event }) {
  // Ensure tags is always an array
  const tags = event.tags || []

  return (
    <Card key={event.id} className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{event.name}</CardTitle>
          <Badge>{event.type}</Badge>
        </div>
        <CardDescription className="line-clamp-2">{event.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm">
            <Calendar className="mr-2 h-4 w-4" />
            <span>
              {event.date} • {event.time}
            </span>
          </div>
          <div className="flex items-center text-sm">
            <MapPin className="mr-2 h-4 w-4" />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center text-sm">
            <Users className="mr-2 h-4 w-4" />
            <span>{event.participants} participants</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-1">
          {tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{tags.length - 3} more
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Link href={`/events/${event.id}`} className="w-full">
          <Button variant="outline" className="w-full">
            View Event
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
