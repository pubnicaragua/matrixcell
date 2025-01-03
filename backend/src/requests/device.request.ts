import Joi from 'joi';
import { Device } from "../models/device.model";
import { BaseRequest } from "./base.request";

const deviceSchema = Joi.object({
    store_id: Joi.number().required(),
    imei: Joi.string().required(),
    status :  Joi.string().required(),
    owner: Joi.string().required(),
});

export const validateDevice = (device: Device) => {
    return BaseRequest.validate(deviceSchema, device);
};
