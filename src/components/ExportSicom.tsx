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
    "VAL_VENCIDO", // Aquí agregamos la columna VAL_VENCIDO
    "VA_DEM_JUDICIAL",
    "VAL_CART_CASTIGADA",
    "NUM_DIAS_VENCIDOS",
    "FECHA_DE_VENCIMIENTO",
    "DEUDA_REFINANCIADA",
    "FECHA_SIG_VENCIMIENTO",
  ];

  // Función para generar un código único basado en la cédula
  const generateUniqueCode = (cedula: string): string => {
    const lastFiveDigits = cedula.slice(-5);
    const randomLetters = Array(3)
      .fill(null)
      .map(() => String.fromCharCode(65 + Math.floor(Math.random() * 26))) // Letras aleatorias
      .join("");
    return `${lastFiveDigits} ${randomLetters}`;
  };

  const excelDateToJSDate = (serial: number): string => {
    const utcDays = Math.floor(serial - 25569);
    const date = new Date(utcDays * 86400 * 1000);
    return date.toISOString().split("T")[0];
  };

  const calculateFields = (client: any) => {
    const paymentInfo = paymentData.find(
      (item: any) =>
        String(item["CODIGO_ID_SUJETO"]).trim() ===
        String(client["CODIGO_ID_SUJETO"]).trim()
    );

    if (!paymentInfo || !client["FECHA_CONCESION"]) return client;

    let creditTerm = 0;
    const creditTermStr = paymentInfo["PLAZO DEL CREDITO"]?.trim();

    // Determinar el plazo en meses
    if (creditTermStr?.includes("MESES")) {
      creditTerm = parseInt(creditTermStr.split(" ")[0]) || 0;
    } else if (creditTermStr?.includes("SEMANAL")) {
      const weeks = parseInt(creditTermStr.split(" ")[0]) || 0;
      creditTerm = Math.ceil(weeks / 4); // Aproximadamente 4 semanas por mes
    }

    const startDate = new Date(client["FECHA_CONCESION"]);
    if (isNaN(startDate.getTime())) return client;

    // Calcular fecha de vencimiento
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + creditTerm);

    const today = new Date();

    // Calcular días vencidos
    const daysOverdue =
      today > endDate
        ? Math.floor((today.getTime() - endDate.getTime()) / (1000 * 60 * 60 * 24))
        : 0;

    // Calcular siguiente vencimiento (sumar un plazo al final)
    const nextPaymentDate = new Date(endDate);
    nextPaymentDate.setMonth(nextPaymentDate.getMonth() + creditTerm);

    // Generar número de operación
    const operationNumber = generateUniqueCode(client["CODIGO_ID_SUJETO"]);

    // Validar y calcular valores
    const valOperacion = parseFloat(client["VAL_OPERACION"]?.replace(/,/g, "")) || 0;
    let valAVencer = parseFloat(client["VAL_A_VENCER"]?.replace(/,/g, "")) || 0;

    if (!valAVencer && valOperacion > 0) {
      valAVencer = valOperacion; // Asegurar valor inicial
    }

    const valVencido = valOperacion - valAVencer;

    return {
      ...client,
      "NUMERO DE OPERACION": operationNumber,
      VAL_A_VENCER: valAVencer.toFixed(2), // Devolver con formato
      VAL_VENCIDO: valVencido.toFixed(2), // Devolver con formato
      NUM_DIAS_VENCIDOS: `${daysOverdue} días`, // Días vencidos en formato texto
      FECHA_DE_VENCIMIENTO: endDate.toLocaleDateString("es-ES"), // Formato de fecha DD/MM/YYYY
      FECHA_SIG_VENCIMIENTO: nextPaymentDate.toLocaleDateString("es-ES"), // Siguiente vencimiento
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

    // Descargar archivo
    XLSX.writeFile(workbook, fileName);
  };


  const handleSendFile = () => {
    if (!file) {
      alert("No se ha cargado ningún archivo para exportar.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    api.post("/clients/insercion-consolidado", formData)
      .then((response) => {
        console.log("Respuesta del servidor:", response.data);
        alert("Archivo enviado exitosamente!");
      })
      .catch((error) => {
        console.error("Error al enviar el archivo:", error);
        alert("Hubo un error al enviar el archivo.");
      });
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
        <button onClick={handleSendFile} style={{ marginLeft: "10px" }}>
          Enviar Archivo
        </button>
        <button onClick={handleExport} style={{ marginLeft: "10px" }}>
          Exportar a Excel
        </button>
      </div>
    </div>
  );
};

export default ExportEquifax;
