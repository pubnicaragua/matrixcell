
import Joi from "joi";
import { BaseRequest } from "./base.request";
import { Contract } from "../models/contract.model";

const contractSchema = Joi.object({
    device_id: Joi.number().required(),
    payment_plan_id: Joi.number().required(),
    down_payment: Joi.number().required(),
    
});

export const validateContract = (contract: Contract) => {
    return BaseRequest.validate(contractSchema, contract);
};