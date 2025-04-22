import Link from "next/link"
import { Calendar, MapPin, Truck, TrendingUp, TrendingDown } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency, formatDate } from "@/lib/utils"

interface TripSummaryCardProps {
  trip: {
    id: string
    tripNumber: string
    truck: {
      name: string
      number: string
    }
    drivers: {
      name: string
      primary: boolean
    }[]
    dates: {
      startDate: string
      unloadingDate: string
    }
    locations: {
      loadingPoint: string
      unloadingPoint: string
    }
    kilometers: {
      runningKm: number
    }
    expenses: {
      rent: number
      totalExpenses: number
      profitLoss: number
    }
  }
}

export function TripSummaryCard({ trip }: TripSummaryCardProps) {
  const isProfitable = trip.expenses.profitLoss >= 0
  const profitMargin = Math.round((trip.expenses.profitLoss / trip.expenses.rent) * 100)

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-0">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{trip.tripNumber}</CardTitle>
            <div className="flex items-center mt-1 text-muted-foreground text-sm">
              <Truck className="h-4 w-4 mr-1" />
              {trip.truck.name} ({trip.truck.number})
            </div>
          </div>
          <div
            className={`px-2 py-1 rounded-md text-xs ${isProfitable ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}
          >
            {isProfitable ? "Profitable" : "Loss"}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex items-center text-sm text-muted-foreground mb-4">
          <Calendar className="h-4 w-4 mr-1" />
          <span>
            {formatDate(trip.dates.startDate)} - {formatDate(trip.dates.unloadingDate)}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Route</p>
            <p className="font-medium flex items-center">
              <MapPin className="h-3 w-3 mr-1" />
              {trip.locations.loadingPoint} to {trip.locations.unloadingPoint}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Distance</p>
            <p className="font-medium">{trip.kilometers.runningKm} km</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Revenue</p>
            <p className="font-medium">{formatCurrency(trip.expenses.rent)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Profit/Loss</p>
            <p className={`font-medium flex items-center ${isProfitable ? "text-green-500" : "text-red-500"}`}>
              {isProfitable ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
              {formatCurrency(Math.abs(trip.expenses.profitLoss))}
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t bg-muted/50 px-6 py-3">
        <div className="flex items-center text-sm text-muted-foreground">
          <span>Profit Margin: </span>
          <span className={`ml-1 font-medium ${isProfitable ? "text-green-500" : "text-red-500"}`}>
            {profitMargin}%
          </span>
        </div>
        <Link href={`/trips/${trip.id}`} className="text-sm text-primary flex items-center ml-auto">
          View Details
        </Link>
      </CardFooter>
    </Card>
  )
}
