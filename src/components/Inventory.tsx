import React, { useState } from "react";
import * as XLSX from "xlsx";

const InventoryManagement: React.FC = () => {
  const [data, setData] = useState<any[]>([]);  // Datos del archivo Excel
  const [fileName, setFileName] = useState("inventario_export.xlsx");  // Nombre del archivo de exportación

  // Función para manejar la carga del archivo Excel
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const binaryStr = e.target?.result as string;
      const workbook = XLSX.read(binaryStr, { type: "binary" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      // Almacenamos los datos cargados
      setData(jsonData);
    };
    reader.readAsBinaryString(file);
  };

  // Función para manejar el cambio en las celdas de la tabla
  const handleCellChange = (rowIndex: number, col: string, value: string) => {
    const newData = [...data];
    newData[rowIndex][col] = value;
    setData(newData);
  };

  // Función para exportar los datos a Excel
  const handleExportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data);  // Convertir los datos a una hoja de Excel
    const wb = XLSX.utils.book_new();  // Crear un nuevo libro
    XLSX.utils.book_append_sheet(wb, ws, "Inventario");  // Agregar la hoja al libro
    XLSX.writeFile(wb, fileName);  // Exportar el archivo con el nombre especificado
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Gestión de Inventario</h2>

      {/* Cargar archivo */}
      <div style={{ marginBottom: "20px" }}>
        <label htmlFor="fileUpload">Cargar archivo Excel:</label>
        <input
          id="fileUpload"
          type="file"
          accept=".xls, .xlsx"
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
                {Object.keys(data[0]).map((key) => (
                  <th key={key}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {Object.keys(row).map((col, colIndex) => (
                    <td key={colIndex}>
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
        <button onClick={handleExportToExcel} style={{ marginLeft: "10px" }}>
          Exportar a Excel
        </button>
      </div>
    </div>
  );
};

export default InventoryManagement;
