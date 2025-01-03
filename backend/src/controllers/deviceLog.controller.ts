import { Request, Response } from "express";
import { BaseService } from "../services/base.service";
import { DeviceLog } from "../models/deviceLog.model";
import { DeviceLogResource } from "../resources/deviceLogResource";

const tableName = 'device_logs'; // Nombre de la tabla en la base de datos
export const DeviceLogController = {
    async getAllDeviceLogs(req: Request, res: Response) {
        try {
            const where = { ...req.query }; // Convertir los parámetros de consulta en filtros
            const devicelogs = await BaseService.getAll<DeviceLog>(tableName,['device_id', 'action_id','perform_user_id','created_at'],where);
            res.json(DeviceLogResource.formatDeviceLogs(devicelogs));
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    },
}