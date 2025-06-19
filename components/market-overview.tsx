"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, ExternalLink } from "lucide-react"
import type { CryptoCurrency } from "@/lib/crypto-api"

interface NewsItem {
  title: string
  description: string
  link: string
  pubDate: string
  image?: string
}

interface MarketOverviewProps {
  topCryptos: CryptoCurrency[]
  topGainers: CryptoCurrency[]
  topLosers: CryptoCurrency[]
  news: NewsItem[]
}

export default function MarketOverview({ topCryptos, topGainers, topLosers, news }: MarketOverviewProps) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Top Market Cap Cryptos */}
      {topCryptos.length > 0 && (
        <section>
          <h2 className="text-lg sm:text-xl font-bold text-black mb-3 sm:mb-4">Top Criptomoedas por Market Cap</h2>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {topCryptos.slice(0, isMobile ? 4 : 8).map((crypto) => (
              <Card key={crypto.id} className="border-gray-200 hover:shadow-md transition-shadow">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2 min-w-0">
                      <img
                        src={crypto.image || "/placeholder.svg?height=20&width=20"}
                        alt={crypto.name}
                        className="w-4 h-4 sm:w-6 sm:h-6 rounded-full flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="font-semibold text-black text-xs sm:text-sm truncate">
                          {crypto.symbol.toUpperCase()}
                        </div>
                        <div className="text-xs text-gray-600 truncate">{crypto.name}</div>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs flex-shrink-0">
                      #{crypto.market_cap_rank}
                    </Badge>
                  </div>

                  <div className="space-y-1">
                    <div className="text-sm sm:text-lg font-bold text-black">
                      $
                      {crypto.current_price.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: crypto.current_price < 1 ? 6 : 2,
                      })}
                    </div>
                    <div
                      className={`flex items-center text-xs sm:text-sm ${
                        crypto.price_change_percentage_24h >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {crypto.price_change_percentage_24h >= 0 ? (
                        <TrendingUp className="h-3 w-3 mr-1" />
                      ) : (
                        <TrendingDown className="h-3 w-3 mr-1" />
                      )}
                      {crypto.price_change_percentage_24h >= 0 ? "+" : ""}
                      {crypto.price_change_percentage_24h?.toFixed(2)}%
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Top Gainers and Losers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Top Gainers */}
        {topGainers.length > 0 && (
          <section>
            <h2 className="text-lg sm:text-xl font-bold text-black mb-3 sm:mb-4">Maiores Altas (24h)</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {topGainers.slice(0, isMobile ? 3 : 4).map((crypto) => (
                <Card key={crypto.id} className="border-gray-200 hover:shadow-md transition-shadow">
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2 min-w-0">
                        <img
                          src={crypto.image || "/placeholder.svg?height=20&width=20"}
                          alt={crypto.name}
                          className="w-4 h-4 sm:w-6 sm:h-6 rounded-full flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="font-semibold text-black text-xs sm:text-sm truncate">
                            {crypto.symbol.toUpperCase()}
                          </div>
                          <div className="text-xs text-gray-600 truncate">{crypto.name}</div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="text-sm sm:text-lg font-bold text-black">
                        $
                        {crypto.current_price.toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: crypto.current_price < 1 ? 6 : 2,
                        })}
                      </div>
                      <div className="flex items-center text-green-600 font-semibold text-xs sm:text-sm">
                        <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />+
                        {crypto.price_change_percentage_24h?.toFixed(2)}%
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Top Losers */}
        {topLosers.length > 0 && (
          <section>
            <h2 className="text-lg sm:text-xl font-bold text-black mb-3 sm:mb-4">Maiores Baixas (24h)</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {topLosers.slice(0, isMobile ? 3 : 4).map((crypto) => (
                <Card key={crypto.id} className="border-gray-200 hover:shadow-md transition-shadow">
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2 min-w-0">
                        <img
                          src={crypto.image || "/placeholder.svg?height=20&width=20"}
                          alt={crypto.name}
                          className="w-4 h-4 sm:w-6 sm:h-6 rounded-full flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="font-semibold text-black text-xs sm:text-sm truncate">
                            {crypto.symbol.toUpperCase()}
                          </div>
                          <div className="text-xs text-gray-600 truncate">{crypto.name}</div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="text-sm sm:text-lg font-bold text-black">
                        $
                        {crypto.current_price.toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: crypto.current_price < 1 ? 6 : 2,
                        })}
                      </div>
                      <div className="flex items-center text-red-600 font-semibold text-xs sm:text-sm">
                        <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        {crypto.price_change_percentage_24h?.toFixed(2)}%
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Crypto News */}
      {news.length > 0 && (
        <section>
          <h2 className="text-lg sm:text-xl font-bold text-black mb-3 sm:mb-4">Últimas Notícias</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {news.slice(0, isMobile ? 3 : 6).map((article, index) => (
              <Card key={index} className="border-gray-200 hover:shadow-md transition-shadow">
                <CardContent className="p-3 sm:p-4">
                  {article.image && (
                    <div className="mb-3">
                      <img
                        src={article.image || "/placeholder.svg"}
                        alt={article.title}
                        className="w-full h-24 sm:h-32 object-cover rounded-md"
                        onError={(e) => {
                          e.currentTarget.style.display = "none"
                        }}
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <h3 className="font-semibold text-black text-sm leading-tight line-clamp-2">{article.title}</h3>

                    <p className="text-xs text-gray-600 line-clamp-2 sm:line-clamp-3">{article.description}</p>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xs text-gray-500">
                        {new Date(article.pubDate).toLocaleDateString("pt-BR")}
                      </span>
                      <a
                        href={article.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-xs text-black hover:text-gray-600 transition-colors"
                      >
                        Ler mais
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
