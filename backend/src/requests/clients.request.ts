import Joi from 'joi';
import { Client } from "../models/client.model";
import { BaseRequest } from "./base.request";

const clientSchema = Joi.object({
    name: Joi.string().required(),
    email :  Joi.string().required(),
    phone: Joi.string().required(),
    address: Joi.string().required(),
    category: Joi.string().required(),
    status: Joi.string().required(),
});

export const validateClient = (client: Client) => {
    return BaseRequest.validate(clientSchema, client);
};
