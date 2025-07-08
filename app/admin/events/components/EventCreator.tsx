'use client'

import { useState } from 'react'

export function EventCreator({ sensor }: { sensor: string }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [dataType, setDataType] = useState('string')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const newEvent = {
      name,
      description,
      data: { type: dataType },
    }

    console.log('Novo evento para adicionar à TD:', newEvent)

    // TODO: POST para /api/events
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm space-y-4">
      <h2 className="font-semibold text-lg">Criar Evento para Thing Description</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div className="flex flex-col space-y-1">
          <label htmlFor="name" className="font-medium text-gray-700">
            Nome do Evento
          </label>
          <input
            id="name"
            className="border p-2 rounded"
            placeholder="Ex: sensorFail"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col space-y-1">
          <label htmlFor="description" className="font-medium text-gray-700">
            Descrição do Evento
          </label>
          <input
            id="description"
            className="border p-2 rounded"
            placeholder="Descrição legível do evento"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col space-y-1">
          <label htmlFor="dataType" className="font-medium text-gray-700">
            Tipo de Dados
          </label>
          <select
            id="dataType"
            className="border p-2 rounded"
            value={dataType}
            onChange={(e) => setDataType(e.target.value)}
          >
            <option value="string">string</option>
            <option value="number">number</option>
            <option value="boolean">boolean</option>
            <option value="object">object</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        className="mt-2 bg-black text-white px-4 py-2 rounded text-sm hover:opacity-90"
      >
        Adicionar Evento à TD
      </button>
    </form>
  )
}
export default EventCreator