"use client"

import { useState, useActionState } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Loader2, Edit } from "lucide-react"
import { updateTransaction } from "@/lib/actions/transactions"

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending} className="w-full bg-black hover:bg-gray-800 text-white">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Atualizando...
        </>
      ) : (
        "Atualizar Aporte"
      )}
    </Button>
  )
}

interface EditTransactionDialogProps {
  transaction: {
    id: string
    crypto_symbol: string
    crypto_name: string
    amount: number
    price_paid: number
    comment?: string
  }
  usdBrlRate: number
}

export default function EditTransactionDialog({ transaction, usdBrlRate }: EditTransactionDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currency, setCurrency] = useState<"USD" | "BRL">("USD")
  const [state, formAction] = useActionState(updateTransaction, null)

  const handleSubmit = async (formData: FormData) => {
    formData.append("transactionId", transaction.id)
    formData.append("currency", currency)
    formData.append("usdBrlRate", usdBrlRate.toString())
    await formAction(formData)
    if (state?.success) {
      setIsOpen(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-50">
          <Edit className="h-3 w-3 mr-1" />
          Editar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Aporte</DialogTitle>
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
            <div className="p-3 border border-gray-300 rounded-md bg-gray-50">
              <div className="font-medium text-black">
                {transaction.crypto_name} ({transaction.crypto_symbol.toUpperCase()})
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-black">Moeda</label>
            <Select value={currency} onValueChange={(value: "USD" | "BRL") => setCurrency(value)}>
              <SelectTrigger className="border-gray-300 focus:border-black focus:ring-black">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">Dólar Americano (USD)</SelectItem>
                <SelectItem value="BRL">Real Brasileiro (BRL)</SelectItem>
              </SelectContent>
            </Select>
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
                defaultValue={transaction.amount}
                className="border-gray-300 focus:border-black focus:ring-black"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="pricePerUnit" className="block text-sm font-medium text-black">
                Preço por Unidade ({currency})
              </label>
              <Input
                id="pricePerUnit"
                name="pricePerUnit"
                type="number"
                step="any"
                required
                defaultValue={
                  currency === "USD" ? transaction.price_paid : (transaction.price_paid * usdBrlRate).toFixed(2)
                }
                className="border-gray-300 focus:border-black focus:ring-black"
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
              defaultValue={transaction.comment || ""}
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
