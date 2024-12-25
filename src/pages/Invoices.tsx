import React, { useState, useEffect } from "react";

const Invoices = () => {
  const [invoices, setInvoices] = useState<
    { id: number; number: string; date: string; amount: number; status: string }[]
  >([]);

  useEffect(() => {
    // Simula la carga dinámica
    const fetchInvoices = async () => {
      const data = [
        { id: 1, number: "INV001", date: "2024-12-01", amount: 200, status: "Pending" },
        { id: 2, number: "INV002", date: "2024-12-10", amount: 150, status: "Paid" },
      ];
      setInvoices(data);
    };

    fetchInvoices();
  }, []);

  const handleMarkAsPaid = (id: number) => {
    setInvoices(
      invoices.map((invoice) =>
        invoice.id === id ? { ...invoice, status: "Paid" } : invoice
      )
    );
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ fontFamily: "var(--font-primary)", color: "var(--color-primary)" }}>
        Facturas
      </h1>
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
          {invoices.map((invoice) => (
            <tr key={invoice.id} style={{ borderBottom: "1px solid var(--color-background)" }}>
              <td style={{ padding: "10px" }}>{invoice.number}</td>
              <td style={{ padding: "10px" }}>{invoice.date}</td>
              <td style={{ padding: "10px" }}>${invoice.amount}</td>
              <td
                style={{
                  padding: "10px",
                  color: invoice.status === "Paid" ? "green" : "red",
                }}
              >
                {invoice.status}
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
                    }}
                  >
                    Marcar como pagada
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Invoices;
