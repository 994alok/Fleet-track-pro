"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Truck, Menu, BarChart, PlusCircle, Home } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function MobileNav() {
  const pathname = usePathname()
  const [open, setOpen] = React.useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <MobileLink href="/" className="flex items-center" onOpenChange={setOpen}>
          <Truck className="mr-2 h-6 w-6 text-primary" />
          <span className="font-bold">FleetTrack Pro</span>
        </MobileLink>
        <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
          <div className="flex flex-col space-y-3">
            <MobileLink
              href="/"
              className={cn("flex items-center gap-2", pathname === "/" ? "text-primary" : "text-muted-foreground")}
              onOpenChange={setOpen}
            >
              <Home className="h-5 w-5" />
              <span>Dashboard</span>
            </MobileLink>
            <MobileLink
              href="/trucks"
              className={cn(
                "flex items-center gap-2",
                pathname === "/trucks" || pathname.startsWith("/trucks/") ? "text-primary" : "text-muted-foreground",
              )}
              onOpenChange={setOpen}
            >
              <Truck className="h-5 w-5" />
              <span>Trucks</span>
            </MobileLink>
            <MobileLink
              href="/trips/new"
              className={cn(
                "flex items-center gap-2",
                pathname === "/trips/new" ? "text-primary" : "text-muted-foreground",
              )}
              onOpenChange={setOpen}
            >
              <PlusCircle className="h-5 w-5" />
              <span>New Trip</span>
            </MobileLink>
            <MobileLink
              href="/reports"
              className={cn(
                "flex items-center gap-2",
                pathname === "/reports" ? "text-primary" : "text-muted-foreground",
              )}
              onOpenChange={setOpen}
            >
              <BarChart className="h-5 w-5" />
              <span>Reports</span>
            </MobileLink>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

interface MobileLinkProps {
  href: string
  onOpenChange?: (open: boolean) => void
  className?: string
  children: React.ReactNode
}

function MobileLink({ href, onOpenChange, className, children, ...props }: MobileLinkProps) {
  return (
    <Link
      href={href}
      onClick={() => {
        onOpenChange?.(false)
      }}
      className={cn(className)}
      {...props}
    >
      {children}
    </Link>
  )
}
