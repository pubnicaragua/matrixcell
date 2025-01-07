import { Payment } from "../models/payment.model";

export const PaymentResource = {
    formatPayment(payment: Payment) {
        return {
            id: payment.id,
            created_at: payment.created_at,
            operation_id: payment.operation_id,
            client_id: payment.client_id,
            payment_date: payment.payment_date,
            amount_paid: payment.amount_paid,
            payment_method: payment.payment_method,
            receipt_number: payment.receipt_number,
            updated_at: payment.updated_at,
        };
    },

    formatPayments(payments: Payment[]) {
        return payments.map(payment => PaymentResource.formatPayment(payment));
    }
};