import { Invoice } from "../models/invoice.model";

export const InvoiceResource = {
    formatInvoice(invoice: Invoice) {
        return {
            id: invoice.id,
            amount: invoice.amount,
            number: invoice.number,
            device_id: invoice.device_id,
            status: invoice.status,
            created_at: invoice.created_at,
            operation_id: invoice.operation_id
        };
    },

    formatInvoices(invoices: Invoice[]) {
        return invoices.map(invoice => InvoiceResource.formatInvoice(invoice));
    }
};