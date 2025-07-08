'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

const placeholderCode = `thing.setPropertyWriteHandler("location", async (val) => {
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
  const [code, setCode] = useState(placeholderCode)

  return (
    <Card className="rounded-xl shadow-sm border min-h-[calc(100vh-80px)] flex flex-col">
      <CardHeader>
        <h3 className="text-lg font-semibold">Editor de Código</h3>
        <p className="text-sm text-muted-foreground">Escreve diretamente a definição do handler.</p>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col gap-4">
        <Label htmlFor="code">Código do Handler</Label>
        <Textarea
          id="code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          rows={20}
          className="font-mono text-sm flex-grow"
        />
        <div>
          <Button>Guardar Handler</Button>
        </div>
      </CardContent>
    </Card>
  )
}
export default CodeEditor