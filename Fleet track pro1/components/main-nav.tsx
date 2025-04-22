"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Truck, BarChart, PlusCircle, Home } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function MainNav() {
  const pathname = usePathname()

  return (
    <div className="mr-4 hidden md:flex">
      <Link href="/" className="mr-6 flex items-center space-x-2">
        <Truck className="h-6 w-6 text-primary" />
        <span className="hidden font-bold sm:inline-block">FleetTrack Pro</span>
      </Link>
      <nav className="flex items-center space-x-6 text-sm font-medium">
        <Link
          href="/"
          className={cn(
            "transition-colors hover:text-primary",
            pathname === "/" ? "text-primary" : "text-muted-foreground",
          )}
        >
          <Button variant="ghost" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            <span>Dashboard</span>
          </Button>
        </Link>
        <Link
          href="/trucks"
          className={cn(
            "transition-colors hover:text-primary",
            pathname === "/trucks" || pathname.startsWith("/trucks/") ? "text-primary" : "text-muted-foreground",
          )}
        >
          <Button variant="ghost" className="flex items-center gap-2">
            <Truck className="h-4 w-4" />
            <span>Trucks</span>
          </Button>
        </Link>
        <Link
          href="/trips/new"
          className={cn(
            "transition-colors hover:text-primary",
            pathname === "/trips/new" ? "text-primary" : "text-muted-foreground",
          )}
        >
          <Button variant="ghost" className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            <span>New Trip</span>
          </Button>
        </Link>
        <Link
          href="/reports"
          className={cn(
            "transition-colors hover:text-primary",
            pathname === "/reports" ? "text-primary" : "text-muted-foreground",
          )}
        >
          <Button variant="ghost" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            <span>Reports</span>
          </Button>
        </Link>
      </nav>
    </div>
  )
}
