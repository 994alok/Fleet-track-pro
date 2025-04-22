"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Calendar, MapPin, Truck, TrendingUp, TrendingDown, Fuel, IndianRupee } from "lucide-react"

import { SiteHeader } from "@/components/site-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { formatCurrency, formatDate } from "@/lib/utils"

// Mock trip data for demonstration
const mockTripData = {
  id: "1",
  tripNumber: "TRIP1234",
  truck: {
    name: "Atlas Express",
    number: "TN-001",
  },
  drivers: [
    { name: "Kumar", primary: true },
    { name: "Suresh", primary: false },
  ],
  dates: {
    startDate: "2024-04-01",
    unloadingDate: "2024-04-05",
  },
  locations: {
    loadingPoint: "Chennai",
    unloadingPoint: "Bangalore",
  },
  kilometers: {
    startingKm: 45000,
    closingKm: 45600,
    runningKm: 600,
  },
  documents: {
    ewayBill: "EWB123456",
    lrNumber: "LR789012",
  },
  dieselEntries: [
    {
      id: 1,
      date: "2024-04-01",
      time: "08:30",
      location: "Chennai Fuel Station",
      litresPurchased: 120,
      pricePerLitre: 90.5,
      totalCost: 10860,
      kmSinceLast: 0, // First entry
    },
    {
      id: 2,
      date: "2024-04-03",
      time: "14:15",
      location: "Highway Fuel Stop",
      litresPurchased: 80,
      pricePerLitre: 91.2,
      totalCost: 7296,
      kmSinceLast: 350, // Distance since last refill
    },
  ],
  expenses: {
    loadingHaltCost: 1500,
    unloadingHaltCost: 1200,
    rent: 25000,
    driverBataType: "percentage",
    driverBataPercent: 10,
    driverBataAmount: 2500,
    agentName: "Rajesh",
    agentMobile: "9876543210",
    agentCommissionType: "percentage",
    agentCommissionPercent: 5,
    agentCommissionAmount: 1250,
    dieselCost: 18156,
    fastagCharges: 1000,
    defCharges: 500,
    rtoCharges: 800,
    otherExpensesText: "Tire repair and food expenses",
    otherExpensesAmount: 1500,
    policeCommission: 300,
    totalExpenses: 27206,
    profitLoss: -2206,
  },
}

export default function TripDetailsPage({ params }: { params: { id: string } }) {
  const [tripData, setTripData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app, you would fetch the trip data from your API
    // For this example, we'll use the mock data
    const fetchTripData = async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500))
        setTripData(mockTripData)
      } catch (error) {
        console.error("Error fetching trip data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTripData()
  }, [params.id])

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full inline-block mb-4"></div>
            <p>Loading trip details...</p>
          </div>
        </main>
      </div>
    )
  }

  if (!tripData) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p>Trip not found</p>
            <Link href="/trucks">
              <Button variant="link" className="mt-4">
                Back to Trucks
              </Button>
            </Link>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container py-8">
          <div className="flex items-center mb-8">
            <Link href="/trucks">
              <Button variant="ghost" size="sm" className="gap-1">
                <ArrowLeft className="h-4 w-4" />
                Back to Trucks
              </Button>
            </Link>
            <div className="ml-4">
              <h1 className="text-3xl font-bold">Trip Details: {tripData.tripNumber}</h1>
              <p className="text-muted-foreground flex items-center mt-1">
                <Truck className="h-4 w-4 mr-1" />
                {tripData.truck.name} • {tripData.truck.number}
              </p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Trip Duration</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  {formatDate(tripData.dates.startDate)} - {formatDate(tripData.dates.unloadingDate)}
                </div>
                <div className="text-2xl font-bold mt-1">
                  {Math.ceil(
                    (new Date(tripData.dates.unloadingDate).getTime() - new Date(tripData.dates.startDate).getTime()) /
                      (1000 * 60 * 60 * 24),
                  )}{" "}
                  days
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Distance Traveled</CardTitle>
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  {tripData.locations.loadingPoint} to {tripData.locations.unloadingPoint}
                </div>
                <div className="text-2xl font-bold mt-1">{tripData.kilometers.runningKm} km</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Profit / Loss</CardTitle>
                {tripData.expenses.profitLoss >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  {tripData.expenses.profitLoss >= 0 ? "Profit" : "Loss"}
                </div>
                <div
                  className={`text-2xl font-bold mt-1 ${tripData.expenses.profitLoss >= 0 ? "text-green-500" : "text-red-500"}`}
                >
                  {formatCurrency(Math.abs(tripData.expenses.profitLoss))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="summary" className="w-full">
            <TabsList className="grid w-full md:w-[500px] grid-cols-4">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="diesel">Diesel</TabsTrigger>
              <TabsTrigger value="expenses">Expenses</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="mt-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Trip Information</CardTitle>
                    <CardDescription>Basic trip details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Trip Number</p>
                        <p className="font-medium">{tripData.tripNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Truck</p>
                        <p className="font-medium">
                          {tripData.truck.name} ({tripData.truck.number})
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Driver(s)</p>
                        <p className="font-medium">
                          {tripData.drivers.map((driver: any, index: number) => (
                            <span key={index}>
                              {driver.name}
                              {driver.primary ? " (Primary)" : ""}
                              {index < tripData.drivers.length - 1 ? ", " : ""}
                            </span>
                          ))}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Route</p>
                        <p className="font-medium">
                          {tripData.locations.loadingPoint} to {tripData.locations.unloadingPoint}
                        </p>
                      </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Start Date</p>
                        <p className="font-medium">{formatDate(tripData.dates.startDate)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Unloading Date</p>
                        <p className="font-medium">{formatDate(tripData.dates.unloadingDate)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Starting KM</p>
                        <p className="font-medium">{tripData.kilometers.startingKm.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Closing KM</p>
                        <p className="font-medium">{tripData.kilometers.closingKm.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Running KM</p>
                        <p className="font-medium">{tripData.kilometers.runningKm.toLocaleString()}</p>
                      </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">E-Way Bill</p>
                        <p className="font-medium">{tripData.documents.ewayBill || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">LR Number</p>
                        <p className="font-medium">{tripData.documents.lrNumber || "N/A"}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Financial Summary</CardTitle>
                    <CardDescription>Revenue and expenses overview</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Rent</p>
                        <p className="font-medium">{formatCurrency(tripData.expenses.rent)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total Expenses</p>
                        <p className="font-medium">{formatCurrency(tripData.expenses.totalExpenses)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Profit/Loss</p>
                        <p
                          className={`font-medium ${tripData.expenses.profitLoss >= 0 ? "text-green-500" : "text-red-500"}`}
                        >
                          {formatCurrency(Math.abs(tripData.expenses.profitLoss))}
                          {tripData.expenses.profitLoss < 0 ? " (Loss)" : ""}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Profit Margin</p>
                        <p
                          className={`font-medium ${tripData.expenses.profitLoss >= 0 ? "text-green-500" : "text-red-500"}`}
                        >
                          {Math.round((tripData.expenses.profitLoss / tripData.expenses.rent) * 100)}%
                        </p>
                      </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Driver Bata</p>
                        <p className="font-medium">
                          {formatCurrency(tripData.expenses.driverBataAmount)}
                          {tripData.expenses.driverBataType === "percentage"
                            ? ` (${tripData.expenses.driverBataPercent}%)`
                            : " (Fixed)"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Agent Commission</p>
                        <p className="font-medium">
                          {formatCurrency(tripData.expenses.agentCommissionAmount)}
                          {tripData.expenses.agentCommissionType === "percentage"
                            ? ` (${tripData.expenses.agentCommissionPercent}%)`
                            : " (Fixed)"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Diesel Cost</p>
                        <p className="font-medium">{formatCurrency(tripData.expenses.dieselCost)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Other Expenses</p>
                        <p className="font-medium">
                          {formatCurrency(
                            tripData.expenses.loadingHaltCost +
                              tripData.expenses.unloadingHaltCost +
                              tripData.expenses.fastagCharges +
                              tripData.expenses.defCharges +
                              tripData.expenses.rtoCharges +
                              tripData.expenses.otherExpensesAmount +
                              tripData.expenses.policeCommission,
                          )}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="diesel" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Fuel className="h-5 w-5" />
                    Diesel Entries
                  </CardTitle>
                  <CardDescription>All diesel purchases for this trip</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {tripData.dieselEntries.map((entry: any, index: number) => (
                      <div key={entry.id} className="p-4 border rounded-md">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="font-medium">Diesel Entry #{index + 1}</h3>
                          <div className="text-sm text-muted-foreground">
                            {formatDate(entry.date)} at {entry.time}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Location</p>
                            <p className="font-medium">{entry.location}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Litres Purchased</p>
                            <p className="font-medium">{entry.litresPurchased.toFixed(2)} L</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Price per Litre</p>
                            <p className="font-medium">₹{entry.pricePerLitre.toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Total Cost</p>
                            <p className="font-medium">{formatCurrency(entry.totalCost)}</p>
                          </div>
                          {entry.kmSinceLast > 0 && (
                            <div>
                              <p className="text-sm text-muted-foreground">KM Since Last Refill</p>
                              <p className="font-medium">{entry.kmSinceLast} km</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}

                    <div className="p-4 bg-muted rounded-md">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Total Diesel Cost:</span>
                        <span className="font-bold">{formatCurrency(tripData.expenses.dieselCost)}</span>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="font-medium">Total Litres:</span>
                        <span className="font-bold">
                          {tripData.dieselEntries
                            .reduce((sum: number, entry: any) => sum + entry.litresPurchased, 0)
                            .toFixed(2)}{" "}
                          L
                        </span>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="font-medium">Average Price per Litre:</span>
                        <span className="font-bold">
                          ₹
                          {(
                            tripData.expenses.dieselCost /
                            tripData.dieselEntries.reduce((sum: number, entry: any) => sum + entry.litresPurchased, 0)
                          ).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="font-medium">Fuel Efficiency:</span>
                        <span className="font-bold">
                          {(
                            tripData.kilometers.runningKm /
                            tripData.dieselEntries.reduce((sum: number, entry: any) => sum + entry.litresPurchased, 0)
                          ).toFixed(2)}{" "}
                          km/L
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="expenses" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <IndianRupee className="h-5 w-5" />
                    Expense Breakdown
                  </CardTitle>
                  <CardDescription>Detailed view of all expenses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b">
                      <span className="font-medium">Category</span>
                      <span className="font-medium">Amount</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span>Loading Halt Cost</span>
                      <span>{formatCurrency(tripData.expenses.loadingHaltCost)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Unloading Halt Cost</span>
                      <span>{formatCurrency(tripData.expenses.unloadingHaltCost)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>
                        Driver Bata{" "}
                        {tripData.expenses.driverBataType === "percentage"
                          ? `(${tripData.expenses.driverBataPercent}%)`
                          : "(Fixed)"}
                      </span>
                      <span>{formatCurrency(tripData.expenses.driverBataAmount)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>
                        Agent Commission{" "}
                        {tripData.expenses.agentCommissionType === "percentage"
                          ? `(${tripData.expenses.agentCommissionPercent}%)`
                          : "(Fixed)"}
                      </span>
                      <span>{formatCurrency(tripData.expenses.agentCommissionAmount)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Diesel Cost</span>
                      <span>{formatCurrency(tripData.expenses.dieselCost)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>FASTag Charges</span>
                      <span>{formatCurrency(tripData.expenses.fastagCharges)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>DEF Charges</span>
                      <span>{formatCurrency(tripData.expenses.defCharges)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>RTO Charges</span>
                      <span>{formatCurrency(tripData.expenses.rtoCharges)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Police Commission</span>
                      <span>{formatCurrency(tripData.expenses.policeCommission)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Other Expenses</span>
                      <span>{formatCurrency(tripData.expenses.otherExpensesAmount)}</span>
                    </div>
                    {tripData.expenses.otherExpensesText && (
                      <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground">Other Expenses Details:</span>
                        <span className="text-sm">{tripData.expenses.otherExpensesText}</span>
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-2 border-t font-bold">
                      <span>Total Expenses</span>
                      <span>{formatCurrency(tripData.expenses.totalExpenses)}</span>
                    </div>

                    <Separator />

                    <div className="flex justify-between items-center">
                      <span className="font-medium">Rent</span>
                      <span className="font-medium">{formatCurrency(tripData.expenses.rent)}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t font-bold">
                      <span>Profit / Loss</span>
                      <span className={`${tripData.expenses.profitLoss >= 0 ? "text-green-500" : "text-red-500"}`}>
                        {formatCurrency(Math.abs(tripData.expenses.profitLoss))}
                        {tripData.expenses.profitLoss < 0 ? " (Loss)" : ""}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="payments" className="mt-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Driver Payment Details</CardTitle>
                    <CardDescription>Payment information for drivers</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Driver 1</p>
                        <p className="font-medium">{tripData.drivers[0].name}</p>
                      </div>
                      {tripData.drivers.length > 1 && (
                        <div>
                          <p className="text-sm text-muted-foreground">Driver 2</p>
                          <p className="font-medium">{tripData.drivers[1].name}</p>
                        </div>
                      )}
                    </div>

                    <Separator />

                    <div>
                      <p className="text-sm text-muted-foreground">Driver Bata Type</p>
                      <p className="font-medium">
                        {tripData.expenses.driverBataType === "percentage" ? "Percentage of Rent" : "Fixed Amount"}
                      </p>
                    </div>

                    {tripData.expenses.driverBataType === "percentage" && (
                      <div>
                        <p className="text-sm text-muted-foreground">Driver Bata Percentage</p>
                        <p className="font-medium">{tripData.expenses.driverBataPercent}%</p>
                      </div>
                    )}

                    <div>
                      <p className="text-sm text-muted-foreground">Total Driver Bata</p>
                      <p className="font-medium">{formatCurrency(tripData.expenses.driverBataAmount)}</p>
                    </div>

                    {tripData.drivers.length > 1 && (
                      <>
                        <Separator />
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Driver 1 Payment</p>
                            <p className="font-medium">{formatCurrency(tripData.expenses.driverBataAmount / 2)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Driver 2 Payment</p>
                            <p className="font-medium">{formatCurrency(tripData.expenses.driverBataAmount / 2)}</p>
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Agent Payment Details</CardTitle>
                    <CardDescription>Payment information for agent</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Agent Name</p>
                        <p className="font-medium">{tripData.expenses.agentName || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Agent Mobile</p>
                        <p className="font-medium">{tripData.expenses.agentMobile || "N/A"}</p>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <p className="text-sm text-muted-foreground">Agent Commission Type</p>
                      <p className="font-medium">
                        {tripData.expenses.agentCommissionType === "percentage" ? "Percentage of Rent" : "Fixed Amount"}
                      </p>
                    </div>

                    {tripData.expenses.agentCommissionType === "percentage" && (
                      <div>
                        <p className="text-sm text-muted-foreground">Agent Commission Percentage</p>
                        <p className="font-medium">{tripData.expenses.agentCommissionPercent}%</p>
                      </div>
                    )}

                    <div>
                      <p className="text-sm text-muted-foreground">Total Agent Commission</p>
                      <p className="font-medium">{formatCurrency(tripData.expenses.agentCommissionAmount)}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
