import Joi from 'joi';
import { BaseRequest } from './base.request';
import { Invoice } from '../models/invoice.model';


const invoiceSchema = Joi.object({
amount: Joi.number().required(),
number :  Joi.string().required(),
device_id: Joi.number().required(),
status: Joi.number().required(),
});

export const validateInvoice = (invoice: Invoice) => {
    return BaseRequest.validate(invoiceSchema, invoice);
};