"use client"

import Link from "next/link"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageSquare, Mail, Phone, HelpCircle, CheckCircle2 } from "lucide-react"

export default function SupportPage() {
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    category: "",
    priority: "medium",
    message: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Support request submitted:", formData)
    setFormSubmitted(true)
    // In a real app, we would send this data to an API
  }

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Support Center</h1>
          <p className="text-muted-foreground">Get help with any issues or questions you have about Student Connect</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="flex flex-col items-center gap-2">
                <MessageSquare className="h-8 w-8 text-primary" />
                Live Chat
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Chat with our support team in real-time for immediate assistance.
              </p>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Start Chat</Button>
            </CardFooter>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <CardTitle className="flex flex-col items-center gap-2">
                <Mail className="h-8 w-8 text-primary" />
                Email Support
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Send us an email and we'll get back to you within 24 hours.</p>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant="outline">
                support@studentconnect.com
              </Button>
            </CardFooter>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <CardTitle className="flex flex-col items-center gap-2">
                <Phone className="h-8 w-8 text-primary" />
                Phone Support
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Call our support team for urgent issues that require immediate attention.
              </p>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant="outline">
                +1 (555) 123-4567
              </Button>
            </CardFooter>
          </Card>
        </div>

        <Tabs defaultValue="contact" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="contact">Contact Form</TabsTrigger>
            <TabsTrigger value="faq">Quick Help</TabsTrigger>
          </TabsList>

          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle>Submit a Support Request</CardTitle>
                <CardDescription>
                  Fill out the form below and our support team will get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {formSubmitted ? (
                  <div className="flex flex-col items-center py-8 text-center">
                    <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
                    <h3 className="text-xl font-bold mb-2">Request Submitted Successfully</h3>
                    <p className="text-muted-foreground mb-6">
                      Thank you for contacting us. We've received your request and will respond shortly.
                    </p>
                    <Button onClick={() => setFormSubmitted(false)}>Submit Another Request</Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input id="subject" name="subject" value={formData.subject} onChange={handleChange} required />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select
                          value={formData.category}
                          onValueChange={(value) => handleSelectChange("category", value)}
                          required
                        >
                          <SelectTrigger id="category">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="account">Account Issues</SelectItem>
                            <SelectItem value="technical">Technical Problems</SelectItem>
                            <SelectItem value="billing">Billing Questions</SelectItem>
                            <SelectItem value="feature">Feature Requests</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Priority</Label>
                        <RadioGroup
                          value={formData.priority}
                          onValueChange={(value) => handleSelectChange("priority", value)}
                          className="flex"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="low" id="low" />
                            <Label htmlFor="low">Low</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="medium" id="medium" />
                            <Label htmlFor="medium">Medium</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="high" id="high" />
                            <Label htmlFor="high">High</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={5}
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full">
                      Submit Request
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="faq">
            <Card>
              <CardHeader>
                <CardTitle>Quick Help Topics</CardTitle>
                <CardDescription>Browse through common topics to find quick solutions to your issues.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="justify-start h-auto py-4 px-4" asChild>
                    <Link href="/faq#account">
                      <HelpCircle className="mr-2 h-5 w-5" />
                      <div className="text-left">
                        <div className="font-medium">Account Issues</div>
                        <div className="text-sm text-muted-foreground">
                          Login problems, profile updates, password reset
                        </div>
                      </div>
                    </Link>
                  </Button>
                  <Button variant="outline" className="justify-start h-auto py-4 px-4" asChild>
                    <Link href="/faq#communities">
                      <HelpCircle className="mr-2 h-5 w-5" />
                      <div className="text-left">
                        <div className="font-medium">Communities</div>
                        <div className="text-sm text-muted-foreground">Joining, creating, and managing communities</div>
                      </div>
                    </Link>
                  </Button>
                  <Button variant="outline" className="justify-start h-auto py-4 px-4" asChild>
                    <Link href="/faq#events">
                      <HelpCircle className="mr-2 h-5 w-5" />
                      <div className="text-left">
                        <div className="font-medium">Events & Hackathons</div>
                        <div className="text-sm text-muted-foreground">
                          Registration, participation, and organization
                        </div>
                      </div>
                    </Link>
                  </Button>
                  <Button variant="outline" className="justify-start h-auto py-4 px-4" asChild>
                    <Link href="/faq#projects">
                      <HelpCircle className="mr-2 h-5 w-5" />
                      <div className="text-left">
                        <div className="font-medium">Projects</div>
                        <div className="text-sm text-muted-foreground">Collaboration, creation, and management</div>
                      </div>
                    </Link>
                  </Button>
                  <Button variant="outline" className="justify-start h-auto py-4 px-4" asChild>
                    <Link href="/faq#messaging">
                      <HelpCircle className="mr-2 h-5 w-5" />
                      <div className="text-left">
                        <div className="font-medium">Messaging</div>
                        <div className="text-sm text-muted-foreground">Direct messages, group chats, notifications</div>
                      </div>
                    </Link>
                  </Button>
                  <Button variant="outline" className="justify-start h-auto py-4 px-4" asChild>
                    <Link href="/faq#technical">
                      <HelpCircle className="mr-2 h-5 w-5" />
                      <div className="text-left">
                        <div className="font-medium">Technical Issues</div>
                        <div className="text-sm text-muted-foreground">Browser problems, app errors, performance</div>
                      </div>
                    </Link>
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button variant="link" asChild>
                  <Link href="/faq">View All FAQs</Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
