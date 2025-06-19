// AwesomeAPI for USD/BRL conversion
interface ExchangeRate {
  USDBRL: {
    bid: string
    ask: string
    create_date: string
  }
}

export async function getUsdBrlRate(): Promise<number> {
  try {
    const response = await fetch("https://economia.awesomeapi.com.br/last/USD-BRL", {
      next: { revalidate: 300 }, // Cache for 5 minutes
    })

    if (!response.ok) {
      throw new Error("Failed to fetch exchange rate")
    }

    const data: ExchangeRate = await response.json()
    return Number.parseFloat(data.USDBRL.bid)
  } catch (error) {
    console.error("Error fetching USD/BRL rate:", error)
    return 5.5 // Fallback rate
  }
}

export function convertBrlToUsd(brlAmount: number, usdBrlRate: number): number {
  return brlAmount / usdBrlRate
}

export function convertUsdToBrl(usdAmount: number, usdBrlRate: number): number {
  return usdAmount * usdBrlRate
}
