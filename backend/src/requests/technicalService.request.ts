
import Joi from "joi";
import { BaseRequest } from "./base.request";
import { TechnicalService } from "../models/technicalServicemodel";

const technicalserviceSchema = Joi.object({
    client: Joi.string().required(),
    service_type: Joi.string().required(),
    description: Joi.string(),
    status: Joi.string().required().default("Pendiente"),
    cost: Joi.number(),
    technicalservice_id: Joi.number().required(),
});

export const validateTechnicalService = (technicalservice: TechnicalService) => {
    return BaseRequest.validate(technicalserviceSchema, technicalservice);
};