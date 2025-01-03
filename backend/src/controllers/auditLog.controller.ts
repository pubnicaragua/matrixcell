import { Request, Response } from "express";
import { BaseService } from "../services/base.service";
import { AuditLog } from "../models/auditLog.model";
import { AuditLogResource } from "../resources/auditLogResource";

const tableName = 'audit_logs'; // Nombre de la tabla en la base de datos
export const AuditLogController = {
    async getAllAuditLogs(req: Request, res: Response) {
        try {
            const where = { ...req.query }; // Convertir los parámetros de consulta en filtros
            const auditlogs = await BaseService.getAll<AuditLog>(tableName,['event', 'user_id','created_at','details'],where);
            res.json(AuditLogResource.formatAuditLogs(auditlogs));
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    },
}