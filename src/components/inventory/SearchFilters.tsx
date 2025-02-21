import type React from "react"
import { Input } from "../ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"

interface SearchFiltersProps {
  onSearch: (searchTerm: string) => void
  onCategoryChange: (category: string) => void
  categories: { id: number; name: string }[]
}

const SearchFilters: React.FC<SearchFiltersProps> = ({ onSearch, onCategoryChange, categories }) => {
  return (
    <div className="flex space-x-4 mb-4">
      <Input
        type="text"
        onChange={(e) => onSearch(e.target.value)}
        placeholder="Buscar producto..."
        className="flex-grow"
      />
      <Select onValueChange={onCategoryChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Todas las categorías" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas las categorías</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.name}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export default SearchFilters

