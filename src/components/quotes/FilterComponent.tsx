import type React from "react"
import { useState } from "react"
import { Input } from "../../components/ui/input"
import { Button } from "../../components/ui/button"
import { Search } from "lucide-react"

interface FilterComponentProps {
  onFilter: (clientName: string) => void
}

const FilterComponent: React.FC<FilterComponentProps> = ({ onFilter }) => {
  const [clientName, setClientName] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onFilter(clientName)
  }

  return (
    <form onSubmit={handleSubmit} className="flex space-x-2 mb-4">
      <Input
        type="text"
        placeholder="Buscar por nombre de cliente"
        value={clientName}
        onChange={(e) => setClientName(e.target.value)}
        className="flex-grow"
      />
      <Button type="submit">
        <Search className="mr-2 h-4 w-4" />
        Buscar
      </Button>
    </form>
  )
}

export default FilterComponent

