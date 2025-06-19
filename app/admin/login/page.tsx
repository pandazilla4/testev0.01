import Link from "next/link"
import AdminLoginForm from "@/components/admin-login-form"
import { ArrowLeft } from "lucide-react"

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex items-center justify-center min-h-screen px-4 py-12">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <Link
              href="/"
              className="inline-flex items-center text-sm text-gray-600 hover:text-black transition-colors mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para Home
            </Link>
          </div>

          <AdminLoginForm />

          <div className="text-center text-xs text-gray-500">
            <p>Acesso restrito apenas para administradores autorizados</p>
          </div>
        </div>
      </div>
    </div>
  )
}
