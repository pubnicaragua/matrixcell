import React, { useState } from "react";
import * as XLSX from "xlsx";
import api from '../axiosConfig'; // Asegúrate de que esta importación sea correcta

const ExportEquifax: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [paymentData, setPaymentData] = useState<any[]>([]);
  const [fileName, setFileName] = useState("macro_sicom_export.xlsx");
  const [file, setFile] = useState<File | null>(null);

  const columns = [
    "COD_TIPO_ID",
    "CODIGO_ID_SUJETO",
    "NOMBRE_SUJETO",
    "DIRECCION",
    "CIUDAD",
    "TELEFONO",
    "FEC_CORTE_SALDO",
    "TIPO_DEUDOR",
    "NUMERO DE OPERACIÓN",
    "FECHA_CONCESION",
    "VAL_OPERACION",
    "VAL_A_VENCER",
    "VAL_VENCIDO",
    "VA_DEM_JUDICIAL",
    "VAL_CART_CASTIGADA",
    "NUM_DIAS_VENCIDOS",
    "FECHA_DE_VENCIMIENTO",
    "DEUDA_REFINANCIADA",
    "FECHA_SIG_VENCIMIENTO",
  ];

  const generateUniqueCode = (cedula: string): string => {
    const lastFiveDigits = cedula.slice(-5);
    const randomLetters = Array(3)
      .fill(null)
      .map(() => String.fromCharCode(65 + Math.floor(Math.random() * 26)))
      .join("");
    return `${lastFiveDigits} ${randomLetters}`;
  };

  const excelDateToJSDate = (serial: number): string => {
    const utcDays = Math.floor(serial - 25569);
    const date = new Date(utcDays * 86400 * 1000);
    return date.toISOString().split("T")[0];
  };

  const calculateFields = (client: any) => {
    const valOperacion = parseFloat(client["VAL_OPERACION"]) || 0;
    let valAVencer = parseFloat(client["VAL_A_VENCER"]) || 0;

    const valVencido = valOperacion - valAVencer;

    client["VAL_A_VENCER"] = valAVencer.toFixed(2);
    client["VAL_VENCIDO"] = valVencido.toFixed(2);

    const operationNumber = generateUniqueCode(client["CODIGO_ID_SUJETO"]);

    const startDate = new Date(client["FECHA_CONCESION"]);
    if (isNaN(startDate.getTime())) return client;

    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 12);

    const today = new Date();
    const daysOverdue = today > endDate ? Math.floor((today.getTime() - endDate.getTime()) / (1000 * 60 * 60 * 24)) : 0;

    const nextPaymentDate = new Date(startDate);
    nextPaymentDate.setDate(nextPaymentDate.getDate() + 30);

    return {
      ...client,
      "NUMERO DE OPERACION": operationNumber,
      NUM_DIAS_VENCIDOS: daysOverdue,
      FECHA_DE_VENCIMIENTO: endDate.toISOString().split("T")[0],
      FECHA_SIG_VENCIMIENTO: nextPaymentDate.toISOString().split("T")[0],
    };
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      const binaryStr = e.target?.result as string;
      const workbook = XLSX.read(binaryStr, { type: "binary" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: false });

      const formattedData = jsonData.map((row: any) => {
        const newRow: any = {};
        columns.forEach((col) => {
          newRow[col] = row[col] !== undefined ? row[col] : "";
        });

        if (typeof newRow["FECHA_CONCESION"] === "number") {
          newRow["FECHA_CONCESION"] = excelDateToJSDate(newRow["FECHA_CONCESION"]);
        }

        return calculateFields(newRow);
      });

      setData(formattedData);
    };
    reader.readAsBinaryString(file);
  };

  const handleExport = () => {
    if (!data.length) {
      alert("No hay datos para exportar.");
      return;
    }

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Datos Exportados");

    XLSX.writeFile(wb, fileName);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Gestión de Macro Sicom</h2>

      <div style={{ marginBottom: "20px" }}>
        <label htmlFor="fileUpload">Cargar archivo macro_sicom:</label>
        <input id="fileUpload" type="file" accept=".xlsm, .xlsx" onChange={handleFileUpload} />
      </div>

      <div>
        <label htmlFor="fileName">Nombre del archivo a exportar:</label>
        <input id="fileName" type="text" value={fileName} onChange={(e) => setFileName(e.target.value)} />
        <button onClick={handleExport} style={{ marginLeft: "10px" }}>
          Exportar a Excel
        </button>
      </div>
    </div>
  );
};

export default ExportEquifax;
