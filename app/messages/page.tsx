"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Send, Plus, Phone, Video, Info, Paperclip, Smile } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"

export default function MessagesPage() {
  const { user } = useAuth()
  const [conversations, setConversations] = useState([
    {
      id: 1,
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "Are you joining the hackathon next week?",
      time: "10:30 AM",
      unread: 1,
      online: true,
      isGroup: false,
    },
    {
      id: 2,
      name: "Web Dev Group",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "Alex: I'll share the project resources soon",
      time: "Yesterday",
      unread: 0,
      online: false,
      isGroup: true,
      members: 8,
    },
    {
      id: 3,
      name: "David Wilson",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "Thanks for your help with the project!",
      time: "Yesterday",
      unread: 0,
      online: true,
      isGroup: false,
    },
    {
      id: 4,
      name: "ML Study Group",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "Meeting scheduled for tomorrow at 5 PM",
      time: "Monday",
      unread: 0,
      online: false,
      isGroup: true,
      members: 12,
    },
    {
      id: 5,
      name: "Emily Chen",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "Did you see the new AI course?",
      time: "Monday",
      unread: 0,
      online: false,
      isGroup: false,
    },
  ])
  const [activeConversation, setActiveConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [messageInput, setMessageInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [showAttachmentOptions, setShowAttachmentOptions] = useState(false)
  const messagesEndRef = useRef(null)
  const messageInputRef = useRef(null)

  // Mock messages for each conversation
  const mockMessages = {
    1: [
      {
        id: 1,
        sender: "Sarah Johnson",
        content: "Hey there! Are you joining the hackathon next week?",
        time: "10:30 AM",
        isMe: false,
      },
    ],
    2: [
      {
        id: 1,
        sender: "Alex",
        content: "I've been working on the frontend for our project",
        time: "Yesterday, 3:45 PM",
        isMe: false,
      },
      {
        id: 2,
        sender: "Maya",
        content: "Great progress so far!",
        time: "Yesterday, 4:00 PM",
        isMe: false,
      },
      {
        id: 3,
        sender: "Alex",
        content: "I'll share the project resources soon",
        time: "Yesterday, 4:15 PM",
        isMe: false,
      },
    ],
    3: [
      {
        id: 1,
        sender: "You",
        content: "I've sent you the code review",
        time: "Yesterday, 2:30 PM",
        isMe: true,
      },
      {
        id: 2,
        sender: "David Wilson",
        content: "Thanks for your help with the project!",
        time: "Yesterday, 2:45 PM",
        isMe: false,
      },
    ],
    4: [
      {
        id: 1,
        sender: "Group Admin",
        content: "Welcome everyone to the ML Study Group!",
        time: "Monday, 10:00 AM",
        isMe: false,
      },
      {
        id: 2,
        sender: "Jessica",
        content: "I'm excited to learn together!",
        time: "Monday, 10:05 AM",
        isMe: false,
      },
      {
        id: 3,
        sender: "Group Admin",
        content: "Meeting scheduled for tomorrow at 5 PM",
        time: "Monday, 11:30 AM",
        isMe: false,
      },
    ],
    5: [
      {
        id: 1,
        sender: "Emily Chen",
        content: "Have you started the new assignment?",
        time: "Monday, 9:00 AM",
        isMe: false,
      },
      {
        id: 2,
        sender: "You",
        content: "Not yet, I'm planning to start tomorrow",
        time: "Monday, 9:15 AM",
        isMe: true,
      },
      {
        id: 3,
        sender: "Emily Chen",
        content: "Did you see the new AI course?",
        time: "Monday, 9:30 AM",
        isMe: false,
      },
    ],
  }

  useEffect(() => {
    // Set first conversation as active by default
    if (conversations.length > 0 && !activeConversation) {
      setActiveConversation(conversations[0])
    }
  }, [conversations, activeConversation])

  useEffect(() => {
    // Load messages for active conversation
    if (activeConversation) {
      setLoading(true)
      // Simulate API call
      setTimeout(() => {
        const conversationMessages = mockMessages[activeConversation.id] || []
        setMessages(conversationMessages)
        setLoading(false)

        // Mark conversation as read
        if (activeConversation.unread > 0) {
          setConversations(conversations.map((c) => (c.id === activeConversation.id ? { ...c, unread: 0 } : c)))
        }
      }, 500)
    }
  }, [activeConversation])

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (messageInput.trim() && activeConversation) {
      const newMessage = {
        id: messages.length + 1,
        sender: "You",
        content: messageInput,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isMe: true,
      }

      setMessages([...messages, newMessage])
      setMessageInput("")

      // Update conversation's last message
      setConversations(
        conversations.map((c) =>
          c.id === activeConversation.id ? { ...c, lastMessage: messageInput, time: "Just now" } : c,
        ),
      )

      // Focus back on input
      messageInputRef.current?.focus()

      // Simulate typing response for demo purposes
      simulateTypingResponse()
    }
  }

  const simulateTypingResponse = () => {
    // Only simulate for certain conversations in demo
    if (activeConversation.id === 1) {
      setIsTyping(true)

      setTimeout(() => {
        setIsTyping(false)

        const newMessage = {
          id: messages.length + 2,
          sender: activeConversation.name,
          content: "Yes, I'm definitely joining the hackathon! Would you like to team up?",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          isMe: false,
        }

        setMessages((prev) => [...prev, newMessage])

        // Update conversation
        setConversations(
          conversations.map((c) =>
            c.id === activeConversation.id
              ? {
                  ...c,
                  lastMessage: newMessage.content,
                  time: "Just now",
                  unread: 0,
                }
              : c,
          ),
        )
      }, 3000)
    }
  }

  const handleConversationClick = (conversation) => {
    setActiveConversation(conversation)
  }

  const handleAttachment = (type) => {
    alert(`${type} attachments will be available soon!`)
    setShowAttachmentOptions(false)
  }

  const filteredConversations = conversations.filter(
    (conversation) =>
      conversation.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conversation.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 h-[calc(100vh-12rem)]">
        {/* Conversations Sidebar */}
        <Card className="md:col-span-1 overflow-hidden">
          <CardContent className="p-0 h-full flex flex-col">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Messages</h2>
                <NewConversationDialog
                  onSuccess={(newConversation) => {
                    setConversations([newConversation, ...conversations])
                    setActiveConversation(newConversation)
                  }}
                />
              </div>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search conversations..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {loading && !activeConversation ? (
                <div className="p-4 text-center text-muted-foreground">Loading conversations...</div>
              ) : filteredConversations.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  {searchQuery ? "No conversations match your search" : "No conversations yet"}
                </div>
              ) : (
                filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-muted/50 ${
                      activeConversation?.id === conversation.id ? "bg-muted" : ""
                    }`}
                    onClick={() => handleConversationClick(conversation)}
                  >
                    <div className="relative">
                      <Avatar>
                        <AvatarImage src={conversation.avatar || "/placeholder.svg"} alt={conversation.name} />
                        <AvatarFallback>{conversation.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      {conversation.online && (
                        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <p className="font-medium truncate">
                          {conversation.name}
                          {conversation.isGroup && (
                            <span className="text-xs text-muted-foreground ml-1">({conversation.members})</span>
                          )}
                        </p>
                        <span className="text-xs text-muted-foreground">{conversation.time}</span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
                    </div>
                    {conversation.unread > 0 && (
                      <div className="flex-shrink-0 h-5 w-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs">
                        {conversation.unread}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="md:col-span-2 lg:col-span-3 overflow-hidden">
          <CardContent className="p-0 h-full flex flex-col">
            {activeConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage
                        src={activeConversation.avatar || "/placeholder.svg"}
                        alt={activeConversation.name}
                      />
                      <AvatarFallback>{activeConversation.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{activeConversation.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {activeConversation.online ? "Online" : "Offline"}
                        {activeConversation.isGroup && ` • ${activeConversation.members} members`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="icon" variant="ghost">
                      <Phone className="h-5 w-5" />
                    </Button>
                    <Button size="icon" variant="ghost">
                      <Video className="h-5 w-5" />
                    </Button>
                    <Button size="icon" variant="ghost">
                      <Info className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {loading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center text-muted-foreground">
                        <p>Loading messages...</p>
                      </div>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center text-muted-foreground">
                        <p className="mb-2">No messages yet</p>
                        <p className="text-sm">Send a message to start the conversation</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      {messages.map((message) => (
                        <div key={message.id} className={`flex ${message.isMe ? "justify-end" : "justify-start"}`}>
                          <div
                            className={`max-w-[70%] rounded-lg p-3 ${
                              message.isMe ? "bg-primary text-primary-foreground" : "bg-muted"
                            }`}
                          >
                            {!message.isMe && <p className="text-xs font-medium mb-1">{message.sender}</p>}
                            <p>{message.content}</p>
                            <p className="text-xs mt-1 opacity-70 text-right">{message.time}</p>
                          </div>
                        </div>
                      ))}

                      {isTyping && (
                        <div className="flex justify-start">
                          <div className="max-w-[70%] rounded-lg p-3 bg-muted">
                            <p className="text-xs font-medium mb-1">{activeConversation.name}</p>
                            <div className="flex space-x-1">
                              <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce"></div>
                              <div
                                className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce"
                                style={{ animationDelay: "0.2s" }}
                              ></div>
                              <div
                                className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce"
                                style={{ animationDelay: "0.4s" }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      )}

                      <div ref={messagesEndRef} />
                    </>
                  )}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t">
                  <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                    <div className="relative">
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={() => setShowAttachmentOptions(!showAttachmentOptions)}
                      >
                        <Paperclip className="h-5 w-5" />
                      </Button>

                      {showAttachmentOptions && (
                        <div className="absolute bottom-full left-0 mb-2 bg-background border rounded-lg shadow-lg p-2 flex gap-2">
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8"
                            onClick={() => handleAttachment("Image")}
                          >
                            <span className="sr-only">Image</span>📷
                          </Button>
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8"
                            onClick={() => handleAttachment("File")}
                          >
                            <span className="sr-only">File</span>📄
                          </Button>
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8"
                            onClick={() => handleAttachment("Voice")}
                          >
                            <span className="sr-only">Voice</span>🎤
                          </Button>
                        </div>
                      )}
                    </div>
                    <Input
                      placeholder="Type a message..."
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      className="flex-1"
                      ref={messageInputRef}
                    />
                    <Button type="button" size="icon" variant="ghost">
                      <Smile className="h-5 w-5" />
                    </Button>
                    <Button type="submit" size="icon" disabled={!messageInput.trim()}>
                      <Send className="h-5 w-5" />
                    </Button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-muted-foreground">
                  <p className="mb-2">Select a conversation to start messaging</p>
                  <NewConversationDialog
                    buttonText="New Conversation"
                    buttonVariant="outline"
                    onSuccess={(newConversation) => {
                      setConversations([newConversation, ...conversations])
                      setActiveConversation(newConversation)
                    }}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function NewConversationDialog({ buttonText = "New", buttonVariant = "ghost", onSuccess }) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    isGroup: "false",
    members: "2",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Create a new conversation
    const newConversation = {
      id: Math.floor(Math.random() * 1000) + 100, // Generate a random ID
      name: formData.name,
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "",
      time: "Just now",
      unread: 0,
      online: Math.random() > 0.5, // Randomly set online status
      isGroup: formData.isGroup === "true",
      members: formData.isGroup === "true" ? Number(formData.members) : undefined,
    }

    onSuccess(newConversation)
    setOpen(false)
    setFormData({
      name: "",
      isGroup: "false",
      members: "2",
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={buttonVariant} size={buttonText === "New" ? "icon" : "default"}>
          {buttonText === "New" ? <Plus className="h-5 w-5" /> : buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Conversation</DialogTitle>
          <DialogDescription>Create a new conversation with a user or group</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter name or username"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Conversation Type</Label>
              <RadioGroup
                name="isGroup"
                value={formData.isGroup}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, isGroup: value }))}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="false" id="individual" />
                  <Label htmlFor="individual">Individual</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="true" id="group" />
                  <Label htmlFor="group">Group</Label>
                </div>
              </RadioGroup>
            </div>

            {formData.isGroup === "true" && (
              <div className="space-y-2">
                <Label htmlFor="members">Number of Members</Label>
                <Input
                  id="members"
                  name="members"
                  type="number"
                  min="3"
                  value={formData.members}
                  onChange={handleChange}
                />
              </div>
            )}

            {formData.isGroup === "true" && (
              <div className="space-y-2">
                <Label htmlFor="description">Group Description (Optional)</Label>
                <Textarea id="description" name="description" placeholder="Describe the purpose of this group" />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="submit">Create</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
