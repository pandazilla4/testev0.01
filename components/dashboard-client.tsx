"use client"

import { useState } from "react"
import DashboardHeader from "@/components/dashboard-header"
import DashboardOverview from "@/components/dashboard-overview"
import PortfolioDetails from "@/components/portfolio-details"
import UserAccessCodes from "@/components/user-access-codes"
import { Bell } from "lucide-react"

interface Transaction {
  id: string
  crypto_symbol: string
  crypto_name: string
  amount: number
  price_paid: number
  comment?: string
  created_at: string
}

interface NewsItem {
  title: string
  description: string
  link: string
  pubDate: string
  image?: string
}

interface DashboardClientProps {
  session: any
  transactions: Transaction[]
  notifications: any[]
  topCryptos: any[]
  news: NewsItem[]
  cryptoPrices: any
  usdBrlRate: number
  userCodes: any[]
  codesCreatedCount: number
}

export default function DashboardClient({
  session,
  transactions,
  notifications,
  topCryptos,
  news,
  cryptoPrices,
  usdBrlRate,
  userCodes,
  codesCreatedCount,
}: DashboardClientProps) {
  const [activeTab, setActiveTab] = useState("dashboard")

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <DashboardOverview
            transactions={transactions}
            cryptoPrices={cryptoPrices}
            topCryptos={topCryptos}
            news={news}
            usdBrlRate={usdBrlRate}
          />
        )

      case "aportes":
        return <PortfolioDetails transactions={transactions} cryptoPrices={cryptoPrices} usdBrlRate={usdBrlRate} />

      case "codes":
        return <UserAccessCodes userCodes={userCodes} codesCreatedCount={codesCreatedCount} />

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader username={session.username} activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Notifications */}
        {notifications && notifications.length > 0 && (
          <div className="mb-6 space-y-2">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg flex items-start"
              >
                <Bell className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm">{notification.message}</p>
                  <p className="text-xs text-blue-600 mt-1">
                    {new Date(notification.created_at).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {renderContent()}
      </main>
    </div>
  )
}
