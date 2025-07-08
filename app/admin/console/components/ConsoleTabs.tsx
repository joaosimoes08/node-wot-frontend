'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import GuiCommandBuilder from './GuiCommandBuilder'
import CodeEditor from './CodeEditor'

export default function ConsoleTabs() {
  return (
    <Tabs defaultValue="gui" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="gui">Modo Visual</TabsTrigger>
        <TabsTrigger value="code">Modo Código</TabsTrigger>
      </TabsList>

      <TabsContent value="gui">
        <GuiCommandBuilder />
      </TabsContent>

      <TabsContent value="code">
        <CodeEditor />
      </TabsContent>
    </Tabs>
  )
}
