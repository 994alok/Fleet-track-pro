"use client"

import { useState, useEffect } from "react"
import { Truck, BarChart, TrendingUp, TrendingDown, IndianRupee, Calendar, Home } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DateRangeFilter } from "@/components/date-range-filter"
import { NavBar } from "@/components/ui/navbar"
import { formatCurrency } from "@/lib/utils"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
} from "recharts"
import { useRouter } from "next/navigation"
import { getTrips, type Trip } from "@/lib/actions"
import { useToast } from "@/components/ui/use-toast"

export default function AnalyticsPage() {
  const [financialData, setFinancialData] = useState<any[]>([])
  const [trips, setTrips] = useState<Trip[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setMonth(new Date().getMonth() - 12)).toISOString().split("T")[0],
    end: new Date().toISOString().split("T")[0],
  })
  const [activeTab, setActiveTab] = useState("profit")
  const router = useRouter()
  const { toast } = useToast()
  const [username, setUsername] = useState("Admin") // Default username

  // Fetch trips from Supabase on initial load
  useEffect(() => {
    async function fetchTrips() {
      setIsLoading(true)
      try {
        const fetchedTrips = await getTrips()
        setTrips(fetchedTrips)

        // Generate financial data based on fetched trips
        if (fetchedTrips.length > 0) {
          const tripData = generateFinancialDataFromTrips(fetchedTrips)
          setFinancialData(tripData)
        } else {
          setFinancialData([])
        }
      } catch (error) {
        console.error("Error fetching trips:", error)
        toast({
          title: "Error",
          description: "Failed to load trips. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchTrips()
  }, [toast])

  // Generate financial data from trips
  const generateFinancialDataFromTrips = (tripData: Trip[]) => {
    // Sort trips by date
    const sortedTrips = [...tripData].sort(
      (a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime(),
    )

    // Group trips by month
    const monthlyData: Record<string, { revenue: number; expenses: number; profit: number; date: Date }> = {}

    sortedTrips.forEach((trip) => {
      const date = new Date(trip.start_date)
      const monthYear = `${date.toLocaleString("default", { month: "short" })} ${date.getFullYear()}`

      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = { revenue: 0, expenses: 0, profit: 0, date: date }
      }

      monthlyData[monthYear].revenue += Number(trip.rent) || 0
      monthlyData[monthYear].expenses += Number(trip.total_expenses) || 0
      monthlyData[monthYear].profit += Number(trip.profit_loss) || 0
    })

    // Convert to array format for charts and sort by date
    return Object.entries(monthlyData)
      .map(([month, data]) => ({
        month,
        revenue: data.revenue,
        expenses: data.expenses,
        profit: data.profit,
        date: data.date,
      }))
      .sort((a, b) => a.date.getTime() - b.date.getTime())
  }

  // Handle date range changes
  const handleDateRangeChange = (range: { start: string; end: string }) => {
    setIsLoading(true)
    setDateRange(range)

    // Filter trips based on date range
    setTimeout(() => {
      const filteredTrips = trips.filter((trip) => {
        const tripDate = new Date(trip.start_date)
        return tripDate >= new Date(range.start) && tripDate <= new Date(range.end)
      })

      const tripData = generateFinancialDataFromTrips(filteredTrips)
      setFinancialData(tripData)
      setIsLoading(false)
    }, 500)
  }

  // Calculate total metrics
  const totalRevenue = financialData.reduce((sum, item) => sum + item.revenue, 0)
  const totalProfit = financialData.reduce((sum, item) => sum + item.profit, 0)
  const totalExpenses = financialData.reduce((sum, item) => sum + item.expenses, 0)

  // Calculate average profit margin
  const profitMargin = totalRevenue > 0 ? Math.round((totalProfit / totalRevenue) * 100) : 0

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 border border-gray-700 p-3 rounded shadow-lg">
          <p className="font-medium text-white">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      )
    }
    return null
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
            activeItem="Analytics"
            onItemSelect={(item) => {
              if (item === "Home") {
                router.push("/")
              }
            }}
            className="mb-2"
            username={username}
          />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold flex items-center">
            <BarChart className="h-8 w-8 mr-2 text-primary" />
            Financial Analytics
          </h1>
        </div>

        {/* Date Range Filter */}
        <div className="mb-8">
          <DateRangeFilter dateRange={dateRange} onDateRangeChange={handleDateRangeChange} isLoading={isLoading} />
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-900 border-gray-800 shadow-lg hover:shadow-primary/5 transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <IndianRupee className="h-4 w-4 mr-2 text-primary" />
                Total Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{formatCurrency(totalRevenue)}</div>
              <p className="text-xs text-muted-foreground mt-1">For selected period</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800 shadow-lg hover:shadow-primary/5 transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <BarChart className="h-4 w-4 mr-2 text-primary" />
                Total Expenses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{formatCurrency(totalExpenses)}</div>
              <p className="text-xs text-muted-foreground mt-1">For selected period</p>
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
                {formatCurrency(totalProfit)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">For selected period</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800 shadow-lg hover:shadow-primary/5 transition-all duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-primary" />
                Profit Margin
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${profitMargin >= 0 ? "text-green-500" : "text-red-500"}`}>
                {profitMargin}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">Average for period</p>
            </CardContent>
          </Card>
        </div>

        {/* Chart Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full md:w-[400px] grid-cols-2">
            <TabsTrigger value="profit">Profit/Loss</TabsTrigger>
            <TabsTrigger value="revenue">Revenue & Expenses</TabsTrigger>
          </TabsList>

          <TabsContent value="profit" className="mt-6">
            <Card className="bg-gray-900 border-gray-800 shadow-lg">
              <CardHeader>
                <CardTitle>Monthly Profit/Loss</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-[400px] w-full flex flex-col items-center justify-center">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
                    <p className="text-gray-500">Loading data...</p>
                  </div>
                ) : financialData.length === 0 ? (
                  <div className="h-[400px] w-full flex flex-col items-center justify-center text-gray-500">
                    <BarChart className="h-16 w-16 mb-4 text-gray-700" />
                    <p className="text-lg font-medium">No Data Available</p>
                    <p className="text-sm text-center mt-2">Add trips to see financial analytics</p>
                  </div>
                ) : (
                  <div className="h-[400px] w-full overflow-x-auto">
                    <div className="min-w-[800px] h-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={financialData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                          <XAxis
                            dataKey="month"
                            stroke="#888"
                            tick={{ fill: "#888" }}
                            tickLine={{ stroke: "#666" }}
                            allowDataOverflow={true}
                          />
                          <YAxis
                            stroke="#888"
                            tick={{ fill: "#888" }}
                            tickFormatter={(value) => `₹${Math.abs(value / 1000)}k`}
                            domain={[-20000, 60000]}
                            tickLine={{ stroke: "#666" }}
                          />
                          <Tooltip content={<CustomTooltip />} />
                          <Legend />
                          <ReferenceLine y={0} stroke="#666" strokeWidth={2} />
                          <Line
                            type="monotone"
                            dataKey="profit"
                            name="Profit/Loss"
                            stroke="#10b981"
                            strokeWidth={3}
                            dot={{ r: 4, strokeWidth: 2, fill: "#111827", stroke: "#10b981" }}
                            activeDot={{ r: 6, strokeWidth: 3, fill: "#111827", stroke: "#10b981" }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="revenue" className="mt-6">
            <Card className="bg-gray-900 border-gray-800 shadow-lg">
              <CardHeader>
                <CardTitle>Revenue & Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-[400px] w-full flex flex-col items-center justify-center">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
                    <p className="text-gray-500">Loading data...</p>
                  </div>
                ) : financialData.length === 0 ? (
                  <div className="h-[400px] w-full flex flex-col items-center justify-center text-gray-500">
                    <BarChart className="h-16 w-16 mb-4 text-gray-700" />
                    <p className="text-lg font-medium">No Data Available</p>
                    <p className="text-sm text-center mt-2">Add trips to see financial analytics</p>
                  </div>
                ) : (
                  <div className="h-[400px] w-full overflow-x-auto">
                    <div className="min-w-[800px] h-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={financialData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                          <XAxis
                            dataKey="month"
                            stroke="#888"
                            tick={{ fill: "#888" }}
                            tickLine={{ stroke: "#666" }}
                            allowDataOverflow={true}
                          />
                          <YAxis
                            stroke="#888"
                            tick={{ fill: "#888" }}
                            tickFormatter={(value) => `₹${value / 1000}k`}
                            domain={[0, 1000000]}
                            tickLine={{ stroke: "#666" }}
                          />
                          <Tooltip content={<CustomTooltip />} />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="revenue"
                            name="Revenue"
                            stroke="#3b82f6"
                            strokeWidth={3}
                            dot={{ r: 4, strokeWidth: 2, fill: "#111827", stroke: "#3b82f6" }}
                            activeDot={{ r: 6, strokeWidth: 3, fill: "#111827", stroke: "#3b82f6" }}
                          />
                          <Line
                            type="monotone"
                            dataKey="expenses"
                            name="Expenses"
                            stroke="#ef4444"
                            strokeWidth={3}
                            dot={{ r: 4, strokeWidth: 2, fill: "#111827", stroke: "#ef4444" }}
                            activeDot={{ r: 6, strokeWidth: 3, fill: "#111827", stroke: "#ef4444" }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Additional Analytics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <Card className="bg-gray-900 border-gray-800 shadow-lg">
            <CardHeader>
              <CardTitle>Monthly Performance</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="py-8 flex flex-col items-center justify-center">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
                  <p className="text-gray-500">Loading data...</p>
                </div>
              ) : financialData.length === 0 ? (
                <div className="py-8 flex flex-col items-center justify-center text-gray-500">
                  <p className="text-sm">No data available</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                    <span className="font-medium">Month</span>
                    <span className="font-medium">Revenue</span>
                    <span className="font-medium">Profit</span>
                  </div>
                  {financialData.slice(-5).map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span>{item.month}</span>
                      <span>{formatCurrency(item.revenue)}</span>
                      <span className={item.profit >= 0 ? "text-green-500" : "text-red-500"}>
                        {formatCurrency(item.profit)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800 shadow-lg">
            <CardHeader>
              <CardTitle>Profit Margin Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="py-8 flex flex-col items-center justify-center">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
                  <p className="text-gray-500">Loading data...</p>
                </div>
              ) : financialData.length === 0 ? (
                <div className="py-8 flex flex-col items-center justify-center text-gray-500">
                  <p className="text-sm">No data available</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                    <span className="font-medium">Month</span>
                    <span className="font-medium">Profit Margin</span>
                  </div>
                  {financialData.slice(-5).map((item, index) => {
                    const margin = item.revenue > 0 ? Math.round((item.profit / item.revenue) * 100) : 0
                    return (
                      <div key={index} className="flex justify-between items-center">
                        <span>{item.month}</span>
                        <div className="flex items-center">
                          <div className="w-32 bg-gray-700 rounded-full h-2 mr-3">
                            <div
                              className={`h-2 rounded-full ${margin >= 0 ? "bg-green-500" : "bg-red-500"}`}
                              style={{ width: `${Math.abs(margin)}%` }}
                            ></div>
                          </div>
                          <span className={margin >= 0 ? "text-green-500" : "text-red-500"}>{margin}%</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
