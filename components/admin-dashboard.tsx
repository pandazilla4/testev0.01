"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Loader2, Plus, Users, Key, Bell, LogOut, Shield, ShieldCheck } from "lucide-react"
import { createAccessCode, sendNotification, promoteToAdmin, removeAdmin } from "@/lib/actions/admin"
import { logout } from "@/lib/actions/auth"
import Link from "next/link"

function CreateCodeButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} className="bg-black hover:bg-gray-800 text-white">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
      Criar Código
    </Button>
  )
}

function SendNotificationButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} className="bg-black hover:bg-gray-800 text-white">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bell className="mr-2 h-4 w-4" />}
      Enviar Notificação
    </Button>
  )
}

interface AdminDashboardProps {
  accessCodes: any[]
  users: any[]
  notifications: any[]
  adminUsername: string
  isMainAdmin: boolean
}

export default function AdminDashboard({
  accessCodes,
  users,
  notifications,
  adminUsername,
  isMainAdmin,
}: AdminDashboardProps) {
  const [codeState, createCodeAction] = useActionState(createAccessCode, null)
  const [notificationState, sendNotificationAction] = useActionState(sendNotification, null)

  const handleAdminToggle = async (userId: string, isCurrentlyAdmin: boolean) => {
    if (isCurrentlyAdmin) {
      await removeAdmin(userId)
    } else {
      await promoteToAdmin(userId)
    }
    window.location.reload() // Refresh to show updated data
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center min-w-0">
              <h1 className="text-lg sm:text-2xl font-bold text-black truncate">Admin Dashboard</h1>
              <Badge variant="secondary" className="ml-2 sm:ml-3 text-xs">
                <span className="truncate max-w-20 sm:max-w-none">{adminUsername}</span>
              </Badge>
              {isMainAdmin && (
                <Badge className="ml-1 sm:ml-2 bg-yellow-100 text-yellow-800 text-xs">
                  <ShieldCheck className="h-3 w-3 mr-1" />
                  <span className="hidden sm:inline">Admin Principal</span>
                  <span className="sm:hidden">Principal</span>
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Link href="/comunicacao-interna">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-300 hover:bg-gray-50 text-xs sm:text-sm text-white bg-gray-700"
                >
                  <span className="hidden sm:inline">{"Arquibancada"}</span>
                  <span className="sm:hidden">Comunicação</span>
                </Button>
              </Link>
              <form action={logout}>
                <Button
                  variant="outline"
                  size="sm"
                  type="submit"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <LogOut className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Sair</span>
                </Button>
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Total de Usuários</CardTitle>
              <Users className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold">{users.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Administradores</CardTitle>
              <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold">{users.filter((u) => u.is_admin).length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Códigos Ativos</CardTitle>
              <Key className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold">
                {accessCodes.filter((code) => code.is_active && !code.used_by_user).length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Notificações Ativas</CardTitle>
              <Bell className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold">{notifications.filter((n) => n.is_active).length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="users" className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 text-xs sm:text-sm">
            <TabsTrigger value="users">Usuários</TabsTrigger>
            <TabsTrigger value="codes">Códigos</TabsTrigger>
            <TabsTrigger value="notifications">Notificações</TabsTrigger>
            <TabsTrigger value="user-codes">Códigos/Usuário</TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Gerenciar Usuários</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Promover usuários a administradores ou remover permissões
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 sm:space-y-4">
                  {users.map((user) => (
                    <div
                      key={user.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border border-gray-200 rounded-lg space-y-2 sm:space-y-0"
                    >
                      <div className="flex items-center space-x-3 sm:space-x-4 min-w-0">
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold flex flex-wrap items-center gap-1 sm:gap-2">
                            <span className="truncate">{user.username}</span>
                            {user.is_admin && (
                              <Badge className="bg-blue-100 text-blue-800 text-xs">
                                <Shield className="h-3 w-3 mr-1" />
                                Admin
                              </Badge>
                            )}
                            {user.is_main_admin && (
                              <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                                <ShieldCheck className="h-3 w-3 mr-1" />
                                Principal
                              </Badge>
                            )}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-600">
                            Cadastrado em: {new Date(user.created_at).toLocaleDateString("pt-BR")}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-600">
                            Códigos criados: {user.codes_created_count || 0}/3
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end space-x-3 sm:space-x-4">
                        <Badge className={user.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                          {user.is_active ? "Ativo" : "Inativo"}
                        </Badge>

                        {/* Admin Toggle - Only show if current user is main admin or if target is not main admin */}
                        {(isMainAdmin || !user.is_main_admin) && !user.is_main_admin && (
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`admin-${user.id}`}
                              checked={user.is_admin}
                              onCheckedChange={() => handleAdminToggle(user.id, user.is_admin)}
                            />
                            <label htmlFor={`admin-${user.id}`} className="text-xs sm:text-sm font-medium">
                              Administrador
                            </label>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Access Codes Tab */}
          <TabsContent value="codes" className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Criar Novo Código de Acesso</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Gere códigos para permitir que novos usuários se cadastrem
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form action={createCodeAction} className="space-y-4">
                  {codeState?.error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
                      {codeState.error}
                    </div>
                  )}
                  {codeState?.success && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded text-sm">
                      {codeState.success}
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
              </CardContent>
            </Card>

            {/* Access Codes List */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Códigos de Acesso</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 sm:space-y-4">
                  {accessCodes.map((code) => (
                    <div
                      key={code.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border border-gray-200 rounded-lg space-y-2 sm:space-y-0"
                    >
                      <div className="min-w-0">
                        <div className="font-mono text-sm sm:text-lg font-bold break-all">{code.code}</div>
                        <div className="text-xs sm:text-sm text-gray-600">
                          Criado em: {new Date(code.created_at).toLocaleDateString("pt-BR")}
                          {code.expires_at && (
                            <span className="block sm:inline sm:ml-2">
                              Expira em: {new Date(code.expires_at).toLocaleDateString("pt-BR")}
                            </span>
                          )}
                          {code.created_by_user && <span className="block sm:inline sm:ml-2">Criado por usuário</span>}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {code.used_by_user ? (
                          <Badge variant="secondary">Usado</Badge>
                        ) : code.is_active ? (
                          <Badge className="bg-green-100 text-green-800">Ativo</Badge>
                        ) : (
                          <Badge variant="destructive">Inativo</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Enviar Notificação</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Envie avisos para todos os usuários do sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form action={sendNotificationAction} className="space-y-4">
                  {notificationState?.error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
                      {notificationState.error}
                    </div>
                  )}
                  {notificationState?.success && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded text-sm">
                      {notificationState.success}
                    </div>
                  )}

                  <div className="space-y-2">
                    <label htmlFor="message" className="block text-sm font-medium text-black">
                      Mensagem
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      rows={4}
                      className="border-gray-300 focus:border-black focus:ring-black"
                      placeholder="Digite sua mensagem para todos os usuários..."
                    />
                  </div>

                  <SendNotificationButton />
                </form>
              </CardContent>
            </Card>

            {/* Notifications List */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Notificações Enviadas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 sm:space-y-4">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="p-3 sm:p-4 border border-gray-200 rounded-lg">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between space-y-2 sm:space-y-0">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm break-words">{notification.message}</p>
                          <p className="text-xs text-gray-600 mt-2">
                            Enviado em: {new Date(notification.created_at).toLocaleString("pt-BR")}
                          </p>
                        </div>
                        <Badge
                          className={
                            notification.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                          }
                        >
                          {notification.is_active ? "Ativa" : "Inativa"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* User Codes Tab */}
          <TabsContent value="user-codes">
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Códigos Criados por Usuários</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Visualizar códigos de acesso criados pelos usuários
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 sm:space-y-4">
                  {accessCodes
                    .filter((code) => code.created_by_user)
                    .map((code) => {
                      const creator = users.find((u) => u.id === code.created_by_user)
                      return (
                        <div
                          key={code.id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border border-gray-200 rounded-lg space-y-2 sm:space-y-0"
                        >
                          <div className="min-w-0">
                            <div className="font-mono text-sm sm:text-lg font-bold break-all">{code.code}</div>
                            <div className="text-xs sm:text-sm text-gray-600">
                              Criado por: <span className="font-medium">{creator?.username || "Usuário removido"}</span>
                              <span className="block sm:inline sm:ml-2">
                                em {new Date(code.created_at).toLocaleDateString("pt-BR")}
                              </span>
                              {code.expires_at && (
                                <span className="block sm:inline sm:ml-2">
                                  Expira em: {new Date(code.expires_at).toLocaleDateString("pt-BR")}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {code.used_by_user ? (
                              <Badge variant="secondary">Usado</Badge>
                            ) : code.is_active ? (
                              <Badge className="bg-green-100 text-green-800">Ativo</Badge>
                            ) : (
                              <Badge variant="destructive">Inativo</Badge>
                            )}
                          </div>
                        </div>
                      )
                    })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
