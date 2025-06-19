"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { loginUser } from "@/lib/actions/auth"

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending} className="w-full bg-black hover:bg-gray-800 text-white">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Entrando...
        </>
      ) : (
        "Entrar"
      )}
    </Button>
  )
}

export default function LoginFormCustom() {
  const [state, formAction] = useActionState(loginUser, null)

  return (
    <Card className="w-full max-w-md border-gray-200">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-black">Fazer Login</CardTitle>
        <CardDescription className="text-gray-600">Entre com suas credenciais</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          {state?.error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">{state.error}</div>
          )}

          <div className="space-y-2">
            <label htmlFor="username" className="block text-sm font-medium text-black">
              Usuário
            </label>
            <Input
              id="username"
              name="username"
              type="text"
              required
              className="border-gray-300 focus:border-black focus:ring-black"
              placeholder="Seu nome de usuário"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-black">
              Senha
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              className="border-gray-300 focus:border-black focus:ring-black"
              placeholder="Sua senha"
            />
          </div>

          <SubmitButton />
        </form>
      </CardContent>
    </Card>
  )
}
