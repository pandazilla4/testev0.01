"use client"

import PortfolioSummary from "./portfolio-summary"
import MarketOverview from "./market-overview"
import PortfolioChart from "./portfolio-chart"

interface Transaction {
  id: string
  crypto_symbol: string
  crypto_name: string
  amount: number
  price_paid: number
  created_at: string
}

interface NewsItem {
  title: string
  description: string
  link: string
  pubDate: string
  image?: string
}

interface DashboardOverviewProps {
  transactions: Transaction[]
  cryptoPrices: any
  topCryptos: any[]
  news: NewsItem[]
  usdBrlRate: number
}

export default function DashboardOverview({
  transactions,
  cryptoPrices,
  topCryptos,
  news,
  usdBrlRate,
}: DashboardOverviewProps) {
  // Get top gainers and losers from top 100 cryptos
  const top100 = topCryptos.slice(0, 100)

  const topGainers = top100
    .filter((crypto) => crypto.price_change_percentage_24h > 0)
    .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)

  const topLosers = top100
    .filter((crypto) => crypto.price_change_percentage_24h < 0)
    .sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h)

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Portfolio Summary */}
      <section>
        <h2 className="text-xl sm:text-2xl font-bold text-black mb-4 sm:mb-6">Resumo do Portfolio</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
          <div className="lg:col-span-2">
            <PortfolioSummary transactions={transactions} cryptoPrices={cryptoPrices} />
          </div>
          <div className="lg:col-span-1">
            <PortfolioChart transactions={transactions} cryptoPrices={cryptoPrices} />
          </div>
        </div>
      </section>

      {/* Market Overview */}
      <MarketOverview topCryptos={topCryptos} topGainers={topGainers} topLosers={topLosers} news={news} />
    </div>
  )
}
