import React, { useEffect, useState } from 'react';
import api from '../axiosConfig'; // Importar la configuración de axios

interface Invoice {
  id: number;
  amount: number | null;
  number: string;
  device_id: string;
  status: string;
  created_at: string;
}

const InvoicesView = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await api.get('/invoices');  // Llama a la API usando axiosConfig
        console.log(response.data);
        setInvoices(response.data);
      } catch (err: any) {
        setError(err.message || 'Error al obtener facturas');
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  const handleToggleStatus = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === 'Pendiente' ? 'Pagada' : 'Pendiente';
    try {
      const response = await api.put(`/invoices/${id}`, { status: newStatus });
      if (response.status === 200) {
        setInvoices((prevInvoices) =>
          prevInvoices.map((invoice) =>
            invoice.id === id ? { ...invoice, status: newStatus } : invoice
          )
        );
      } else {
        throw new Error(`Unexpected response status: ${response.status}`);
      }
    } catch (err: any) {
      setError(err.message || 'Error al actualizar el estado de la factura');
    }
  };

  const filteredInvoices = invoices.filter((invoice) =>
    invoice.number.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Lista de Facturas</h1>

      {error && <p className="text-red-500 text-center">{error}</p>}

      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar por número de factura"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg"
        />
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Cargando...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Número</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Monto</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">ID del Dispositivo</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Estado</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Fecha de Creación</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-800">{invoice.number}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {invoice.amount !== null ? `$${invoice.amount.toFixed(2)}` : 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">{invoice.device_id}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">{invoice.status}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {new Date(invoice.created_at).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    <button
                      onClick={() => handleToggleStatus(invoice.id, invoice.status)}
                      className={`px-4 py-2 rounded-lg text-white ${
                        invoice.status === 'Pendiente' ? 'bg-green-500' : 'bg-yellow-500'
                      } hover:opacity-90`}
                    >
                      {invoice.status === 'Pendiente' ? 'Marcar como Pagada' : 'Marcar como Pendiente'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default InvoicesView;
