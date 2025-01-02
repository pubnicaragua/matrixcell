import React, { useState } from "react";
import * as XLSX from "xlsx";

const ExportEquifax: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
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

  // Cargar archivo y convertir a JSON
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const binaryStr = e.target?.result as string;
      const workbook = XLSX.read(binaryStr, { type: "binary" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      // Agregar columnas faltantes y inicializar valores vacíos
      const formattedData = jsonData.map((row: any) => {
        const newRow: any = {};
        columns.forEach((col) => {
          newRow[col] = row[col] || ""; // Completa columnas faltantes con valores vacíos
        });
        return newRow;
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

  // Manejar cambios en las celdas de la tabla
  const handleCellChange = (
    rowIndex: number,
    columnKey: string,
    value: string
  ) => {
    const updatedData = [...data];
    updatedData[rowIndex][columnKey] = value;
    setData(updatedData);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Gestión de Macro Sicom</h2>

      {/* Cargar archivo */}
      <div style={{ marginBottom: "20px" }}>
        <label htmlFor="fileUpload">Cargar archivo `macro_sicom`:</label>
        <input
          id="fileUpload"
          type="file"
          accept=".xlsm, .xlsx"
          onChange={handleFileUpload}
        />
      </div>

      {/* Tabla de datos cargados */}
      {data.length > 0 && (
        <div style={{ marginBottom: "20px", overflowX: "auto" }}>
          <h3>Datos cargados</h3>
          <table
            border={1}
            cellPadding={5}
            style={{
              width: "100%",
              textAlign: "left",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {columns.map((col) => (
                    <td key={col}>
                      <input
                        type="text"
                        value={row[col]}
                        onChange={(e) =>
                          handleCellChange(rowIndex, col, e.target.value)
                        }
                        style={{
                          width: "100%",
                          border: "none",
                          outline: "none",
                        }}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

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
