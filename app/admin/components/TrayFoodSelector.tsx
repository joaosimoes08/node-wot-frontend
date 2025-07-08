'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Props {
  value?: string
  onChange: (value: string) => void
}

export function TrayFoodSelector({ value, onChange }: Props) {
  const options = ["Sopa", "Carne", "Peixe", "Vegetariano", "Sobremesa", "Outro"]

  return (
    <Select onValueChange={onChange} value={value}>
      <SelectTrigger className="mt-3 w-full">
        <SelectValue placeholder="Selecionar alimento..." />
      </SelectTrigger>
      <SelectContent>
        {options.map((opt) => (
          <SelectItem key={opt} value={opt}>
            {opt}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
export default TrayFoodSelector
