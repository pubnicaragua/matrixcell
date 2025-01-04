import { AuditLog } from "../models/auditLog.model";

export const AuditLogResource = {
    formatAuditLog(auditlog: AuditLog) {
        return {
            id: auditlog.id,
            event: auditlog.event,
            user_id: auditlog.user_id,
            created_at: auditlog.created_at,
            details: auditlog.details,
        };
    },

    formatAuditLogs(auditlogs: AuditLog[]) {
        return auditlogs.map(auditlog => AuditLogResource.formatAuditLog(auditlog));
    }
};