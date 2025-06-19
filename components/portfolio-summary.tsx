"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, DollarSign, PieChart, Target } from "lucide-react"

interface Transaction {
  id: string
  crypto_symbol: string
  crypto_name: string
  amount: number
  price_paid: number
  created_at: string
}

interface CryptoPrice {
  [key: string]: {
    usd: number
    usd_24h_change: number
  }
}

interface PortfolioSummaryProps {
  transactions: Transaction[]
  cryptoPrices: CryptoPrice
}

export default function PortfolioSummary({ transactions, cryptoPrices }: PortfolioSummaryProps) {
  // Calculate portfolio statistics
  const portfolioData = transactions.reduce((acc, transaction) => {
    const symbol = transaction.crypto_symbol.toLowerCase()
    const currentPrice = cryptoPrices[transaction.crypto_name.toLowerCase()]?.usd || 0

    if (!acc[symbol]) {
      acc[symbol] = {
        symbol: transaction.crypto_symbol,
        name: transaction.crypto_name,
        totalAmount: 0,
        totalInvested: 0,
        currentValue: 0,
        transactions: [],
      }
    }

    acc[symbol].totalAmount += transaction.amount
    acc[symbol].totalInvested += transaction.amount * transaction.price_paid
    acc[symbol].currentValue += transaction.amount * currentPrice
    acc[symbol].transactions.push(transaction)

    return acc
  }, {} as any)

  const portfolioArray = Object.values(portfolioData)
  const totalInvested = portfolioArray.reduce((sum: number, crypto: any) => sum + crypto.totalInvested, 0)
  const totalCurrentValue = portfolioArray.reduce((sum: number, crypto: any) => sum + crypto.currentValue, 0)
  const totalPnL = totalCurrentValue - totalInvested
  const totalPnLPercentage = totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0
  const uniqueCryptos = portfolioArray.length
  const totalTransactions = transactions.length

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium">Valor Total</CardTitle>
          <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600" />
        </CardHeader>
        <CardContent>
          <div className="text-lg sm:text-2xl font-bold">${totalCurrentValue.toFixed(2)}</div>
          <p className="text-xs text-gray-600 mt-1">Valor atual do portfolio</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium">P&L Total</CardTitle>
          {totalPnL >= 0 ? (
            <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
          ) : (
            <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 text-red-600" />
          )}
        </CardHeader>
        <CardContent>
          <div className={`text-lg sm:text-2xl font-bold ${totalPnL >= 0 ? "text-green-600" : "text-red-600"}`}>
            {totalPnL >= 0 ? "+" : ""}${totalPnL.toFixed(2)}
          </div>
          <p className={`text-xs mt-1 ${totalPnLPercentage >= 0 ? "text-green-600" : "text-red-600"}`}>
            {totalPnLPercentage >= 0 ? "+" : ""}
            {totalPnLPercentage.toFixed(2)}%
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium">Criptomoedas</CardTitle>
          <PieChart className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600" />
        </CardHeader>
        <CardContent>
          <div className="text-lg sm:text-2xl font-bold">{uniqueCryptos}</div>
          <p className="text-xs text-gray-600 mt-1">Diferentes moedas</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium">Total de Aportes</CardTitle>
          <Target className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600" />
        </CardHeader>
        <CardContent>
          <div className="text-lg sm:text-2xl font-bold">{totalTransactions}</div>
          <p className="text-xs text-gray-600 mt-1">${totalInvested.toFixed(2)} investido</p>
        </CardContent>
      </Card>
    </div>
  )
}
