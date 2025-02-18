import React from 'react';
import { utils, writeFile } from 'xlsx';
import { Client, Operation } from '../../types';
import { useState, useEffect } from 'react';

interface ExportReportProps {
  clients: Client[];
  operations: Operation[];
  stores: { id: number; name: string }[]; // ✅ Agregar stores
}


const ExportReport: React.FC<ExportReportProps> = ({ clients, operations, stores }) => {
  const [userRole, setUserRole] = useState<number>(0);
  const [userStore, setUserStore] = useState<number | null>(null);
  const [selectedStore, setSelectedStore] = useState<number | null>(null);


  useEffect(() => {
    const perfil = localStorage.getItem("perfil");
    if (perfil) {
      const parsedPerfil = JSON.parse(perfil);
      setUserRole(parsedPerfil.rol_id || 0);
      setUserStore(parsedPerfil.store_id || null);

      // ✅ Si el usuario NO es admin, forzar a que solo pueda ver su tienda
      if (parsedPerfil.rol_id !== 1) {
        setSelectedStore(parsedPerfil.store_id || null);
      }
    }
  }, []);


  const generateExcel = () => {
    let filteredClients = clients;

    if (userRole !== 1) {
      // ✅ Si NO es admin, debe exportar SOLO los clientes de su tienda asignada
      filteredClients = clients.filter(client => client.store_id === userStore);
    } else if (selectedStore) {
      // ✅ Si es admin y seleccionó una tienda, filtra por esa tienda
      filteredClients = clients.filter(client => client.store_id === selectedStore);
    }

    console.log("Clientes filtrados para exportación:", filteredClients); // ✅ Agregar este log para verificar

    if (filteredClients.length === 0) {
      alert("No hay datos para exportar.");
      return;
    }

    const reportData = filteredClients.map((client) => {
      const clientOperations = operations.filter(op => op.client_id === client.id);

      return clientOperations.map((operation) => ({
        COD_TIPO_ID: client.identity_type,
        CODIGO_ID_SUJETO: client.identity_number,
        NOMBRE_SUJETO: client.name,
        DIRECCION: client.address,
        CIUDAD: client.city,
        TELEFONO: client.phone,
        FEC_CORTE_SALDO: client.due_date,
        TIPO_DEUDOR: client.debt_type,
        FECHA_CONCESION: client.grant_date,
        VAL_OPERACION: operation.operation_value,
        VAL_A_VENCER: operation.amount_due,
        VAL_VENCIDO: operation.amount_paid,
        VA_DEM_JUDICIAL: operation.judicial_action ? 'Sí' : 'No',
        VAL_CART_CASTIGADA: operation.cart_value,
        NUM_DIAS_VENCIDOS: operation.days_overdue,
        FECHA_DE_VENCIMIENTO: operation.due_date,
        DEUDA_REFINANCIADA: operation.refinanced_debt,
        FECHA_SIG_VENCIMIENTO: operation.prox_due_date,
        PLAZO_EN_MESES: client.deadline,
        NUMERO_DE_OPERACION: operation.operation_number,
        TIENDA: stores?.find(store => store.id === client.store_id)?.name || "Desconocido"
      }));
    }).flat();

    const worksheet = utils.json_to_sheet(reportData);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, 'Reporte');
    writeFile(workbook, `Reporte_${selectedStore ? `Tienda_${selectedStore}` : 'General'}.xlsx`);
  };




  return (
    <div className="mb-4">
      {userRole === 1 && (
        <select
          value={selectedStore || ""}
          onChange={(e) => setSelectedStore(e.target.value ? Number(e.target.value) : null)}
          className="p-2 border rounded-lg mb-2"
        >
          <option value="">Todas las Tiendas</option>
          {stores.map(store => (
            <option key={store.id} value={store.id}>
              {store.name}
            </option>
          ))}
        </select>
      )}


      <button
        onClick={generateExcel}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Exportar Reporte Equifax
      </button>
    </div>
  );

};

export default ExportReport;
