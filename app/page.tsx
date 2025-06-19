"use client"

import { useState } from "react"
import HomeHeader from "@/components/home-header"
import LoginFormCustom from "@/components/login-form-custom"
import RegisterForm from "@/components/register-form"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login")

  return (
    <div className="min-h-screen bg-white">
      <HomeHeader />

      <main className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-12">
        <div className="w-full max-w-md space-y-6">
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200">
            <Button
              variant="ghost"
              className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "login"
                  ? "border-black text-black"
                  : "border-transparent text-gray-500 hover:text-black hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("login")}
            >
              Fazer Login
            </Button>
            <Button
              variant="ghost"
              className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "register"
                  ? "border-black text-black"
                  : "border-transparent text-gray-500 hover:text-black hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("register")}
            >
              Criar Conta
            </Button>
          </div>

          {/* Form Content */}
          <div className="mt-6">{activeTab === "login" ? <LoginFormCustom /> : <RegisterForm />}</div>

          {/* Footer Info */}
          <div className="text-center text-sm text-gray-500 space-y-2">
            <p>CriptoMaxi Tracker - Gerencie seus investimentos em crypto</p>
            <p className="text-xs">Sistema anônimo e seguro</p>
          </div>
        </div>
      </main>
    </div>
  )
}
