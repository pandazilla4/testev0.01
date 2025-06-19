import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { createClient } from "@/lib/supabase/server"
import { getTopCryptos, getCryptoPrices } from "@/lib/crypto-api"
import { fetchCryptoNews } from "@/lib/rss-parser"
import { getUsdBrlRate } from "@/lib/currency-api"
import DashboardClient from "@/components/dashboard-client"

export default async function DashboardPage() {
  const session = await getSession()

  if (!session || session.type !== "user") {
    redirect("/")
  }

  const supabase = createClient()

  // Get user transactions
  const { data: transactions } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", session.userId)
    .order("created_at", { ascending: false })

  // Get active notifications
  const { data: notifications } = await supabase
    .from("notifications")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(5)

  // Get user's access codes
  const { data: userCodes } = await supabase
    .from("access_codes")
    .select("*")
    .eq("created_by_user", session.userId)
    .order("created_at", { ascending: false })

  // Get user's codes count
  const { data: userData } = await supabase
    .from("users")
    .select("codes_created_count")
    .eq("id", session.userId)
    .single()

  // Get top cryptocurrencies, news, and exchange rate
  const [topCryptos, news, usdBrlRate] = await Promise.all([getTopCryptos(), fetchCryptoNews(), getUsdBrlRate()])

  // Get current prices for user's cryptocurrencies
  const uniqueCryptoNames = [...new Set(transactions?.map((t) => t.crypto_name.toLowerCase()) || [])]
  const cryptoPrices = await getCryptoPrices(uniqueCryptoNames)

  return (
    <DashboardClient
      session={session}
      transactions={transactions || []}
      notifications={notifications || []}
      topCryptos={topCryptos}
      news={news}
      cryptoPrices={cryptoPrices}
      usdBrlRate={usdBrlRate}
      userCodes={userCodes || []}
      codesCreatedCount={userData?.codes_created_count || 0}
    />
  )
}
