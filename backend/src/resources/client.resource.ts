import { Client } from "../models/client.model";

export const ClientResource = {
    formatClient(client: Client) {
        return {
            id: client.id,
            identity_number: client.identity_number,
            identity_type: client.identity_type,
            name: client.name,
            address: client.address,
            phone: client.phone,
            email: client.email,
            city: client.city,
            due_date: client.due_date,
            deubt_type: client.deubt_type,
            operation_number: client.operation_number,
            status: client.status,
            category: client.category,
            created_at: client.created_at
        };
    },

    formatClients(clients: Client[]) {
        return clients.map(client => ClientResource.formatClient(client));
    }
};














