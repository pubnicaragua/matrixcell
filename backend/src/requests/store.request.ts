import Joi from 'joi';
import { Store } from "../models/store.model";
import { BaseRequest } from "./base.request";

const storeSchema = Joi.object({
name: Joi.string().required(),
address :  Joi.string().required(),
phone: Joi.string().required(),
active: Joi.boolean,
});

export const validateStore = (store: Store) => {
    return BaseRequest.validate(storeSchema, store);
};