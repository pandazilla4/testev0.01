// CoinGecko API integration
const COINGECKO_BASE_URL = "https://api.coingecko.com/api/v3"

export interface CryptoCurrency {
  id: string
  symbol: string
  name: string
  current_price: number
  market_cap_rank: number
  price_change_percentage_24h: number
  image: string
}

export interface CryptoPrice {
  [key: string]: {
    usd: number
    usd_24h_change: number
  }
}

// Get top 200 cryptocurrencies
export async function getTopCryptos(): Promise<CryptoCurrency[]> {
  try {
    const response = await fetch(
      `${COINGECKO_BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=200&page=1&sparkline=false&price_change_percentage=24h`,
      { 
        next: { revalidate: 300 }, // Cache for 5 minutes
        headers: {
          'Accept': 'application/json',
        }
      }
    )

    if (!response.ok) {
      console.error("CoinGecko API error:", response.status, response.statusText)
      return []
    }

    const data = await response.json()
    return data || []
  } catch (error) {
    console.error("Error fetching crypto data:", error)
    return []
  }
}

// Get current prices for specific cryptocurrencies
export async function getCryptoPrices(cryptoIds: string[]): Promise<CryptoPrice> {
  if (cryptoIds.length === 0) return {}

  try {
    const ids = cryptoIds.join(",")
    const response = await fetch(
      `${COINGECKO_BASE_URL}/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`,
      { 
        next: { revalidate: 60 }, // Cache for 1 minute
        headers: {
          'Accept': 'application/json',
        }
      }
    )

    if (!response.ok) {
      console.error("CoinGecko price API error:", response.status, response.statusText)
      return {}
    }

    const data = await response.json()
    return data || {}
  } catch (error) {
    console.error("Error fetching crypto prices:", error)
    return {}
  }
}

// Search cryptocurrencies
export async function searchCryptos(query: string): Promise<CryptoCurrency[]> {
  if (!query || query.length < 2) return []

  try {
    const topCryptos = await getTopCryptos()
    return topCryptos.filter(
      (crypto) =>
        crypto.name.toLowerCase().includes(query.toLowerCase()) ||
        crypto.symbol.toLowerCase().includes(query.toLowerCase()),
    )
  } catch (error) {
    console.error("Error searching cryptos:", error)
    return []
  }
}
