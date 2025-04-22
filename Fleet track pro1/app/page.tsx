"use client"

import { useState, useEffect } from "react"
import { Truck, Plus, TrendingUp, TrendingDown, Home, BarChart, IndianRupee } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { TripTile } from "@/components/trip-tile"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { NavBar } from "@/components/ui/navbar"
import { AddTripForm } from "@/components/add-trip-form"
import { TripDetailModal } from "@/components/trip-detail-modal"
import { useRouter } from "next/navigation"
import { getTrips, addTrip, updateTrip, type Trip } from "@/lib/actions"

export default function Dashboard() {
  const router = useRouter()
  const [trips, setTrips] = useState<Trip[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddTripForm, setShowAddTripForm] = useState(false)
  const [activeNavItem, setActiveNavItem] = useState("Home")
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null)
  const [showTripDetail, setShowTripDetail] = useState(false)
  const { toast } = useToast()
  const [username, setUsername] = useState("John") // Default username
  // Add state for editing a trip
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null)

  // Fetch trips from Supabase on initial load
  useEffect(() => {
    async function fetchTrips() {
      setIsLoading(true)
      try {
        const fetchedTrips = await getTrips()
        setTrips(fetchedTrips)
      } catch (error) {
        console.error("Error fetching trips:", error)
        toast({
          title: "Error",
          description: "Failed to load trips. Please try again later.",
          variant: "destructive",
        })
        // Set trips to empty array to prevent undefined errors
        setTrips([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchTrips()
  }, [toast])

  useEffect(() => {
    // Set the active navigation item to "Home" when on the home page
    setActiveNavItem("Home")
  }, [])

  // Calculate total revenue and profit
  const totalRevenue = trips.reduce((sum, trip) => sum + Number(trip.rent), 0)
  const totalProfit = trips.reduce((sum, trip) => sum + Number(trip.profit_loss), 0)

  // Update the handleSaveTrip function to handle both adding and editing
  const handleSaveTrip = async (tripData: any) => {
    try {
      setIsLoading(true)

      let result

      // Check if we're editing an existing trip or adding a new one
      if (tripData.id) {
        // Update existing trip
        result = await updateTrip(tripData.id, tripData)
      } else {
        // Add new trip
        result = await addTrip(tripData)
      }

      if (result.success) {
        // Fetch the updated trips list
        const updatedTrips = await getTrips()
        setTrips(updatedTrips)

        // Show success toast
        toast({
          title: tripData.id ? "Trip Updated Successfully" : "Trip Added Successfully",
          description: `${tripData.trip_number} has been ${tripData.id ? "updated" : "added"}.`,
        })

        // Hide the form and reset editing state
        setShowAddTripForm(false)
        setEditingTrip(null)
      } else {
        console.error("Error result:", result)
        toast({
          title: tripData.id ? "Error Updating Trip" : "Error Adding Trip",
          description: result.message || `Failed to ${tripData.id ? "update" : "add"} trip`,
          variant: "destructive",
        })
        // Don't hide the form on error
      }
    } catch (error) {
      console.error(`Error ${tripData.id ? "updating" : "saving"} trip:`, error)
      toast({
        title: tripData.id ? "Error Updating Trip" : "Error Adding Trip",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })
      // Don't hide the form on error
    } finally {
      setIsLoading(false)
    }
  }

  const handleNavItemSelect = (item: string) => {
    setActiveNavItem(item)
    if (item === "Analytics") {
      router.push("/analytics")
    } else if (item === "Home") {
      router.push("/")
    }
  }

  // Update the handleTripClick function to pass the edit and delete handlers
  const handleTripClick = (trip: Trip) => {
    setSelectedTrip(trip)
    setShowTripDetail(true)
  }

  // Add handleEditTrip and handleDeleteTrip functions
  const handleEditTrip = (trip: Trip) => {
    setEditingTrip(trip)
    setShowAddTripForm(true)
    setShowTripDetail(false)
  }

  const handleDeleteTrip = async (tripId: string) => {
    // The deletion is handled in the modal, but we need to refresh the trips list
    try {
      const updatedTrips = await getTrips()
      setTrips(updatedTrips)
    } catch (error) {
      console.error("Error refreshing trips after deletion:", error)
      toast({
        title: "Error",
        description: "Failed to refresh trips after deletion",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-gray-800 bg-gradient-to-r from-gray-900 to-black shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <Truck className="h-8 w-8 mr-3 text-primary" />
              <h1 className="text-2xl font-bold">FleetTrack Pro</h1>
            </div>
          </div>
          <NavBar
            items={[
              { name: "Home", url: "/", icon: Home },
              { name: "Analytics", url: "/analytics", icon: BarChart },
            ]}
            activeItem={activeNavItem}
            onItemSelect={handleNavItemSelect}
            className="mb-2"
            username={username}
          />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gray-900 border-gray-800 shadow-lg hover:shadow-primary/5 transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Truck className="h-4 w-4 mr-2 text-primary" />
                Total Trips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{trips.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Completed trips</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800 shadow-lg hover:shadow-primary/5 transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <IndianRupee className="h-4 w-4 mr-2 text-primary" />
                Total Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">₹{totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">Across all trips</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800 shadow-lg hover:shadow-primary/5 transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                {totalProfit >= 0 ? (
                  <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 mr-2 text-red-500" />
                )}
                Net Profit
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${totalProfit >= 0 ? "text-green-500" : "text-red-500"}`}>
                ₹{Math.abs(totalProfit).toLocaleString()}
                {totalProfit < 0 && " (Loss)"}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Overall performance</p>
            </CardContent>
          </Card>
        </div>

        {/* Trip Overview */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold flex items-center">
              <Truck className="h-5 w-5 mr-2 text-primary" />
              Trip Overview
            </h2>
            <Button
              onClick={() => {
                setShowAddTripForm(true)
                setEditingTrip(null)
              }}
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-primary/20"
            >
              <Plus className="h-4 w-4" />
              Add Trip
            </Button>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 border border-gray-800 rounded-lg bg-gray-900/50">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
              <p className="text-xl font-medium text-gray-400">Loading trips...</p>
            </div>
          ) : trips.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 border border-gray-800 rounded-lg bg-gray-900/50">
              <Truck className="h-16 w-16 text-gray-700 mb-4" />
              <p className="text-xl font-medium text-gray-400">No trips exist yet</p>
              <p className="text-sm text-gray-500 mt-2 text-center">
                Add your first trip by clicking the "Add Trip" button above
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {trips.map((trip) => (
                  <motion.div
                    key={trip.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => handleTripClick(trip)}
                    className="cursor-pointer"
                  >
                    <TripTile trip={trip} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </main>

      {/* Fullscreen Add Trip Form Overlay */}
      <AnimatePresence>
        {showAddTripForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-sm overflow-y-auto"
          >
            <div className="container mx-auto px-4 py-8">
              <div className="max-w-4xl mx-auto">
                <AddTripForm
                  onSave={handleSaveTrip}
                  onCancel={() => {
                    setShowAddTripForm(false)
                    setEditingTrip(null)
                  }}
                  editTrip={editingTrip}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trip Detail Modal */}
      <TripDetailModal
        trip={selectedTrip}
        isOpen={showTripDetail}
        onClose={() => setShowTripDetail(false)}
        onEdit={handleEditTrip}
        onDelete={handleDeleteTrip}
      />
    </div>
  )
}
