import { Invoice } from "../models/invoice.model";

export const InvoiceResource = {
    formatInvoice(invoice: Invoice) {
        return {
            id: invoice.id,
            amount: invoice.amount,
            number: invoice.number,
            device_id: invoice.device_id,
            status: invoice.status
        };
    },

    formatInvoices(invoices: Invoice[]) {
        return invoices.map(invoice => InvoiceResource.formatInvoice(invoice));
    }
};