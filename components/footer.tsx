import Link from "next/link"

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <Link href="/" className="text-xl font-bold">
            StudentConnect
          </Link>
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by students, for students. © 2024 StudentConnect.
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/communities" className="text-sm text-muted-foreground hover:text-foreground">
            Communities
          </Link>
          <Link href="/projects" className="text-sm text-muted-foreground hover:text-foreground">
            Projects
          </Link>
          <Link href="/events" className="text-sm text-muted-foreground hover:text-foreground">
            Events
          </Link>
          <Link href="/messages" className="text-sm text-muted-foreground hover:text-foreground">
            Messages
          </Link>
          <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
            Privacy
          </Link>
          <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
            Terms
          </Link>
          <Link href="/support" className="text-sm text-muted-foreground hover:text-foreground">
            Support
          </Link>
        </div>
      </div>
    </footer>
  )
}
