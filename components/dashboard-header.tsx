"use client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, LogOut } from "lucide-react"
import { logout } from "@/lib/actions/auth"
import Link from "next/link"

interface DashboardHeaderProps {
  username: string
  activeTab: string
  onTabChange: (tab: string) => void
}

export default function DashboardHeader({ username, activeTab, onTabChange }: DashboardHeaderProps) {
  const tabs = [
    { id: "dashboard", label: "Dashboard" },
    { id: "aportes", label: "Meus Aportes" },
    { id: "codes", label: "Meus Códigos" },
  ]

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4 sm:space-x-8 min-w-0">
            <div className="flex items-center min-w-0">
              <h1 className="text-lg sm:text-xl font-bold text-black truncate">CriptoMaxi Tracker</h1>
              <Badge variant="secondary" className="ml-2 sm:ml-3 text-xs">
                <span className="truncate max-w-20 sm:max-w-none">{username}</span>
              </Badge>
            </div>

            {/* Tabs - Hidden on mobile */}
            <nav className="hidden lg:flex space-x-1">
              {tabs.map((tab) => (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "ghost"}
                  className={`text-sm ${
                    activeTab === tab.id ? "bg-black text-white hover:bg-gray-800" : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => onTabChange(tab.id)}
                >
                  {tab.label}
                </Button>
              ))}
            </nav>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            <Link href="/comunicacao-interna">
              <Button
                variant="outline"
                size="sm"
                className="border-gray-300 text-gray-700 hover:bg-gray-50 text-xs sm:text-sm"
              >
                <span className="hidden sm:inline">Comunicação Interna</span>
                <span className="sm:hidden">Comunicação</span>
              </Button>
            </Link>
            <Link href="/aportes/novo">
              <Button size="sm" className="bg-black hover:bg-gray-800 text-white text-xs sm:text-sm">
                <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Novo Aporte</span>
                <span className="sm:hidden">Aporte</span>
              </Button>
            </Link>
            <form action={logout}>
              <Button
                variant="outline"
                size="sm"
                type="submit"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <LogOut className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                <span className="hidden sm:inline">Sair</span>
              </Button>
            </form>
          </div>
        </div>

        {/* Mobile Tabs */}
        <div className="lg:hidden border-t border-gray-200">
          <nav className="flex">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant="ghost"
                className={`flex-1 py-3 rounded-none border-b-2 text-xs ${
                  activeTab === tab.id
                    ? "border-black text-black"
                    : "border-transparent text-gray-500 hover:text-black hover:border-gray-300"
                }`}
                onClick={() => onTabChange(tab.id)}
              >
                {tab.label}
              </Button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}
