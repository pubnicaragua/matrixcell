import React, { useState, useEffect } from "react";
import { FaSearch, FaTrash, FaEdit, FaCheckCircle, FaClock } from "react-icons/fa";
import { supabase } from "../api/supabase";

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
        .from('dispositivos')
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
    <div style={{ padding: "20px" }}>
      <h1>Gestión de Facturas</h1>

      {/* Search */}
      <div>
        <FaSearch /> 
        <input
          type="text"
          placeholder="Buscar factura..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table */}
      <table>
        <thead>
          <tr>
            <th>Número</th>
            <th>Fecha</th>
            <th>Monto</th>
            <th>Estado</th>
            <th>Dispositivo</th> {/* Nueva columna */}
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {paginatedInvoices.map((invoice) => (
            <tr key={invoice.id}>
              <td>{invoice.numero}</td>
              <td>{invoice.created_at}</td>
              <td>{invoice.monto}</td>
              <td>
                {invoice.estado === 2 ? (
                  <><FaCheckCircle style={{ marginRight: "5px" }} /> Pagada</>
                ) : (
                  <><FaClock style={{ marginRight: "5px" }} /> Pendiente</>
                )}
              </td>
              <td>{invoice.dispositivo_id ? devices.find(d => d.id === invoice.dispositivo_id)?.nombre : 'N/A'}</td> {/* Mostrar dispositivo asociado */}
              <td>
                {invoice.estado === 1 && (
                  <button 
                    onClick={() => handleMarkAsPaid(invoice.id)}
                    style={{
                      backgroundColor: "green",
                      color: "white",
                      fontSize: "12px",
                      padding: "5px 10px",
                      borderRadius: "4px",
                      cursor: "pointer",
                      marginRight: "5px"
                    }}
                  >
                    Marcar como pagada
                  </button>
                )}
                <button
                  onClick={() => handleEdit(invoice)}
                  style={{
                    backgroundColor: "#FF9800",
                    color: "white",
                    fontSize: "12px",
                    padding: "5px 10px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    marginRight: "5px"
                  }}
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(invoice.id)}
                  style={{
                    backgroundColor: "#F44336",
                    color: "white",
                    fontSize: "12px",
                    padding: "5px 10px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    marginRight: "5px"
                  }}
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button key={page} onClick={() => setCurrentPage(page)}>
            {page}
          </button>
        ))}
      </div>

      {/* Edit Modal */}
      {editingInvoice && (
        <div>
          <div>
            <h2>Editar Factura</h2>
            <form>
              <div>
                <label>Número</label>
                <input
                  type="text"
                  value={editingInvoice.numero}
                  onChange={(e) => setEditingInvoice({ ...editingInvoice, numero: e.target.value })}
                />
              </div>
              <div>
                <label>Fecha</label>
                <input
                  type="date"
                  value={editingInvoice.created_at}
                  onChange={(e) => setEditingInvoice({ ...editingInvoice, created_at: e.target.value })}
                />
              </div>
              <div>
                <label>Monto</label>
                <input
                  type="number"
                  value={editingInvoice.monto}
                  onChange={(e) => setEditingInvoice({ ...editingInvoice, monto: Number(e.target.value) })}
                />
              </div>
              <div>
                <label>Dispositivo</label>
                <select
                  value={editingInvoice.dispositivo_id || ''}
                  onChange={(e) => setEditingInvoice({ ...editingInvoice, dispositivo_id: Number(e.target.value) })}
                >
                  <option value="">Seleccionar dispositivo</option>
                  {devices.map((device) => (
                    <option key={device.id} value={device.id}>
                      {device.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <button type="button" onClick={handleSaveEdit}>Guardar cambios</button>
              <button type="button" onClick={handleCancelEdit}>Cancelar</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Invoices;
