import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { getTopCryptos } from "@/lib/crypto-api"
import { getUsdBrlRate } from "@/lib/currency-api"
import SmartTransactionForm from "@/components/smart-transaction-form"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default async function NovoAportePage() {
  const session = await getSession()

  if (!session || session.type !== "user") {
    redirect("/")
  }

  const [topCryptos, usdBrlRate] = await Promise.all([getTopCryptos(), getUsdBrlRate()])

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-sm text-gray-600 hover:text-black transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao Dashboard
          </Link>
        </div>

        <SmartTransactionForm topCryptos={topCryptos} usdBrlRate={usdBrlRate} />
      </div>
    </div>
  )
}
