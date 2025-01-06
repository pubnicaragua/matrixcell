import React, { useState } from "react";
import * as XLSX from "xlsx";

const ExportEquifax: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [paymentData, setPaymentData] = useState<any[]>([]); // Datos de valores y pagos mensuales
  const [fileName, setFileName] = useState("macro_sicom_export.xlsx");

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

  // Función para convertir un número de Excel a fecha
  const excelDateToJSDate = (serial: number): string => {
    const utcDays = Math.floor(serial - 25569); // Restar 25569 para convertir a epoch time
    const date = new Date(utcDays * 86400 * 1000); // Multiplicar por los milisegundos en un día
    return date.toISOString().split("T")[0]; // Convertir a formato YYYY-MM-DD
  };

  // Generar un número de operación único basado en la cédula
  const generateUniqueCode = (cedula: any) => {
    const cedulaStr = String(cedula).trim(); // Convertir a cadena de texto y limpiar espacios
    const lastFiveDigits = cedulaStr.slice(-5); // Obtener los últimos 5 dígitos
    const randomLetters = Array(5)
      .fill(null)
      .map(() => String.fromCharCode(65 + Math.floor(Math.random() * 26))) // Letras aleatorias
      .join("");
    return `${lastFiveDigits}${randomLetters}`;
  };

  // Calcular valores automáticos
  const calculateFields = (client: any) => {
    const paymentInfo = paymentData.find(
      (item: any) => String(item["CODIGO_ID_SUJETO"]).trim() === String(client["CODIGO_ID_SUJETO"]).trim()
    );

    if (!paymentInfo || !client["FECHA_CONCESION"]) {
      return client;
    }

    const creditTerm = parseInt(paymentInfo["PLAZO DEL CREDITO"]?.split(" ")[0]) || 0; // Meses
    const startDate = new Date(client["FECHA_CONCESION"]);
    if (isNaN(startDate.getTime())) {
      console.error(`Fecha de concesión inválida: ${client["FECHA_CONCESION"]}`);
      return client;
    }

    // Calcular fecha de vencimiento
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + creditTerm);

    // Calcular número de días vencidos
    const today = new Date();
    const daysOverdue = today > endDate ? Math.floor((today.getTime() - endDate.getTime()) / (1000 * 60 * 60 * 24)) : 0;

    // Calcular fecha del siguiente vencimiento (30 días desde la concesión)
    const nextPaymentDate = new Date(startDate);
    nextPaymentDate.setDate(nextPaymentDate.getDate() + 30); // 30 días después de la fecha de concesión

    // Generar número de operación
    const operationNumber = generateUniqueCode(client["CODIGO_ID_SUJETO"]);

    return {
      ...client,
      "NUMERO DE OPERACIÓN": operationNumber,
      NUM_DIAS_VENCIDOS: daysOverdue,
      FECHA_DE_VENCIMIENTO: endDate.toISOString().split("T")[0], // Fecha en formato YYYY-MM-DD
      FECHA_SIG_VENCIMIENTO: nextPaymentDate.toISOString().split("T")[0], // Fecha del siguiente vencimiento
    };
  };

  // Cargar archivo de valores y pagos mensuales
  const handlePaymentFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const binaryStr = e.target?.result as string;
      const workbook = XLSX.read(binaryStr, { type: "binary" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      setPaymentData(jsonData); // Guardar los datos cargados
    };
    reader.readAsBinaryString(file);
  };

  // Cargar archivo macro_sicom
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const binaryStr = e.target?.result as string;
      const workbook = XLSX.read(binaryStr, { type: "binary" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: false });

      // Formatear los datos cargados
      const formattedData = jsonData.map((row: any) => {
        const newRow: any = {};
        columns.forEach((col) => {
          newRow[col] = row[col] !== undefined ? row[col] : ""; // Completar valores faltantes con ""
        });

        // Convertir fecha si es un número
        if (typeof newRow["FECHA_CONCESION"] === "number") {
          newRow["FECHA_CONCESION"] = excelDateToJSDate(newRow["FECHA_CONCESION"]);
        }

        // Calcular valores automáticos
        return calculateFields(newRow);
      });

      setData(formattedData);
    };
    reader.readAsBinaryString(file);
  };

  // Exportar archivo editado
  const handleExport = () => {
    if (!data.length) {
      alert("No hay datos para exportar");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Datos Exportados");

    XLSX.writeFile(workbook, fileName);
    alert("Archivo exportado exitosamente!");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Gestión de Macro Sicom</h2>

      {/* Cargar archivo de valores y pagos mensuales */}
      <div style={{ marginBottom: "20px" }}>
        <label htmlFor="paymentFileUpload">Cargar archivo de valores y pagos mensuales:</label>
        <input
          id="paymentFileUpload"
          type="file"
          accept=".xlsm, .xlsx"
          onChange={handlePaymentFileUpload}
        />
      </div>

      {/* Cargar archivo macro_sicom */}
      <div style={{ marginBottom: "20px" }}>
        <label htmlFor="fileUpload">Cargar archivo `macro_sicom`:</label>
        <input
          id="fileUpload"
          type="file"
          accept=".xlsm, .xlsx"
          onChange={handleFileUpload}
        />
      </div>

      {/* Exportar archivo */}
      <div>
        <label htmlFor="fileName">Nombre del archivo a exportar:</label>
        <input
          id="fileName"
          type="text"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
        />
        <button onClick={handleExport} style={{ marginLeft: "10px" }}>
          Exportar Archivo
        </button>
      </div>
    </div>
  );
};

export default ExportEquifax;
