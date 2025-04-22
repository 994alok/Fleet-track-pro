import Link from "next/link"
import { ArrowLeft, Calendar, MapPin, Truck, Fuel, IndianRupee, TrendingUp } from "lucide-react"

import { SiteHeader } from "@/components/site-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatCurrency, formatDate } from "@/lib/utils"

export default function TruckDetailsPage({ params }: { params: { id: string } }) {
  const truckId = params.id

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
              <h1 className="text-3xl font-bold">Truck1</h1>
              <p className="text-muted-foreground flex items-center mt-1">
                <Truck className="h-4 w-4 mr-1" />
                ABC123 • Driver: John Doe
              </p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Trips</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Distance</CardTitle>
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,500 km</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <IndianRupee className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(50000)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">{formatCurrency(12500)}</div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="trips" className="w-full">
            <TabsList className="grid w-full md:w-[400px] grid-cols-2">
              <TabsTrigger value="trips">Trip History</TabsTrigger>
              <TabsTrigger value="expenses">Expenses</TabsTrigger>
            </TabsList>
            <TabsContent value="trips" className="mt-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Trip Card 1 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex justify-between">
                      <span>TRIP001</span>
                      <span className="text-sm font-normal text-muted-foreground">
                        {formatDate("2023-10-01")} - {formatDate("2023-10-05")}
                      </span>
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      CityA to CityB
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Distance</p>
                        <p className="font-medium">500 km</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Revenue</p>
                        <p className="font-medium">{formatCurrency(10000)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Expenses</p>
                        <p className="font-medium">{formatCurrency(7500)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Profit</p>
                        <p className="font-medium text-green-500 flex items-center">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          {formatCurrency(2500)}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t">
                      <div className="flex items-center gap-2">
                        <Fuel className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">50 litres @ ₹90/litre</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Trip Card 2 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex justify-between">
                      <span>TRIP004</span>
                      <span className="text-sm font-normal text-muted-foreground">
                        {formatDate("2023-09-20")} - {formatDate("2023-09-25")}
                      </span>
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      CityC to CityD
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Distance</p>
                        <p className="font-medium">600 km</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Revenue</p>
                        <p className="font-medium">{formatCurrency(12000)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Expenses</p>
                        <p className="font-medium">{formatCurrency(9000)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Profit</p>
                        <p className="font-medium text-green-500 flex items-center">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          {formatCurrency(3000)}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t">
                      <div className="flex items-center gap-2">
                        <Fuel className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">60 litres @ ₹92/litre</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Trip Card 3 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex justify-between">
                      <span>TRIP007</span>
                      <span className="text-sm font-normal text-muted-foreground">
                        {formatDate("2023-09-10")} - {formatDate("2023-09-15")}
                      </span>
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      CityE to CityF
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Distance</p>
                        <p className="font-medium">450 km</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Revenue</p>
                        <p className="font-medium">{formatCurrency(9000)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Expenses</p>
                        <p className="font-medium">{formatCurrency(6500)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Profit</p>
                        <p className="font-medium text-green-500 flex items-center">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          {formatCurrency(2500)}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t">
                      <div className="flex items-center gap-2">
                        <Fuel className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">45 litres @ ₹88/litre</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="expenses" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Expense Breakdown</CardTitle>
                  <CardDescription>Overview of all expenses for this truck</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b">
                      <span className="font-medium">Category</span>
                      <span className="font-medium">Amount</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-2">
                        <Fuel className="h-4 w-4 text-muted-foreground" />
                        Diesel
                      </span>
                      <span>{formatCurrency(18000)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Driver Bata</span>
                      <span>{formatCurrency(5000)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Fastag Charges</span>
                      <span>{formatCurrency(3000)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>RTO Charges</span>
                      <span>{formatCurrency(1500)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Loading/Unloading Halt</span>
                      <span>{formatCurrency(4000)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>DEF Charges</span>
                      <span>{formatCurrency(1000)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Agent Commission</span>
                      <span>{formatCurrency(2500)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Other Expenses</span>
                      <span>{formatCurrency(2500)}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t font-bold">
                      <span>Total Expenses</span>
                      <span>{formatCurrency(37500)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
