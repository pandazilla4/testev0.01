"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X } from "lucide-react"

interface Transaction {
  id: string
  crypto_symbol: string
  crypto_name: string
  amount: number
  price_paid: number
  created_at: string
}

interface PortfolioChartProps {
  transactions: Transaction[]
  cryptoPrices: any
}

type ChartData = "invested" | "current_value" | "pnl"
type Period = "week" | "month" | "year"

export default function PortfolioChart({ transactions, cryptoPrices }: PortfolioChartProps) {
  const [period, setPeriod] = useState<Period>("week")
  const [dataType, setDataType] = useState<ChartData>("pnl")

  const chartData = useMemo(() => {
    const now = new Date()
    const bars: { label: string; value: number; date: Date }[] = []

    if (period === "week") {
      // Last 7 days with day/month format
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now)
        date.setDate(date.getDate() - i)
        const day = date.getDate().toString().padStart(2, "0")
        const month = (date.getMonth() + 1).toString().padStart(2, "0")
        bars.push({
          label: `${day}/${month}`,
          value: 0,
          date,
        })
      }
    } else if (period === "month") {
      // Last 12 months
      const monthLabels = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]
      for (let i = 11; i >= 0; i--) {
        const date = new Date(now)
        date.setMonth(date.getMonth() - i)
        bars.push({
          label: monthLabels[date.getMonth()],
          value: 0,
          date,
        })
      }
    } else {
      // Last 4 years
      for (let i = 3; i >= 0; i--) {
        const date = new Date(now)
        date.setFullYear(date.getFullYear() - i)
        bars.push({
          label: date.getFullYear().toString(),
          value: 0,
          date,
        })
      }
    }

    // Calculate values for each period
    bars.forEach((bar) => {
      let periodTransactions: Transaction[] = []

      if (period === "week") {
        // Transactions on this specific day
        periodTransactions = transactions.filter((t) => {
          const tDate = new Date(t.created_at)
          return (
            tDate.getDate() === bar.date.getDate() &&
            tDate.getMonth() === bar.date.getMonth() &&
            tDate.getFullYear() === bar.date.getFullYear()
          )
        })
      } else if (period === "month") {
        // Transactions in this month
        periodTransactions = transactions.filter((t) => {
          const tDate = new Date(t.created_at)
          return tDate.getMonth() === bar.date.getMonth() && tDate.getFullYear() === bar.date.getFullYear()
        })
      } else {
        // Transactions in this year
        periodTransactions = transactions.filter((t) => {
          const tDate = new Date(t.created_at)
          return tDate.getFullYear() === bar.date.getFullYear()
        })
      }

      // Calculate value based on data type
      if (dataType === "invested") {
        bar.value = periodTransactions.reduce((sum, t) => sum + t.amount * t.price_paid, 0)
      } else if (dataType === "current_value") {
        bar.value = periodTransactions.reduce((sum, t) => {
          const currentPrice = cryptoPrices[t.crypto_name.toLowerCase()]?.usd || 0
          return sum + t.amount * currentPrice
        }, 0)
      } else {
        // P&L
        const invested = periodTransactions.reduce((sum, t) => sum + t.amount * t.price_paid, 0)
        const current = periodTransactions.reduce((sum, t) => {
          const currentPrice = cryptoPrices[t.crypto_name.toLowerCase()]?.usd || 0
          return sum + t.amount * currentPrice
        }, 0)
        bar.value = current - invested
      }
    })

    return bars
  }, [transactions, cryptoPrices, period, dataType])

  // Calculate total P&L percentage
  const totalInvested = transactions.reduce((sum, t) => sum + t.amount * t.price_paid, 0)
  const totalCurrent = transactions.reduce((sum, t) => {
    const currentPrice = cryptoPrices[t.crypto_name.toLowerCase()]?.usd || 0
    return sum + t.amount * currentPrice
  }, 0)
  const totalPnL = totalCurrent - totalInvested
  const totalPnLPercentage = totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0

  const maxValue = Math.max(...chartData.map((d) => Math.abs(d.value)))
  const minValue = Math.min(...chartData.map((d) => d.value))

  return (
    <Card className="bg-gray-900 text-white border-gray-800">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-400 mb-1">P&L</div>
            <div className="text-lg sm:text-2xl font-bold">
              {totalPnLPercentage >= 0 ? "+" : ""}
              {totalPnLPercentage.toFixed(2)}%
            </div>
          </div>
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white p-1">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Controls */}
        <div className="flex space-x-2">
          <Select value={period} onValueChange={(value: Period) => setPeriod(value)}>
            <SelectTrigger className="w-20 sm:w-24 h-7 sm:h-8 bg-gray-800 border-gray-700 text-white text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="week" className="text-white text-xs">
                Semana
              </SelectItem>
              <SelectItem value="month" className="text-white text-xs">
                Mês
              </SelectItem>
              <SelectItem value="year" className="text-white text-xs">
                Ano
              </SelectItem>
            </SelectContent>
          </Select>

          <Select value={dataType} onValueChange={(value: ChartData) => setDataType(value)}>
            <SelectTrigger className="w-24 sm:w-32 h-7 sm:h-8 bg-gray-800 border-gray-700 text-white text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="pnl" className="text-white text-xs">
                P&L
              </SelectItem>
              <SelectItem value="invested" className="text-white text-xs">
                Investido
              </SelectItem>
              <SelectItem value="current_value" className="text-white text-xs">
                Valor Atual
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Chart */}
        <div className="relative">
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-xs text-gray-400 w-6 sm:w-8">
            <span className="text-xs">{maxValue > 0 ? `$${maxValue.toFixed(0)}` : "$0"}</span>
            <span className="text-xs">$0</span>
            {minValue < 0 && <span className="text-xs">${minValue.toFixed(0)}</span>}
          </div>

          {/* Chart area */}
          <div className="ml-8 sm:ml-10 h-24 sm:h-32 flex items-end justify-between space-x-1 relative">
            {/* Zero line */}
            <div
              className="absolute bottom-0 left-0 right-0 h-px bg-gray-600"
              style={{
                bottom: minValue < 0 ? `${(Math.abs(minValue) / (maxValue - minValue)) * 100}%` : "0%",
              }}
            />

            {chartData.map((bar, index) => {
              const totalRange = maxValue - minValue
              const height = totalRange > 0 ? Math.max((Math.abs(bar.value) / totalRange) * 100, 2) : 2
              const isPositive = bar.value >= 0
              const isEmpty = bar.value === 0

              // Position from bottom based on value
              const bottomPosition =
                minValue < 0
                  ? isPositive
                    ? `${(Math.abs(minValue) / totalRange) * 100}%`
                    : `${((Math.abs(minValue) - Math.abs(bar.value)) / totalRange) * 100}%`
                  : "0%"

              return (
                <div key={index} className="flex flex-col items-center flex-1 relative h-full">
                  {/* Bar */}
                  <div className="relative w-full h-full flex items-end">
                    <div
                      className={`w-full relative overflow-hidden ${
                        isEmpty ? "bg-gray-700" : isPositive ? "bg-green-400" : "bg-red-400"
                      }`}
                      style={{
                        height: `${height}%`,
                        position: "absolute",
                        bottom: bottomPosition,
                      }}
                    >
                      {/* Diagonal stripes pattern for visual appeal */}
                      {!isEmpty && (
                        <div
                          className="absolute inset-0 opacity-20"
                          style={{
                            backgroundImage: `repeating-linear-gradient(
                              45deg,
                              transparent,
                              transparent 2px,
                              rgba(255,255,255,0.3) 2px,
                              rgba(255,255,255,0.3) 4px
                            )`,
                          }}
                        />
                      )}
                    </div>
                  </div>

                  {/* Date label */}
                  <div className="text-xs text-gray-400 mt-2 transform -rotate-45 origin-center whitespace-nowrap">
                    {bar.label}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="flex justify-center space-x-2 sm:space-x-4 text-xs text-gray-400 mt-4">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-sm"></div>
            <span className="text-xs">Positivo</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-400 rounded-sm"></div>
            <span className="text-xs">Negativo</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gray-700 rounded-sm"></div>
            <span className="text-xs">Sem dados</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
