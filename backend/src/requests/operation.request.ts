import Joi from 'joi';
import { Operation } from "../models/operation.model";
import { BaseRequest } from "./base.request";

const operationSchema = Joi.object({
    operation_number: Joi.string().required(),
    operation_type :  Joi.string().required(),
    operation_date: Joi.string().required(),
    due_date: Joi.string().required(),
    amount_due: Joi.string().required(),
    amount_paid: Joi.string().required(),
    days_overdue: Joi.string().required(),
    status: Joi.string().required(),
    judicial_action: Joi.boolean(),
});

export const validateOperation = (operation: Operation) => {
    return BaseRequest.validate(operationSchema, operation);
};