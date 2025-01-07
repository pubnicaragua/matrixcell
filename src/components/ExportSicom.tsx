import React, { useState } from "react";
import * as XLSX from "xlsx"; // Importación corregida
import api from '../axiosConfig' // Asegúrate de que esta importación sea correcta

const ExportEquifax: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [paymentData, setPaymentData] = useState<any[]>([]); // Datos de valores y pagos mensuales
  const [fileName, setFileName] = useState("macro_sicom_export.xlsx");
  const [file, setFile] = useState<File | null>(null); // Agregar estado para almacenar el archivo cargado

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

  // Función para generar un código único basado en la cédula (Ejemplo simple)
  const generateUniqueCode = (cedula: string): string => {
    return `COD_${cedula}`; // Agregar un prefijo para hacerlo único
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Guardamos el archivo en el estado
    setFile(file);

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

  // Función para manejar el cambio de valor en las celdas
  const handleCellChange = (rowIndex: number, col: string, value: string) => {
    const newData = [...data];
    newData[rowIndex][col] = value;
    setData(newData);
  };

  const handleExport = () => {
    if (!file) {
      alert("No se ha cargado ningún archivo para exportar.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file); // Agregamos el archivo al FormData

    console.log("Enviando archivo...", file);

    // Usando axios para enviar el archivo
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
        <label htmlFor="fileUpload">Cargar archivo macro_sicom:</label>
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
          Enviar Archivo
        </button>
      </div>
    </div>
  );
};

export default ExportEquifax;
