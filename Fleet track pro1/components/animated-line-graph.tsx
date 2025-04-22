"use client"

import { useEffect, useRef, useState } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts"

interface AnimatedLineGraphProps {
  data: {
    month: string
    profit: number
  }[]
}

export function AnimatedLineGraph({ data }: AnimatedLineGraphProps) {
  const [animatedData, setAnimatedData] = useState<any[]>([])
  const [isAnimating, setIsAnimating] = useState(true)
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null)
  const animationRef = useRef<number | null>(null)
  const frameCount = useRef(0)

  useEffect(() => {
    // Reset animation when data changes
    setAnimatedData([])
    setIsAnimating(true)
    frameCount.current = 0

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }

    const animate = () => {
      if (frameCount.current < data.length) {
        setAnimatedData((prev) => [...prev, data[frameCount.current]])
        frameCount.current += 1
        animationRef.current = requestAnimationFrame(animate)
      } else {
        setIsAnimating(false)
      }
    }

    const timeoutId = setTimeout(() => {
      animationRef.current = requestAnimationFrame(animate)
    }, 300)

    return () => {
      clearTimeout(timeoutId)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [data])

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const profit = payload[0].value
      const isPositive = profit >= 0

      return (
        <div className="bg-gray-800 border border-gray-700 p-3 rounded shadow-lg">
          <p className="font-medium">{label}</p>
          <p className={`font-bold ${isPositive ? "text-green-500" : "text-red-500"}`}>
            {isPositive ? "Profit: " : "Loss: "}₹{Math.abs(profit).toLocaleString()}
          </p>
        </div>
      )
    }

    return null
  }

  const minValue = Math.min(...data.map((item) => item.profit))
  const maxValue = Math.max(...data.map((item) => item.profit))
  const domain = [
    Math.min(minValue, 0) * 1.1,
    Math.max(maxValue, 0) * 1.1,
  ]

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={isAnimating ? animatedData : data}
        margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
        onMouseMove={(e) => {
          if (e.activeTooltipIndex !== undefined) {
            setHoveredPoint(e.activeTooltipIndex)
          } else {
            setHoveredPoint(null)
          }
        }}
        onMouseLeave={() => setHoveredPoint(null)}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#444" />
        <XAxis dataKey="month" stroke="#888" tick={{ fill: "#888" }} tickLine={{ stroke: "#666" }} />
        <YAxis
          stroke="#888"
          tick={{ fill: "#888" }}
          tickFormatter={(value) => `₹${Math.abs(value / 1000)}k`}
          domain={domain}
          tickLine={{ stroke: "#666" }}
        />
        <Tooltip content={<CustomTooltip />} />
        <ReferenceLine y={0} stroke="#666" strokeWidth={2} />

        <Line
          type="monotone"
          dataKey="profit"
          stroke="#10b981"
          strokeWidth={2}
          dot={(props: any) => {
            const { cx, cy, index, payload } = props
            if (payload.profit == null) return null

            const isHovered = hoveredPoint === index
            return (
              <circle
                cx={cx}
                cy={cy}
                r={isHovered ? 6 : 4}
                fill="#111827"
                stroke="#10b981"
                strokeWidth={isHovered ? 3 : 2}
              />
            )
          }}
          activeDot={(props: any) => {
            const { cx, cy } = props
            return (
              <g>
                <circle cx={cx} cy={cy} r={6} fill="#111827" stroke="#10b981" strokeWidth={3} />
                <circle cx={cx} cy={cy} r={10} fill="none" stroke="#10b981" strokeWidth={1} opacity={0.5} />
              </g>
            )
          }}
          isAnimationActive={true}
          animationDuration={500}
          animationEasing="ease-out"
          connectNulls
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
