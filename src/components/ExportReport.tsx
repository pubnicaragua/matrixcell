import React from 'react';
import { utils, writeFile } from 'xlsx';
import { Client, Operation } from '../types';

interface ExportReportProps {
  clients: Client[];
  operations: Operation[];
}

const ExportReport: React.FC<ExportReportProps> = ({ clients, operations }) => {
  const generateExcel = () => {
    const reportData = clients.map((client) => {
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
      }));
    }).flat();

    const worksheet = utils.json_to_sheet(reportData);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, 'Reporte');
    writeFile(workbook, 'Reporte_Clientes_Operaciones.xlsx');
  };

  return (
    <button
      onClick={generateExcel}
      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
    >
      Exportar Reporte
    </button>
  );
};

export default ExportReport;
