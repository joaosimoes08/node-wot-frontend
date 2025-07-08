'use client'

import { useEffect, useState } from 'react'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { DownloadIcon } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'

export function ExportPage() {
  const [collections, setCollections] = useState<string[]>([])
  const [previewData, setPreviewData] = useState<Record<string, any>>({})
  const [format, setFormat] = useState<'json' | 'csv'>('json')

  useEffect(() => {
    async function fetchCollections() {
      try {
        const res = await fetch('/api/proxy?path=/api/db/collections', {
          headers: {
            'x-api-key': process.env.BACK_API_KEY!,
          },
        })
        const data = await res.json()
        setCollections(data || [])

        // Carrega o primeiro documento de cada coleção
        for (const name of data) {
          const resPreview = await fetch(`/api/proxy?path=/api/db/collections/${name}`, {
            headers: {
              'x-api-key': process.env.BACK_API_KEY!,
            },
          })
          const docs = await resPreview.json()
          if (docs?.length > 0) {
            setPreviewData((prev) => ({ ...prev, [name]: docs[0] }))
          }
        }
      } catch (err) {
        console.error('Erro ao buscar coleções:', err)
        toast.error('Erro ao buscar coleções.')
      }
    }

    fetchCollections()
  }, [])

  const download = async (collectionName: string, format: 'json' | 'csv') => {
    try {
      const res = await fetch(`/api/proxy?path=/api/db/collections/${collectionName}`, {
        headers: {
          'x-api-key': process.env.BACK_API_KEY!,
        },
      })
      const data = await res.json()
      let blob: Blob

      if (format === 'json') {
        blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      } else {
        const headers = Object.keys(data[0] || {})
        const csv = [
          headers.join(','),
          ...data.map((row: any) =>
            headers.map((h) => JSON.stringify(row[h] ?? '')).join(',')
          ),
        ].join('\n')
        blob = new Blob([csv], { type: 'text/csv' })
      }

      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${collectionName}.${format}`
      document.body.appendChild(link)
      link.click()
      link.remove()

      toast.success(`Exportação em ${format.toUpperCase()} concluída!`)
    } catch (err) {
      console.error('Erro ao exportar dados:', err)
      toast.error('Erro ao exportar dados.')
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Exportar Dados</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Collection</TableHead>
            <TableHead>Preview</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {collections.map((name) => (
            <TableRow key={name}>
              <TableCell className="font-medium">{name}</TableCell>
              <TableCell className="text-xs text-muted-foreground max-w-md truncate">
                {previewData[name] ? JSON.stringify(previewData[name], null, 0) : '...'}
              </TableCell>
              <TableCell>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="icon">
                      <DownloadIcon className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-48">
                    <div className="space-y-2">
                      <Select value={format} onValueChange={(val) => setFormat(val as 'json' | 'csv')}>
                        <SelectTrigger>
                          <SelectValue placeholder="Formato" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="json">JSON</SelectItem>
                          <SelectItem value="csv">CSV</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button onClick={() => download(name, format)} className="w-full" size="sm">
                        Download
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default ExportPage
