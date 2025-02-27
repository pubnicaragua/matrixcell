"use client"

import type React from "react"
import { Search } from "lucide-react"
import type { FilterConfig } from "./types"

interface SearchFiltersProps {
  filters: FilterConfig
  onFilterChange: (filters: FilterConfig) => void
  onResetFilters: () => void
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({ filters, onFilterChange, onResetFilters }) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({
      ...filters,
      searchTerm: e.target.value,
    })
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({
      ...filters,
      paymentDate: e.target.value,
    })
  }

  return (
    <div className="mb-6">
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        {/* Buscador */}
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar por cliente, operación, recibo o tienda..."
            value={filters.searchTerm}
            onChange={handleSearchChange}
            className="pl-10 pr-4 py-2 w-full border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Filtro de fecha */}
        <div className="flex flex-col md:flex-row gap-2">
          <div className="flex flex-col">
            <label htmlFor="paymentDate" className="text-sm text-gray-600 mb-1">
              Fecha de pago
            </label>
            <input
              id="paymentDate"
              type="date"
              value={filters.paymentDate}
              onChange={handleDateChange}
              className="p-2 border rounded-md"
            />
          </div>
        </div>
      </div>

      {/* Botón de limpiar filtros */}
      <div className="flex flex-wrap justify-between">
        <button onClick={onResetFilters} className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
          Limpiar Filtros
        </button>
      </div>
    </div>
  )
}

