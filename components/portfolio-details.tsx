"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown } from "lucide-react"
import EditTransactionDialog from "./edit-transaction-dialog"
import DeleteTransactionDialog from "./delete-transaction-dialog"

interface Transaction {
  id: string
  crypto_symbol: string
  crypto_name: string
  amount: number
  price_paid: number
  comment?: string
  created_at: string
}

interface PortfolioDetailsProps {
  transactions: Transaction[]
  cryptoPrices: any
  usdBrlRate: number
}

export default function PortfolioDetails({ transactions, cryptoPrices, usdBrlRate }: PortfolioDetailsProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-black">Meus Aportes Detalhados</h2>
        <Badge variant="secondary">{transactions.length} transações</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Transações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transactions.map((transaction) => {
              const currentPrice = cryptoPrices[transaction.crypto_name.toLowerCase()]?.usd || 0
              const currentValue = transaction.amount * currentPrice
              const investedValue = transaction.amount * transaction.price_paid
              const pnl = currentValue - investedValue
              const pnlPercentage = investedValue > 0 ? (pnl / investedValue) * 100 : 0

              return (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div>
                        <div className="font-semibold text-black text-lg">
                          {transaction.amount} {transaction.crypto_symbol.toUpperCase()}
                        </div>
                        <div className="text-sm text-gray-600">{transaction.crypto_name}</div>
                      </div>
                    </div>

                    {transaction.comment && <p className="text-sm text-gray-600 mb-2">{transaction.comment}</p>}

                    <div className="flex items-center space-x-4 text-sm">
                      <span className="text-gray-600">
                        Comprado em: {new Date(transaction.created_at).toLocaleDateString("pt-BR")}
                      </span>
                      <span className="text-gray-600">Preço pago: ${transaction.price_paid.toFixed(2)}</span>
                      <span className="text-gray-600">Preço atual: ${currentPrice.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="text-right space-y-2">
                    <div className="text-lg font-bold">
                      <div className="text-gray-600 text-sm">Valor Investido</div>
                      <div>${investedValue.toFixed(2)}</div>
                    </div>
                    <div className="text-lg font-bold">
                      <div className="text-gray-600 text-sm">Valor Atual</div>
                      <div>${currentValue.toFixed(2)}</div>
                    </div>
                    <div
                      className={`text-lg font-bold flex items-center ${pnl >= 0 ? "text-green-600" : "text-red-600"}`}
                    >
                      {pnl >= 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                      <div>
                        {pnl >= 0 ? "+" : ""}${pnl.toFixed(2)}
                        <div className="text-sm">
                          ({pnl >= 0 ? "+" : ""}
                          {pnlPercentage.toFixed(2)}%)
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2 ml-4">
                    <EditTransactionDialog transaction={transaction} usdBrlRate={usdBrlRate} />
                    <DeleteTransactionDialog
                      transactionId={transaction.id}
                      cryptoName={transaction.crypto_name}
                      amount={transaction.amount}
                      cryptoSymbol={transaction.crypto_symbol}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
