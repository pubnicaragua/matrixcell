import { Request, Response } from "express";
import { Notification } from "../models/notification.model";
import { validateNotification } from "../requests/notification.request";
import { BaseService } from "../services/base.service";
import { NotificationResource } from "../resources/notification.resource";
const tableName = 'notifications'; // Nombre de la tabla en la base de datos
export const NotificationController = {
    async getAllNotifications(req: Request, res: Response) {
        try {
            const where = { ...req.query }; // Convertir los parámetros de consulta en filtros
            const notifications = await BaseService.getAll<Notification>(tableName,['id', 'created_at', 'message','user_id','invoice_id','status'],where);
            res.json(NotificationResource.formatNotifications(notifications));
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    },

    async createNotification(req: Request, res: Response) {
        try {
            validateNotification(req.body); // Validar los datos
            const { userId } = req;
            const notification = await BaseService.create<Notification>(tableName, req.body, userId);
            res.status(201).json(NotificationResource.formatNotification(notification));
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    },
     async updateNotification(req: Request, res: Response) {
            try {
                const { id } = req.params;
                validateNotification(req.body); // Validar los datos
                const { userId } = req;
                const notification = await BaseService.update<Notification>(tableName, parseInt(id), req.body, userId);
                res.json(NotificationResource.formatNotification(notification));
            } catch (error: any) {
                res.status(400).json({ message: error.message });
            }
        },


}