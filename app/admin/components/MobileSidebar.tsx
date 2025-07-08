'use client'

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { Sidebar } from "./Sidebar"

export function MobileSidebar() {
  return (
    <Sheet>
      <SheetTrigger className="md:hidden p-2">
        <Menu className="h-6 w-6" />
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-[250px]">
        <SheetHeader className="hidden">
          <SheetTitle className="hidden">Menu</SheetTitle>
        </SheetHeader>
        <Sidebar isMobile />
      </SheetContent>
    </Sheet>
  )
}
export default MobileSidebar