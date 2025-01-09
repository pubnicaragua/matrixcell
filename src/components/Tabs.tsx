import React from 'react';

interface TabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Tabs: React.FC<TabsProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="mb-4">
      <button onClick={() => setActiveTab('add-client')} className={`mr-2 px-4 py-2 ${activeTab === 'add-client' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Agregar Cliente</button>
      <button onClick={() => setActiveTab('add-operation')} className={`mr-2 px-4 py-2 ${activeTab === 'add-operation' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Agregar Operación</button>
      <button onClick={() => setActiveTab('client-list')} className={`mr-2 px-4 py-2 ${activeTab === 'client-list' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Lista de Clientes</button>
      <button onClick={() => setActiveTab('operation-list')} className={`px-4 py-2 ${activeTab === 'operation-list' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Lista de Operaciones</button>
      <button onClick={() => setActiveTab('send-invoice')} className={`px-4 py-2 ${activeTab === 'send-invoice' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Enviar Factura por correo</button>

    </div>
  );
};

export default Tabs;
