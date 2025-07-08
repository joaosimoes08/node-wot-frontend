'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Trash2, Plus } from 'lucide-react'

interface FormEntry {
  method: string
  href: string
}

export function GuiCommandBuilder() {
  const [template, setTemplate] = useState('')
  const [forms, setForms] = useState<FormEntry[]>([{ method: '', href: '' }])
  const [output, setOutput] = useState('')

  const updateForm = (index: number, field: keyof FormEntry, value: string) => {
    const updated = [...forms]
    updated[index][field] = value
    setForms(updated)
  }

  const addForm = () => {
    setForms([...forms, { method: '', href: '' }])
  }

  const removeForm = (index: number) => {
    if (forms.length === 1) return
    const updated = [...forms]
    updated.splice(index, 1)
    setForms(updated)
  }

    const gerarHandler = () => {
    const actionName = template || 'acaoCustom'
    const validForms = forms.filter(f => f.href && f.method)

    if (validForms.length === 0) {
        setOutput('// Nenhum form válido')
        return
    }

    const lines = validForms.map(f => {
        return `  await fetch("${f.href}", { method: "${f.method}" });`
    })

    const generatedCode =
        `thing.setActionHandler("${actionName}", async () => {\n` +
        lines.join('\n') +
        `\n});`

    setOutput(generatedCode)
    }

  return (
    <Card className="rounded-xl shadow-sm border p-6">
      <CardHeader className="p-0 mb-4">
        <h3 className="text-lg font-semibold">Criar Handler com Templates</h3>
        <p className="text-sm text-muted-foreground">Gere um handler com múltiplos forms.</p>
      </CardHeader>

      {/* CONTEÚDO FIXO E COMPACTO */}
      <CardContent className="grid grid-cols-2 gap-6 max-h-[620px] overflow-hidden">
        {/* FORMULÁRIO */}
        <div className="flex flex-col justify-between overflow-hidden pr-2">
          <div className="space-y-4">
            <div>
              <Label className="mb-1 block">Template de Ação</Label>
              <Select onValueChange={setTemplate}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleciona um template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ligar-led">Ligar LED</SelectItem>
                  <SelectItem value="desligar-led">Desligar LED</SelectItem>
                  <SelectItem value="reboot">Reiniciar Dispositivo</SelectItem>
                  <SelectItem value="custom">Personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Forms</Label>
              <div className="space-y-2 overflow-y-auto max-h-[250px] pr-1">
                {forms.map((form, index) => (
                  <div key={index} className="grid grid-cols-[1fr_110px_40px] gap-2 items-end">
                    <Input
                      placeholder="http://192.168.1.x/comando"
                      value={form.href}
                      onChange={(e) => updateForm(index, 'href', e.target.value)}
                    />
                    <Select
                      onValueChange={(val) => updateForm(index, 'method', val)}
                      value={form.method}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Método" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="POST">POST</SelectItem>
                        <SelectItem value="GET">GET</SelectItem>
                        <SelectItem value="PUT">PUT</SelectItem>
                        <SelectItem value="DELETE">DELETE</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeForm(index)}
                      disabled={forms.length === 1}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={addForm}
                disabled={forms.length >= 3}
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Form
              </Button>
            </div>
          </div>

          <Button onClick={gerarHandler} className="mt-4 w-fit">
            Gerar Handler
          </Button>
        </div>

        {/* PREVIEW */}
        <div className="flex flex-col h-full">
          <Label className="mb-1 block">Preview do Handler</Label>
          <Textarea
            className="font-mono text-sm resize-none h-full"
            value={output}
            readOnly
          />
        </div>
      </CardContent>
    </Card>
  )
}
export default GuiCommandBuilder