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
            city: client.city,
            due_date: client.due_date,
            grant_date: client.grant_date,
            deadline: client.deadline,
            debt_type: client.debt_type,
            created_at: client.created_at,
            email: client.email,
            deleted: client.deleted,
            store_id: client.store_id,
            frequency: client.frequency,
            contract_number: client.contract_number
        };
    },

    formatClients(clients: Client[]) {
        return clients.map(client => ClientResource.formatClient(client));
    }
};














