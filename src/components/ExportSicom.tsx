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
  
    if (creditTermStr?.includes("MESES")) {
      creditTerm = parseInt(creditTermStr.split(" ")[0]) || 0;
    } else if (creditTermStr?.includes("SEMANAL")) {
      const weeks = parseInt(creditTermStr.split(" ")[0]) || 0;
      creditTerm = Math.ceil(weeks / 4);
    }
  
    const startDate = new Date(client["FECHA_CONCESION"]);
    if (isNaN(startDate.getTime())) return client;
  
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + creditTerm);
  
    const today = new Date();
    const daysOverdue =
      today > endDate
        ? Math.floor((today.getTime() - endDate.getTime()) / (1000 * 60 * 60 * 24))
        : 0;
  
    const nextPaymentDate = new Date(startDate);
    nextPaymentDate.setDate(nextPaymentDate.getDate() + 30);
  
    const operationNumber = generateUniqueCode(client["CODIGO_ID_SUJETO"]);
  
    // Validar y calcular valores
    const valOperacion = parseFloat(client["VAL_OPERACION"]?.replace(/,/g, "")) || 0;
    let valAVencer = parseFloat(client["VAL_A_VENCER"]?.replace(/,/g, "")) || 0;
    const valVencido = valOperacion - valAVencer;
  
    if (isNaN(valOperacion) || isNaN(valAVencer)) {
      console.error("Datos inválidos en el cliente:", client);
      return client;
    }
  
    if (!valAVencer && valOperacion > 0) {
      valAVencer = valOperacion;
    }
  
    return {
      ...client,
      "NUMERO DE OPERACION": operationNumber,
      NUM_DIAS_VENCIDOS: daysOverdue,
      FECHA_DE_VENCIMIENTO: endDate.toISOString().split("T")[0],
      FECHA_SIG_VENCIMIENTO: nextPaymentDate.toISOString().split("T")[0],
      VAL_VENCIDO: valVencido.toFixed(2),
      VAL_A_VENCER: valAVencer.toFixed(2),
    };
  };

  const compareFiles = () => {
    return data.map((client) => {
      const paymentInfo = paymentData.find(
        (item) => String(item["CODIGO_ID_SUJETO"]).trim() === String(client["CODIGO_ID_SUJETO"]).trim()
      );
      
      if (!paymentInfo) {
        return {
          ...client,
          error: "No se encontró información de pago para este cliente",
        };
      }

      // Realizar más comparaciones o validaciones aquí si es necesario

      return client;
    });
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

    const verifiedData = compareFiles();  // Verificación de los datos comparados
    const ws = XLSX.utils.json_to_sheet(verifiedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Datos Exportados");

    // Descargar el archivo con el nombre configurado
    XLSX.writeFile(wb, fileName);
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
