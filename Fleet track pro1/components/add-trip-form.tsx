"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFieldArray } from "react-hook-form"
import { z } from "zod"
import {
  Truck,
  MapPin,
  Fuel,
  IndianRupee,
  Plus,
  Trash2,
  ArrowLeft,
  ArrowRight,
  Save,
  Percent,
  X,
  CheckCircle,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { motion } from "framer-motion"

// Define the form schema with Zod
const formSchema = z
  .object({
    // 1. Truck & Driver Details
    truck_name: z.string().min(1, "Truck name is required"),
    truck_number: z.string().min(1, "Truck number is required"),
    driver1_name: z.string().min(1, "Driver 1 name is required"),
    driver2_name: z.string().optional(),

    // 2. Trip Information
    trip_number: z.string().min(1, "Trip number is required"),
    start_date: z.string().min(1, "Start date is required"),
    loading_point: z.string().min(1, "Loading point is required"),
    starting_km: z.coerce.number().min(0, "Starting KM must be a positive number"),
    eway_bill: z.string().optional(),
    lr_number: z.string().optional(),
    unloading_point: z.string().min(1, "Unloading point is required"),
    unloading_date: z.string().min(1, "Unloading date is required"),
    closing_km: z.coerce.number().min(0, "Closing KM must be a positive number"),
    running_km: z.coerce.number().optional(),

    // 3. Diesel Entries
    diesel_entries: z.array(
      z.object({
        date: z.string().min(1, "Date is required"),
        time: z.string().min(1, "Time is required"),
        litres_purchased: z.coerce.number().min(0, "Must be a positive number"),
        price_per_litre: z.coerce.number().min(0, "Must be a positive number"),
        total_cost: z.coerce.number().optional(),
        location: z.string().min(1, "Location is required"),
      }),
    ),

    // 4. Expense & Payment Tracking
    loading_halt_cost: z.coerce.number().min(0, "Must be a positive number"),
    unloading_halt_cost: z.coerce.number().min(0, "Must be a positive number"),
    rent: z.coerce.number().min(0, "Rent must be a positive number"),

    // Driver Bata
    driver_bata_type: z.string().default("percentage"),
    driver_bata_percent: z.coerce.number().min(0, "Driver Bata percentage is required"),
    driver_bata_amount: z.coerce.number().optional(),

    // Agent Details
    agent_name: z.string().optional(),
    agent_mobile: z.string().optional(),

    // Agent Commission
    agent_commission_amount: z.coerce.number().min(0, "Agent Commission amount is required"),

    // Other Expenses
    diesel_cost: z.coerce.number().optional(),
    fastag_charges: z.coerce.number().min(0, "Must be a positive number"),
    def_charges: z.coerce.number().min(0, "Must be a positive number"),
    rto_charges: z.coerce.number().min(0, "Must be a positive number"),
    other_expenses_text: z.string().optional(),
    other_expenses_amount: z.coerce.number().min(0, "Must be a positive number"),
    police_commission: z.coerce.number().min(0, "Must be a positive number"),

    // 5. Final Calculations
    total_expenses: z.coerce.number().optional(),
    profit_loss: z.coerce.number().optional(),
  })
  .refine((data) => data.closing_km >= data.starting_km, {
    message: "Closing KM must be greater than or equal to Starting KM",
    path: ["closing_km"],
  })

interface Trip {
  id?: string
  truck_name?: string
  truck_number?: string
  driver1_name?: string
  driver2_name?: string
  trip_number?: string
  start_date?: string
  loading_point?: string
  starting_km?: number
  eway_bill?: string
  lr_number?: string
  unloading_point?: string
  unloading_date?: string
  closing_km?: number
  running_km?: number
  diesel_entries?: {
    date: string
    time: string
    litres_purchased: number
    price_per_litre: number
    total_cost: number
    location: string
  }[]
  loading_halt_cost?: number
  unloading_halt_cost?: number
  rent?: number
  driver_bata_type?: string
  driver_bata_percent?: number
  driver_bata_amount?: number
  agent_name?: string
  agent_mobile?: string
  agent_commission_amount?: number
  diesel_cost?: number
  fastag_charges?: number
  def_charges?: number
  rto_charges?: number
  other_expenses_text?: string
  other_expenses_amount?: number
  police_commission?: number
  total_expenses?: number
  profit_loss?: number
}

interface AddTripFormProps {
  onSave: (tripData: z.infer<typeof formSchema>) => void
  onCancel: () => void
  editTrip?: Trip | null
}

export function AddTripForm({ onSave, onCancel, editTrip }: AddTripFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  // Generate a random trip number
  const generateTripNumber = () => {
    const prefix = "TRIP"
    const randomNum = Math.floor(1000 + Math.random() * 9000)
    return `${prefix}${randomNum}`
  }

  // Initialize the form with default values
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: editTrip
      ? {
          truck_name: editTrip.truck_name || "",
          truck_number: editTrip.truck_number || "",
          driver1_name: editTrip.driver1_name || "",
          driver2_name: editTrip.driver2_name || "",
          trip_number: editTrip.trip_number || generateTripNumber(),
          start_date: editTrip.start_date || new Date().toISOString().split("T")[0],
          loading_point: editTrip.loading_point || "",
          starting_km: editTrip.starting_km || 0,
          eway_bill: editTrip.eway_bill || "",
          lr_number: editTrip.lr_number || "",
          unloading_point: editTrip.unloading_point || "",
          unloading_date: editTrip.unloading_date || new Date().toISOString().split("T")[0],
          closing_km: editTrip.closing_km || 0,
          running_km: editTrip.running_km || 0,
          diesel_entries: editTrip.diesel_entries?.length
            ? editTrip.diesel_entries
            : [
                {
                  date: new Date().toISOString().split("T")[0],
                  time: new Date().toTimeString().split(" ")[0].substring(0, 5),
                  litres_purchased: 0,
                  price_per_litre: 0,
                  total_cost: 0,
                  location: "",
                },
              ],
          loading_halt_cost: editTrip.loading_halt_cost || 0,
          unloading_halt_cost: editTrip.unloading_halt_cost || 0,
          rent: editTrip.rent || 0,
          driver_bata_type: editTrip.driver_bata_type || "percentage",
          driver_bata_percent: editTrip.driver_bata_percent || 10,
          driver_bata_amount: editTrip.driver_bata_amount || 0,
          agent_name: editTrip.agent_name || "",
          agent_mobile: editTrip.agent_mobile || "",
          agent_commission_amount: editTrip.agent_commission_amount || 0,
          diesel_cost: editTrip.diesel_cost || 0,
          fastag_charges: editTrip.fastag_charges || 0,
          def_charges: editTrip.def_charges || 0,
          rto_charges: editTrip.rto_charges || 0,
          other_expenses_text: editTrip.other_expenses_text || "",
          other_expenses_amount: editTrip.other_expenses_amount || 0,
          police_commission: editTrip.police_commission || 0,
          total_expenses: editTrip.total_expenses || 0,
          profit_loss: editTrip.profit_loss || 0,
        }
      : {
          truck_name: "",
          truck_number: "",
          driver1_name: "",
          driver2_name: "",
          trip_number: generateTripNumber(),
          start_date: new Date().toISOString().split("T")[0],
          loading_point: "",
          starting_km: 0,
          eway_bill: "",
          lr_number: "",
          unloading_point: "",
          unloading_date: new Date().toISOString().split("T")[0],
          closing_km: 0,
          running_km: 0,
          diesel_entries: [
            {
              date: new Date().toISOString().split("T")[0],
              time: new Date().toTimeString().split(" ")[0].substring(0, 5),
              litres_purchased: 0,
              price_per_litre: 0,
              total_cost: 0,
              location: "",
            },
          ],
          loading_halt_cost: 0,
          unloading_halt_cost: 0,
          rent: 0,
          driver_bata_type: "percentage",
          driver_bata_percent: 10, // Default to 10%
          driver_bata_amount: 0,
          agent_name: "",
          agent_mobile: "",
          agent_commission_amount: 0,
          diesel_cost: 0,
          fastag_charges: 0,
          def_charges: 0,
          rto_charges: 0,
          other_expenses_text: "",
          other_expenses_amount: 0,
          police_commission: 0,
          total_expenses: 0,
          profit_loss: 0,
        },
  })

  // Setup field array for diesel entries
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "diesel_entries",
  })

  // Calculate running KM when starting or closing KM changes
  useEffect(() => {
    const startingKm = form.watch("starting_km")
    const closingKm = form.watch("closing_km")
    const runningKm = closingKm - startingKm

    if (runningKm >= 0) {
      form.setValue("running_km", runningKm)
    }
  }, [form.watch("starting_km"), form.watch("closing_km"), form])

  // Calculate total cost for each diesel entry
  useEffect(() => {
    const dieselEntries = form.watch("diesel_entries")

    dieselEntries.forEach((entry, index) => {
      const totalCost = entry.litres_purchased * entry.price_per_litre
      form.setValue(`diesel_entries.${index}.total_cost`, totalCost)
    })

    // Calculate total diesel cost
    const totalDieselCost = dieselEntries.reduce((sum, entry) => {
      return sum + entry.litres_purchased * entry.price_per_litre
    }, 0)

    form.setValue("diesel_cost", totalDieselCost)
  }, [form.watch("diesel_entries"), form])

  // Calculate driver bata amount (always percentage)
  useEffect(() => {
    const rent = form.watch("rent")
    const agentCommissionAmount = form.watch("agent_commission_amount") || 0
    const driverBataPercent = form.watch("driver_bata_percent") || 0
    const driverBataAmount = ((rent - agentCommissionAmount) * driverBataPercent) / 100
    form.setValue("driver_bata_amount", driverBataAmount)
  }, [form.watch("rent"), form.watch("agent_commission_amount"), form.watch("driver_bata_percent"), form])

  // Calculate total expenses and profit/loss
  useEffect(() => {
    const rent = Number(form.watch("rent") || 0)
    const loadingHaltCost = Number(form.watch("loading_halt_cost") || 0)
    const unloadingHaltCost = Number(form.watch("unloading_halt_cost") || 0)
    const driverBataAmount = Number(form.watch("driver_bata_amount") || 0)
    const agentCommissionAmount = Number(form.watch("agent_commission_amount") || 0)
    const dieselCost = Number(form.watch("diesel_cost") || 0)
    const fastagCharges = Number(form.watch("fastag_charges") || 0)
    const defCharges = Number(form.watch("def_charges") || 0)
    const rtoCharges = Number(form.watch("rto_charges") || 0)
    const otherExpensesAmount = Number(form.watch("other_expenses_amount") || 0)
    const policeCommission = Number(form.watch("police_commission") || 0)

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

    form.setValue("total_expenses", totalExpenses)
    const profitLoss = rent - totalExpenses
    form.setValue("profit_loss", profitLoss)
  }, [
    form.watch("rent"),
    form.watch("loading_halt_cost"),
    form.watch("unloading_halt_cost"),
    form.watch("driver_bata_amount"),
    form.watch("agent_commission_amount"),
    form.watch("diesel_cost"),
    form.watch("fastag_charges"),
    form.watch("def_charges"),
    form.watch("rto_charges"),
    form.watch("other_expenses_amount"),
    form.watch("police_commission"),
    form,
  ])

  const nextStep = async () => {
    let result = false

    // Validate current step fields
    if (currentStep === 1) {
      result = await form.trigger(["truck_name", "truck_number", "driver1_name"])
    } else if (currentStep === 2) {
      result = await form.trigger([
        "trip_number",
        "start_date",
        "loading_point",
        "starting_km",
        "unloading_point",
        "unloading_date",
        "closing_km",
      ])
    } else if (currentStep === 3) {
      result = await form.trigger("diesel_entries")
    } else if (currentStep === 4) {
      result = await form.trigger([
        "loading_halt_cost",
        "unloading_halt_cost",
        "rent",
        "driver_bata_percent",
        "agent_commission_amount",
        "fastag_charges",
        "def_charges",
        "rto_charges",
        "other_expenses_amount",
        "police_commission",
      ])
    }

    if (result && currentStep < 5) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const addDieselEntry = () => {
    append({
      date: new Date().toISOString().split("T")[0],
      time: new Date().toTimeString().split(" ")[0].substring(0, 5),
      litres_purchased: 0,
      price_per_litre: 0,
      total_cost: 0,
      location: "",
    })
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true)

      // Show success message
      setShowSuccess(true)

      // If we're editing, include the trip ID
      if (editTrip?.id) {
        values = { ...values, id: editTrip.id }
      }

      // Call the onSave callback with the form data
      await onSave(values)

      // We'll let the parent component decide whether to reset the form and hide it
      setTimeout(() => {
        setShowSuccess(false)
      }, 1500)
    } catch (error) {
      console.error("Error submitting form:", error)
      setShowSuccess(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Render the appropriate step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Truck className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">1. Truck & Driver Details</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="truck_name"
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
                  name="truck_number"
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
                <FormField
                  control={form.control}
                  name="driver1_name"
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
                  name="driver2_name"
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
            </div>
            <div className="flex justify-between mt-6">
              <Button type="button" variant="outline" onClick={onCancel} className="flex items-center">
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button type="button" onClick={nextStep} className="bg-primary">
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )

      case 2:
        return (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">2. Trip Information</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="trip_number"
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
                  name="start_date"
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
                <FormField
                  control={form.control}
                  name="loading_point"
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
                  name="starting_km"
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
                <FormField
                  control={form.control}
                  name="eway_bill"
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
                  name="lr_number"
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
                <FormField
                  control={form.control}
                  name="unloading_point"
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
                  name="unloading_date"
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
                <FormField
                  control={form.control}
                  name="closing_km"
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
                  name="running_km"
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
            </div>
            <div className="flex justify-between mt-6">
              <Button type="button" variant="outline" onClick={prevStep}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
              <Button type="button" onClick={nextStep} className="bg-primary">
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )

      case 3:
        return (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Fuel className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">3. Diesel Entries</h3>
              </div>

              <div className="space-y-6">
                {fields.map((field, index) => (
                  <div key={field.id} className="p-4 border border-gray-700 rounded-md relative">
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

                    <h4 className="font-medium mb-4">Diesel Entry #{index + 1}</h4>

                    <div className="grid grid-cols-1 gap-4">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name={`diesel_entries.${index}.date`}
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
                          name={`diesel_entries.${index}.time`}
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
                      </div>
                      <FormField
                        control={form.control}
                        name={`diesel_entries.${index}.location`}
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
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name={`diesel_entries.${index}.litres_purchased`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Litres Purchased*</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  step="0.01"
                                  {...field}
                                  onChange={(e) => {
                                    field.onChange(e.target.value === "" ? 0 : Number.parseFloat(e.target.value))
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`diesel_entries.${index}.price_per_litre`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Price per Litre*</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  step="0.01"
                                  {...field}
                                  onChange={(e) => {
                                    field.onChange(e.target.value === "" ? 0 : Number.parseFloat(e.target.value))
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name={`diesel_entries.${index}.total_cost`}
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

                <Button type="button" variant="outline" size="sm" onClick={addDieselEntry} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Another Diesel Entry
                </Button>

                <div className="p-4 bg-gray-800 rounded-md">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total Diesel Cost:</span>
                    <span className="font-bold">₹{form.watch("diesel_cost").toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-between mt-6">
              <Button type="button" variant="outline" onClick={prevStep}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
              <Button type="button" onClick={nextStep} className="bg-primary">
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )

      case 4:
        return (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <IndianRupee className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">4. Expenses & Payments</h3>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="loading_halt_cost"
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
                    name="unloading_halt_cost"
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

                <Separator className="bg-gray-700" />

                <div className="p-4 border border-gray-700 rounded-md">
                  <h4 className="font-medium mb-4">Agent Details</h4>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <FormField
                      control={form.control}
                      name="agent_name"
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
                      name="agent_mobile"
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
                    name="agent_commission_amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Agent Commission (Fixed Amount)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="p-4 border border-gray-700 rounded-md">
                  <h4 className="font-medium mb-4">Driver Bata</h4>
                  <p className="text-sm text-gray-400 mb-4">Calculated as: (Rent - Agent Commission) × Bata %</p>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="driver_bata_percent"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Driver Bata (%)</FormLabel>
                          <FormControl>
                            <div className="flex items-center">
                              <Input type="number" step="0.01" {...field} />
                              <Percent className="ml-2 h-4 w-4 text-gray-400" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="driver_bata_amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Driver Bata Amount (Auto-calculated)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} readOnly className="bg-muted" />
                          </FormControl>
                          <FormDescription>
                            {form.watch("driver2_name") ? "Split between both drivers" : "For single driver"}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="p-4 border border-gray-700 rounded-md">
                  <h4 className="font-medium mb-4">Other Expenses</h4>

                  <div className="grid grid-cols-1 gap-4">
                    <FormField
                      control={form.control}
                      name="diesel_cost"
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

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="fastag_charges"
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
                        name="def_charges"
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

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="rto_charges"
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
                        name="police_commission"
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
                    </div>

                    <FormField
                      control={form.control}
                      name="other_expenses_amount"
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

                    <FormField
                      control={form.control}
                      name="other_expenses_text"
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
              </div>
            </div>
            <div className="flex justify-between mt-6">
              <Button type="button" variant="outline" onClick={prevStep}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
              <Button
                type="button"
                onClick={form.handleSubmit(onSubmit)}
                disabled={isSubmitting}
                className="bg-primary hover:bg-primary/90"
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <span className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                    Saving...
                  </span>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Trip
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        )

      default:
        return null
    }
  }

  return (
    <div className="relative">
      {showSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute inset-0 flex items-center justify-center z-10 bg-background/80 backdrop-blur-sm"
        >
          <div className="bg-green-500/10 text-green-500 p-6 rounded-lg flex flex-col items-center">
            <CheckCircle className="h-16 w-16 mb-4" />
            <h3 className="text-xl font-bold">Trip Added Successfully!</h3>
          </div>
        </motion.div>
      )}

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-2xl font-bold">{editTrip ? "Edit Trip" : "Add New Trip"}</h2>
          <div className="text-sm text-muted-foreground">Step {currentStep} of 4</div>
        </div>
        <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
          <div
            className="bg-primary h-full transition-all duration-300 ease-in-out"
            style={{ width: `${(currentStep / 4) * 100}%` }}
          ></div>
        </div>
      </div>

      <Form {...form}>
        <form className="space-y-6">{renderStepContent()}</form>
      </Form>
    </div>
  )
}
