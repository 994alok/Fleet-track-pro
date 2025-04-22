"use client"

import { useState } from "react"
import { ArrowLeft, Calendar, MapPin, Truck, TrendingUp, TrendingDown, Fuel, IndianRupee } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { formatCurrency, formatDate } from "@/lib/utils"
import { motion } from "framer-motion"

interface TripDetailViewProps {
  trip: any
  onBack: () => void
}

export function TripDetailView({ trip, onBack }: TripDetailViewProps) {
  const [activeTab, setActiveTab] = useState("summary")

  if (!trip) {
    return (
      <div className="text-center py-12">
        <p>Trip not found</p>
        <Button variant="link" onClick={onBack} className="mt-4">
          Back to Trips
        </Button>
      </div>
    )
  }

  const isProfitable = trip.profitLoss >= 0

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" onClick={onBack} className="mr-4 group">
          <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Trip Details: {trip.tripNumber}</h1>
          <p className="text-muted-foreground flex items-center mt-1">
            <Truck className="h-4 w-4 mr-1" />
            {trip.truckName} • {trip.truckNumber}
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
              {formatDate(trip.startDate)} - {formatDate(trip.unloadingDate)}
            </div>
            <div className="text-2xl font-bold mt-1">
              {Math.ceil(
                (new Date(trip.unloadingDate).getTime() - new Date(trip.startDate).getTime()) / (1000 * 60 * 60 * 24),
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
              {trip.loadingPoint} to {trip.unloadingPoint}
            </div>
            <div className="text-2xl font-bold mt-1">{trip.runningKm} km</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profit / Loss</CardTitle>
            {isProfitable ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">{isProfitable ? "Profit" : "Loss"}</div>
            <div className={`text-2xl font-bold mt-1 ${isProfitable ? "text-green-500" : "text-red-500"}`}>
              {formatCurrency(Math.abs(trip.profitLoss))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
                    <p className="font-medium">{trip.tripNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Truck</p>
                    <p className="font-medium">
                      {trip.truckName} ({trip.truckNumber})
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Driver(s)</p>
                    <p className="font-medium">
                      {trip.driver1Name}
                      {trip.driver2Name && `, ${trip.driver2Name}`}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Route</p>
                    <p className="font-medium">
                      {trip.loadingPoint} to {trip.unloadingPoint}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Start Date</p>
                    <p className="font-medium">{formatDate(trip.startDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Unloading Date</p>
                    <p className="font-medium">{formatDate(trip.unloadingDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Starting KM</p>
                    <p className="font-medium">{trip.startingKm.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Closing KM</p>
                    <p className="font-medium">{trip.closingKm.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Running KM</p>
                    <p className="font-medium">{trip.runningKm.toLocaleString()}</p>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">E-Way Bill</p>
                    <p className="font-medium">{trip.ewayBill || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">LR Number</p>
                    <p className="font-medium">{trip.lrNumber || "N/A"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Financial Summary</CardTitle>
                <CardDescription>Expenses overview</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Expenses</p>
                    <p className="font-medium">{formatCurrency(trip.totalExpenses)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Profit/Loss</p>
                    <p className={`font-medium ${isProfitable ? "text-green-500" : "text-red-500"}`}>
                      {formatCurrency(Math.abs(trip.profitLoss))}
                      {!isProfitable && " (Loss)"}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Driver Bata</p>
                    <p className="font-medium">
                      {formatCurrency(trip.driverBataAmount)}
                      {trip.driverBataType === "percentage" ? ` (${trip.driverBataPercent}%)` : " (Fixed)"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Agent Commission</p>
                    <p className="font-medium">
                      {formatCurrency(trip.agentCommissionAmount)}
                      {trip.agentCommissionType === "percentage" ? ` (${trip.agentCommissionPercent}%)` : " (Fixed)"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Diesel Cost</p>
                    <p className="font-medium">{formatCurrency(trip.dieselCost)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Other Expenses</p>
                    <p className="font-medium">
                      {formatCurrency(
                        trip.loadingHaltCost +
                          trip.unloadingHaltCost +
                          trip.fastagCharges +
                          trip.defCharges +
                          trip.rtoCharges +
                          trip.otherExpensesAmount +
                          trip.policeCommission,
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
                {trip.dieselEntries.map((entry: any, index: number) => (
                  <div key={index} className="p-4 border rounded-md">
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
                    </div>
                  </div>
                ))}

                <div className="p-4 bg-muted rounded-md">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total Diesel Cost:</span>
                    <span className="font-bold">{formatCurrency(trip.dieselCost)}</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="font-medium">Total Litres:</span>
                    <span className="font-bold">
                      {trip.dieselEntries
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
                        trip.dieselCost /
                        trip.dieselEntries.reduce((sum: number, entry: any) => sum + entry.litresPurchased, 0)
                      ).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="font-medium">Fuel Efficiency:</span>
                    <span className="font-bold">
                      {(
                        trip.runningKm /
                        trip.dieselEntries.reduce((sum: number, entry: any) => sum + entry.litresPurchased, 0)
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
                  <span>{formatCurrency(trip.loadingHaltCost)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Unloading Halt Cost</span>
                  <span>{formatCurrency(trip.unloadingHaltCost)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>
                    Driver Bata {trip.driverBataType === "percentage" ? `(${trip.driverBataPercent}%)` : "(Fixed)"}
                  </span>
                  <span>{formatCurrency(trip.driverBataAmount)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>
                    Agent Commission{" "}
                    {trip.agentCommissionType === "percentage" ? `(${trip.agentCommissionPercent}%)` : "(Fixed)"}
                  </span>
                  <span>{formatCurrency(trip.agentCommissionAmount)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Diesel Cost</span>
                  <span>{formatCurrency(trip.dieselCost)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>FASTag Charges</span>
                  <span>{formatCurrency(trip.fastagCharges)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>DEF Charges</span>
                  <span>{formatCurrency(trip.defCharges)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>RTO Charges</span>
                  <span>{formatCurrency(trip.rtoCharges)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Police Commission</span>
                  <span>{formatCurrency(trip.policeCommission)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Other Expenses</span>
                  <span>{formatCurrency(trip.otherExpensesAmount)}</span>
                </div>
                {trip.otherExpensesText && (
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">Other Expenses Details:</span>
                    <span className="text-sm">{trip.otherExpensesText}</span>
                  </div>
                )}

                <div className="flex justify-between items-center pt-2 border-t font-bold">
                  <span>Total Expenses</span>
                  <span>{formatCurrency(trip.totalExpenses)}</span>
                </div>

                <Separator />

                <div className="flex justify-between items-center">
                  <span className="font-medium">Rent</span>
                  <span className="font-medium">{formatCurrency(trip.rent)}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t font-bold">
                  <span>Profit / Loss</span>
                  <span className={`${isProfitable ? "text-green-500" : "text-red-500"}`}>
                    {formatCurrency(Math.abs(trip.profitLoss))}
                    {!isProfitable ? " (Loss)" : ""}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t font-bold">
                  <span>Profit Margin</span>
                  <span className={`font-bold ${isProfitable ? "text-green-500" : "text-red-500"}`}>
                    {trip.rent > 0 ? Math.round((trip.profitLoss / trip.rent) * 100) : 0}%
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
                    <p className="font-medium">{trip.driver1Name}</p>
                  </div>
                  {trip.driver2Name && (
                    <div>
                      <p className="text-sm text-muted-foreground">Driver 2</p>
                      <p className="font-medium">{trip.driver2Name}</p>
                    </div>
                  )}
                </div>

                <Separator />

                <div>
                  <p className="text-sm text-muted-foreground">Driver Bata Type</p>
                  <p className="font-medium">
                    {trip.driverBataType === "percentage" ? "Percentage of Rent" : "Fixed Amount"}
                  </p>
                </div>

                {trip.driverBataType === "percentage" && (
                  <div>
                    <p className="text-sm text-muted-foreground">Driver Bata Percentage</p>
                    <p className="font-medium">{trip.driverBataPercent}%</p>
                  </div>
                )}

                <div>
                  <p className="text-sm text-muted-foreground">Total Driver Bata</p>
                  <p className="font-medium">{formatCurrency(trip.driverBataAmount)}</p>
                </div>

                {trip.driver2Name && (
                  <>
                    <Separator />
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Driver 1 Payment</p>
                        <p className="font-medium">{formatCurrency(trip.driverBataAmount / 2)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Driver 2 Payment</p>
                        <p className="font-medium">{formatCurrency(trip.driverBataAmount / 2)}</p>
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
                    <p className="font-medium">{trip.agentName || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Agent Mobile</p>
                    <p className="font-medium">{trip.agentMobile || "N/A"}</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <p className="text-sm text-muted-foreground">Agent Commission Type</p>
                  <p className="font-medium">
                    {trip.agentCommissionType === "percentage" ? "Percentage of Rent" : "Fixed Amount"}
                  </p>
                </div>

                {trip.agentCommissionType === "percentage" && (
                  <div>
                    <p className="text-sm text-muted-foreground">Agent Commission Percentage</p>
                    <p className="font-medium">{trip.agentCommissionPercent}%</p>
                  </div>
                )}

                <div>
                  <p className="text-sm text-muted-foreground">Total Agent Commission</p>
                  <p className="font-medium">{formatCurrency(trip.agentCommissionAmount)}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
