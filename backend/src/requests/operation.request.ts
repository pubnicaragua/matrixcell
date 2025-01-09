import Joi from 'joi';
import { Operation } from "../models/operation.model";
import { BaseRequest } from "./base.request";

const operationSchema = Joi.object({
    operation_number: Joi.string().required(),
    operation_value: Joi.number().allow(null), // Agregado para reflejar el modelo y la tabla
    due_date: Joi.string().required(), // Cambiado a string para alinearse con la tabla
    amount_due: Joi.number().allow(null), // Puede ser nulo
    amount_paid: Joi.number().allow(null), // Puede ser nulo
    days_overdue: Joi.number().integer().allow(null), // Puede ser nulo
    cart_value: Joi.number().allow(null), // Agregado para reflejar la tabla y el modelo
    judicial_action: Joi.string().allow(null), // Cambiado a string
    refinanced_debt: Joi.string().allow(null), // Agregado para reflejar la tabla y el modelo
    prox_due_date: Joi.string().required(), // Mantiene el formato ISO
    client_id: Joi.number().integer().allow(null) // Puede ser nulo
});


export const validateOperation = (operation: Operation) => {
    return BaseRequest.validate(operationSchema, operation);
};