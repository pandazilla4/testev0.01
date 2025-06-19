"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Search } from "lucide-react"
import type { CryptoCurrency } from "@/lib/crypto-api"

interface CryptoSearchProps {
  onSelect: (crypto: CryptoCurrency) => void
  topCryptos: CryptoCurrency[]
}

export default function CryptoSearch({ onSelect, topCryptos }: CryptoSearchProps) {
  const [query, setQuery] = useState("")
  const [filteredCryptos, setFilteredCryptos] = useState<CryptoCurrency[]>([])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (query.length >= 2) {
      const filtered = topCryptos.filter(
        (crypto) =>
          crypto.name.toLowerCase().includes(query.toLowerCase()) ||
          crypto.symbol.toLowerCase().includes(query.toLowerCase()),
      )
      setFilteredCryptos(filtered.slice(0, 10))
      setIsOpen(true)
    } else {
      setFilteredCryptos([])
      setIsOpen(false)
    }
  }, [query, topCryptos])

  const handleSelect = (crypto: CryptoCurrency) => {
    onSelect(crypto)
    setQuery("")
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder="Buscar criptomoeda..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 border-gray-300 focus:border-black focus:ring-black"
        />
      </div>

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
