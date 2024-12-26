import React, { useState, useEffect } from "react";
import { FaSearch, FaTrash, FaEdit, FaCheckCircle, FaClock } from "react-icons/fa";

interface Invoice {
  id: number;
  number: string;
  date: string;
  amount: number;
  status: "Paid" | "Pending";
}

const Invoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    // Simulated API call
    const fetchInvoices = async () => {
      const data: Invoice[] = [
        { id: 1, number: "INV001", date: "2024-12-01", amount: 200, status: "Pending" },
        { id: 2, number: "INV002", date: "2024-12-05", amount: 150, status: "Paid" },
        { id: 3, number: "INV003", date: "2024-12-10", amount: 300, status: "Pending" },
        { id: 4, number: "INV004", date: "2024-12-15", amount: 400, status: "Paid" },
        { id: 5, number: "INV005", date: "2024-12-20", amount: 250, status: "Pending" },
        { id: 6, number: "INV006", date: "2024-12-25", amount: 100, status: "Paid" },
        { id: 7, number: "INV007", date: "2024-12-30", amount: 350, status: "Pending" },
      ];
      setInvoices(data);
    };

    fetchInvoices();
  }, []);

  useEffect(() => {
    // Update filtered invoices whenever the search term or invoices change
    const results = invoices.filter((invoice) =>
      invoice.number.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredInvoices(results);
  }, [searchTerm, invoices]);

  const handleDelete = (id: number) => {
    setInvoices(invoices.filter((invoice) => invoice.id !== id));
  };

  const handleMarkAsPaid = (id: number) => {
    setInvoices(
      invoices.map((invoice) =>
        invoice.id === id ? { ...invoice, status: "Paid" } : invoice
      )
    );
  };

  const handleEdit = (invoice: Invoice) => {
    setEditingInvoice(invoice);
  };

  const handleSaveEdit = () => {
    if (editingInvoice) {
      setInvoices(
        invoices.map((invoice) =>
          invoice.id === editingInvoice.id ? editingInvoice : invoice
        )
      );
      setEditingInvoice(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingInvoice(null);
  };

  const paginatedInvoices = filteredInvoices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ fontFamily: "var(--font-primary)", color: "var(--color-primary)" }}>
        Gestión de Facturas
      </h1>

      {/* Search */}
      <div style={{ margin: "20px 0", display: "flex", alignItems: "center" }}>
        <FaSearch style={{ marginRight: "10px", color: "var(--color-secondary)" }} />
        <input
          type="text"
          placeholder="Buscar factura..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            width: "100%",
            maxWidth: "300px",
          }}
        />
      </div>

      {/* Table */}
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
        <thead>
          <tr style={{ background: "var(--color-secondary)", color: "var(--color-white)" }}>
            <th style={{ padding: "10px", textAlign: "left" }}>Número</th>
            <th style={{ padding: "10px", textAlign: "left" }}>Fecha</th>
            <th style={{ padding: "10px", textAlign: "left" }}>Monto</th>
            <th style={{ padding: "10px", textAlign: "left" }}>Estado</th>
            <th style={{ padding: "10px", textAlign: "left" }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {paginatedInvoices.map((invoice) => (
            <tr
              key={invoice.id}
              style={{ borderBottom: "1px solid var(--color-background)" }}
            >
              <td style={{ padding: "10px" }}>{invoice.number}</td>
              <td style={{ padding: "10px" }}>{invoice.date}</td>
              <td style={{ padding: "10px" }}>${invoice.amount}</td>
              <td
                style={{
                  padding: "10px",
                  color: invoice.status === "Paid" ? "green" : "orange",
                }}
              >
                {invoice.status === "Paid" ? (
                  <>
                    <FaCheckCircle style={{ marginRight: "5px" }} />
                    Pagada
                  </>
                ) : (
                  <>
                    <FaClock style={{ marginRight: "5px" }} />
                    Pendiente
                  </>
                )}
              </td>
              <td style={{ padding: "10px" }}>
                {invoice.status === "Pending" && (
                  <button
                    onClick={() => handleMarkAsPaid(invoice.id)}
                    style={{
                      background: "var(--color-primary)",
                      color: "var(--color-white)",
                      padding: "5px 10px",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      marginRight: "10px",
                    }}
                  >
                    Marcar como pagada
                  </button>
                )}
                <button
                  onClick={() => handleEdit(invoice)}
                  style={{
                    background: "var(--color-secondary)",
                    color: "var(--color-white)",
                    padding: "5px 10px",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    marginRight: "10px",
                  }}
                >
                  <FaEdit /> Editar
                </button>
                <button
                  onClick={() => handleDelete(invoice.id)}
                  style={{
                    background: "var(--color-danger)",
                    color: "var(--color-white)",
                    padding: "5px 10px",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  <FaTrash /> Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div style={{ marginTop: "20px", display: "flex", justifyContent: "center" }}>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            style={{
              background: page === currentPage ? "var(--color-secondary)" : "var(--color-primary)",
              color: "var(--color-white)",
              padding: "5px 10px",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              margin: "0 5px",
            }}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Edit Modal */}
      {editingInvoice && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              background: "var(--color-white)",
              padding: "20px",
              borderRadius: "8px",
              width: "400px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h2>Editar Factura</h2>
            <form>
              <div style={{ marginBottom: "15px" }}>
                <label>Número</label>
                <input
                  type="text"
                  value={editingInvoice.number}
                  onChange={(e) =>
                    setEditingInvoice({ ...editingInvoice, number: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                  }}
                />
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label>Fecha</label>
                <input
                  type="date"
                  value={editingInvoice.date}
                  onChange={(e) =>
                    setEditingInvoice({ ...editingInvoice, date: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                  }}
                />
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label>Monto</label>
                <input
                  type="number"
                  value={editingInvoice.amount}
                  onChange={(e) =>
                    setEditingInvoice({ ...editingInvoice, amount: Number(e.target.value) })
                  }
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                  }}
                />
              </div>
              <button
                type="button"
                onClick={handleSaveEdit}
                style={{
                  background: "var(--color-primary)",
                  color: "var(--color-white)",
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  marginRight: "10px",
                }}
              >
                Guardar
              </button>
              <button
                type="button"
                onClick={handleCancelEdit}
                style={{
                  background: "var(--color-danger)",
                  color: "var(--color-white)",
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Cancelar
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Invoices;
