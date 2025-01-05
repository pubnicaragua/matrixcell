import Joi from 'joi';
import { Status } from "../models/status.model";
import { BaseRequest } from "./base.request";

const statusSchema = Joi.object({
    client_id: Joi.number().required(),
    total_operations :  Joi.number().required(),
    total_due: Joi.number().required(),
    total_overdue: Joi.number().required(),
    judicial_operations: Joi.number().required(),
    status: Joi.string().required(),
    last_payment_date: Joi.string().required(),
});

export const validateStatus = (status: Status) => {
    return BaseRequest.validate(statusSchema, status);
};