import React, { useState } from "react";
import * as XLSX from "xlsx";
import api from "../axiosConfig"; // Asegúrate de que esta importación sea correcta

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
    "FRECUENCIA_PAGO", // Nueva columna para la frecuencia de pago
  ];

  const generateUniqueCode = (cedula: string): string => {
    const lastFiveDigits = cedula.slice(-5);
    const randomLetters = Array(3)
      .fill(null)
      .map(() => String.fromCharCode(65 + Math.floor(Math.random() * 26))) // Letras aleatorias
      .join("");
    return ${lastFiveDigits}${randomLetters};
  };

  const calculateFields = (client: any) => {
    const paymentInfo = paymentData.find(
      (item: any) =>
        String(item["CODIGO_ID_SUJETO"]).trim() ===
        String(client["CODIGO_ID_SUJETO"]).trim()
    );
  
    const valOperacion = parseFloat(client["VAL_OPERACION"]?.replace(/,/g, "")) || 0;
    let valAVencer = parseFloat(client["VAL_A_VENCER"]?.replace(/,/g, "")) || valOperacion;
  
    let creditTerm = 0;
    const creditTermStr = paymentInfo?.["PLAZO EN MESES"]?.toString().trim() || "";
    const paymentValue = paymentInfo?.["VALOR MENSUAL"]
      ? paymentInfo["VALOR MENSUAL"].toString().toUpperCase()
      : "";
  
    // Determinar frecuencia de pago
    const paymentFrequency =
      paymentValue.includes("SEMANAL") || paymentValue.includes("SEMANALES")
        ? "SEMANAL"
        : paymentValue
        ? "MENSUAL"
        : "N/A";
  
    // Validar y calcular el plazo en meses o semanas
    if (creditTermStr && !isNaN(parseInt(creditTermStr))) {
      creditTerm = parseInt(creditTermStr);
    } else {
      creditTerm = paymentFrequency === "SEMANAL" ? 12 : 1; // Predeterminado: 12 semanas o 1 mes
    }
  
    const startDate = new Date(client["FECHA_CONCESION"]);
    if (isNaN(startDate.getTime())) {
      return {
        ...client,
        FEC_CORTE_SALDO: "N/A",
        FRECUENCIA_PAGO: "N/A",
      };
    }
  
    // Calcular FEC_CORTE_SALDO
    let lastPaymentDate = new Date(startDate);
    if (paymentFrequency === "SEMANAL") {
      lastPaymentDate.setDate(lastPaymentDate.getDate() + creditTerm * 7);
    } else if (paymentFrequency === "MENSUAL") {
      lastPaymentDate.setMonth(lastPaymentDate.getMonth() + creditTerm);
    } else {
      lastPaymentDate = new Date(startDate);
      lastPaymentDate.setDate(lastPaymentDate.getDate() + 30); // Asumir un mes por defecto
    }
  
    const today = new Date();
    const daysOverdue =
      today > lastPaymentDate
        ? Math.floor((today.getTime() - lastPaymentDate.getTime()) / (1000 * 60 * 60 * 24))
        : 0;
  
    const nextPaymentDate = new Date(lastPaymentDate);
    if (paymentFrequency === "SEMANAL") {
      nextPaymentDate.setDate(nextPaymentDate.getDate() + 7); // Siguiente pago semanal
    } else if (paymentFrequency === "MENSUAL") {
      nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1); // Siguiente pago mensual
    }
  
    const operationNumber = generateUniqueCode(client["CODIGO_ID_SUJETO"]);
    const valVencido = valOperacion - valAVencer;
  
    return {
      ...client,
      "NUMERO DE OPERACION": operationNumber,
      VAL_A_VENCER: valAVencer.toFixed(2),
      VAL_VENCIDO: valVencido.toFixed(2),
      NUM_DIAS_VENCIDOS: ${daysOverdue} días,
      FEC_CORTE_SALDO: lastPaymentDate.toLocaleDateString("es-ES"),
      FRECUENCIA_PAGO: paymentFrequency,
      FECHA_DE_VENCIMIENTO: lastPaymentDate.toLocaleDateString("es-ES"),
      FECHA_SIG_VENCIMIENTO: nextPaymentDate.toLocaleDateString("es-ES"),
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

        return calculateFields(newRow);
      });

      setData(formattedData);
    };
    reader.readAsBinaryString(file);
  };

  const handlePaymentFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const binaryStr = e.target?.result as string;
      const workbook = XLSX.read(binaryStr, { type: "binary" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      setPaymentData(jsonData);
    };
    reader.readAsBinaryString(file);
  };

  const handleExport = () => {
    if (!data.length) {
      alert("No hay datos para exportar.");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Datos Exportados");

    XLSX.writeFile(workbook, fileName);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Gestión de Macro Sicom</h2>

      <div style={{ marginBottom: "20px" }}>
        <label htmlFor="paymentFileUpload">Cargar archivo de valores y pagos mensuales:</label>
        <input id="paymentFileUpload" type="file" accept=".xlsm, .xlsx" onChange={handlePaymentFileUpload} />
      </div>

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

export default ExportEquifax;