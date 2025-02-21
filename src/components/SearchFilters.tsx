import type React from "react"

interface SearchFiltersProps {
  onSearch: (searchTerm: string) => void
  onCategoryChange: (category: string) => void;
  categories: { id: number; name: string }[];
}

const SearchFilters: React.FC<SearchFiltersProps> = ({ onSearch, onCategoryChange, categories }) => {
  return (
    <div className="mb-4">
      <input
        type="text"
        onChange={(e) => onSearch(e.target.value)}
        placeholder="Buscar producto..."
        className="border rounded px-2 py-1 w-full"
      />

      <select onChange={(e) => onCategoryChange(e.target.value)} className="border rounded px-2 py-1">
        <option value="">Todas las categorías</option>
        {categories.map((category) => (
          <option key={category.id} value={category.name}>
            {category.name}
          </option>
        ))}
      </select>
    </div>
  )
}

export default SearchFilters

