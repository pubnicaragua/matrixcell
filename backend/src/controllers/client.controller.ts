import { Request, Response } from "express";
import { BaseService } from "../services/base.service";
import { Client } from "../models/client.model";
import { ClientResource } from "../resources/client.resource";
import { validateClient } from "../requests/clients.request";
import { Operation } from "../models/operation.model";
import PDFDocument from 'pdfkit-table';
import { Buffer } from 'buffer';
import supabase from "../config/supabaseClient";
const tableName = 'clients'; // Nombre de la tabla en la base de datos
import * as XLSX from 'xlsx';

export const ClientController = {
    async getAllClients(req: Request, res: Response) {
        try {
            const where = { ...req.query }; // Convertir los parámetros de consulta en filtros
            const clients = await BaseService.getAll<Client>(tableName, ['id', 'identity_number', 'identity_type', 'name', 'address', 'phone', 'email', 'city', 'due_date', 'deubt_type', 'operation_number', 'status', 'category', 'created_at'], where);
           
            res.json(ClientResource.formatClients(clients));
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    },

    async createClient(req: Request, res: Response) {
        try {
            validateClient(req.body); // Validar los datos
            const { userId } = req;
            const client = await BaseService.create<Client>(tableName, req.body, userId);
            res.status(201).json(ClientResource.formatClient(client));
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    },

    async updateClient(req: Request, res: Response) {
        try {
            const { id } = req.params;
            validateClient(req.body); // Validar los datos
            const { userId } = req;
            const client = await BaseService.update<Client>(tableName, parseInt(id), req.body, userId);
            res.json(ClientResource.formatClient(client));
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    },

    async deleteClient(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { userId } = req;

            await BaseService.delete<Client>(tableName, id, userId);
            res.json({ message: 'Client eliminada correctamente' });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    },
    async generateEquifaxReport(req: Request, res: Response) {
        // Define el nombre de las tablas (asegúrate de que sean válidas)
        const clientsTableName = 'clients';
        const operationsTableName = 'operations';
        const clients = await BaseService.getAll<Client>(clientsTableName, ['id', 'identity_number', 'identity_type', 'name', 'address', 'phone', 'city', 'due_date', 'deubt_type', 'created_at']);
        const operations = await BaseService.getAll<Operation>(operationsTableName, ['id', 'operation_number', 'operation_date', 'due_date', 'amount_due', 'amount_paid', 'days_overdue', 'status', 'judicial_action', 'created_at', 'updated_at']);
        // Procesar datos y generar archivo
        // Procesar datos y preparar información para el reporte
        const data = clients.map(client => {
            const clientOperations = operations.filter(op => op.client_id === client.id);
            return {
                id: client.id,
                name: client.name,
                operations: clientOperations.length,
                total_due: clientOperations.reduce((sum, op) => sum + op.amount_due, 0),
            };
        });
        const columns = ['id', 'name', 'operations', 'total_due']
        // Crear documento PDF
        const doc = new PDFDocument({
            size: 'letter',
            layout: 'landscape', // Orientación horizontal
        });
        const buffers: Buffer[] = [];

        // Configurar el documento para que se guarde en un buffer en memoria
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
            const pdfData = Buffer.concat(buffers);
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=report.pdf');
            res.send(pdfData);
        });


        // Agregar título al PDF
        doc
            .fontSize(18)
            .text(`Reporte de la tabla: ${tableName}`, { align: 'center' })
            .moveDown(1);

        // Preparar datos para la tabla
        const tableData = {
            headers: columns.map((col) => col.toUpperCase()),
            rows: data.map((row: any) => columns.map((col) => row[col] ?? 'N/A'))
        };
        // Agregar la tabla al documento
        await doc.table(tableData, {
            prepareHeader: () => doc.fontSize(12).fillColor('black'),
            prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
                // Asegurarse de que indexRow no sea undefined
                const rowColor = (indexRow !== undefined && indexRow % 2 === 0) ? 'gray' : 'black';
                doc.fontSize(10).fillColor(rowColor);
                return doc; // Aseguramos que la función devuelva el documento
            }
        });
        // Finalizar el documento
        doc.end();
    },
    async consolidadoEquifax(req: Request, res: Response) {
        try {
            if (!req.file) {
                throw new Error('Archivo no encontrado.');
            }
    
            type ExcelData = {
                CODIGO_ID_SUJETO: string;
                NOMBRE_SUJETO: string;
                DIRECCION: string;
                CIUDAD: string;
                TELEFONO: string;
                FEC_CORTE_SALDO: string | Date;
                TIPO_DEUDOR: string;
                NUMERO_DE_OPERACION: string;
                FECHA_CONCESION: string | Date;
                VAL_OPERACION: number;
                VAL_A_VENCER: number;
                VAL_VENCIDO: number;
                VA_DEM_JUDICIAL: number;
                VAL_CART_CASTIGADA: number;
                NUM_DIAS_VENCIDOS: number;
                FECHA_DE_VENCIMIENTO: string | Date;
                DEUDA_REFINANCIADA: number;
                FECHA_SIG_VENCIMIENTO: string | Date;
            };
    
            const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
            const sheetName = workbook.SheetNames[0];
            const sheetData: ExcelData[] = XLSX.utils.sheet_to_json<ExcelData>(workbook.Sheets[sheetName]);
    
            if (sheetData.length === 0) {
                 res.status(400).json({ error: 'El archivo está vacío.' });
            }
    
            for (const row of sheetData) {
                // Inserta cliente en la tabla `clients`
                const client = {
                    identity_number: row.CODIGO_ID_SUJETO,
                    name: row.NOMBRE_SUJETO,
                    address: row.DIRECCION,
                    city: row.CIUDAD,
                    phone: row.TELEFONO,
                    debt_type: row.TIPO_DEUDOR,
                    created_at: new Date(),
                };
    
                const { data: clientData, error: clientError } = await supabase
                    .from('clients')
                    .insert(client)
                    .select()
                    .single();
    
                if (clientError) throw new Error(`Error al insertar cliente: ${clientError.message}`);
    
                // Relaciona la operación con el cliente
                const operation = {
                    operation_number: row.NUMERO_DE_OPERACION == '' ? null:row.NUMERO_DE_OPERACION,
                    operation_date: row.FECHA_CONCESION == '' ? null:row.FECHA_CONCESION,
                    operation_value: row.VAL_OPERACION == 0 ? null:row.VAL_OPERACION,
                    amount_due: row.VAL_A_VENCER,
                    amount_paid: row.VAL_VENCIDO,
                    judicial_action: row.VA_DEM_JUDICIAL > 0,
                    cart_value: row.VAL_CART_CASTIGADA,
                    days_overdue: row.NUM_DIAS_VENCIDOS,
                    due_date: row.FECHA_DE_VENCIMIENTO == '' ? null:row.FECHA_CONCESION,
                    refinanced_date: row.DEUDA_REFINANCIADA,
                    prox_due_date: row.FECHA_SIG_VENCIMIENTO,
                    client_id: clientData.id, // Relación con el cliente insertado
                    created_at: new Date(),
                };
    
                console.log(operation)
                const { error: operationError } = await supabase.from('operations').insert(operation);
                if (operationError) throw new Error(`Error al insertar operación: ${operationError.message}`);
    
                // Relaciona el estado con el cliente
                const status = {
                    total_operations: 1,
                    total_due: row.VAL_A_VENCER,
                    total_overdue: row.NUM_DIAS_VENCIDOS > 0 ? row.VAL_VENCIDO : 0,
                    judicial_operations: row.VA_DEM_JUDICIAL > 0 ? 1 : 0,
                    client_id: clientData.id, // Relación con el cliente insertado
                    created_at: new Date(),
                };
    
                console.log(status)
                const { error: statusError } = await supabase.from('statuses').insert(status);
                
                if (statusError) throw new Error(`Error al insertar estado: ${statusError.message}`);
            }
    
            res.status(200).json({ message: 'Datos procesados e insertados con éxito.' });
        } catch (error: any) {
            console.error('Error al procesar el archivo Excel:', error);
            res.status(500).json({ error: 'Error interno del servidor.', details: error.message });
        }
    }
    
}
