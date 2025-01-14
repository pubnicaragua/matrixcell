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
import { extractFirstNumber } from "../services/client.service";
import { number, string } from "joi";
import { identity } from "lodash";

export const ClientController = {
    async getAllClients(req: Request, res: Response) {
        try {
            const where = { ...req.query }; // Convertir los parámetros de consulta en filtros
            const clients = await BaseService.getAll<Client>(tableName, ['id', 'identity_number', 'identity_type', 'name', 'address', 'phone', 'city', 'due_date', 'debt_type', 'grant_date', 'deadline', 'created_at'], where);

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
            const { data, error } = await supabase.from('operations').delete().eq('client_id', id);
            const { data:dataDevices, error:errorDevices } = await supabase.from('devices').delete().eq('owner', id);
            if (error) throw new Error(error.message);
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
                total_due: clientOperations.reduce((sum, op) => sum + (op.amount_due ?? 0), 0),
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
                COD_TIPO_ID: string;
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
                NUM_DIAS_VENCIDOS: string;
                FECHA_DE_VENCIMIENTO: string | Date;
                DEUDA_REFINANCIADA: number;
                FECHA_SIG_VENCIMIENTO: string | Date;
                PLAZO_EN_MESES: string;
                VALOR_MENSUAL: string;
                FRECUENCIA_PAGO: string;
            };

            const normalizeDate = (date: string | number | undefined | Date): Date | null => {
                if (!date) return null;
                if (typeof date === 'number') {
                    return new Date((date - 25569) * 86400 * 1000);
                }
                if (typeof date === 'string') {
                    const parts = date.split('/');
                    if (parts.length === 3) {
                        const [day, month, year] = parts.map(Number);
                        const fullYear = year < 100 ? 2000 + year : year;
                        return new Date(fullYear, month - 1, day);
                    }
                }
                return null;
            };

            const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
            const sheetName = workbook.SheetNames[0];
            const sheetData: ExcelData[] = XLSX.utils.sheet_to_json<ExcelData>(workbook.Sheets[sheetName]);

            if (sheetData.length === 0) {
                res.status(400).json({ error: 'El archivo está vacío.' });
            }

            for (const row of sheetData) {
                console.log('fila', row)

                const { data: existingClients, error: clientCheckError } = await supabase
                    .from('clients')
                    .select('id')
                    .eq('identity_number', row.CODIGO_ID_SUJETO);

                if (clientCheckError) {
                    throw new Error(`Error al verificar cliente: ${clientCheckError.message}`);
                }

                let clientId;

                // Verifica si se encontró un cliente
                if (!existingClients || existingClients.length === 0) {
                    console.log(`Cliente no encontrado para: ${row.CODIGO_ID_SUJETO}`);
                    clientId = null; // Esto indica que el cliente no existe
                } else {
                    clientId = existingClients[0].id; // Cliente encontrado
                    console.log(`Cliente encontrado con ID: ${clientId}`);
                }

                const client = {
                    identity_number: row.CODIGO_ID_SUJETO,
                    identity_type: row.COD_TIPO_ID,
                    name: row.NOMBRE_SUJETO,
                    address: row.DIRECCION,
                    city: row.CIUDAD,
                    phone: row.TELEFONO,
                    debt_type: row.TIPO_DEUDOR,
                    grant_date: row.FECHA_CONCESION || null,
                    due_date: row.FEC_CORTE_SALDO || null,
                    deadline: extractFirstNumber(row.PLAZO_EN_MESES) || null,
                    created_at: new Date(),
                }

                console.log(client)

                if (!clientId) {
                    const { data: clientData, error: clientError } = await supabase
                        .from('clients')
                        .insert(client)
                        .select()
                        .single();

                    clientId = clientData.id;
                    if (clientError) throw new Error(`Error al insertar cliente: ${clientError.message}`);

                } else {
                    const { error: clientError } = await supabase
                        .from('clients')
                        .update(client)
                        .eq('id', clientId);
                    console.log(`Cliente ${client.name} actualizado`)
                    if (clientError) throw new Error(`Error al actualizar cliente: ${clientError.message}`);
                }
                const { data: existingOperations, error: operationsError } = await supabase
                    .from('operations')
                    .select('id')
                    .eq('client_id', clientId);

                if (operationsError) {
                    throw new Error(`Error al verificar operaciones: ${operationsError.message}`);
                }

                const operation = {
                    operation_number: row.NUMERO_DE_OPERACION || null,
                    operation_value: row.VAL_OPERACION || null,
                    amount_due: row.VAL_A_VENCER || null,
                    amount_paid: row.VAL_VENCIDO || null,
                    judicial_action: row.VA_DEM_JUDICIAL > 0,
                    cart_value: row.VAL_CART_CASTIGADA || null,
                    days_overdue: extractFirstNumber(row.NUM_DIAS_VENCIDOS) || null,
                    due_date: row.FECHA_DE_VENCIMIENTO || null,
                    refinanced_debt: row.DEUDA_REFINANCIADA || null,
                    prox_due_date: row.FECHA_SIG_VENCIMIENTO || null,
                    client_id: clientId,
                    created_at: new Date(),
                    monthly_value: row.VALOR_MENSUAL || null,
                    frequency: row.FRECUENCIA_PAGO || null
                };

                console.log(operation)

                if (existingOperations?.length > 0) {
                    const { error: operationError } = await supabase
                        .from('operations')
                        .update(operation)
                        .eq('id', existingOperations[0].id);

                    if (operationError) throw new Error(`Error al actualizar operación: ${operationError.message}`);
                } else {
                    const { error: operationError } = await supabase
                        .from('operations')
                        .insert(operation);

                    if (operationError) throw new Error(`Error al insertar operación: ${operationError.message}`);
                }
            }

            res.status(200).json({ message: 'Datos procesados e insertados con éxito.' });
        } catch (error: any) {
            console.error('Error al procesar el archivo Excel:', error);
            res.status(500).json({ error: 'Error interno del servidor.', details: error.message });
        }
    }


}
