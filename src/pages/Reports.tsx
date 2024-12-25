import React from "react";
import { Bar, Pie } from "react-chartjs-2";

const Reports = () => {
  const dataBar = {
    labels: ["Enero", "Febrero", "Marzo", "Abril"],
    datasets: [
      {
        label: "Ingresos ($)",
        data: [4000, 3000, 5000, 4500],
        backgroundColor: "var(--color-primary)",
      },
    ],
  };

  const dataPie = {
    labels: ["Pagadas", "Pendientes", "Canceladas"],
    datasets: [
      {
        label: "Facturas",
        data: [50, 30, 20],
        backgroundColor: ["green", "red", "gray"],
      },
    ],
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ fontFamily: "var(--font-primary)", color: "var(--color-primary)" }}>Reportes</h1>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
        <div style={{ width: "45%" }}>
          <h2>Ingresos Mensuales</h2>
          <Bar data={dataBar} />
        </div>
        <div style={{ width: "45%" }}>
          <h2>Estado de Facturas</h2>
          <Pie data={dataPie} />
        </div>
      </div>
    </div>
  );
};

export default Reports;
