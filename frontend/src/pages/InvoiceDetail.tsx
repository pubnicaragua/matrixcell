import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const InvoiceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [invoice, setInvoice] = useState<{
    id: number;
    number: string;
    date: string;
    amount: number;
    status: string;
    description: string;
    client: string;
    payments: { date: string; amount: number }[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Simula una carga desde un API
    const fetchInvoiceDetail = async () => {
      try {
        const mockInvoice = {
          id: 1,
          number: "INV001",
          date: "2024-12-01",
          amount: 200,
          status: "Pending",
          description: "Factura por servicios de mantenimiento técnico.",
          client: "John Doe",
          payments: [
            { date: "2024-12-05", amount: 100 },
          ],
        };

        if (parseInt(id || "0") === mockInvoice.id) {
          setInvoice(mockInvoice);
        } else {
          setError("Factura no encontrada.");
        }
      } catch {
        setError("Ocurrió un error al cargar los detalles de la factura.");
      } finally {
        setLoading(false);
      }
    };

    fetchInvoiceDetail();
  }, [id]);

  const handleMarkAsPaid = () => {
    if (invoice) {
      setInvoice({ ...invoice, status: "Paid" });
      alert("La factura ha sido marcada como pagada.");
    }
  };

  if (loading) {
    return <p style={styles.loading}>Cargando detalles de la factura...</p>;
  }

  if (error) {
    return <p style={styles.error}>{error}</p>;
  }

  if (!invoice) {
    return <p style={styles.error}>Factura no disponible.</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={styles.title}>Detalles de la Factura</h1>
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Información de la Factura</h2>
        <p><strong>Número:</strong> {invoice.number}</p>
        <p><strong>Fecha:</strong> {invoice.date}</p>
        <p><strong>Cliente:</strong> {invoice.client}</p>
        <p><strong>Descripción:</strong> {invoice.description}</p>
        <p><strong>Monto Total:</strong> ${invoice.amount}</p>
        <p>
          <strong>Estado:</strong>{" "}
          <span style={{ color: invoice.status === "Paid" ? "green" : "red" }}>
            {invoice.status}
          </span>
        </p>
        {invoice.status === "Pending" && (
          <button style={styles.markAsPaidButton} onClick={handleMarkAsPaid}>
            Marcar como Pagada
          </button>
        )}
      </div>

      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Historial de Pagos</h2>
        {invoice.payments.length > 0 ? (
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.tableCell}>Fecha</th>
                <th style={styles.tableCell}>Monto</th>
              </tr>
            </thead>
            <tbody>
              {invoice.payments.map((payment, index) => (
                <tr key={index} className="table-row">
                <td style={styles.tableCell}>{payment.date}</td>
                <td style={styles.tableCell}>${payment.amount}</td>
              </tr>
              
              ))}
            </tbody>
          </table>
        ) : (
          <p>No hay pagos registrados.</p>
        )}
      </div>
    </div>
  );
};

const styles = {
  loading: {
    fontSize: "16px",
    textAlign: "center" as const,
    marginTop: "20px",
  },
  error: {
    fontSize: "16px",
    textAlign: "center" as const,
    color: "red",
    marginTop: "20px",
  },
  title: {
    fontFamily: "var(--font-primary)",
    color: "var(--color-primary)",
    marginBottom: "20px",
  },
  card: {
    marginTop: "20px",
    padding: "20px",
    background: "var(--color-white)",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  cardTitle: {
    fontFamily: "var(--font-primary)",
    color: "var(--color-secondary)",
    marginBottom: "10px",
  },
  markAsPaidButton: {
    marginTop: "10px",
    background: "var(--color-primary)",
    color: "var(--color-white)",
    padding: "10px 20px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse" as const,
    marginTop: "10px",
  },
  tableHeader: {
    background: "var(--color-secondary)",
    color: "var(--color-white)",
  },
  tableCell: {
    padding: "10px",
    textAlign: "left" as const,
    borderBottom: "1px solid var(--color-background)",
  },
  tableRow: {
    ":hover": {
      backgroundColor: "var(--color-background)",
    },
  },
};

export default InvoiceDetail;
