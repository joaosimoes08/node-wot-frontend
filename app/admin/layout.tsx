import { Sidebar } from "./components/Sidebar"
import { MobileSidebar } from "./components/MobileSidebar"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1">
        {/* Header mobile */}
        <div className="md:hidden p-4 border-b flex items-center">
          <MobileSidebar />
          <h1 className="ml-4 text-xl font-bold">Admin</h1>
        </div>
        <main className="p-4">{children}</main>
      </div>
    </div>
  )
}
