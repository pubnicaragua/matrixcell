import React, { useState, useEffect } from "react";
import { FaSearch, FaTrash, FaEdit, FaCheckCircle, FaClock } from "react-icons/fa";
import supabase from "../api/supabase";

interface Invoice {
  id: number;
  numero: string;
  created_at: string;
  monto: number;
  estado: number;  // 1: Pendiente, 2: Pagada
  dispositivo_id?: number; // Campo de dispositivo asociado
}

interface Device {
  id: number;
  nombre: string;
}

const Invoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);  // Lista de dispositivos
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    // Fetch invoices
    const fetchInvoices = async () => {
      const { data, error } = await supabase
        .from('facturas')
        .select('id, numero, created_at, monto, estado, dispositivo_id');  // Obtener también 'estado' y 'dispositivo_id'

      if (error) {
        console.error("Error fetching invoices:", error);
      } else {
        setInvoices(data);
      }
    };

    // Fetch devices
    const fetchDevices = async () => {
      const { data, error } = await supabase
        .from('devices')
        .select('id, nombre'); // Obtener id y nombre de los dispositivos

      if (error) {
        console.error("Error fetching devices:", error);
      } else {
        setDevices(data);
      }
    };

    fetchInvoices();
    fetchDevices();
  }, []);

  useEffect(() => {
    const results = invoices.filter((invoice) =>
      invoice.numero.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredInvoices(results);
  }, [searchTerm, invoices]);

  const handleDelete = async (id: number) => {
    const { data, error } = await supabase
      .from('facturas')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Error deleting invoice:", error);
    } else {
      setInvoices(invoices.filter((invoice) => invoice.id !== id));
    }
  };

  const handleCreateInvoice = async (invoice: Invoice) => {
    const { data, error } = await supabase
      .from("facturas")
      .insert([invoice]);

    if (error) {
      console.error("Error creating invoice:", error);
    } else {
      if (data) {
        setInvoices([data[0], ...invoices]);
      }
    }
  };

  const handleMarkAsPaid = async (id: number) => {
    const { data, error } = await supabase
      .from('facturas')
      .update({ estado: 2 })  // Cambiar estado a "Pagada" (2)
      .eq('id', id);

    if (error) {
      console.error("Error updating invoice:", error);
    } else {
      // Actualizar el estado de la factura en la UI
      setInvoices(invoices.map((invoice) =>
        invoice.id === id ? { ...invoice, estado: 2 } : invoice
      ));
    }
  };

  const handleEdit = (invoice: Invoice) => {
    setEditingInvoice(invoice);
  };

  const handleSaveEdit = async () => {
    if (editingInvoice) {
      const { data, error } = await supabase
        .from('facturas')
        .update({
          numero: editingInvoice.numero,
          created_at: editingInvoice.created_at,
          monto: editingInvoice.monto,
          estado: editingInvoice.estado,
          dispositivo_id: editingInvoice.dispositivo_id,  // Guardar dispositivo asociado
        })
        .eq('id', editingInvoice.id);

      if (error) {
        console.error("Error updating invoice:", error);
      } else {
        setInvoices(invoices.map((invoice) =>
          invoice.id === editingInvoice.id ? editingInvoice : invoice
        ));
        setEditingInvoice(null); // Reset the editing state
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingInvoice(null); // Reset editing state
  };

  const paginatedInvoices = filteredInvoices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestión de Facturas</h1>

      {/* Search */}
      <div className="flex items-center space-x-2 mb-4">
        <FaSearch />
        <input
          type="text"
          placeholder="Buscar factura..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded-md p-2 w-full"
        />
      </div>

      {/* Table */}
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr>
            <th className="px-4 py-2 border-b">Número</th>
            <th className="px-4 py-2 border-b">Fecha</th>
            <th className="px-4 py-2 border-b">Monto</th>
            <th className="px-4 py-2 border-b">Estado</th>
            <th className="px-4 py-2 border-b">Dispositivo</th>
            <th className="px-4 py-2 border-b">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {paginatedInvoices.map((invoice) => (
            <tr key={invoice.id} className="border-t">
              <td className="px-4 py-2">{invoice.numero}</td>
              <td className="px-4 py-2">{invoice.created_at}</td>
              <td className="px-4 py-2">{invoice.monto}</td>
              <td className="px-4 py-2">
                {invoice.estado === 2 ? (
                  <><FaCheckCircle className="mr-2 text-green-500" /> Pagada</>
                ) : (
                  <><FaClock className="mr-2 text-yellow-500" /> Pendiente</>
                )}
              </td>
              <td className="px-4 py-2">
                {invoice.dispositivo_id ? devices.find(d => d.id === invoice.dispositivo_id)?.nombre : 'N/A'}
              </td>
              <td className="px-4 py-2">
                {invoice.estado === 1 && (
                  <button
                    onClick={() => handleMarkAsPaid(invoice.id)}
                    className="bg-green-500 text-white px-4 py-2 rounded-md text-xs mr-2"
                  >
                    Marcar como pagada
                  </button>
                )}
                <button
                  onClick={() => handleEdit(invoice)}
                  className="bg-orange-500 text-white px-4 py-2 rounded-md text-xs mr-2"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(invoice.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md text-xs"
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="mt-4">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className="px-3 py-1 mr-2 bg-blue-500 text-white rounded-md"
          >
            {page}
          </button>
        ))}
      </div>

      {/* Edit Modal */}
      {editingInvoice && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Editar Factura</h2>
            <form>
              <div className="mb-4">
                <label className="block mb-2">Número</label>
                <input
                  type="text"
                  value={editingInvoice.numero}
                  onChange={(e) => setEditingInvoice({ ...editingInvoice, numero: e.target.value })}
                  className="border border-gray-300 rounded-md p-2 w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Fecha</label>
                <input
                  type="date"
                  value={editingInvoice.created_at}
                  onChange={(e) => setEditingInvoice({ ...editingInvoice, created_at: e.target.value })}
                  className="border border-gray-300 rounded-md p-2 w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Monto</label>
                <input
                  type="number"
                  value={editingInvoice.monto}
                  onChange={(e) => setEditingInvoice({ ...editingInvoice, monto: Number(e.target.value) })}
                  className="border border-gray-300 rounded-md p-2 w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Dispositivo</label>
                <select
                  value={editingInvoice.dispositivo_id || ''}
                  onChange={(e) => setEditingInvoice({ ...editingInvoice, dispositivo_id: Number(e.target.value) })}
                  className="border border-gray-300 rounded-md p-2 w-full"
                >
                  <option value="">Seleccionar dispositivo</option>
                  {devices.map((device) => (
                    <option key={device.id} value={device.id}>
                      {device.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <button type="button" onClick={handleSaveEdit} className="bg-green-500 text-white px-4 py-2 rounded-md mr-2">Guardar cambios</button>
              <button type="button" onClick={handleCancelEdit} className="bg-gray-500 text-white px-4 py-2 rounded-md">Cancelar</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Invoices;
  