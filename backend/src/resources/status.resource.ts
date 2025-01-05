import { Status } from "../models/status.model";

export const StatusResource = {
    formatStatus(status: Status) {
        return {
            id: status.id,
            client_id: status.client_id,
            total_operations: status.total_operations,
            total_due: status.total_due,
            total_overdue: status.total_overdue,
            judicial_operations: status.judicial_operations,
            status: status.status,
            last_payment_date: status.last_payment_date,
            created_at: status.created_at,
            updated_at: status.updated_at
        };
    },

    formatStatuss(statuss: Status[]) {
        return statuss.map(status => StatusResource.formatStatus(status));
    }
};