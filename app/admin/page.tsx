import { redirect } from "next/navigation"
import { getSession } from "@/lib/session"
import { createClient } from "@/lib/supabase/server"
import AdminDashboard from "@/components/admin-dashboard"

export default async function AdminPage() {
  const session = await getSession()

  if (!session || session.type !== "admin") {
    redirect("/admin/login")
  }

  const supabase = createClient()

  // Get current admin info
  const { data: currentAdmin } = await supabase.from("users").select("is_main_admin").eq("id", session.userId).single()

  // If not found in users table, check admins table
  let isMainAdmin = currentAdmin?.is_main_admin || false
  if (!currentAdmin) {
    const { data: adminData } = await supabase.from("admins").select("*").eq("id", session.userId).single()
    isMainAdmin = adminData?.username === "admin" // Backward compatibility
  }

  // Get access codes
  const { data: accessCodes } = await supabase
    .from("access_codes")
    .select("*")
    .order("created_at", { ascending: false })

  // Get users
  const { data: users } = await supabase.from("users").select("*").order("created_at", { ascending: false })

  // Get notifications
  const { data: notifications } = await supabase
    .from("notifications")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <AdminDashboard
      accessCodes={accessCodes || []}
      users={users || []}
      notifications={notifications || []}
      adminUsername={session.username}
      isMainAdmin={isMainAdmin}
    />
  )
}
