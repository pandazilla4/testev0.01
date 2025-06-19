"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Search } from "lucide-react"
import type { CryptoCurrency } from "@/lib/crypto-api"

interface CryptoSuggestionsProps {
  onSelect: (crypto: CryptoCurrency) => void
  topCryptos: CryptoCurrency[]
}

export default function CryptoSuggestions({ onSelect, topCryptos }: CryptoSuggestionsProps) {
  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)

  // Top 8 most popular cryptos for suggestions
  const suggestions = topCryptos.slice(0, 8)

  const filteredCryptos =
    query.length >= 2
      ? topCryptos
          .filter(
            (crypto) =>
              crypto.name.toLowerCase().includes(query.toLowerCase()) ||
              crypto.symbol.toLowerCase().includes(query.toLowerCase()),
          )
          .slice(0, 10)
      : []

  const handleSelect = (crypto: CryptoCurrency) => {
    onSelect(crypto)
    setQuery("")
    setIsOpen(false)
    setShowSuggestions(false)
  }

  const handleFocus = () => {
    if (query.length < 2) {
      setShowSuggestions(true)
    } else {
      setIsOpen(true)
    }
  }

  const handleInputChange = (value: string) => {
    setQuery(value)
    if (value.length >= 2) {
      setIsOpen(true)
      setShowSuggestions(false)
    } else {
      setIsOpen(false)
      setShowSuggestions(true)
    }
  }

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder="Buscar criptomoeda..."
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={() => {
            // Delay to allow click on suggestions
            setTimeout(() => {
              setIsOpen(false)
              setShowSuggestions(false)
            }, 200)
          }}
          className="pl-10 border-gray-300 focus:border-black focus:ring-black"
        />
      </div>

      {/* Suggestions Cards */}
      {showSuggestions && (
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-3">Mais populares:</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {suggestions.map((crypto) => (
              <button
                key={crypto.id}
                onClick={() => handleSelect(crypto)}
                className="flex items-center space-x-2 p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <img src={crypto.image || "/placeholder.svg"} alt={crypto.name} className="w-5 h-5 rounded-full" />
                <div className="text-left">
                  <div className="text-xs font-medium text-black">{crypto.symbol.toUpperCase()}</div>
                  <div className="text-xs text-gray-600 truncate">{crypto.name}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search Results List */}
      {isOpen && filteredCryptos.length > 0 && (
        <Card className="absolute z-10 w-full mt-1 border-gray-200 shadow-lg">
          <CardContent className="p-0">
            <div className="max-h-60 overflow-y-auto">
              {filteredCryptos.map((crypto) => (
                <button
                  key={crypto.id}
                  onClick={() => handleSelect(crypto)}
                  className="w-full flex items-center justify-between p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 text-left"
                >
                  <div className="flex items-center space-x-3">
                    <img src={crypto.image || "/placeholder.svg"} alt={crypto.name} className="w-6 h-6 rounded-full" />
                    <div>
                      <div className="font-medium text-black">{crypto.name}</div>
                      <div className="text-sm text-gray-600">{crypto.symbol.toUpperCase()}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-black">${crypto.current_price.toFixed(2)}</div>
                    <div
                      className={`text-sm ${
                        crypto.price_change_percentage_24h >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {crypto.price_change_percentage_24h >= 0 ? "+" : ""}
                      {crypto.price_change_percentage_24h?.toFixed(2)}%
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
