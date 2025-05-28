"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowRight, Calendar, Code, MessageCircle, Users, Star, Brain, Globe, Shield } from "lucide-react"
import { motion } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useAuth } from "@/components/auth-provider"

const stats = [
  { label: "Active Students", value: "15,000+", icon: Users, color: "text-blue-600" },
  { label: "Communities", value: "850+", icon: Globe, color: "text-green-600" },
  { label: "Projects", value: "2,400+", icon: Code, color: "text-purple-600" },
  { label: "Events Hosted", value: "500+", icon: Calendar, color: "text-orange-600" },
]

const features = [
  {
    icon: Users,
    title: "Smart Communities",
    description: "AI-powered matching to connect you with the right communities based on your interests and goals.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: MessageCircle,
    title: "Real-time Collaboration",
    description: "Instant messaging, video calls, and collaborative workspaces for seamless teamwork.",
    color: "bg-green-50 text-green-600",
  },
  {
    icon: Calendar,
    title: "Event Management",
    description: "Discover, create, and manage events with integrated RSVP and networking features.",
    color: "bg-purple-50 text-purple-600",
  },
  {
    icon: Code,
    title: "Project Showcase",
    description: "Build your portfolio, find collaborators, and showcase your work to potential employers.",
    color: "bg-orange-50 text-orange-600",
  },
  {
    icon: Brain,
    title: "AI Learning Assistant",
    description: "Get personalized learning recommendations and instant help with our intelligent chatbot.",
    color: "bg-red-50 text-red-600",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Enterprise-grade security with full control over your data and privacy settings.",
    color: "bg-indigo-50 text-indigo-600",
  },
]

const testimonials = [
  {
    quote:
      "StudentConnect transformed my university experience. I found my dream team for our capstone project and landed an internship through the network!",
    name: "Sarah Chen",
    role: "Computer Science, Stanford",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 5,
  },
  {
    quote:
      "The AI assistant helped me discover communities I never knew existed. I'm now leading a robotics club with 200+ members!",
    name: "Marcus Johnson",
    role: "Mechanical Engineering, MIT",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 5,
  },
  {
    quote:
      "From hackathons to study groups, this platform has everything. The project collaboration tools are game-changing.",
    name: "Priya Patel",
    role: "Data Science, Berkeley",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 5,
  },
]

const featuredCommunities = [
  {
    name: "AI & Machine Learning",
    members: "3.2k",
    growth: "+15%",
    color: "bg-gradient-to-r from-purple-500 to-pink-500",
  },
  { name: "Web Development", members: "2.8k", growth: "+12%", color: "bg-gradient-to-r from-blue-500 to-cyan-500" },
  {
    name: "Startup Founders",
    members: "1.9k",
    growth: "+25%",
    color: "bg-gradient-to-r from-green-500 to-emerald-500",
  },
  { name: "Design & UX", members: "2.1k", growth: "+18%", color: "bg-gradient-to-r from-orange-500 to-red-500" },
]

const upcomingEvents = [
  {
    title: "Global Hackathon 2024",
    date: "March 15-17, 2024",
    participants: "500+",
    type: "Hackathon",
    featured: true,
  },
  {
    title: "AI Workshop Series",
    date: "March 22, 2024",
    participants: "150+",
    type: "Workshop",
    featured: false,
  },
  {
    title: "Startup Pitch Competition",
    date: "April 5, 2024",
    participants: "80+",
    type: "Competition",
    featured: true,
  },
]

export default function HomePage() {
  const { user } = useAuth()
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [demoOpen, setDemoOpen] = useState(false)
  const [learnMoreOpen, setLearnMoreOpen] = useState(false)
  const videoRef = useRef(null)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (demoOpen && videoRef.current) {
      videoRef.current.play().catch((e) => console.log("Autoplay prevented:", e))
    }
  }, [demoOpen])

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-background">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Connect. Collaborate. Succeed.
                </h1>
                <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Join the world's most advanced student collaboration platform. Build meaningful connections, work on
                  exciting projects, and accelerate your career.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/auth/register">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    Get Started
                  </Button>
                </Link>
                <Link href="/about">
                  <Button size="lg" variant="outline">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative w-full h-[350px] md:h-[400px] lg:h-[500px] rounded-lg overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-950 dark:to-purple-950 flex items-center justify-center">
                <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
                <div className="relative z-10 flex flex-col items-center justify-center space-y-4 p-6 text-center">
                  <div className="flex space-x-4">
                    <div className="w-16 h-16 rounded-full bg-blue-500 animate-pulse"></div>
                    <div className="w-16 h-16 rounded-full bg-purple-500 animate-pulse delay-100"></div>
                    <div className="w-16 h-16 rounded-full bg-pink-500 animate-pulse delay-200"></div>
                  </div>
                  <h2 className="text-2xl font-bold">Connect with peers worldwide</h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    Join communities, collaborate on projects, and attend events with students from around the globe.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4`}
                >
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{stat.value}</h3>
                <p className="text-gray-600 dark:text-gray-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800">Key Features</div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Everything You Need to Succeed</h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                StudentConnect provides all the tools you need to build your network, showcase your skills, and advance
                your career.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Skill-Based Communities</CardTitle>
                <CardDescription>Connect with peers who share your interests and skills.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1">
                  <Badge>Web Development</Badge>
                  <Badge>Machine Learning</Badge>
                  <Badge>UI/UX Design</Badge>
                  <Badge>Blockchain</Badge>
                  <Badge>Mobile Development</Badge>
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/communities">
                  <Button variant="outline" className="w-full">
                    Explore Communities
                  </Button>
                </Link>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Project Collaboration</CardTitle>
                <CardDescription>Find exciting projects or start your own.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="outline">24 Active Projects</Badge>
                  <Badge variant="outline">142 Contributors</Badge>
                  <Badge variant="outline">8 Categories</Badge>
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/projects">
                  <Button variant="outline" className="w-full">
                    Discover Projects
                  </Button>
                </Link>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Events & Hackathons</CardTitle>
                <CardDescription>Participate in events and showcase your skills.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="secondary">Upcoming Hackathon</Badge>
                  <Badge variant="secondary">Workshops</Badge>
                  <Badge variant="secondary">Tech Talks</Badge>
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/events">
                  <Button variant="outline" className="w-full">
                    View Events
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Loved by students worldwide
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              See how StudentConnect is transforming student experiences
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <motion.div
              key={currentTestimonial}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-2xl p-8 lg:p-12 text-center"
            >
              <div className="flex justify-center mb-6">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="h-6 w-6 text-yellow-400 fill-current" />
                ))}
              </div>
              <blockquote className="text-xl lg:text-2xl text-gray-700 dark:text-gray-200 mb-8 italic">
                "{testimonials[currentTestimonial].quote}"
              </blockquote>
              <div className="flex items-center justify-center">
                <Avatar className="h-16 w-16 mr-4">
                  <AvatarImage src={testimonials[currentTestimonial].avatar || "/placeholder.svg"} />
                  <AvatarFallback>{testimonials[currentTestimonial].name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{testimonials[currentTestimonial].name}</p>
                  <p className="text-gray-600 dark:text-gray-400">{testimonials[currentTestimonial].role}</p>
                </div>
              </div>
            </motion.div>

            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentTestimonial ? "bg-purple-600" : "bg-gray-300 dark:bg-gray-700"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Communities Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">Trending Communities</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Join the most active and fastest-growing communities
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCommunities.map((community, index) => (
              <motion.div
                key={community.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className={`h-32 ${community.color} relative`}>
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <Badge className="bg-white/20 text-white border-white/30 mb-2">{community.growth} growth</Badge>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{community.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{community.members} members</p>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/communities">Join Community</Link>
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild variant="outline" size="lg">
              <Link href="/communities">
                Explore All Communities
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">Upcoming Events</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Don't miss these exciting opportunities to learn and network
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {upcomingEvents.map((event, index) => (
              <motion.div
                key={event.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative ${event.featured ? "md:col-span-2" : ""}`}
              >
                <Card className="h-full hover:shadow-xl transition-shadow duration-300 dark:border-gray-800">
                  {event.featured && (
                    <Badge className="absolute top-4 right-4 bg-gradient-to-r from-purple-600 to-pink-600">
                      Featured
                    </Badge>
                  )}
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{event.type}</Badge>
                      <span className="text-sm text-gray-500 dark:text-gray-400">{event.participants} registered</span>
                    </div>
                    <CardTitle className="text-xl">{event.title}</CardTitle>
                    <CardDescription className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      {event.date}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full" asChild>
                      <Link href="/events">Register Now</Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild variant="outline" size="lg">
              <Link href="/events">
                View All Events
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-blue-50 dark:from-background dark:to-gray-900">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Ready to Get Started?</h2>
              <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Join thousands of students already using StudentConnect to advance their careers.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/auth/register">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Sign Up Now
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button size="lg" variant="outline">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Video Dialog */}
      <Dialog open={demoOpen} onOpenChange={setDemoOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>StudentConnect Platform Demo</DialogTitle>
            <DialogDescription>
              See how StudentConnect helps students connect, collaborate, and succeed
            </DialogDescription>
          </DialogHeader>
          <div className="aspect-video mt-4 bg-black rounded-lg overflow-hidden">
            {/* Replace with actual video in production */}
            <video ref={videoRef} controls className="w-full h-full" poster="/placeholder.svg?height=720&width=1280">
              <source src="#" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </DialogContent>
      </Dialog>

      {/* Learn More Dialog */}
      <Dialog open={learnMoreOpen} onOpenChange={setLearnMoreOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>About StudentConnect</DialogTitle>
            <DialogDescription>The ultimate platform for student collaboration and growth</DialogDescription>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            <p>
              StudentConnect is a comprehensive platform designed specifically for students to connect with peers,
              collaborate on projects, and grow professionally. Our mission is to bridge the gap between academic
              learning and real-world application by creating a vibrant ecosystem where students can showcase their
              skills, find like-minded collaborators, and access valuable resources.
            </p>
            <h3 className="text-lg font-semibold mt-4">Our Vision</h3>
            <p>
              We envision a world where every student has equal access to opportunities, mentorship, and resources
              regardless of their geographic location or institutional affiliation. StudentConnect aims to democratize
              access to knowledge and networks, empowering students to build meaningful connections that last beyond
              graduation.
            </p>
            <h3 className="text-lg font-semibold mt-4">Key Benefits</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Connect with peers who share your academic interests and career goals</li>
              <li>Collaborate on meaningful projects that enhance your portfolio</li>
              <li>Discover events, hackathons, and workshops tailored to your interests</li>
              <li>Access curated learning resources and mentorship opportunities</li>
              <li>Build a professional network before you graduate</li>
            </ul>
            <div className="flex justify-end mt-6">
              <Button asChild>
                <Link href="/auth/register">Join StudentConnect Today</Link>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
