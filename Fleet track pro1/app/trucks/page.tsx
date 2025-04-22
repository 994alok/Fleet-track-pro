import Link from "next/link"
import { Truck, Calendar, ArrowRight, TrendingUp, TrendingDown } from "lucide-react"

import { SiteHeader } from "@/components/site-header"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatCurrency, formatDate } from "@/lib/utils"

export default function TrucksPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Trucks</h1>
            <Link href="/trips/new">
              <Button>Add New Trip</Button>
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Truck Card 1 */}
            <Card className="overflow-hidden">
              <CardHeader className="pb-0">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">Truck1</CardTitle>
                    <CardDescription className="flex items-center mt-1">
                      <Truck className="h-4 w-4 mr-1" />
                      ABC123
                    </CardDescription>
                  </div>
                  <div className="bg-primary/10 text-primary px-2 py-1 rounded-md text-xs">Active</div>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="flex items-center text-sm text-muted-foreground mb-4">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>Last updated: {formatDate("2023-10-05")}</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Driver</p>
                    <p className="font-medium">John Doe</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Last Trip</p>
                    <p className="font-medium">TRIP001</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Revenue</p>
                    <p className="font-medium">{formatCurrency(10000)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Profit</p>
                    <p className="font-medium text-green-500 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {formatCurrency(2500)}
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t bg-muted/50 px-6 py-3">
                <Link href="/trucks/1" className="text-sm text-primary flex items-center ml-auto">
                  View Details
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </CardFooter>
            </Card>

            {/* Truck Card 2 */}
            <Card className="overflow-hidden">
              <CardHeader className="pb-0">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">Truck2</CardTitle>
                    <CardDescription className="flex items-center mt-1">
                      <Truck className="h-4 w-4 mr-1" />
                      XYZ456
                    </CardDescription>
                  </div>
                  <div className="bg-primary/10 text-primary px-2 py-1 rounded-md text-xs">Active</div>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="flex items-center text-sm text-muted-foreground mb-4">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>Last updated: {formatDate("2023-10-03")}</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Driver</p>
                    <p className="font-medium">Mike Smith</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Last Trip</p>
                    <p className="font-medium">TRIP002</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Revenue</p>
                    <p className="font-medium">{formatCurrency(12000)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Profit</p>
                    <p className="font-medium text-green-500 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {formatCurrency(3200)}
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t bg-muted/50 px-6 py-3">
                <Link href="/trucks/2" className="text-sm text-primary flex items-center ml-auto">
                  View Details
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </CardFooter>
            </Card>

            {/* Truck Card 3 */}
            <Card className="overflow-hidden">
              <CardHeader className="pb-0">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">Truck3</CardTitle>
                    <CardDescription className="flex items-center mt-1">
                      <Truck className="h-4 w-4 mr-1" />
                      PQR789
                    </CardDescription>
                  </div>
                  <div className="bg-muted text-muted-foreground px-2 py-1 rounded-md text-xs">Inactive</div>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="flex items-center text-sm text-muted-foreground mb-4">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>Last updated: {formatDate("2023-09-28")}</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Driver</p>
                    <p className="font-medium">David Johnson</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Last Trip</p>
                    <p className="font-medium">TRIP003</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Revenue</p>
                    <p className="font-medium">{formatCurrency(8500)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Profit</p>
                    <p className="font-medium text-red-500 flex items-center">
                      <TrendingDown className="h-3 w-3 mr-1" />
                      {formatCurrency(-500)}
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t bg-muted/50 px-6 py-3">
                <Link href="/trucks/3" className="text-sm text-primary flex items-center ml-auto">
                  View Details
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
