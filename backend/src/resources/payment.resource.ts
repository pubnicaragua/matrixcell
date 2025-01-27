import { Payment } from "../models/payment.model";

export const PaymentResource = {
    formatPayment(payment: Payment) {
        return {
            id: payment.id,
            contract_id: payment.contract_id,
            payment_date: payment.payment_date,
            amount: payment.amount,
            created_at: payment.created_at,
        };
    },

    formatPayments(payments: Payment[]) {
        return payments.map(payment => PaymentResource.formatPayment(payment));
    }
};