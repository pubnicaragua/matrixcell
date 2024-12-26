import React, { useState, useEffect } from "react";
import { Bar, Pie } from "react-chartjs-2";
import { FaDownload, FaFilter } from "react-icons/fa";

const Reports = () => {
  // Datos iniciales simulados
  const [dataBar, setDataBar] = useState({
    labels: ["Enero", "Febrero", "Marzo", "Abril"],
    datasets: [
      {
        label: "Ingresos ($)",
        data: [4000, 3000, 5000, 4500],
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
    ],
  });

  const [dataPie, setDataPie] = useState({
    labels: ["Pagadas", "Pendientes", "Canceladas"],
    datasets: [
      {
        label: "Facturas",
        data: [50, 30, 20],
        backgroundColor: ["#4caf50", "#f44336", "#9e9e9e"],
      },
    ],
  });

  const [tableData, setTableData] = useState([
    { month: "Enero", total: 4000, pending: 5, canceled: 1 },
    { month: "Febrero", total: 3000, pending: 3, canceled: 2 },
    { month: "Marzo", total: 5000, pending: 2, canceled: 0 },
    { month: "Abril", total: 4500, pending: 4, canceled: 1 },
  ]);

  const [filter, setFilter] = useState("");
  const [filteredData, setFilteredData] = useState(tableData);

  useEffect(() => {
    // Filtro en la tabla
    const results = tableData.filter((row) =>
      row.month.toLowerCase().includes(filter.toLowerCase())
    );
    setFilteredData(results);
  }, [filter, tableData]);

  const handleDownload = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Mes,Total,Pending,Canceladas"]
        .concat(filteredData.map((row) => `${row.month},${row.total},${row.pending},${row.canceled}`))
        .join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "reports.csv";
    link.click();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ fontFamily: "var(--font-primary)", color: "var(--color-primary)" }}>
        Reportes Financieros
      </h1>

      {/* Gráficos */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
        <div style={{ flex: 1, marginRight: "20px" }}>
          <h2 style={{ color: "var(--color-secondary)" }}>Ingresos Mensuales</h2>
          <Bar
            data={dataBar}
            options={{
              responsive: true,
              plugins: {
                legend: { display: true, position: "top" },
                title: { display: true, text: "Ingresos por Mes" },
              },
            }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <h2 style={{ color: "var(--color-secondary)" }}>Estado de Facturas</h2>
          <Pie
            data={dataPie}
            options={{
              responsive: true,
              plugins: {
                legend: { display: true, position: "right" },
                title: { display: true, text: "Distribución de Facturas" },
              },
            }}
          />
        </div>
      </div>

      {/* Filtros */}
      <div style={{ marginTop: "40px" }}>
        <h2 style={{ fontFamily: "var(--font-primary)", color: "var(--color-secondary)" }}>
          Detalle de Reportes
        </h2>
        <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
          <FaFilter style={{ marginRight: "10px", color: "var(--color-secondary)" }} />
          <input
            type="text"
            placeholder="Filtrar por mes..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              width: "100%",
              maxWidth: "300px",
            }}
          />
          <button
            onClick={handleDownload}
            style={{
              marginLeft: "20px",
              background: "var(--color-primary)",
              color: "var(--color-white)",
              padding: "10px 20px",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
            }}
          >
            <FaDownload style={{ marginRight: "10px" }} />
            Descargar CSV
          </button>
        </div>
      </div>

      {/* Tabla */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "20px",
        }}
      >
        <thead>
          <tr
            style={{
              background: "var(--color-secondary)",
              color: "var(--color-white)",
            }}
          >
            <th style={styles.tableHeader}>Mes</th>
            <th style={styles.tableHeader}>Total ($)</th>
            <th style={styles.tableHeader}>Pendientes</th>
            <th style={styles.tableHeader}>Canceladas</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((row, index) => (
                          <tr key={index} className="tableRow">
                          <td style={styles.tableCell}>{row.month}</td>
                          <td style={styles.tableCell}>{row.total}</td>
                          <td style={styles.tableCell}>{row.pending}</td>
                          <td style={styles.tableCell}>{row.canceled}</td>
                        </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  tableHeader: {
    padding: "10px",
    textAlign: "left" as "left",
    borderBottom: "2px solid var(--color-background)",
  },
  tableRow: {
    ":hover": { backgroundColor: "var(--color-lightgray)" },
  },
  tableCell: {
    padding: "10px",
    textAlign: "left" as "left",
    borderBottom: "1px solid var(--color-background)",
  },
};

export default Reports;
