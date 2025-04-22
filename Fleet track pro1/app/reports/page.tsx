"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatCurrency } from "@/lib/utils"
import { NavBar } from "@/components/ui/navbar"
import { Home, BarChart } from "lucide-react"
import { useRouter } from "next/navigation"

export default function ReportsPage() {
  const router = useRouter()

  const handleNavItemSelect = (item: string) => {
    if (item === "Home") {
      router.push("/")
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <div className="container py-4">
          <NavBar
            items={[
              { name: "Home", url: "/", icon: Home },
              { name: "Analytics", url: "/reports", icon: BarChart },
            ]}
            activeItem="Analytics"
            onItemSelect={handleNavItemSelect}
            className="relative sm:static transform-none left-0 mb-4 ml-2 sm:ml-2"
          />
          <h1 className="text-3xl font-bold mb-8">Reports & Analytics</h1>
        </div>
        <div className="container py-8">
          <Tabs defaultValue="summary" className="w-full">
            <TabsList className="grid w-full md:w-[400px] grid-cols-2">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="expenses">Expense Analysis</TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="mt-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(125000)}</div>
                    <p className="text-xs text-muted-foreground mt-1">+15% from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(85000)}</div>
                    <p className="text-xs text-muted-foreground mt-1">+8% from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-500">{formatCurrency(40000)}</div>
                    <p className="text-xs text-muted-foreground mt-1">+32% from last month</p>
                  </CardContent>
                </Card>
                <Card>
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
                <Card>
                  <CardHeader>
                    <CardTitle>Top Performing Trucks</CardTitle>
                    <CardDescription>Trucks with highest profit margin</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center pb-2 border-b">
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

                <Card>
                  <CardHeader>
                    <CardTitle>Monthly Performance</CardTitle>
                    <CardDescription>Revenue and profit trends</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center pb-2 border-b">
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
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Expense Breakdown</CardTitle>
                  <CardDescription>Analysis of expenses by category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b">
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
                    <div className="flex justify-between items-center">
                      <span>RTO Charges</span>
                      <span>{formatCurrency(3500)}</span>
                      <span>4%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>DEF Charges</span>
                      <span>{formatCurrency(2500)}</span>
                      <span>3%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Other Expenses</span>
                      <span>{formatCurrency(2500)}</span>
                      <span>3%</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t font-bold">
                      <span>Total Expenses</span>
                      <span>{formatCurrency(85000)}</span>
                      <span>100%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Diesel Consumption</CardTitle>
                    <CardDescription>Analysis by truck</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center pb-2 border-b">
                        <span className="font-medium">Truck</span>
                        <span className="font-medium">Litres</span>
                        <span className="font-medium">Cost</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Truck1 (ABC123)</span>
                        <span>120</span>
                        <span>{formatCurrency(10800)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Truck2 (XYZ456)</span>
                        <span>110</span>
                        <span>{formatCurrency(9900)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Truck3 (PQR789)</span>
                        <span>95</span>
                        <span>{formatCurrency(8550)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Truck4 (JKL987)</span>
                        <span>105</span>
                        <span>{formatCurrency(9450)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Truck5 (MNO321)</span>
                        <span>70</span>
                        <span>{formatCurrency(6300)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Efficiency Analysis</CardTitle>
                    <CardDescription>Cost per kilometer</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center pb-2 border-b">
                        <span className="font-medium">Truck</span>
                        <span className="font-medium">Cost/KM</span>
                        <span className="font-medium">Rating</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Truck5 (MNO321)</span>
                        <span>₹28</span>
                        <span className="text-green-500">Excellent</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Truck2 (XYZ456)</span>
                        <span>₹32</span>
                        <span className="text-green-500">Good</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Truck1 (ABC123)</span>
                        <span>₹35</span>
                        <span className="text-green-500">Good</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Truck4 (JKL987)</span>
                        <span>₹38</span>
                        <span className="text-yellow-500">Average</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Truck3 (PQR789)</span>
                        <span>₹42</span>
                        <span className="text-red-500">Poor</span>
                      </div>
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
