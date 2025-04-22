"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Calendar, ChevronDown, X, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"

interface DateRangeFilterProps {
  dateRange: {
    start: string
    end: string
  }
  onDateRangeChange: (range: { start: string; end: string }) => void
  isLoading?: boolean
}

const quickRangeOptions = [
  { label: "1 Month", months: 1 },
  { label: "3 Months", months: 3 },
  { label: "6 Months", months: 6 },
  { label: "1 Year", months: 12 },
  { label: "2 Years", months: 24 },
  { label: "3 Years", months: 36 },
  { label: "4 Years", months: 48 },
  { label: "5 Years", months: 60 },
]

export function DateRangeFilter({ dateRange, onDateRangeChange, isLoading = false }: DateRangeFilterProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState(quickRangeOptions[3]) // Default to 1 Year
  const [error, setError] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStart = e.target.value
    const endDate = new Date(dateRange.end)
    const startDate = new Date(newStart)

    if (startDate > endDate) {
      setError("Start date cannot be after end date")
      return
    }

    setError(null)
    onDateRangeChange({
      ...dateRange,
      start: newStart,
    })
  }

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEnd = e.target.value
    const startDate = new Date(dateRange.start)
    const endDate = new Date(newEnd)

    if (endDate < startDate) {
      setError("End date cannot be before start date")
      return
    }

    setError(null)
    onDateRangeChange({
      ...dateRange,
      end: newEnd,
    })
  }

  const setQuickRange = (months: number) => {
    const end = new Date()
    const start = new Date()
    start.setMonth(start.getMonth() - months)

    setError(null)
    onDateRangeChange({
      start: start.toISOString().split("T")[0],
      end: end.toISOString().split("T")[0],
    })
  }

  const handleOptionSelect = (option: { label: string; months: number }) => {
    setSelectedOption(option)
    setQuickRange(option.months)
    setDropdownOpen(false)
  }

  const clearError = () => {
    setError(null)
  }

  return (
    <Card className="bg-gray-900 border-gray-800 shadow-lg">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row items-center gap-4 relative">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-gray-400" />
            <span className="text-sm font-medium">Filter by date range:</span>
          </div>

          <div className="flex flex-1 items-center gap-2">
            <Input
              type="date"
              value={dateRange.start}
              onChange={handleStartDateChange}
              onFocus={clearError}
              className="w-full md:w-auto"
              max={dateRange.end}
            />
            <span className="text-gray-400">to</span>
            <Input
              type="date"
              value={dateRange.end}
              onChange={handleEndDateChange}
              onFocus={clearError}
              className="w-full md:w-auto"
              min={dateRange.start}
            />
          </div>

          <div className="relative" ref={dropdownRef}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDropdownOpen((prev) => !prev)}
              disabled={isLoading}
              className="min-w-[120px] justify-between"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                  Loading...
                </span>
              ) : (
                <>
                  {selectedOption.label}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-40 bg-gray-800 border border-gray-700 rounded shadow-lg z-10"
                >
                  {quickRangeOptions.map((option) => (
                    <button
                      key={option.months}
                      onClick={() => handleOptionSelect(option)}
                      className="flex items-center justify-between w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                    >
                      {option.label}
                      {selectedOption.months === option.months && <Check className="h-4 w-4 text-primary" />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 text-red-500 text-sm flex items-center"
            >
              <X className="h-4 w-4 mr-1" />
              {error}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}
