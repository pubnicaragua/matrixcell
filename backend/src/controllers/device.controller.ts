import { Request, Response } from "express";
import { Device } from "../models/device.model";
import { validateDevice } from "../requests/device.request";
import { BaseService } from "../services/base.service";
import { DeviceResource } from "../resources/device.resource";
import supabase from "../config/supabaseClient";
import * as XLSX from 'xlsx';

const tableName = 'devices'; // Nombre de la tabla en la base de datos
export const DeviceController = {

    async getAllDevices(req: Request, res: Response) {
        try {
            type DeviceFormat = {
                id?: number|null;
                store_id?: number|null;
                imei: string | null;
                status: string ;
                owner: number | null;
                created_at: Date|null;
                clients: {
                    name: string;
                };
            };
            const where = { ...req.query }; // Convertir los parámetros de consulta en filtros
            const devices = await BaseService.getAll<DeviceFormat>(tableName, ['id', 'imei', 'status', 'owner', 'store_id','devices(name)'], where);
            const resultados = devices!.map((device) => ({
                id: device.id,
            imei: device.imei,
            status: device.status,
            owner: device.owner,
            store_id: device.store_id,
            cliente: Array.isArray(device.clients)
                    ? device.clients[0]?.name || "Sin Cliente"
                    : device.clients?.name || "Sin Cliente",
            created_at: device.created_at,
            }));
            res.json(DeviceResource.formatDevices(resultados));
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    },

    async createDevice(req: Request, res: Response) {
        try {
            validateDevice(req.body); // Validar los datos
            const { userId } = req;
            const device = await BaseService.create<Device>(tableName, req.body, userId);
            res.status(201).json(DeviceResource.formatDevice(device));
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    },

    async updateDevice(req: Request, res: Response) {
        try {
            const { id } = req.params;
            validateDevice(req.body); // Validar los datos
            const { userId } = req;
            const device = await BaseService.update<Device>(tableName, parseInt(id), req.body, userId);
            res.json(DeviceResource.formatDevice(device));
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    },

    async deleteDevice(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { userId } = req;

            await BaseService.delete<Device>(tableName, id, userId);
            res.json({ message: 'Device eliminada correctamente' });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    },
    async processMasiveDevices(req: Request, res: Response) {
        try {

            // Verifica si hay un archivo cargado
            if (!req.file) {
                throw new Error('Archivo no encontrado.');
            }
            type DeviceRow = {
                imei: string;
                action: 'bloqueado' | 'desbloqueado';
            };
            // Lee el archivo Excel
            const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
            const sheetName = workbook.SheetNames[0]; // Usamos la primera hoja del archivo
            const sheetData: DeviceRow[] = XLSX.utils.sheet_to_json<DeviceRow>(workbook.Sheets[sheetName]);

            // Valida que el archivo tenga datos
            if (sheetData.length === 0) {
                res.status(400).json({ error: 'El archivo está vacío.' });
            }

            // Procesar cada fila (se espera que tenga las columnas "imei" y "action")
            const results: { imei: string; status: string }[] = [];
            for (const row of sheetData) {
                const imei = row['imei'];
                const action = row['action']; // "block" o "unblock"

                if (!imei || !['bloqueado', 'desbloqueado'].includes(action)) {
                    results.push({ imei, status: 'Datos inválidos.' });
                    continue;
                }

                // Lógica para bloquear/desbloquear el dispositivo (Supabase u otro servicio)
                const { error } =
                    action === 'bloqueado'
                        ? await supabase.from('devices').update({ status: 'Bloqueado' }).eq('imei', imei)
                        : await supabase.from('devices').update({ status: 'Desbloqueado' }).eq('imei', imei);

                if (error) {
                    results.push({ imei, status: `Error: ${error.message}` });
                } else {
                    results.push({ imei, status: `${action === 'bloqueado' ? 'Bloqueado' : 'Desbloqueado'} exitosamente` });
                }
            }

            res.status(200).json({ message: 'Procesamiento completo.', results });
        } catch (error) {
            console.error('Error al procesar dispositivos:', error);
            res.status(500).json({ error: 'Error interno del servidor.' });
        }
    }
}