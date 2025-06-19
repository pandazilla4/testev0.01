"use server"

import { createClient } from "@/lib/supabase/server"
import { getSession } from "@/lib/session"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function addTransactionWithCurrency(prevState: any, formData: FormData) {
  const session = await getSession()

  if (!session || session.type !== "user") {
    return { error: "Acesso negado" }
  }

  const cryptoSymbol = formData.get("cryptoSymbol") as string
  const cryptoName = formData.get("cryptoName") as string
  const amount = formData.get("amount") as string
  const pricePerUnit = formData.get("pricePerUnit") as string
  const currency = formData.get("currency") as string
  const comment = formData.get("comment") as string

  if (!cryptoSymbol || !cryptoName || !amount || !pricePerUnit || !currency) {
    return { error: "Todos os campos obrigatórios devem ser preenchidos" }
  }

  const supabase = createClient()

  // Convert price to USD if needed
  let priceInUsd = Number.parseFloat(pricePerUnit)
  if (currency === "BRL") {
    // This will be handled in the frontend with the exchange rate
    const usdBrlRate = Number.parseFloat(formData.get("usdBrlRate") as string) || 5.5
    priceInUsd = priceInUsd / usdBrlRate
  }

  const { error } = await supabase.from("transactions").insert({
    user_id: session.userId,
    crypto_symbol: cryptoSymbol.toUpperCase(),
    crypto_name: cryptoName,
    amount: Number.parseFloat(amount),
    price_paid: priceInUsd,
    comment: comment || null,
  })

  if (error) {
    console.error("Error adding transaction:", error)
    return { error: "Erro ao adicionar transação" }
  }

  revalidatePath("/dashboard")
  revalidatePath("/aportes")
  redirect("/dashboard")
}

export async function deleteTransaction(transactionId: string) {
  const session = await getSession()

  if (!session || session.type !== "user") {
    return { error: "Acesso negado" }
  }

  const supabase = createClient()

  const { error } = await supabase.from("transactions").delete().eq("id", transactionId).eq("user_id", session.userId)

  if (error) {
    return { error: "Erro ao deletar transação" }
  }

  revalidatePath("/dashboard")
  revalidatePath("/aportes")
  return { success: "Transação deletada com sucesso!" }
}

export async function updateTransaction(prevState: any, formData: FormData) {
  const session = await getSession()

  if (!session || session.type !== "user") {
    return { error: "Acesso negado" }
  }

  const transactionId = formData.get("transactionId") as string
  const amount = formData.get("amount") as string
  const pricePerUnit = formData.get("pricePerUnit") as string
  const currency = formData.get("currency") as string
  const comment = formData.get("comment") as string

  if (!transactionId || !amount || !pricePerUnit || !currency) {
    return { error: "Todos os campos obrigatórios devem ser preenchidos" }
  }

  const supabase = createClient()

  // Convert price to USD if needed
  let priceInUsd = Number.parseFloat(pricePerUnit)
  if (currency === "BRL") {
    const usdBrlRate = Number.parseFloat(formData.get("usdBrlRate") as string) || 5.5
    priceInUsd = priceInUsd / usdBrlRate
  }

  const { error } = await supabase
    .from("transactions")
    .update({
      amount: Number.parseFloat(amount),
      price_paid: priceInUsd,
      comment: comment || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", transactionId)
    .eq("user_id", session.userId)

  if (error) {
    return { error: "Erro ao atualizar transação" }
  }

  revalidatePath("/dashboard")
  revalidatePath("/aportes")
  return { success: "Transação atualizada com sucesso!" }
}
