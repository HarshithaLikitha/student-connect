"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Bot,
  Send,
  X,
  MessageSquare,
  Loader2,
  Minimize2,
  Maximize2,
  HelpCircle,
  Users,
  Calendar,
  Code,
  BookOpen,
} from "lucide-react"
import { cn } from "@/lib/utils"

type Message = {
  role: "user" | "assistant"
  content: string
  timestamp: Date
  suggestions?: string[]
}

const quickActions = [
  { icon: Users, label: "Join Communities", action: "How do I join communities?" },
  { icon: Calendar, label: "Find Events", action: "Show me upcoming events" },
  { icon: Code, label: "Start Projects", action: "How to create a project?" },
  { icon: BookOpen, label: "Get Resources", action: "Where can I find learning resources?" },
]

const suggestedQuestions = [
  "How do I join a community?",
  "What events are happening this week?",
  "How can I start a new project?",
  "How do I message other students?",
  "Where can I find study groups?",
  "How to update my profile?",
]

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `Hi there! 👋 I'm your StudentConnect AI assistant. I'm here to help you navigate the platform, find communities, discover events, and make the most of your student experience. What would you like to know?`,
      timestamp: new Date(),
      suggestions: suggestedQuestions.slice(0, 3),
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [showQuickActions, setShowQuickActions] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen, isMinimized])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = input
    setInput("")
    setShowQuickActions(false)

    // Add user message
    const newUserMessage: Message = {
      role: "user",
      content: userMessage,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, newUserMessage])
    setIsLoading(true)

    try {
      const botResponse = await processMessage(userMessage)
      const assistantMessage: Message = {
        role: "assistant",
        content: botResponse.content,
        timestamp: new Date(),
        suggestions: botResponse.suggestions,
      }
      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error processing message:", error)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I apologize, but I'm experiencing some technical difficulties. Please try again in a moment.",
          timestamp: new Date(),
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickAction = (action: string) => {
    setInput(action)
    handleSubmit({ preventDefault: () => {} } as React.FormEvent)
  }

  const handleSuggestion = (suggestion: string) => {
    setInput(suggestion)
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  const processMessage = async (message: string): Promise<{ content: string; suggestions?: string[] }> => {
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000))

    const lowerMessage = message.toLowerCase()

    if (lowerMessage.includes("join") && lowerMessage.includes("communit")) {
      return {
        content:
          "To join a community on StudentConnect:\n\n1. 🔍 Go to the **Communities** page\n2. 🎯 Browse or search for communities that match your interests\n3. 📋 Click on a community to view details\n4. ✅ Click the **'Join Community'** button\n5. 🎉 You'll receive a confirmation and can start participating!\n\nYou can also filter communities by categories like AI, Web Development, or Engineering to find exactly what you're looking for.",
        suggestions: [
          "Show me popular communities",
          "How do I create my own community?",
          "What are community guidelines?",
        ],
      }
    }

    if (lowerMessage.includes("event") || lowerMessage.includes("hackathon")) {
      return {
        content:
          "Here's how to find and join events:\n\n🗓️ **Upcoming Events:**\n• Global Hackathon 2024 (March 15-17)\n• AI Workshop Series (March 22)\n• Startup Pitch Competition (April 5)\n\n📍 **To register:**\n1. Visit the **Events** page\n2. Browse upcoming events\n3. Click **'Register'** on events you're interested in\n4. Get calendar reminders and updates\n\nYou can filter by event type (Hackathons, Workshops, Competitions) and see which ones your friends are attending!",
        suggestions: ["Show me this week's events", "How do I create an event?", "What are the most popular events?"],
      }
    }

    if (lowerMessage.includes("project") && (lowerMessage.includes("create") || lowerMessage.includes("start"))) {
      return {
        content:
          "Creating a project on StudentConnect is easy! 🚀\n\n**Steps to create a project:**\n1. 📝 Go to **Projects** → **'Create Project'**\n2. 🎯 Choose your project category (AI, Web Dev, Engineering, etc.)\n3. 📋 Fill in project details, tech stack, and team requirements\n4. 🏷️ Add relevant tags to help others find your project\n5. 👥 Specify if you're looking for team members\n6. 🎉 Publish and start collaborating!\n\n**Pro tip:** Projects with clear descriptions and specific skill requirements get 3x more collaboration requests!",
        suggestions: ["Show me trending projects", "How do I find team members?", "What makes a successful project?"],
      }
    }

    if (lowerMessage.includes("message") || lowerMessage.includes("chat")) {
      return {
        content:
          "StudentConnect's messaging system makes collaboration seamless! 💬\n\n**How to message students:**\n1. 👤 Visit someone's profile\n2. 📩 Click **'Send Message'**\n3. 💭 Start a conversation!\n\n**Features:**\n• 🔄 Real-time messaging\n• 👥 Group chats for project teams\n• 📁 File sharing and collaboration\n• 🔔 Smart notifications\n• 🎥 Video call integration\n\nYou can also message people directly from communities, events, or project pages!",
        suggestions: ["How do I create group chats?", "Can I video call other students?", "How do notifications work?"],
      }
    }

    if (lowerMessage.includes("profile") || lowerMessage.includes("account")) {
      return {
        content:
          "Your profile is your digital identity on StudentConnect! ✨\n\n**To update your profile:**\n1. 👤 Click your avatar → **'Profile'**\n2. ✏️ Click **'Edit Profile'**\n3. 📝 Update your information:\n   • Bio and interests\n   • Skills and technologies\n   • University and major\n   • GitHub/LinkedIn links\n4. 💾 Save your changes\n\n**Pro tips:**\n• Complete profiles get 5x more connection requests\n• Add your skills to get matched with relevant projects\n• Upload a professional photo",
        suggestions: ["How do I add my skills?", "Can I connect my GitHub?", "How to make my profile stand out?"],
      }
    }

    if (lowerMessage.includes("resource") || lowerMessage.includes("learn") || lowerMessage.includes("study")) {
      return {
        content:
          "StudentConnect has tons of learning resources! 📚\n\n**Available resources:**\n• 🎓 **Tutorials** - Step-by-step guides\n• 📖 **Study Materials** - Shared by community members\n• 🎥 **Workshop Recordings** - Past event videos\n• 💡 **Project Templates** - Starter code and examples\n• 🤝 **Study Groups** - Find study partners\n\n**Access resources:**\n1. Check the **Resources** section in communities\n2. Browse the **Tutorials** page\n3. Join study-focused communities\n4. Attend workshops and events",
        suggestions: ["Show me programming tutorials", "How do I find study groups?", "What workshops are available?"],
      }
    }

    // Default response with helpful suggestions
    return {
      content:
        "I'm here to help you make the most of StudentConnect! 🌟\n\nI can assist you with:\n• 🏘️ Finding and joining communities\n• 📅 Discovering events and hackathons\n• 🚀 Creating and joining projects\n• 💬 Using the messaging system\n• 👤 Managing your profile\n• 📚 Finding learning resources\n\nWhat would you like to explore first?",
      suggestions: suggestedQuestions.slice(0, 4),
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <>
      {/* Chat Toggle Button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            onClick={() => setIsOpen(true)}
            className="h-14 w-14 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all duration-300"
            size="icon"
          >
            <MessageSquare className="h-6 w-6" />
          </Button>
          <div className="absolute -top-2 -right-2">
            <div className="h-4 w-4 bg-green-500 rounded-full animate-pulse" />
          </div>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className={cn(
            "fixed z-50 bg-white dark:bg-gray-900 rounded-lg shadow-2xl border",
            "bottom-6 right-6",
            isMinimized ? "w-80 h-16" : "w-96 h-[600px]",
            "max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)]",
            "md:w-96 md:h-[600px]",
            "sm:w-80 sm:h-[500px]",
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Avatar className="h-8 w-8 border-2 border-white/20">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                  <AvatarFallback className="bg-white/20">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-400 rounded-full border-2 border-white" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">StudentConnect AI</h3>
                <p className="text-xs text-purple-100">Always here to help</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMinimized(!isMinimized)}
                className="h-8 w-8 text-white hover:bg-white/20"
              >
                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 text-white hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Quick Actions */}
              {showQuickActions && (
                <div className="p-4 border-b bg-gray-50 dark:bg-gray-800">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 font-medium">Quick Actions</p>
                  <div className="grid grid-cols-2 gap-2">
                    {quickActions.map((action, index) => (
                      <Button
                        key={action.label}
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickAction(action.action)}
                        className="justify-start text-xs h-8"
                      >
                        <action.icon className="h-3 w-3 mr-2" />
                        {action.label}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Messages */}
              <ScrollArea className="flex-1 p-4 h-[400px]">
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={cn(
                        "flex items-start space-x-3",
                        message.role === "user" ? "flex-row-reverse space-x-reverse" : "",
                      )}
                    >
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        {message.role === "assistant" ? (
                          <>
                            <AvatarImage src="/placeholder.svg?height=32&width=32" />
                            <AvatarFallback className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                              <Bot className="h-4 w-4" />
                            </AvatarFallback>
                          </>
                        ) : (
                          <>
                            <AvatarImage src="/placeholder.svg?height=32&width=32" />
                            <AvatarFallback className="bg-blue-600 text-white">U</AvatarFallback>
                          </>
                        )}
                      </Avatar>

                      <div className={cn("flex-1 space-y-2", message.role === "user" ? "items-end" : "items-start")}>
                        <div
                          className={cn(
                            "rounded-lg px-4 py-2 max-w-[85%] text-sm",
                            message.role === "user"
                              ? "bg-blue-600 text-white ml-auto"
                              : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100",
                          )}
                        >
                          <div className="whitespace-pre-wrap">{message.content}</div>
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <span>{formatTime(message.timestamp)}</span>
                        </div>

                        {/* Suggestions */}
                        {message.role === "assistant" && message.suggestions && (
                          <div className="space-y-2 mt-3">
                            <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Suggested questions:</p>
                            <div className="flex flex-wrap gap-2">
                              {message.suggestions.map((suggestion, idx) => (
                                <Button
                                  key={idx}
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleSuggestion(suggestion)}
                                  className="text-xs h-7 px-3"
                                >
                                  <HelpCircle className="h-3 w-3 mr-1" />
                                  {suggestion}
                                </Button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex items-start space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-2 flex items-center space-x-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">Thinking...</span>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Input */}
              <div className="p-4 border-t bg-gray-50 dark:bg-gray-800 rounded-b-lg">
                <form onSubmit={handleSubmit} className="flex space-x-2">
                  <Input
                    ref={inputRef}
                    placeholder="Ask me anything about StudentConnect..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1 text-sm"
                    disabled={isLoading}
                  />
                  <Button
                    type="submit"
                    size="icon"
                    disabled={!input.trim() || isLoading}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Powered by StudentConnect AI • Always learning, always helping
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </>
  )
}
