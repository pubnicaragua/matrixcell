import Joi from 'joi';
import { Payment } from "../models/payment.model";
import { BaseRequest } from "./base.request";

const paymentSchema = Joi.object({
    operation_id :  Joi.number().required(),
    client_id: Joi.number().required(),
    payment_date: Joi.boolean,
    amount_paid: Joi.number().required(),
    payment_method: Joi.string().required(),
    receipt_number: Joi.string().required(),
});

export const validatePayment = (payment: Payment) => {
    return BaseRequest.validate(paymentSchema, payment);
};