"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFieldArray } from "react-hook-form"
import { z } from "zod"
import { ArrowLeft, Truck, MapPin, IndianRupee, Fuel, Plus, Trash2, Percent, DollarSign } from "lucide-react"

import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"

// Define the form schema with Zod
const formSchema = z
  .object({
    // Truck & Driver Details
    truckName: z.string().min(1, "Truck name is required"),
    truckNumber: z.string().min(1, "Truck number is required"),
    driver1Name: z.string().min(1, "Driver 1 name is required"),
    driver2Name: z.string().optional(),

    // Trip Information
    tripNumber: z.string().min(1, "Trip number is required"),
    startDate: z.string().min(1, "Start date is required"),
    loadingPoint: z.string().min(1, "Loading point is required"),
    startingKm: z.coerce.number().min(0, "Starting KM must be a positive number"),
    ewayBill: z.string().optional(),
    lrNumber: z.string().optional(),
    unloadingPoint: z.string().min(1, "Unloading point is required"),
    unloadingDate: z.string().min(1, "Unloading date is required"),
    closingKm: z.coerce.number().min(0, "Closing KM must be a positive number"),
    runningKm: z.coerce.number().optional(),

    // Diesel Entries
    dieselEntries: z.array(
      z.object({
        date: z.string().min(1, "Date is required"),
        time: z.string().min(1, "Time is required"),
        litresPurchased: z.coerce.number().min(0, "Must be a positive number"),
        pricePerLitre: z.coerce.number().min(0, "Must be a positive number"),
        totalCost: z.coerce.number().optional(),
        location: z.string().min(1, "Location is required"),
      }),
    ),

    // Expense & Payment Tracking
    loadingHaltCost: z.coerce.number().min(0, "Must be a positive number"),
    unloadingHaltCost: z.coerce.number().min(0, "Must be a positive number"),
    rent: z.coerce.number().min(0, "Rent must be a positive number"),

    // Driver Bata
    driverBataType: z.enum(["percentage", "fixed"]),
    driverBataPercent: z.coerce.number().optional(),
    driverBataFixed: z.coerce.number().optional(),
    driverBataAmount: z.coerce.number().optional(),

    // Agent Details
    agentName: z.string().optional(),
    agentMobile: z.string().optional(),

    // Agent Commission
    agentCommissionType: z.enum(["percentage", "fixed"]),
    agentCommissionPercent: z.coerce.number().optional(),
    agentCommissionFixed: z.coerce.number().optional(),
    agentCommissionAmount: z.coerce.number().optional(),

    // Other Expenses
    dieselCost: z.coerce.number().optional(),
    fastagCharges: z.coerce.number().min(0, "Must be a positive number"),
    defCharges: z.coerce.number().min(0, "Must be a positive number"),
    rtoCharges: z.coerce.number().min(0, "Must be a positive number"),
    otherExpensesText: z.string().optional(),
    otherExpensesAmount: z.coerce.number().min(0, "Must be a positive number"),
    policeCommission: z.coerce.number().min(0, "Must be a positive number"),

    // Final Calculations
    totalExpenses: z.coerce.number().optional(),
    profitLoss: z.coerce.number().optional(),
  })
  .refine((data) => data.closingKm >= data.startingKm, {
    message: "Closing KM must be greater than or equal to Starting KM",
    path: ["closingKm"],
  })
  .refine(
    (data) => {
      if (data.driverBataType === "percentage") {
        return data.driverBataPercent !== undefined && data.driverBataPercent >= 0
      }
      return true
    },
    {
      message: "Driver Bata percentage is required when using percentage type",
      path: ["driverBataPercent"],
    },
  )
  .refine(
    (data) => {
      if (data.driverBataType === "fixed") {
        return data.driverBataFixed !== undefined && data.driverBataFixed >= 0
      }
      return true
    },
    {
      message: "Driver Bata fixed amount is required when using fixed type",
      path: ["driverBataFixed"],
    },
  )
  .refine(
    (data) => {
      if (data.agentCommissionType === "percentage") {
        return data.agentCommissionPercent !== undefined && data.agentCommissionPercent >= 0
      }
      return true
    },
    {
      message: "Agent Commission percentage is required when using percentage type",
      path: ["agentCommissionPercent"],
    },
  )
  .refine(
    (data) => {
      if (data.agentCommissionType === "fixed") {
        return data.agentCommissionFixed !== undefined && data.agentCommissionFixed >= 0
      }
      return true
    },
    {
      message: "Agent Commission fixed amount is required when using fixed type",
      path: ["agentCommissionFixed"],
    },
  )

export default function NewTripPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("truck")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Generate a random trip number
  const generateTripNumber = () => {
    const prefix = "TRIP"
    const randomNum = Math.floor(1000 + Math.random() * 9000)
    return `${prefix}${randomNum}`
  }

  // Initialize the form with default values
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      truckName: "",
      truckNumber: "",
      driver1Name: "",
      driver2Name: "",
      tripNumber: generateTripNumber(),
      startDate: new Date().toISOString().split("T")[0],
      loadingPoint: "",
      startingKm: 0,
      ewayBill: "",
      lrNumber: "",
      unloadingPoint: "",
      unloadingDate: new Date().toISOString().split("T")[0],
      closingKm: 0,
      runningKm: 0,
      dieselEntries: [
        {
          date: new Date().toISOString().split("T")[0],
          time: new Date().toTimeString().split(" ")[0].substring(0, 5),
          litresPurchased: 0,
          pricePerLitre: 0,
          totalCost: 0,
          location: "",
        },
      ],
      loadingHaltCost: 0,
      unloadingHaltCost: 0,
      rent: 0,
      driverBataType: "percentage",
      driverBataPercent: 0,
      driverBataFixed: 0,
      driverBataAmount: 0,
      agentName: "",
      agentMobile: "",
      agentCommissionType: "percentage",
      agentCommissionPercent: 0,
      agentCommissionFixed: 0,
      agentCommissionAmount: 0,
      dieselCost: 0,
      fastagCharges: 0,
      defCharges: 0,
      rtoCharges: 0,
      otherExpensesText: "",
      otherExpensesAmount: 0,
      policeCommission: 0,
      totalExpenses: 0,
      profitLoss: 0,
    },
  })

  // Setup field array for diesel entries
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "dieselEntries",
  })

  // Calculate running KM when starting or closing KM changes
  useEffect(() => {
    const startingKm = form.watch("startingKm")
    const closingKm = form.watch("closingKm")
    const runningKm = closingKm - startingKm

    if (runningKm >= 0) {
      form.setValue("runningKm", runningKm)
    }
  }, [form.watch("startingKm"), form.watch("closingKm"), form])

  // Calculate total cost for each diesel entry
  useEffect(() => {
    const dieselEntries = form.watch("dieselEntries")

    dieselEntries.forEach((entry, index) => {
      const totalCost = entry.litresPurchased * entry.pricePerLitre
      form.setValue(`dieselEntries.${index}.totalCost`, totalCost)
    })

    // Calculate total diesel cost
    const totalDieselCost = dieselEntries.reduce((sum, entry) => {
      return sum + entry.litresPurchased * entry.pricePerLitre
    }, 0)

    form.setValue("dieselCost", totalDieselCost)
  }, [form.watch("dieselEntries"), form])

  // Calculate driver bata amount
  useEffect(() => {
    const rent = form.watch("rent")
    const driverBataType = form.watch("driverBataType")

    if (driverBataType === "percentage") {
      const driverBataPercent = form.watch("driverBataPercent") || 0
      const driverBataAmount = (rent * driverBataPercent) / 100
      form.setValue("driverBataAmount", driverBataAmount)
    } else {
      const driverBataFixed = form.watch("driverBataFixed") || 0
      form.setValue("driverBataAmount", driverBataFixed)
    }
  }, [
    form.watch("rent"),
    form.watch("driverBataType"),
    form.watch("driverBataPercent"),
    form.watch("driverBataFixed"),
    form,
  ])

  // Calculate agent commission amount
  useEffect(() => {
    const rent = form.watch("rent")
    const agentCommissionType = form.watch("agentCommissionType")

    if (agentCommissionType === "percentage") {
      const agentCommissionPercent = form.watch("agentCommissionPercent") || 0
      const agentCommissionAmount = (rent * agentCommissionPercent) / 100
      form.setValue("agentCommissionAmount", agentCommissionAmount)
    } else {
      const agentCommissionFixed = form.watch("agentCommissionFixed") || 0
      form.setValue("agentCommissionAmount", agentCommissionFixed)
    }
  }, [
    form.watch("rent"),
    form.watch("agentCommissionType"),
    form.watch("agentCommissionPercent"),
    form.watch("agentCommissionFixed"),
    form,
  ])

  // Calculate total expenses and profit/loss
  useEffect(() => {
    const rent = form.watch("rent")
    const loadingHaltCost = form.watch("loadingHaltCost")
    const unloadingHaltCost = form.watch("unloadingHaltCost")
    const driverBataAmount = form.watch("driverBataAmount")
    const agentCommissionAmount = form.watch("agentCommissionAmount") || 0
    const dieselCost = form.watch("dieselCost")
    const fastagCharges = form.watch("fastagCharges")
    const defCharges = form.watch("defCharges")
    const rtoCharges = form.watch("rtoCharges")
    const otherExpensesAmount = form.watch("otherExpensesAmount")
    const policeCommission = form.watch("policeCommission")

    const totalExpenses =
      loadingHaltCost +
      unloadingHaltCost +
      driverBataAmount +
      agentCommissionAmount +
      dieselCost +
      fastagCharges +
      defCharges +
      rtoCharges +
      otherExpensesAmount +
      policeCommission

    form.setValue("totalExpenses", totalExpenses)

    const profitLoss = rent - totalExpenses
    form.setValue("profitLoss", profitLoss)
  }, [
    form.watch("rent"),
    form.watch("loadingHaltCost"),
    form.watch("unloadingHaltCost"),
    form.watch("driverBataAmount"),
    form.watch("agentCommissionAmount"),
    form.watch("dieselCost"),
    form.watch("fastagCharges"),
    form.watch("defCharges"),
    form.watch("rtoCharges"),
    form.watch("otherExpensesAmount"),
    form.watch("policeCommission"),
    form,
  ])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true)

      // In a real application, you would send this data to your API
      console.log("Form values:", values)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Trip created successfully",
        description: `Trip ${values.tripNumber} has been created.`,
      })

      router.push("/trucks")
    } catch (error) {
      console.error("Error creating trip:", error)
      toast({
        title: "Error creating trip",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextTab = () => {
    if (activeTab === "truck") setActiveTab("trip")
    else if (activeTab === "trip") setActiveTab("diesel")
    else if (activeTab === "diesel") setActiveTab("expenses")
  }

  const prevTab = () => {
    if (activeTab === "expenses") setActiveTab("diesel")
    else if (activeTab === "diesel") setActiveTab("trip")
    else if (activeTab === "trip") setActiveTab("truck")
  }

  const addDieselEntry = () => {
    append({
      date: new Date().toISOString().split("T")[0],
      time: new Date().toTimeString().split(" ")[0].substring(0, 5),
      litresPurchased: 0,
      pricePerLitre: 0,
      totalCost: 0,
      location: "",
    })
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
              <h1 className="text-3xl font-bold">Add New Trip</h1>
              <p className="text-muted-foreground mt-1">Enter trip details to create a new trip record</p>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full md:w-[600px] grid-cols-4">
                  <TabsTrigger value="truck">Truck & Driver</TabsTrigger>
                  <TabsTrigger value="trip">Trip Details</TabsTrigger>
                  <TabsTrigger value="diesel">Diesel Entries</TabsTrigger>
                  <TabsTrigger value="expenses">Expenses</TabsTrigger>
                </TabsList>

                {/* Truck & Driver Details */}
                <TabsContent value="truck" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Truck className="h-5 w-5" />
                        Truck & Driver Details
                      </CardTitle>
                      <CardDescription>Enter the truck and driver information</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="truckName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Truck Name*</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter truck name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="truckNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Truck Number*</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter truck number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="driver1Name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Driver 1 Name*</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter driver 1 name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="driver2Name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Driver 2 Name (Optional)</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter driver 2 name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                      <Button type="button" onClick={nextTab}>
                        Next
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                {/* Trip Information */}
                <TabsContent value="trip" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        Trip Information
                      </CardTitle>
                      <CardDescription>Enter the trip details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="tripNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Trip Number*</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter trip number" {...field} />
                              </FormControl>
                              <FormDescription>Auto-generated but can be edited</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="startDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Trip Start Date*</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="loadingPoint"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Loading Point*</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter loading point" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="startingKm"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Starting KM*</FormLabel>
                              <FormControl>
                                <Input type="number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="ewayBill"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>E-Way Bill Number (Optional)</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter e-way bill number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="lrNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>LR Number (Optional)</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter LR number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="unloadingPoint"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Unloading Point*</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter unloading point" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="unloadingDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Unloading Date*</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="closingKm"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Closing KM*</FormLabel>
                              <FormControl>
                                <Input type="number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="runningKm"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Running KM (Auto-calculated)</FormLabel>
                              <FormControl>
                                <Input type="number" {...field} readOnly className="bg-muted" />
                              </FormControl>
                              <FormDescription>Closing KM - Starting KM</FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button type="button" variant="outline" onClick={prevTab}>
                        Previous
                      </Button>
                      <Button type="button" onClick={nextTab}>
                        Next
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                {/* Diesel Entries */}
                <TabsContent value="diesel" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Fuel className="h-5 w-5" />
                        Diesel Entries
                      </CardTitle>
                      <CardDescription>Record diesel purchases for this trip</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {fields.map((field, index) => (
                        <div key={field.id} className="p-4 border rounded-md relative">
                          <div className="absolute top-2 right-2">
                            {index > 0 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => remove(index)}
                                className="h-8 w-8 p-0"
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            )}
                          </div>

                          <h3 className="font-medium mb-4">Diesel Entry #{index + 1}</h3>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <FormField
                              control={form.control}
                              name={`dieselEntries.${index}.date`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Date*</FormLabel>
                                  <FormControl>
                                    <Input type="date" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`dieselEntries.${index}.time`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Time*</FormLabel>
                                  <FormControl>
                                    <Input type="time" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`dieselEntries.${index}.location`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Petrol Pump Location*</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Enter location" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <FormField
                              control={form.control}
                              name={`dieselEntries.${index}.litresPurchased`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Litres Purchased*</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      step="0.01"
                                      {...field}
                                      onChange={(e) => {
                                        field.onChange(Number.parseFloat(e.target.value))
                                      }}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`dieselEntries.${index}.pricePerLitre`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Price per Litre*</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      step="0.01"
                                      {...field}
                                      onChange={(e) => {
                                        field.onChange(Number.parseFloat(e.target.value))
                                      }}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`dieselEntries.${index}.totalCost`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Total Cost (Auto-calculated)</FormLabel>
                                  <FormControl>
                                    <Input type="number" step="0.01" {...field} readOnly className="bg-muted" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      ))}

                      <Button type="button" variant="outline" size="sm" className="mt-2" onClick={addDieselEntry}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Another Diesel Entry
                      </Button>

                      <div className="mt-4 p-4 bg-muted rounded-md">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Total Diesel Cost:</span>
                          <span className="font-bold">₹{form.watch("dieselCost").toFixed(2)}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button type="button" variant="outline" onClick={prevTab}>
                        Previous
                      </Button>
                      <Button type="button" onClick={nextTab}>
                        Next
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                {/* Expense & Payment Tracking */}
                <TabsContent value="expenses" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <IndianRupee className="h-5 w-5" />
                        Expense & Payment Tracking
                      </CardTitle>
                      <CardDescription>Enter all expenses related to this trip</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="loadingHaltCost"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Loading Halt Cost</FormLabel>
                              <FormControl>
                                <Input type="number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="unloadingHaltCost"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Unloading Halt Cost</FormLabel>
                              <FormControl>
                                <Input type="number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="rent"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Rent</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Driver Bata Section */}
                      <div className="p-4 border rounded-md">
                        <h3 className="font-medium mb-4">Driver Bata</h3>

                        <FormField
                          control={form.control}
                          name="driverBataType"
                          render={({ field }) => (
                            <FormItem className="mb-4">
                              <FormLabel>Driver Bata Type</FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className="flex flex-col space-y-1"
                                >
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="percentage" id="driverBataPercentage" />
                                    <label htmlFor="driverBataPercentage" className="flex items-center">
                                      <Percent className="h-4 w-4 mr-1" />
                                      Percentage of Rent
                                    </label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="fixed" id="driverBataFixed" />
                                    <label htmlFor="driverBataFixed" className="flex items-center">
                                      <DollarSign className="h-4 w-4 mr-1" />
                                      Fixed Amount
                                    </label>
                                  </div>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {form.watch("driverBataType") === "percentage" ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="driverBataPercent"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Driver Bata (%)</FormLabel>
                                  <FormControl>
                                    <Input type="number" step="0.01" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="driverBataAmount"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Driver Bata Amount (Auto-calculated)</FormLabel>
                                  <FormControl>
                                    <Input type="number" {...field} readOnly className="bg-muted" />
                                  </FormControl>
                                  <FormDescription>
                                    {form.watch("driver2Name") ? "Split between both drivers" : "For single driver"}
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="driverBataFixed"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Driver Bata (Fixed Amount)</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      step="0.01"
                                      {...field}
                                      onChange={(e) => {
                                        field.onChange(Number.parseFloat(e.target.value))
                                        form.setValue("driverBataAmount", Number.parseFloat(e.target.value))
                                      }}
                                    />
                                  </FormControl>
                                  <FormDescription>
                                    {form.watch("driver2Name") ? "Split between both drivers" : "For single driver"}
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        )}
                      </div>

                      {/* Agent Details Section */}
                      <div className="p-4 border rounded-md">
                        <h3 className="font-medium mb-4">Agent Details</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <FormField
                            control={form.control}
                            name="agentName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Agent Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter agent name" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="agentMobile"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Agent Mobile Number</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter agent mobile" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="agentCommissionType"
                          render={({ field }) => (
                            <FormItem className="mb-4">
                              <FormLabel>Agent Commission Type</FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className="flex flex-col space-y-1"
                                >
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="percentage" id="agentCommissionPercentage" />
                                    <label htmlFor="agentCommissionPercentage" className="flex items-center">
                                      <Percent className="h-4 w-4 mr-1" />
                                      Percentage of Rent
                                    </label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="fixed" id="agentCommissionFixed" />
                                    <label htmlFor="agentCommissionFixed" className="flex items-center">
                                      <DollarSign className="h-4 w-4 mr-1" />
                                      Fixed Amount
                                    </label>
                                  </div>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {form.watch("agentCommissionType") === "percentage" ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="agentCommissionPercent"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Agent Commission (%)</FormLabel>
                                  <FormControl>
                                    <Input type="number" step="0.01" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="agentCommissionAmount"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Agent Commission Amount (Auto-calculated)</FormLabel>
                                  <FormControl>
                                    <Input type="number" {...field} readOnly className="bg-muted" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="agentCommissionFixed"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Agent Commission (Fixed Amount)</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      step="0.01"
                                      {...field}
                                      onChange={(e) => {
                                        field.onChange(Number.parseFloat(e.target.value))
                                        form.setValue("agentCommissionAmount", Number.parseFloat(e.target.value))
                                      }}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        )}
                      </div>

                      {/* Other Expenses Section */}
                      <div className="p-4 border rounded-md">
                        <h3 className="font-medium mb-4">Other Expenses</h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <FormField
                            control={form.control}
                            name="dieselCost"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Diesel Cost (Auto-calculated)</FormLabel>
                                <FormControl>
                                  <Input type="number" {...field} readOnly className="bg-muted" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="fastagCharges"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>FASTag Charges</FormLabel>
                                <FormControl>
                                  <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="defCharges"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>DEF Charges</FormLabel>
                                <FormControl>
                                  <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <FormField
                            control={form.control}
                            name="rtoCharges"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>RTO Charges</FormLabel>
                                <FormControl>
                                  <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="policeCommission"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Police Commission</FormLabel>
                                <FormControl>
                                  <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="otherExpensesAmount"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Other Expenses Amount</FormLabel>
                                <FormControl>
                                  <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="mt-4">
                          <FormField
                            control={form.control}
                            name="otherExpensesText"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Other Expenses Details</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Enter details about other expenses"
                                    className="min-h-[80px]"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      {/* Final Calculations */}
                      <div className="p-4 bg-muted rounded-md space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Total Expenses:</span>
                          <span className="font-bold">₹{form.watch("totalExpenses").toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Profit / Loss:</span>
                          <span
                            className={`font-bold ${form.watch("profitLoss") >= 0 ? "text-green-500" : "text-red-500"}`}
                          >
                            ₹{Math.abs(form.watch("profitLoss")).toFixed(2)}{" "}
                            {form.watch("profitLoss") < 0 ? "(Loss)" : ""}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button type="button" variant="outline" onClick={prevTab}>
                        Previous
                      </Button>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Saving..." : "Save Trip"}
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </Tabs>
            </form>
          </Form>
        </div>
      </main>
    </div>
  )
}
