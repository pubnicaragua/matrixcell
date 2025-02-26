import { Payment } from "../models/payment.model";

export const PaymentResource = {
    formatPayment(payment: Payment) {
        return {
            id: payment.id,
            contract_id: payment.contract_id,
            payment_date: payment.payment_date,
            amount: payment.amount,
            created_at: payment.created_at,
            operation_id: payment.operation_id,
            client_id: payment.client_id,
            amount_paid: payment.amount_paid,
            receipt_number: payment.receipt_number,
        };
    },

    formatPayments(payments: Payment[]) {
        return payments.map(payment => PaymentResource.formatPayment(payment));
    }
};