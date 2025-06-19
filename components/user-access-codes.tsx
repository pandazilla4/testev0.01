"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Plus, Key, Trash2 } from "lucide-react"
import { createUserAccessCode, deactivateAccessCode } from "@/lib/actions/admin"

function CreateCodeButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} className="bg-black hover:bg-gray-800 text-white">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
      Criar Código
    </Button>
  )
}

interface UserAccessCodesProps {
  userCodes: any[]
  codesCreatedCount: number
}

export default function UserAccessCodes({ userCodes, codesCreatedCount }: UserAccessCodesProps) {
  const [state, formAction] = useActionState(createUserAccessCode, null)

  const handleDeactivate = async (codeId: string) => {
    await deactivateAccessCode(codeId)
    window.location.reload()
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Key className="h-5 w-5 mr-2" />
            Meus Códigos de Acesso
          </CardTitle>
          <CardDescription>
            Você pode criar até 3 códigos de acesso para convidar outras pessoas. Códigos criados: {codesCreatedCount}
            /3
          </CardDescription>
        </CardHeader>
        <CardContent>
          {codesCreatedCount < 3 && (
            <form action={formAction} className="space-y-4 mb-6">
              {state?.error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
                  {state.error}
                </div>
              )}
              {state?.success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded text-sm">
                  {state.success}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="expiresAt" className="block text-sm font-medium text-black">
                    Data de Expiração (opcional)
                  </label>
                  <Input
                    id="expiresAt"
                    name="expiresAt"
                    type="datetime-local"
                    className="border-gray-300 focus:border-black focus:ring-black"
                  />
                </div>
                <div className="flex items-end">
                  <CreateCodeButton />
                </div>
              </div>
            </form>
          )}

          {codesCreatedCount >= 3 && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded text-sm mb-6">
              Você já criou o máximo de 3 códigos de acesso permitidos.
            </div>
          )}

          <div className="space-y-4">
            {userCodes.map((code) => (
              <div key={code.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <div className="font-mono text-lg font-bold">{code.code}</div>
                  <div className="text-sm text-gray-600">
                    Criado em: {new Date(code.created_at).toLocaleDateString("pt-BR")}
                    {code.expires_at && (
                      <span className="ml-2">| Expira em: {new Date(code.expires_at).toLocaleDateString("pt-BR")}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {code.used_by_user ? (
                    <Badge variant="secondary">Usado</Badge>
                  ) : code.is_active ? (
                    <>
                      <Badge className="bg-green-100 text-green-800">Ativo</Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeactivate(code.id)}
                        className="border-red-300 text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Desativar
                      </Button>
                    </>
                  ) : (
                    <Badge variant="destructive">Inativo</Badge>
                  )}
                </div>
              </div>
            ))}

            {userCodes.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Key className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Você ainda não criou nenhum código de acesso.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
