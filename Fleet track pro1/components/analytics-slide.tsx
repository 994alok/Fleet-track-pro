"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatCurrency } from "@/lib/utils"
import { BarChart } from "lucide-react"

export function AnalyticsSlide() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="mt-6 mb-8"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold flex items-center">
          <BarChart className="h-5 w-5 mr-2 text-primary" />
          Analytics Overview
        </h2>
      </div>

      <Tabs defaultValue="summary" className="w-full">
        <TabsList className="grid w-full md:w-[400px] grid-cols-2 rounded-full bg-gray-900 border border-gray-800 p-1">
          <TabsTrigger value="summary" className="rounded-full data-[state=active]:bg-muted">
            Summary
          </TabsTrigger>
          <TabsTrigger value="expenses" className="rounded-full data-[state=active]:bg-muted">
            Expense Analysis
          </TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Trucks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5</div>
                <p className="text-xs text-muted-foreground mt-1">Active fleet</p>
              </CardContent>
            </Card>
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(85000)}</div>
                <p className="text-xs text-muted-foreground mt-1">+8% from last month</p>
              </CardContent>
            </Card>
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">{formatCurrency(40000)}</div>
                <p className="text-xs text-muted-foreground mt-1">+32% from last month</p>
              </CardContent>
            </Card>
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">32%</div>
                <p className="text-xs text-muted-foreground mt-1">+5% from last month</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle>Top Performing Trucks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                    <span className="font-medium">Truck</span>
                    <span className="font-medium">Profit Margin</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Truck2 (XYZ456)</span>
                    <span className="text-green-500">38%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Truck1 (ABC123)</span>
                    <span className="text-green-500">35%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Truck5 (MNO321)</span>
                    <span className="text-green-500">30%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Truck4 (JKL987)</span>
                    <span className="text-green-500">28%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Truck3 (PQR789)</span>
                    <span className="text-red-500">-5%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle>Monthly Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                    <span className="font-medium">Month</span>
                    <span className="font-medium">Revenue</span>
                    <span className="font-medium">Profit</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>October</span>
                    <span>{formatCurrency(125000)}</span>
                    <span className="text-green-500">{formatCurrency(40000)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>September</span>
                    <span>{formatCurrency(110000)}</span>
                    <span className="text-green-500">{formatCurrency(30000)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>August</span>
                    <span>{formatCurrency(95000)}</span>
                    <span className="text-green-500">{formatCurrency(25000)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>July</span>
                    <span>{formatCurrency(105000)}</span>
                    <span className="text-green-500">{formatCurrency(28000)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>June</span>
                    <span>{formatCurrency(90000)}</span>
                    <span className="text-green-500">{formatCurrency(22000)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="expenses" className="mt-6">
          <Card className="mb-8 bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle>Expense Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                  <span className="font-medium">Category</span>
                  <span className="font-medium">Amount</span>
                  <span className="font-medium">Percentage</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Diesel</span>
                  <span>{formatCurrency(45000)}</span>
                  <span>53%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Driver Bata</span>
                  <span>{formatCurrency(12500)}</span>
                  <span>15%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Loading/Unloading Halt</span>
                  <span>{formatCurrency(8000)}</span>
                  <span>9%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Fastag Charges</span>
                  <span>{formatCurrency(6000)}</span>
                  <span>7%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Agent Commission</span>
                  <span>{formatCurrency(5000)}</span>
                  <span>6%</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-700 font-bold">
                  <span>Total Expenses</span>
                  <span>{formatCurrency(85000)}</span>
                  <span>100%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
