"use client"

import Link from "next/link"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search } from "lucide-react"

// Mock FAQ data
const faqData = {
  general: [
    {
      question: "What is Student Connect?",
      answer:
        "Student Connect is a community platform designed for students to connect, collaborate, and grow together. It offers features like skill-based communities, messaging, events, hackathons, and project collaboration opportunities.",
    },
    {
      question: "How do I create an account?",
      answer:
        "To create an account, click on the 'Sign Up' button in the top right corner of the homepage. Fill in your details including name, email, and password. You can also link your GitHub and LinkedIn profiles for better networking opportunities.",
    },
    {
      question: "Is Student Connect free to use?",
      answer:
        "Yes, Student Connect is completely free for all students. We believe in providing equal opportunities for all students to connect and collaborate without any financial barriers.",
    },
    {
      question: "Can I use Student Connect if I'm not a student?",
      answer:
        "Student Connect is primarily designed for students, but alumni and educators can also join to mentor and connect with students. During registration, you can specify your role.",
    },
  ],
  communities: [
    {
      question: "How do I join a community?",
      answer:
        "To join a community, navigate to the Communities page, browse through the available communities, and click the 'Join Community' button on the community card that interests you.",
    },
    {
      question: "Can I create my own community?",
      answer:
        "Yes, you can create your own community by clicking on the 'Create Community' button on the Communities page. You'll need to provide details like the community name, description, and relevant tags.",
    },
    {
      question: "What types of communities are available?",
      answer:
        "Student Connect offers various types of communities based on academic interests, skills, hobbies, and career aspirations. Examples include Web Development, Machine Learning, UI/UX Design, and more.",
    },
  ],
  events: [
    {
      question: "How do I register for an event?",
      answer:
        "To register for an event, go to the Events page, find the event you're interested in, and click the 'Register' button. You'll receive a confirmation email with further details.",
    },
    {
      question: "Can I organize my own event?",
      answer:
        "Yes, you can organize your own event by clicking on the 'Create Event' button on the Events page. You'll need to provide details like the event name, date, time, location, and description.",
    },
    {
      question: "Are all events in-person?",
      answer:
        "No, events can be in-person, virtual, or hybrid. The event details will specify the format and provide necessary information like venue address or online meeting links.",
    },
  ],
  projects: [
    {
      question: "How do I join a project?",
      answer:
        "To join a project, navigate to the Projects page, browse through available projects, and click the 'Join Project' button on the project card that interests you. The project creator will review your request.",
    },
    {
      question: "Can I create my own project?",
      answer:
        "Yes, you can create your own project by clicking on the 'Create Project' button on the Projects page. You'll need to provide details like the project name, description, required skills, and team size.",
    },
    {
      question: "How does project collaboration work?",
      answer:
        "Project collaboration happens through dedicated project spaces where team members can share ideas, assign tasks, track progress, and communicate. You can also integrate with GitHub for code collaboration.",
    },
  ],
  account: [
    {
      question: "How do I update my profile information?",
      answer:
        "To update your profile information, go to your Profile page and click on the 'Edit Profile' button. You can update your personal details, education information, skills, and social media links.",
    },
    {
      question: "How do I reset my password?",
      answer:
        "To reset your password, click on the 'Forgot password?' link on the login page. Enter your email address, and you'll receive a password reset link via email.",
    },
    {
      question: "Can I delete my account?",
      answer:
        "Yes, you can delete your account by going to your Profile page, clicking on 'Settings', and selecting the 'Delete Account' option. Please note that this action is irreversible.",
    },
  ],
}

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("general")

  // Filter FAQs based on search query
  const filteredFAQs = searchQuery
    ? Object.values(faqData)
        .flat()
        .filter(
          (faq) =>
            faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase()),
        )
    : faqData[activeTab]

  return (
    <div className="container py-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Frequently Asked Questions</h1>
          <p className="text-muted-foreground mb-6">Find answers to common questions about Student Connect</p>
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search for questions..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {searchQuery ? (
          <Card>
            <CardHeader>
              <CardTitle>Search Results</CardTitle>
              <CardDescription>
                Found {filteredFAQs.length} results for "{searchQuery}"
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {filteredFAQs.map((faq, index) => (
                  <AccordionItem key={index} value={`search-${index}`}>
                    <AccordionTrigger>{faq.question}</AccordionTrigger>
                    <AccordionContent>{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-5 mb-8">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="communities">Communities</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="account">Account</TabsTrigger>
            </TabsList>
            {Object.entries(faqData).map(([category, questions]) => (
              <TabsContent key={category} value={category}>
                <Card>
                  <CardHeader>
                    <CardTitle className="capitalize">{category} Questions</CardTitle>
                    <CardDescription>Frequently asked questions about {category.toLowerCase()}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      {questions.map((faq, index) => (
                        <AccordionItem key={index} value={`${category}-${index}`}>
                          <AccordionTrigger>{faq.question}</AccordionTrigger>
                          <AccordionContent>{faq.answer}</AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        )}

        <div className="mt-8 text-center">
          <p className="mb-4">Still have questions?</p>
          <Button asChild>
            <Link href="/support">Contact Support</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
