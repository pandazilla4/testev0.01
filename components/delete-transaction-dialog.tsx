"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Trash2, Loader2 } from "lucide-react"
import { deleteTransaction } from "@/lib/actions/transactions"

interface DeleteTransactionDialogProps {
  transactionId: string
  cryptoName: string
  amount: number
  cryptoSymbol: string
}

export default function DeleteTransactionDialog({
  transactionId,
  cryptoName,
  amount,
  cryptoSymbol,
}: DeleteTransactionDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteTransaction(transactionId)
      setIsOpen(false)
    } catch (error) {
      console.error("Error deleting transaction:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="border-red-300 text-red-700 hover:bg-red-50">
          <Trash2 className="h-3 w-3 mr-1" />
          Excluir
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirmar Exclusão</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-gray-600">Tem certeza que deseja excluir este aporte?</p>

          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="font-medium text-black">
              {amount} {cryptoSymbol.toUpperCase()}
            </div>
            <div className="text-sm text-gray-600">{cryptoName}</div>
          </div>

          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Excluindo...
                </>
              ) : (
                "Excluir"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
