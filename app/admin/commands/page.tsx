'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { toast } from 'sonner'

type TD = {
  _id: string
  thing: {
    actions?: {
      [key: string]: {
        description?: string
        forms: { op: string; href: string }[]
      }
    }
  }
}

type Command = {
  label: string
  desc: string
  value: string
  endpoint: string
  tdId?: string
}

const ITEMS_PER_PAGE = 9

export default function CommandsPage() {
  const [page, setPage] = useState(0)
  const [controllers, setControllers] = useState<TD[]>([])
  const [commands, setCommands] = useState<Command[]>([
    {
      label: 'Fechar buffet',
      desc: 'Fecha imediatamente o buffet.',
      value: 'closeBuffet',
      endpoint: ''
    },
    {
      label: 'Calibrar sensores',
      desc: 'Calibra os sensores do dispositivo.',
      value: 'calibrateSensors',
      endpoint: ''
    },
    {
      label: 'Abrir Buffet',
      desc: 'Abre imediatamente o buffet.',
      value: 'openBuffet',
      endpoint: ''
    },
  ])
  const [selectedControllers, setSelectedControllers] = useState<{ [key: number]: string }>({})

  const currentCommands = commands.slice(
    page * ITEMS_PER_PAGE,
    (page + 1) * ITEMS_PER_PAGE
  )

  useEffect(() => {
    const fetchControllers = async () => {
      try {
        const res = await fetch(`/api/proxy?path=/api/db/collections/TDs`)
        const data: TD[] = await res.json()
        setControllers(data)

        // Atualizar comandos com endpoints reais
        const updatedCommands = commands.map((cmd) => {
          for (const td of data) {
            const action = td.thing.actions?.[cmd.value]
            const form = action?.forms.find((f) => f.op === 'invokeaction')
            if (form) {
              return {
                ...cmd,
                endpoint: form.href,
                tdId: td._id
              }
            }
          }
          return cmd
        })

        setCommands(updatedCommands)
      } catch (error) {
        console.error('Erro ao buscar TDs:', error)
      }
    }

    fetchControllers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleExecute = async (index: number, command: Command) => {
    const selected = selectedControllers[index]

    const updatedUrl = command.endpoint.replace("192.168.137.248", "10.147.18.209");
    if (!selected) {
      toast.error('Seleciona um controlador primeiro.')
      return
    }

    if (selected !== command.tdId) {
      toast.error('Controlador não corresponde à ação selecionada.')
      return
    }

    if (!command.endpoint) {
      toast.error('Comando sem endpoint definido.')
      return
    }

    try {
      const encodedPath = encodeURIComponent(
        command.endpoint.replace(/^http?:\/\/[^/]+/, '')
      )

      const res = await fetch(`${updatedUrl}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!res.ok) throw new Error()

      toast.success(`Comando '${command.label}' enviado com sucesso!`)
    } catch (e) {
      toast.error(`Erro ao enviar comando '${command.label}'`)
    }
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Gestão de Comandos</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentCommands.map((command, idx) => {
          const globalIdx = page * ITEMS_PER_PAGE + idx
          return (
            <div
              key={globalIdx}
              className="rounded-xl border bg-white px-4 py-4 shadow-sm h-60 flex flex-col justify-between"
            >
              <div className="flex items-start gap-3">
                <div>
                  <h3 className="font-semibold leading-none">{command.label}</h3>
                  <p className="text-sm text-muted-foreground -mt-0.5">{command.desc}</p>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Select
                  onValueChange={(value) =>
                    setSelectedControllers((prev) => ({ ...prev, [globalIdx]: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar controlador" />
                  </SelectTrigger>
                  <SelectContent>
                    {controllers.map((td) => (
                      <SelectItem key={td._id} value={td._id}>
                        {td._id}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  className="w-full"
                  onClick={() => handleExecute(globalIdx, command)}
                >
                  Executar
                </Button>
              </div>

              <p className="text-xs text-muted-foreground mt-1">
                Ação imediata sobre o controlador selecionado.
              </p>
            </div>
          )
        })}
      </div>

      <div className="flex justify-center mt-4 -mb-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setPage((p) => Math.max(p - 1, 0))}
          className="mr-2"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setPage((p) =>
              Math.min(p + 1, Math.ceil(commands.length / ITEMS_PER_PAGE) - 1)
            )
          }
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}