'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Activity,
  Cpu,
  Plug,
  Terminal,
  FileText,
  Database,
  Upload,
  Download,
  Settings,
  Users,
  Bell,
  Ticket,
} from "lucide-react"
import { useUser, UserButton, SignedIn } from "@clerk/nextjs"
import { cn } from "@/lib/utils"

const navSections = [
  {
    title: "Visão Geral",
    items: [
      { label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
      { label: "Histórico", icon: Activity, href: "/admin/history" },
      { label: "Eventos", icon: Ticket, href: "/admin/events" },
    ],
  },
  {
    title: "Dispositivos",
    items: [
      { label: "Dispositivos", icon: Cpu, href: "/admin/devices" },
      { label: "Comandos", icon: Plug, href: "/admin/commands" },
      { label: "Consola API", icon: Terminal, href: "/admin/console" },
    ],
  },
  {
    title: "Gestão de Dados",
    items: [
      { label: "TDs", icon: FileText, href: "/admin/tds" },
      { label: "Base de Dados", icon: Database, href: "/admin/db" },
      { label: "Importar", icon: Upload, href: "/admin/import" },
      { label: "Exportar", icon: Download, href: "/admin/export" },
    ],
  },
  {
    title: "Sistema",
    items: [
      { label: "Definições", icon: Settings, href: "/admin/settings" },
      { label: "Utilizadores", icon: Users, href: "/admin/users" },
      { label: "Notificações", icon: Bell, href: "/admin/alerts" },
    ],
  },
]

export function Sidebar({ isMobile = false }: { isMobile?: boolean }) {
  const pathname = usePathname()
  const { user } = useUser()

  return (
    <aside
      className={cn(
        "h-full w-full max-w-[250px] border-r bg-muted p-4 flex flex-col justify-between",
        !isMobile && "h-screen hidden md:flex"
      )}
    >
      <div>
        <div className="text-xl font-bold mb-6 pl-2">Admin Dashboard</div>

        <nav className="space-y-6">
          {navSections.map((section) => (
            <div key={section.title}>
              <p className="text-xs text-muted-foreground uppercase tracking-wide px-3 mb-2">
                {section.title}
              </p>
              <div className="space-y-1">
                {section.items.map(({ label, icon: Icon, href }) => (
                  <Link
                    key={label}
                    href={href}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-md hover:bg-primary/10 transition",
                      pathname === href ? "bg-primary/10 font-medium" : "text-muted-foreground"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{label}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </div>

      <SignedIn>
        <div className="flex items-center gap-2 p-2 border-t">
          <UserButton afterSignOutUrl="/" />
          <div className="text-sm">
            <p className="font-medium leading-none">{user?.fullName}</p>
            <p className="text-xs text-muted-foreground truncate max-w-[120px]">
              {user?.primaryEmailAddress?.emailAddress}
            </p>
          </div>
        </div>
      </SignedIn>
    </aside>
  )
}
export default Sidebar