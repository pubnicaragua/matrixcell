
import Joi from "joi";
import { BaseRequest } from "./base.request";
import { PaymentPlan } from "../models/paymentPlan.model";

const paymentplanSchema = Joi.object({
    device_id: Joi.number().required(),
    months: Joi.number().required(),
    weekly_payment: Joi.number().required(),
    monthly_payment: Joi.number().required(),
    total_cost: Joi.number().required(),
    
});

export const validatePaymentPlan = (paymentplan: PaymentPlan) => {
    return BaseRequest.validate(paymentplanSchema, paymentplan);
};