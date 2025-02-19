import type React from "react"

interface SearchFiltersProps {
  onSearch: (searchTerm: string) => void
}

const SearchFilters: React.FC<SearchFiltersProps> = ({ onSearch }) => {
  return (
    <div className="mb-4">
      <input
        type="text"
        onChange={(e) => onSearch(e.target.value)}
        placeholder="Buscar producto..."
        className="border rounded px-2 py-1 w-full"
      />
    </div>
  )
}

export default SearchFilters

