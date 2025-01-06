import React, { createContext, useState, useContext, ReactNode } from 'react';

// Definimos el tipo de los valores que tendrá el contexto
interface StoreContextType {
  activeStore: { id: number; name: string } | null; // Tipo de la tienda activa
  setActiveStore: React.Dispatch<
    React.SetStateAction<{ id: number; name: string } | null>
  >;
}

// Creamos el contexto
const StoreContext = createContext<StoreContextType | undefined>(undefined);

// Proveedor del contexto
export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeStore, setActiveStore] = useState<{ id: number; name: string } | null>(null);

  return (
    <StoreContext.Provider value={{ activeStore, setActiveStore }}>
      {children}
    </StoreContext.Provider>
  );
};

// Hook para usar el contexto
export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore debe usarse dentro de un StoreProvider');
  }
  return context;
};
