"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PieChart, TrendingUp, Newspaper, LogOut, Menu, X } from "lucide-react"
import { logout } from "@/lib/actions/auth"
import AddTransactionForm from "./add-transaction-form"
import type { CryptoCurrency } from "@/lib/crypto-api"

interface DashboardSidebarProps {
  username: string
  activeTab: string
  onTabChange: (tab: string) => void
  topCryptos: CryptoCurrency[]
}

export default function DashboardSidebar({ username, activeTab, onTabChange, topCryptos }: DashboardSidebarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const menuItems = [
    { id: "portfolio", label: "Meu Portfolio", icon: PieChart },
    { id: "market", label: "Mercado", icon: TrendingUp },
    { id: "news", label: "Notícias", icon: Newspaper },
  ]

  const SidebarContent = () => (
    <>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-black">CriptoMaxi Tracker</h1>
        <Badge variant="secondary" className="mt-2">
          {username}
        </Badge>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {menuItems.map((item) => (
            <Button
              key={item.id}
              variant={activeTab === item.id ? "default" : "ghost"}
              className={`w-full justify-start ${
                activeTab === item.id ? "bg-black text-white hover:bg-gray-800" : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => {
                onTabChange(item.id)
                setIsMobileMenuOpen(false)
              }}
            >
              <item.icon className="h-4 w-4 mr-3" />
              {item.label}
            </Button>
          ))}
        </div>
      </nav>

      {/* Actions */}
      <div className="p-4 border-t border-gray-200 space-y-3">
        <AddTransactionForm topCryptos={topCryptos} />
        <form action={logout}>
          <Button variant="outline" type="submit" className="w-full border-gray-300 text-gray-700 hover:bg-gray-50">
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </form>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="bg-white border-gray-300"
        >
          {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white border-r border-gray-200">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-200 flex flex-col">
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  )
}
