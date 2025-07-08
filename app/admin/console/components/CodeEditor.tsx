'use client'

import { useState } from 'react'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import CodeMirror from '@uiw/react-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { vscodeLight } from '@uiw/codemirror-theme-vscode'

const defaultCode = `thing.setPropertyWriteHandler("location", async (val) => {
  location = await val.value();
  console.log(\`Location updated to:\`, location);
  await locationcollection.updateOne(
    { _id: thingId },
    {
      $set: {
        "data.location.value": location,
        "data.location.lastModified": new Date(),
        deviceType: thing.title
      }
    },
    { upsert: true }
  );
});`

export function CodeEditor() {
  const [code, setCode] = useState(defaultCode)
  const [status, setStatus] = useState('')

  const guardarHandler = async () => {
    setStatus('A guardar...')
    try {
      const res = await fetch('/api/handlers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      })

      const data = await res.json()
      if (data.success) {
        setStatus('✅ Handler guardado com sucesso.')
      } else {
        setStatus(`❌ Erro: ${data.error || 'Desconhecido'}`)
      }
    } catch (err: any) {
      setStatus(`❌ Erro de rede: ${err.message}`)
    }
  }

  return (
    <Card className="rounded-xl shadow-sm border p-6">
      <CardHeader className="p-0 mb-4">
        <h3 className="text-lg font-semibold">Editor de Código</h3>
        <p className="text-sm text-muted-foreground">Escreve diretamente o handler JavaScript.</p>
      </CardHeader>

      <CardContent className="space-y-4">
        <Label className="block">Código</Label>
        <div className="h-[420px] overflow-hidden rounded-md">
          <CodeMirror
            value={code}
            height="100%"
            extensions={[javascript()]}
            theme={vscodeLight}
            onChange={(val) => setCode(val)}
          />
        </div>
        <Button className="mt-2" onClick={guardarHandler}>
          Guardar Handler
        </Button>
        {status && <p className="text-sm text-muted-foreground">{status}</p>}
      </CardContent>
    </Card>
  )
}
export default CodeEditor