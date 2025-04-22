"use client"

import { formatDate } from "@/lib/utils"
import { Truck, Calendar, TrendingUp, TrendingDown, MapPin } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface TruckTileProps {
  truck: {
    id: string
    name: string
    number: string
    loadingDate: string
    unloadingDate: string
    driverName: string
    loadingPoint: string
    unloadingPoint: string
    rent: number
    driverPay: number
    agentCommission: number
    fasTag: number
  }
  profit: number
}

export function TruckTile({ truck, profit }: TruckTileProps) {
  const isProfitable = profit > 0

  // Calculate total expenses
  const totalExpenses = truck.driverPay + truck.agentCommission + truck.fasTag

  return (
    <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 hover:border-gray-600 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center">
            <Truck className="h-5 w-5 mr-2 text-primary" />
            <h3 className="text-lg font-semibold">{truck.name}</h3>
          </div>
          <span className="text-sm bg-gray-700 px-2 py-1 rounded-full">{truck.number}</span>
        </div>

        <div className="flex items-center text-sm text-gray-400 mb-4">
          <Calendar className="h-4 w-4 mr-2" />
          <span>
            {formatDate(truck.loadingDate)} – {formatDate(truck.unloadingDate)}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-400">Driver</p>
            <p className="font-medium">{truck.driverName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Route</p>
            <p className="font-medium flex items-center">
              <MapPin className="h-3 w-3 mr-1" />
              {truck.loadingPoint} <span className="mx-1">➝</span> {truck.unloadingPoint}
            </p>
          </div>
        </div>

        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-700">
          <div>
            <p className="text-sm text-gray-400">Expenses</p>
            <p className="font-medium">₹{totalExpenses.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">Profit/Loss</p>
            <div className="flex items-center">
              <p className={`font-bold flex items-center ${isProfitable ? "text-green-500" : "text-red-500"}`}>
                {isProfitable ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}₹
                {Math.abs(profit).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
