import { Client } from "../models/client.model";

export const ClientResource = {
    formatClient(client: Client) {
        return {
            id: client.id,
            name: client.name,
            email: client.email,
            phone: client.phone,
            address: client.address,
            category: client.category,
            status: client.status,
        };
    },

    formatClients(clients: Client[]) {
        return clients.map(client => ClientResource.formatClient(client));
    }
};














