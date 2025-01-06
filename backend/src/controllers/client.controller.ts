import { Request, Response } from "express";
import { BaseService } from "../services/base.service";
import { Client } from "../models/client.model";
import { ClientResource } from "../resources/client.resource";
import { validateClient } from "../requests/clients.request";
import { Operation } from "../models/operation.model";
import PDFDocument from 'pdfkit-table';
import { Buffer } from 'buffer';
const tableName = 'clients'; // Nombre de la tabla en la base de datos
export const ClientController = {
    async getAllClients(req: Request, res: Response) {
        try {
            const where = { ...req.query }; // Convertir los parámetros de consulta en filtros
            const clients = await BaseService.getAll<Client>(tableName, ['id','identity_number','identity_type', 'name','address', 'phone','email',  'city', 'due_date','deubt_type','operation_number','status','category','created_at'], where);
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
        const clients = await BaseService.getAll<Client>(clientsTableName, ['id','identity_number','identity_type', 'name','address', 'phone',  'city', 'due_date','deubt_type','operation_number','device_id','client_id','created_at']);
        const operations = await BaseService.getAll<Operation>(operationsTableName, ['id', 'operation_number', 'operation_type','operation_date','due_date','amount_due','amount_paid','days_overdue','status','judicial_action','created_at','updated_at']);
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
        const columns = ['id', 'name',  'operations', 'total_due']
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
    }
}