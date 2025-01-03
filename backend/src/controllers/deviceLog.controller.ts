import { Request, Response } from "express";
import { BaseService } from "../services/base.service";
import { DeviceLog } from "../models/deviceLog.model";
import { DeviceLogResource } from "../resources/deviceLogResource";

const tableName = 'devicelogs'; // Nombre de la tabla en la base de datos
export const DeviceLogController = {
    async getAllDeviceLogs(req: Request, res: Response) {
        try {
            const where = { ...req.query }; // Convertir los parámetros de consulta en filtros
            const devicelogs = await BaseService.getAll<DeviceLog>(tableName,['device_id', 'action','performed_by','timestamp'],where);
            res.json(DeviceLogResource.formatDeviceLogs(devicelogs));
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    },
}