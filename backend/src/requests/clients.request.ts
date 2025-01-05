import Joi from 'joi';
import { Client } from "../models/client.model";
import { BaseRequest } from "./base.request";

const clientSchema = Joi.object({
    identity_number: Joi.string().required(),
    identity_type: Joi.string().required(),
    name: Joi.string().required(),
    address: Joi.string().required(),
    phone: Joi.string().required(),
    city: Joi.string().required(),
    due_date: Joi.string().required(),
    deubt_type: Joi.string().required(),
    operation_number: Joi.number().required(),
    device_id: Joi.number().required(),
});

export const validateClient = (client: Client) => {
    return BaseRequest.validate(clientSchema, client);
};
