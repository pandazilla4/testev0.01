"use client"

import { useState, useActionState } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Loader2, Plus } from "lucide-react"
import { addTransaction } from "@/lib/actions/transactions"
import type { CryptoCurrency } from "@/lib/crypto-api"
import CryptoSearch from "./crypto-search"

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
        "Adicionar Transação"
      )}
    </Button>
  )
}

interface AddTransactionFormProps {
  topCryptos: CryptoCurrency[]
}

export default function AddTransactionForm({ topCryptos }: AddTransactionFormProps) {
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoCurrency | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [state, formAction] = useActionState(addTransaction, null)

  const handleCryptoSelect = (crypto: CryptoCurrency) => {
    setSelectedCrypto(crypto)
  }

  const handleSubmit = async (formData: FormData) => {
    if (selectedCrypto) {
      formData.append("cryptoSymbol", selectedCrypto.symbol)
      formData.append("cryptoName", selectedCrypto.name)
    }
    await formAction(formData)
    if (state?.success) {
      setIsOpen(false)
      setSelectedCrypto(null)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-black hover:bg-gray-800 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Transação
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar Nova Transação</DialogTitle>
        </DialogHeader>

        <form action={handleSubmit} className="space-y-4">
          {state?.error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">{state.error}</div>
          )}

          {state?.success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded text-sm">
              {state.success}
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-medium text-black">Criptomoeda</label>
            {selectedCrypto ? (
              <div className="flex items-center justify-between p-3 border border-gray-300 rounded-md bg-gray-50">
                <div className="flex items-center space-x-3">
                  <img
                    src={selectedCrypto.image || "/placeholder.svg"}
                    alt={selectedCrypto.name}
                    className="w-6 h-6 rounded-full"
                  />
                  <div>
                    <div className="font-medium text-black">{selectedCrypto.name}</div>
                    <div className="text-sm text-gray-600">{selectedCrypto.symbol.toUpperCase()}</div>
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
              <CryptoSearch onSelect={handleCryptoSelect} topCryptos={topCryptos} />
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="amount" className="block text-sm font-medium text-black">
                Quantidade
              </label>
              <Input
                id="amount"
                name="amount"
                type="number"
                step="any"
                required
                className="border-gray-300 focus:border-black focus:ring-black"
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="pricePaid" className="block text-sm font-medium text-black">
                Preço Pago (USD)
              </label>
              <Input
                id="pricePaid"
                name="pricePaid"
                type="number"
                step="any"
                required
                className="border-gray-300 focus:border-black focus:ring-black"
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="comment" className="block text-sm font-medium text-black">
              Comentário (opcional)
            </label>
            <Textarea
              id="comment"
              name="comment"
              rows={3}
              className="border-gray-300 focus:border-black focus:ring-black"
              placeholder="Adicione uma nota sobre esta transação..."
            />
          </div>

          <SubmitButton />
        </form>
      </DialogContent>
    </Dialog>
  )
}
