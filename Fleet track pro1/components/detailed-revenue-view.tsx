"use client"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { ArrowLeft, Save, Truck, Calendar, TrendingUp, TrendingDown, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { formatDate } from "@/lib/utils"
import { motion } from "framer-motion"

const formSchema = z
  .object({
    id: z.string(),
    name: z.string().min(2, "Truck name must be at least 2 characters"),
    number: z.string().min(2, "Truck number is required"),
    loadingDate: z.string().min(1, "Loading date is required"),
    unloadingDate: z.string().min(1, "Unloading date is required"),
    driverName: z.string().min(2, "Driver name is required"),
    rent: z.coerce.number().min(1, "Rent must be greater than 0"),
    driverPay: z.coerce.number().min(0, "Driver pay must be a positive number"),
    agentCommission: z.coerce.number().min(0, "Agent commission must be a positive number"),
    fasTag: z.coerce.number().min(0, "FASTag must be a positive number"),
  })
  .refine(
    (data) => {
      // Check if both dates are valid before comparing
      if (!data.loadingDate || !data.unloadingDate) return true

      const loadingDate = new Date(data.loadingDate)
      const unloadingDate = new Date(data.unloadingDate)

      // Check if dates are valid
      if (isNaN(loadingDate.getTime()) || isNaN(unloadingDate.getTime())) return true

      return unloadingDate >= loadingDate
    },
    {
      message: "Unloading date must be after loading date",
      path: ["unloadingDate"],
    },
  )

interface DetailedRevenueViewProps {
  truck: {
    id: string
    name: string
    number: string
    loadingDate: string
    unloadingDate: string
    driverName: string
    rent: number
    driverPay: number
    agentCommission: number
    fasTag: number
  }
  onBack: () => void
  onSave: (data: any) => void
}

export function DetailedRevenueView({ truck, onBack, onSave }: DetailedRevenueViewProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: truck,
  })

  const calculateProfit = () => {
    const values = form.getValues()
    const rent = Number(values.rent || 0)
    const driverPay = Number(values.driverPay || 0)
    const agentCommission = Number(values.agentCommission || 0)
    const fasTag = Number(values.fasTag || 0)
    return rent - (driverPay + agentCommission + fasTag)
  }

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Show success message
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 2000)

      onSave(data)
    } catch (error) {
      console.error("Error updating truck:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const profit = calculateProfit()
  const isProfitable = profit > 0

  // Calculate profit percentage
  const profitPercentage = truck.rent > 0 ? Math.round((profit / truck.rent) * 100) : 0

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <div className="flex items-center">
        <Button variant="ghost" onClick={onBack} className="mr-4 group">
          <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back
        </Button>
        <h2 className="text-2xl font-bold">Revenue Details</h2>

        {showSuccess && (
          <motion.div
            className="ml-auto flex items-center text-green-500"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
          >
            <CheckCircle className="h-5 w-5 mr-2" />
            <span>Changes saved successfully!</span>
          </motion.div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="bg-gray-900 border-gray-800 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Truck className="h-5 w-5 mr-2 text-primary" />
                {truck.name} ({truck.number})
              </CardTitle>
              <div className="flex items-center text-sm text-gray-400 mt-2">
                <Calendar className="h-4 w-4 mr-2" />
                <span>
                  {formatDate(truck.loadingDate)} – {formatDate(truck.unloadingDate)}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Truck Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter truck name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Truck Number</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter truck number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="loadingDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Loading Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
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
                          <FormLabel>Unloading Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="driverName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Driver Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter driver name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator className="bg-gray-700" />

                  <h3 className="text-lg font-medium">Revenue Details</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="rent"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Rent (₹)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) => {
                                field.onChange(e)
                                form.trigger(["rent", "driverPay", "agentCommission", "fasTag"])
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="driverPay"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Driver Pay (₹)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) => {
                                field.onChange(e)
                                form.trigger(["rent", "driverPay", "agentCommission", "fasTag"])
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="agentCommission"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Agent Commission (₹)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) => {
                                field.onChange(e)
                                form.trigger(["rent", "driverPay", "agentCommission", "fasTag"])
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="fasTag"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>FASTag (₹)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) => {
                                field.onChange(e)
                                form.trigger(["rent", "driverPay", "agentCommission", "fasTag"])
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" disabled={isSubmitting} className="relative overflow-hidden group">
                      {isSubmitting ? (
                        <span className="flex items-center">
                          <span className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                          Saving...
                        </span>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="bg-gray-900 border-gray-800 shadow-lg">
            <CardHeader>
              <CardTitle>Profit Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="text-center">
                  <p className="text-sm text-gray-400 mb-2">Total Profit/Loss</p>
                  <motion.p
                    key={profit}
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    className={`text-4xl font-bold ${isProfitable ? "text-green-500" : "text-red-500"} flex items-center justify-center`}
                  >
                    {isProfitable ? <TrendingUp className="h-6 w-6 mr-2" /> : <TrendingDown className="h-6 w-6 mr-2" />}
                    ₹{Math.abs(profit).toLocaleString()}
                    {!isProfitable && " (Loss)"}
                  </motion.p>
                </div>

                <Separator className="bg-gray-700" />

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Driver Pay</span>
                    <span className="font-medium">₹{form.getValues().driverPay.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-400">Agent Commission</span>
                    <span className="font-medium">₹{form.getValues().agentCommission.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-400">FASTag</span>
                    <span className="font-medium">₹{form.getValues().fasTag.toLocaleString()}</span>
                  </div>

                  <Separator className="bg-gray-700" />

                  <div className="flex justify-between font-bold">
                    <span>Total Expenses</span>
                    <span>
                      ₹
                      {(
                        form.getValues().driverPay +
                        form.getValues().agentCommission +
                        form.getValues().fasTag
                      ).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  )
}
