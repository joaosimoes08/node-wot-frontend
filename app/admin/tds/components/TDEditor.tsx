'use client'

import { useEffect, useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { EditorView } from '@codemirror/view'
import CodeMirror from '@uiw/react-codemirror'
import { vscodeLight } from '@uiw/codemirror-theme-vscode'
import { json } from '@codemirror/lang-json'
import { Input } from '@/components/ui/input'

export function TDEditor() {
  const [tdList, setTdList] = useState<any[]>([])
  const [selectedTdId, setSelectedTdId] = useState('')
  const [tdContent, setTdContent] = useState('')
  const [originalContent, setOriginalContent] = useState('')
  const [newId, setNewId] = useState('')
  const [newTitle, setNewTitle] = useState('')
  const [showNew, setShowNew] = useState(false)

  const fetchTDs = async () => {
      try {
        const res = await fetch('/api/proxy?path=/api/db/collections/TDs')
        const data = await res.json()
        setTdList(data)
        if (data.length > 0) {
          const first = data[0]
          setSelectedTdId(first._id)
          setTdContent(JSON.stringify(first.thing, null, 2))
          setOriginalContent(JSON.stringify(first.thing, null, 2))
        }
      } catch (err) {
        toast.error('Erro ao obter TDs')
      }
  }
  useEffect(() => {
    fetchTDs()
  }, [])

  const handleSave = async () => {
    console.log("saving")
    try {
      const res = await fetch(`/api/proxy?path=/api/db/collections/TDs`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify([
          {
            _id: selectedTdId,
            title: tdList.find((t) => t._id === selectedTdId)?.title || '',
            thing: JSON.parse(tdContent)
          }
        ])
      })

      if (!res.ok) throw new Error()
      toast.success('TD atualizada com sucesso!')
      fetchTDs()
      setOriginalContent(tdContent)
    } catch (err) {
      toast.error('Erro ao guardar TD')
    }
  }

  const handleUndo = () => {
    setTdContent(originalContent)
    toast('Alterações revertidas.')
  }

  const handleChangeTd = (id: string) => {
    const selected = tdList.find((td) => td._id === id)
    setSelectedTdId(id)
    setTdContent(JSON.stringify(selected?.thing, null, 2))
    setOriginalContent(JSON.stringify(selected?.thing, null, 2))
  }

  const handleCreateNew = async () => {
    if (!newId || !newTitle) return toast.error('Preenche o ID e o título')
    const base = {
      '@context': 'https://www.w3.org/2019/wot/td/v1',
      id: newId,
      title: newTitle
    }

    const payload = [{
      _id: newId,
      title: newTitle,
      thing: base
    }]

    try {
      const res = await fetch(`/api/proxy?path=/api/db/collections/TDs`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      if (!res.ok) throw new Error()
      toast.success('TD criada com sucesso!')
      location.reload()
    } catch (err) {
      toast.error('Erro ao criar nova TD')
    }
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Selecionar Thing Description</h2>
        <Select value={selectedTdId} onValueChange={handleChangeTd}>
          <SelectTrigger className="w-[300px]">
            <SelectValue placeholder="Selecionar TD" />
          </SelectTrigger>
          <SelectContent>
            {tdList.map((td) => (
              <SelectItem key={td._id} value={td._id}>
                {td.thing.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="max-w-full overflow-x-auto border rounded-md">
        <CodeMirror
          value={tdContent}
          onChange={(val) => setTdContent(val)}
          extensions={[json()]}
          theme={vscodeLight}
          height="500px"
          style={{ fontSize: 14, minWidth: '1000px' }}
          basicSetup={{
            lineNumbers: true,
            highlightActiveLine: true
          }}
          editable
        />
      </div>

      <div className="flex gap-4 mt-4 flex-wrap">
        <Button onClick={handleSave}>Guardar</Button>
        <Button variant="secondary" onClick={handleUndo}>
          Reverter
        </Button>
        <Button variant="outline" onClick={() => setShowNew(!showNew)}>
          {showNew ? 'Cancelar' : 'Nova TD'}
        </Button>
      </div>

      {showNew && (
        <div className="flex flex-col gap-2 max-w-[600px] mt-6">
          <h3 className="text-md font-medium">Criar nova TD</h3>
          <div className="flex flex-row gap-4">
            <Input placeholder="ID da TD" value={newId} onChange={(e) => setNewId(e.target.value)} />
            <Input placeholder="Título da TD" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
            <Button onClick={handleCreateNew}>Criar</Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default TDEditor
