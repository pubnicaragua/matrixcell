import { AuditLog } from "../models/auditLog.model";

export const AuditLogResource = {
    formatAuditLog(auditlog: AuditLog) {
        return {
            id: auditlog.id,
           event: auditlog.event,
            user: auditlog.user,
            timestamp: auditlog.timestamp,
            details: auditlog.details,
        };
    },

    formatAuditLogs(auditlogs: AuditLog[]) {
        return auditlogs.map(auditlog => AuditLogResource.formatAuditLog(auditlog));
    }
};