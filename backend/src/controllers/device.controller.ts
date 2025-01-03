import { Request, Response } from "express";
import { Device } from "../models/device.model";
import { validateDevice } from "../requests/device.request";
import { BaseService } from "../services/base.service";
import { DeviceResource } from "../resources/device.resource";
const tableName = 'devices'; // Nombre de la tabla en la base de datos
export const DeviceController = {
    async getAllDevices(req: Request, res: Response) {
        try {
            const where = { ...req.query }; // Convertir los parámetros de consulta en filtros
            const devices = await BaseService.getAll<Device>(tableName,['imei', 'status','owner','store_id'],where);
            res.json(DeviceResource.formatDevices(devices));
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
}