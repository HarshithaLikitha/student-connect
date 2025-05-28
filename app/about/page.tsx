import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2, Users, Code, Calendar, MessageCircle, BookOpen, Brain } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="container py-12">
      {/* Hero Section */}
      <section className="mb-16">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="md:w-1/2 space-y-6">
            <h1 className="text-4xl font-bold tracking-tight">About Student Connect</h1>
            <p className="text-lg text-gray-600">
              Student Connect is a comprehensive platform designed to bridge the gap between academic learning and
              real-world collaboration. We empower students to connect with peers, share knowledge, and build projects
              together.
            </p>
            <p className="text-lg text-gray-600">
              Our mission is to create a vibrant ecosystem where students can develop both technical and soft skills
              through meaningful interactions and collaborative experiences.
            </p>
            <div className="flex gap-4 pt-4">
              <Button asChild>
                <Link href="/auth/register">Join Now</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/communities">Explore Communities</Link>
              </Button>
            </div>
          </div>
          <div className="md:w-1/2">
            <img
              src="/placeholder.svg?height=400&width=600&text=Student+Connect"
              alt="Students collaborating"
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Our Story</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-bold mb-4">The Beginning</h3>
              <p className="text-gray-600">
                Student Connect started as a small project by a group of university students who were frustrated with
                the lack of collaboration opportunities outside the classroom. They envisioned a platform where students
                could easily find peers with complementary skills and interests.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-bold mb-4">Growth & Evolution</h3>
              <p className="text-gray-600">
                What began as a simple forum quickly evolved into a comprehensive platform with communities, project
                collaboration tools, event management, and more. As our user base grew, so did our features and
                capabilities.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-bold mb-4">Today & Beyond</h3>
              <p className="text-gray-600">
                Today, Student Connect serves thousands of students across hundreds of educational institutions. We
                continue to innovate with AI-powered features, enhanced collaboration tools, and deeper integration with
                the academic ecosystem.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Our Core Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex items-start gap-4">
            <div className="bg-purple-100 p-2 rounded-full">
              <CheckCircle2 className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Collaboration</h3>
              <p className="text-gray-600">
                We believe that the best learning happens through collaboration. Our platform is designed to facilitate
                meaningful interactions between students with diverse skills and backgrounds.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="bg-purple-100 p-2 rounded-full">
              <CheckCircle2 className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Innovation</h3>
              <p className="text-gray-600">
                We encourage innovative thinking and creative problem-solving. Our platform provides the tools and
                resources students need to bring their ideas to life.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="bg-purple-100 p-2 rounded-full">
              <CheckCircle2 className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Inclusivity</h3>
              <p className="text-gray-600">
                We are committed to creating an inclusive environment where all students feel welcome and valued,
                regardless of their background, identity, or level of experience.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="bg-purple-100 p-2 rounded-full">
              <CheckCircle2 className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Growth Mindset</h3>
              <p className="text-gray-600">
                We believe in the power of continuous learning and personal growth. Our platform is designed to help
                students develop both technical and soft skills that will serve them throughout their careers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Features Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Platform Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-md">
            <div className="p-3 bg-purple-100 rounded-full mb-4">
              <Users className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Communities</h3>
            <p className="text-gray-600">
              Join skill-based communities to connect with peers who share your interests and expertise.
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-md">
            <div className="p-3 bg-purple-100 rounded-full mb-4">
              <Code className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Projects</h3>
            <p className="text-gray-600">
              Collaborate on projects, showcase your work, and build a portfolio that demonstrates your skills.
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-md">
            <div className="p-3 bg-purple-100 rounded-full mb-4">
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Events</h3>
            <p className="text-gray-600">
              Discover and participate in hackathons, workshops, and other events to expand your knowledge and network.
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-md">
            <div className="p-3 bg-purple-100 rounded-full mb-4">
              <MessageCircle className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Messaging</h3>
            <p className="text-gray-600">
              Connect with other students through our messaging system for seamless communication and collaboration.
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-md">
            <div className="p-3 bg-purple-100 rounded-full mb-4">
              <BookOpen className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Resources</h3>
            <p className="text-gray-600">
              Access and share learning resources, tutorials, and study materials to support your academic journey.
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-md">
            <div className="p-3 bg-purple-100 rounded-full mb-4">
              <Brain className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">AI Assistant</h3>
            <p className="text-gray-600">
              Get help and guidance from our AI-powered assistant, designed to support your learning and collaboration.
            </p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { name: "Alex Johnson", role: "Founder & CEO", avatar: "/placeholder.svg?height=150&width=150" },
            { name: "Sarah Chen", role: "CTO", avatar: "/placeholder.svg?height=150&width=150" },
            { name: "Michael Rodriguez", role: "Head of Product", avatar: "/placeholder.svg?height=150&width=150" },
            { name: "Emily Taylor", role: "Head of Community", avatar: "/placeholder.svg?height=150&width=150" },
          ].map((member, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <img
                src={member.avatar || "/placeholder.svg"}
                alt={member.name}
                className="rounded-full w-32 h-32 object-cover mb-4"
              />
              <h3 className="text-xl font-bold">{member.name}</h3>
              <p className="text-gray-600">{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 text-white rounded-lg p-8 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Join Our Community?</h2>
        <p className="text-lg mb-6 max-w-2xl mx-auto">
          Connect with peers, collaborate on projects, and take your academic journey to the next level.
        </p>
        <div className="flex justify-center gap-4">
          <Button className="bg-white text-purple-600 hover:bg-gray-100" size="lg" asChild>
            <Link href="/auth/register">Sign Up Now</Link>
          </Button>
          <Button variant="outline" className="border-white text-white hover:bg-white/10" size="lg" asChild>
            <Link href="/communities">Explore Communities</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
