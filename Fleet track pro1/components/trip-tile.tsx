"use client"

import { formatDate } from "@/lib/utils"
import { Truck, Calendar, TrendingUp, TrendingDown, MapPin } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import type { Trip } from "@/lib/actions"

interface TripTileProps {
  trip: Trip
}

export function TripTile({ trip }: TripTileProps) {
  const isProfitable = Number(trip.profit_loss) > 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 hover:border-gray-600 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center">
              <Truck className="h-5 w-5 mr-2 text-primary" />
              <h3 className="text-lg font-semibold">{trip.truck_name}</h3>
            </div>
            <span className="text-sm bg-gray-700 px-2 py-1 rounded-full">{trip.truck_number}</span>
          </div>

          <div className="flex items-center text-sm text-gray-400 mb-4">
            <Calendar className="h-4 w-4 mr-2" />
            <span>
              {formatDate(trip.start_date)} – {formatDate(trip.unloading_date)}
            </span>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-400">Driver</p>
            <p className="font-medium">
              {trip.driver1_name}
              {trip.driver2_name ? `, ${trip.driver2_name}` : ""}
            </p>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-400">Route</p>
            <p className="font-medium flex items-center">
              <MapPin className="h-3 w-3 mr-1" />
              {trip.loading_point} to {trip.unloading_point}
            </p>
          </div>

          <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-700">
            <div>
              <p className="text-sm text-gray-400">Expenses</p>
              <p className="font-medium">₹{Number(trip.total_expenses).toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">Profit/Loss</p>
              <div className="flex items-center">
                <p className={`font-bold flex items-center ${isProfitable ? "text-green-500" : "text-red-500"}`}>
                  {isProfitable ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}₹
                  {Math.abs(Number(trip.profit_loss)).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-gray-700 text-center">
            <p className="text-xs text-gray-400">Click for details</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
