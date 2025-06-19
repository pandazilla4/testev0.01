"use client"

import { useState, useEffect, useActionState } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Calculator } from "lucide-react"
import { addTransactionWithCurrency } from "@/lib/actions/transactions"
import type { CryptoCurrency } from "@/lib/crypto-api"
import CryptoSuggestions from "./crypto-suggestions"

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending} className="w-full bg-black hover:bg-gray-800 text-white">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Adicionando...
        </>
      ) : (
        "Adicionar Aporte"
      )}
    </Button>
  )
}

interface SmartTransactionFormProps {
  topCryptos: CryptoCurrency[]
  usdBrlRate: number
}

export default function SmartTransactionForm({ topCryptos, usdBrlRate }: SmartTransactionFormProps) {
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoCurrency | null>(null)
  const [currency, setCurrency] = useState<"USD" | "BRL">("USD")
  const [investmentAmount, setInvestmentAmount] = useState("")
  const [cryptoAmount, setCryptoAmount] = useState("")
  const [pricePerUnit, setPricePerUnit] = useState("")
  const [state, formAction] = useActionState(addTransactionWithCurrency, null)

  // Auto-calculate when investment amount or crypto changes
  useEffect(() => {
    if (selectedCrypto && investmentAmount && !isNaN(Number.parseFloat(investmentAmount))) {
      const amount = Number.parseFloat(investmentAmount)
      let priceInUsd = selectedCrypto.current_price

      if (currency === "BRL") {
        priceInUsd = selectedCrypto.current_price * usdBrlRate
      }

      const calculatedCryptoAmount = amount / priceInUsd
      setCryptoAmount(calculatedCryptoAmount.toFixed(8))
      setPricePerUnit(priceInUsd.toFixed(2))
    }
  }, [selectedCrypto, investmentAmount, currency, usdBrlRate])

  // Recalculate investment amount when crypto amount changes
  const handleCryptoAmountChange = (value: string) => {
    setCryptoAmount(value)
    if (selectedCrypto && value && !isNaN(Number.parseFloat(value))) {
      const amount = Number.parseFloat(value)
      let priceInUsd = selectedCrypto.current_price

      if (currency === "BRL") {
        priceInUsd = selectedCrypto.current_price * usdBrlRate
      }

      const calculatedInvestmentAmount = amount * priceInUsd
      setInvestmentAmount(calculatedInvestmentAmount.toFixed(2))
      setPricePerUnit(priceInUsd.toFixed(2))
    }
  }

  const handleCryptoSelect = (crypto: CryptoCurrency) => {
    setSelectedCrypto(crypto)
    setInvestmentAmount("")
    setCryptoAmount("")
    setPricePerUnit("")
  }

  const handleSubmit = async (formData: FormData) => {
    if (selectedCrypto) {
      formData.append("cryptoSymbol", selectedCrypto.symbol)
      formData.append("cryptoName", selectedCrypto.name)
      formData.append("currency", currency)
      formData.append("usdBrlRate", usdBrlRate.toString())
    }
    await formAction(formData)
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calculator className="h-5 w-5 mr-2" />
          Novo Aporte Inteligente
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-6">
          {state?.error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">{state.error}</div>
          )}

          {state?.success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded text-sm">
              {state.success}
            </div>
          )}

          {/* Crypto Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-black">Criptomoeda</label>
            {selectedCrypto ? (
              <div className="flex items-center justify-between p-3 border border-gray-300 rounded-md bg-gray-50">
                <div className="flex items-center space-x-3">
                  <img
                    src={selectedCrypto.image || "/placeholder.svg"}
                    alt={selectedCrypto.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <div className="font-medium text-black">{selectedCrypto.name}</div>
                    <div className="text-sm text-gray-600">
                      {selectedCrypto.symbol.toUpperCase()} - $
                      {selectedCrypto.current_price.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 6,
                      })}
                    </div>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedCrypto(null)}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Alterar
                </Button>
              </div>
            ) : (
              <CryptoSuggestions onSelect={handleCryptoSelect} topCryptos={topCryptos} />
            )}
          </div>

          {selectedCrypto && (
            <>
              {/* Currency Selection */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-black">Moeda do Investimento</label>
                <Select value={currency} onValueChange={(value: "USD" | "BRL") => setCurrency(value)}>
                  <SelectTrigger className="border-gray-300 focus:border-black focus:ring-black">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">Dólar Americano (USD)</SelectItem>
                    <SelectItem value="BRL">Real Brasileiro (BRL)</SelectItem>
                  </SelectContent>
                </Select>
                {currency === "BRL" && (
                  <p className="text-xs text-gray-600">Taxa atual: R$ {usdBrlRate.toFixed(2)} por USD</p>
                )}
              </div>

              {/* Investment Amount */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="investmentAmount" className="block text-sm font-medium text-black">
                    Valor do Investimento ({currency})
                  </label>
                  <Input
                    id="investmentAmount"
                    type="number"
                    step="any"
                    value={investmentAmount}
                    onChange={(e) => setInvestmentAmount(e.target.value)}
                    className="border-gray-300 focus:border-black focus:ring-black"
                    placeholder={currency === "USD" ? "146.00" : "800.00"}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="cryptoAmount" className="block text-sm font-medium text-black">
                    Quantidade ({selectedCrypto.symbol.toUpperCase()})
                  </label>
                  <Input
                    id="cryptoAmount"
                    name="amount"
                    type="number"
                    step="any"
                    value={cryptoAmount}
                    onChange={(e) => handleCryptoAmountChange(e.target.value)}
                    className="border-gray-300 focus:border-black focus:ring-black"
                    placeholder="1.23456789"
                  />
                </div>
              </div>

              {/* Price Per Unit */}
              <div className="space-y-2">
                <label htmlFor="pricePerUnit" className="block text-sm font-medium text-black">
                  Preço por Unidade ({currency})
                </label>
                <Input
                  id="pricePerUnit"
                  name="pricePerUnit"
                  type="number"
                  step="any"
                  value={pricePerUnit}
                  onChange={(e) => setPricePerUnit(e.target.value)}
                  className="border-gray-300 focus:border-black focus:ring-black"
                  placeholder="118.50"
                />
                <p className="text-xs text-gray-600">
                  Você pode editar este valor caso tenha comprado por um preço diferente (P2P, outras exchanges, etc.)
                </p>
              </div>

              {/* Comment */}
              <div className="space-y-2">
                <label htmlFor="comment" className="block text-sm font-medium text-black">
                  Comentário (opcional)
                </label>
                <Textarea
                  id="comment"
                  name="comment"
                  rows={3}
                  className="border-gray-300 focus:border-black focus:ring-black"
                  placeholder="Ex: Compra via P2P, Binance, etc..."
                />
              </div>

              <SubmitButton />
            </>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
