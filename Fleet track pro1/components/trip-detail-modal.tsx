"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Truck, MapPin, Calendar, Ruler, Fuel, IndianRupee, BarChart, Download, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatCurrency, formatDate } from "@/lib/utils"
import type { Trip } from "@/lib/actions"
import { generateTripPDF } from "@/lib/pdf-generator"
import { deleteTrip } from "@/lib/actions"
import { toast } from "@/components/ui/use-toast"

interface TripDetailModalProps {
  trip: Trip | null
  isOpen: boolean
  onClose: () => void
  onEdit?: (trip: Trip) => void
  onDelete?: (tripId: string) => void
}

export function TripDetailModal({ trip, isOpen, onClose, onEdit, onDelete }: TripDetailModalProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [animationComplete, setAnimationComplete] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveTab("overview")
      setAnimationComplete(false)
    }
  }, [isOpen])

  if (!trip) return null

  const isProfitable = Number(trip.profit_loss) >= 0
  const totalExpenses = Number(trip.total_expenses)

  // Calculate expense percentage of rent
  const expensePercentage =
    Number(trip.rent) > 0 && totalExpenses > 0 ? Math.min((totalExpenses / Number(trip.rent)) * 100, 100) : 0

  // Change the modal container to be more prominent
  const modalContainerStyles =
    "fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"

  // Update the modal content to be larger and more prominent
  const modalContentStyles =
    "bg-gray-900 border border-gray-800 rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-hidden"

  const handleDownloadPDF = () => {
    if (!trip) return

    try {
      const doc = generateTripPDF(trip)
      doc.save(`Trip_${trip.trip_number}_Details.pdf`)
    } catch (error) {
      console.error("Error generating PDF:", error)
    }
  }

  const handleEdit = () => {
    // You would typically open your edit form here or navigate to an edit page
    // For now, we'll just close the modal and let the parent component handle it
    onClose()
    if (trip && onEdit) {
      onEdit(trip)
    }
  }

  const handleDelete = async () => {
    if (!trip?.id) return

    setIsDeleting(true)
    setIsLoading(true)

    try {
      const result = await deleteTrip(trip.id)

      if (result.success) {
        toast({
          title: "Trip Deleted",
          description: "The trip has been successfully deleted.",
        })
        onClose()
        if (onDelete) {
          onDelete(trip.id)
        }
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to delete trip",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting trip:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred while deleting the trip",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setIsLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={modalContainerStyles}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              transition: {
                type: "spring",
                damping: 25,
                stiffness: 300,
              },
            }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={modalContentStyles}
            onClick={(e) => e.stopPropagation()}
            onAnimationComplete={() => setAnimationComplete(true)}
          >
            {/* Header with close button */}
            <div className="flex justify-between items-center p-6 border-b border-gray-800 sticky top-0 bg-gray-900 z-10">
              <h2 className="text-2xl font-bold flex items-center">
                <Truck className="h-6 w-6 mr-2 text-primary" />
                Trip Details: {trip.trip_number}
              </h2>
              <div className="flex items-center gap-2">
                {/* Add Edit Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleEdit()
                  }}
                  className="flex items-center gap-1"
                >
                  <Edit className="h-4 w-4" />
                  <span className="hidden md:inline">Edit</span>
                </Button>

                {/* Add Delete Button */}
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDelete()
                  }}
                  disabled={isDeleting}
                  className="flex items-center gap-1"
                >
                  {isDeleting ? (
                    <>
                      <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-1"></span>
                      <span className="hidden md:inline">Deleting...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4" />
                      <span className="hidden md:inline">Delete</span>
                    </>
                  )}
                </Button>

                {/* Download PDF Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDownloadPDF()
                  }}
                  className="flex items-center gap-1"
                >
                  <Download className="h-4 w-4" />
                  <span className="hidden md:inline">Download PDF</span>
                </Button>

                {/* Close Button */}
                <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-gray-800">
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Tab navigation */}
            <div className="px-6 pt-4 sticky top-[72px] bg-gray-900 z-10">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-5 w-full">
                  <TabsTrigger value="overview" className="flex items-center gap-1">
                    <Truck className="h-4 w-4 md:mr-1" />
                    <span className="hidden md:inline">Overview</span>
                  </TabsTrigger>
                  <TabsTrigger value="metrics" className="flex items-center gap-1">
                    <Ruler className="h-4 w-4 md:mr-1" />
                    <span className="hidden md:inline">Metrics</span>
                  </TabsTrigger>
                  <TabsTrigger value="diesel" className="flex items-center gap-1">
                    <Fuel className="h-4 w-4 md:mr-1" />
                    <span className="hidden md:inline">Diesel</span>
                  </TabsTrigger>
                  <TabsTrigger value="expenses" className="flex items-center gap-1">
                    <IndianRupee className="h-4 w-4 md:mr-1" />
                    <span className="hidden md:inline">Expenses</span>
                  </TabsTrigger>
                  <TabsTrigger value="summary" className="flex items-center gap-1">
                    <BarChart className="h-4 w-4 md:mr-1" />
                    <span className="hidden md:inline">Summary</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Content area with smooth transitions */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <AnimatePresence mode="wait">
                {activeTab === "overview" && (
                  <TabContent tabKey="overview">
                    <Card className="border-gray-700">
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Truck className="h-5 w-5 mr-2 text-primary" />
                          Trip Overview
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h3 className="text-sm font-medium text-gray-400">Trip Name/Number</h3>
                            <p className="text-lg font-semibold">{trip.trip_number}</p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-400">Driver Name(s)</h3>
                            <p className="text-lg font-semibold">
                              {trip.driver1_name}
                              {trip.driver2_name && `, ${trip.driver2_name}`}
                            </p>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium text-gray-400">Route</h3>
                          <div className="flex items-center mt-1">
                            <MapPin className="h-5 w-5 text-primary mr-2" />
                            <p className="text-lg font-semibold">
                              {trip.loading_point} <span className="mx-2">→</span> {trip.unloading_point}
                            </p>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium text-gray-400">Trip Date</h3>
                          <div className="flex items-center mt-1">
                            <Calendar className="h-5 w-5 text-primary mr-2" />
                            <p className="text-lg font-semibold">
                              {formatDate(trip.start_date)} - {formatDate(trip.unloading_date)}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabContent>
                )}

                {activeTab === "metrics" && (
                  <TabContent tabKey="metrics">
                    <Card className="border-gray-700">
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Ruler className="h-5 w-5 mr-2 text-primary" />
                          Trip Metrics
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="bg-gray-800 p-4 rounded-lg">
                            <h3 className="text-sm font-medium text-gray-400 mb-1">Starting KM</h3>
                            <p className="text-2xl font-bold">{trip.starting_km.toLocaleString()}</p>
                          </div>

                          <div className="bg-gray-800 p-4 rounded-lg">
                            <h3 className="text-sm font-medium text-gray-400 mb-1">Ending KM</h3>
                            <p className="text-2xl font-bold">{trip.closing_km.toLocaleString()}</p>
                          </div>

                          <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
                            <h3 className="text-sm font-medium text-primary mb-1">Running KM</h3>
                            <p className="text-2xl font-bold">{trip.running_km.toLocaleString()}</p>
                            <p className="text-xs text-gray-400 mt-1">Auto-calculated: Ending - Starting</p>
                          </div>
                        </div>

                        <div className="bg-gray-800 p-4 rounded-lg">
                          <h3 className="text-sm font-medium text-gray-400 mb-1">Trip Duration</h3>
                          <p className="text-2xl font-bold">
                            {Math.ceil(
                              (new Date(trip.unloading_date).getTime() - new Date(trip.start_date).getTime()) /
                                (1000 * 60 * 60 * 24),
                            )}{" "}
                            days
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            From {formatDate(trip.start_date)} to {formatDate(trip.unloading_date)}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </TabContent>
                )}

                {activeTab === "diesel" && (
                  <TabContent tabKey="diesel">
                    <Card className="border-gray-700">
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Fuel className="h-5 w-5 mr-2 text-primary" />
                          Diesel Entries
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {trip.diesel_entries && trip.diesel_entries.length > 0 ? (
                          <>
                            {trip.diesel_entries.map((entry: any, index: number) => (
                              <div key={index} className="bg-gray-800 p-4 rounded-lg">
                                <div className="flex justify-between items-center mb-2">
                                  <h3 className="font-medium">Entry #{index + 1}</h3>
                                  <span className="text-sm text-gray-400">
                                    {formatDate(entry.date)} {entry.time}
                                  </span>
                                </div>

                                <div className="grid grid-cols-3 gap-4 mb-2">
                                  <div>
                                    <p className="text-sm text-gray-400">Litres</p>
                                    <p className="font-semibold">{entry.litres_purchased.toFixed(2)} L</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-400">Rate (₹/L)</p>
                                    <p className="font-semibold">₹{entry.price_per_litre.toFixed(2)}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-400">Total Cost</p>
                                    <p className="font-semibold">₹{entry.total_cost.toFixed(2)}</p>
                                  </div>
                                </div>

                                <div>
                                  <p className="text-sm text-gray-400">Location</p>
                                  <p className="font-semibold">{entry.location}</p>
                                </div>
                              </div>
                            ))}

                            <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
                              <div className="flex justify-between items-center">
                                <h3 className="font-medium text-primary">Total Diesel Cost</h3>
                                <p className="text-xl font-bold">{formatCurrency(trip.diesel_cost)}</p>
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="text-center py-8 text-gray-400">
                            No diesel entries recorded for this trip.
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabContent>
                )}

                {activeTab === "expenses" && (
                  <TabContent tabKey="expenses">
                    <Card className="border-gray-700">
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <IndianRupee className="h-5 w-5 mr-2 text-primary" />
                          Expenses & Payments
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-gray-800 p-4 rounded-lg">
                              <h3 className="font-medium mb-3">Driver Payments</h3>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-gray-400">Driver Bata</span>
                                  <span>{formatCurrency(trip.driver_bata_amount)}</span>
                                </div>
                                {trip.driver_bata_type === "percentage" && (
                                  <div className="text-xs text-gray-500">({trip.driver_bata_percent}% of rent)</div>
                                )}
                              </div>
                            </div>

                            <div className="bg-gray-800 p-4 rounded-lg">
                              <h3 className="font-medium mb-3">Agent Commission</h3>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-gray-400">Commission</span>
                                  <span>{formatCurrency(trip.agent_commission_amount)}</span>
                                </div>
                                {trip.agent_name && (
                                  <div className="text-xs text-gray-500">Agent: {trip.agent_name}</div>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="bg-gray-800 p-4 rounded-lg">
                            <h3 className="font-medium mb-3">Trip Expenses</h3>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-gray-400">Diesel Cost</span>
                                <span>{formatCurrency(trip.diesel_cost)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Toll/FASTag</span>
                                <span>{formatCurrency(trip.fastag_charges)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Loading Halt</span>
                                <span>{formatCurrency(trip.loading_halt_cost)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Unloading Halt</span>
                                <span>{formatCurrency(trip.unloading_halt_cost)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">DEF Charges</span>
                                <span>{formatCurrency(trip.def_charges)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">RTO Charges</span>
                                <span>{formatCurrency(trip.rto_charges)}</span>
                              </div>
                              {Number(trip.police_commission) > 0 && (
                                <div className="flex justify-between">
                                  <span className="text-gray-400">Police Commission</span>
                                  <span>{formatCurrency(trip.police_commission)}</span>
                                </div>
                              )}
                              {Number(trip.other_expenses_amount) > 0 && (
                                <div className="flex justify-between">
                                  <span className="text-gray-400">Other Expenses</span>
                                  <span>{formatCurrency(trip.other_expenses_amount)}</span>
                                </div>
                              )}
                            </div>

                            {trip.other_expenses_text && (
                              <div className="mt-2 text-sm text-gray-400">
                                <p className="font-medium">Notes:</p>
                                <p>{trip.other_expenses_text}</p>
                              </div>
                            )}
                          </div>

                          <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
                            <div className="flex justify-between items-center">
                              <h3 className="font-medium text-primary">Total Expenses</h3>
                              <p className="text-xl font-bold">{formatCurrency(totalExpenses)}</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabContent>
                )}

                {activeTab === "summary" && (
                  <TabContent tabKey="summary">
                    <Card className="border-gray-700">
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <BarChart className="h-5 w-5 mr-2 text-primary" />
                          Financial Summary
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-gray-800 p-4 rounded-lg">
                            <h3 className="text-sm font-medium text-gray-400 mb-1">Rent (Trip Revenue)</h3>
                            <p className="text-2xl font-bold">{formatCurrency(trip.rent)}</p>
                          </div>

                          <div className="bg-gray-800 p-4 rounded-lg">
                            <h3 className="text-sm font-medium text-gray-400 mb-1">Total Expenses</h3>
                            <p className="text-2xl font-bold">{formatCurrency(totalExpenses)}</p>
                          </div>
                        </div>

                        <div
                          className={`p-6 rounded-lg ${isProfitable ? "bg-green-900/20 border border-green-500/30" : "bg-red-900/20 border border-red-500/30"}`}
                        >
                          <h3 className="text-sm font-medium text-gray-300 mb-2">Profit / Loss</h3>
                          <p className={`text-3xl font-bold ${isProfitable ? "text-green-500" : "text-red-500"}`}>
                            {formatCurrency(Math.abs(Number(trip.profit_loss)))}
                            {!isProfitable && " (Loss)"}
                          </p>

                          <div className="mt-4">
                            <div className="flex justify-between text-sm mb-1">
                              <span>Expenses</span>
                              <span>{Math.round(expensePercentage)}% of Revenue</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2.5">
                              <div
                                className={`h-2.5 rounded-full ${isProfitable ? "bg-green-500" : "bg-red-500"}`}
                                style={{ width: `${Math.min(expensePercentage, 100)}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gray-800 p-4 rounded-lg">
                          <h3 className="font-medium mb-3">Key Metrics</h3>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-400">Profit Margin</p>
                              <p className={`font-bold ${isProfitable ? "text-green-500" : "text-red-500"}`}>
                                {Number(trip.rent) > 0
                                  ? Math.round((Number(trip.profit_loss) / Number(trip.rent)) * 100)
                                  : 0}
                                %
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-400">Cost per KM</p>
                              <p className="font-bold">
                                ₹{trip.running_km > 0 ? Math.round(totalExpenses / trip.running_km) : 0}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-400">Revenue per KM</p>
                              <p className="font-bold">
                                ₹{trip.running_km > 0 ? Math.round(Number(trip.rent) / trip.running_km) : 0}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-400">Profit per KM</p>
                              <p className={`font-bold ${isProfitable ? "text-green-500" : "text-red-500"}`}>
                                ₹{trip.running_km > 0 ? Math.round(Number(trip.profit_loss) / trip.running_km) : 0}
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabContent>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Animation wrapper for tab content
function TabContent({ children, tabKey }: { children: React.ReactNode; tabKey: string }) {
  return (
    <motion.div
      key={tabKey}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  )
}
