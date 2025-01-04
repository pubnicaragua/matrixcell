import Joi from 'joi';
import { Notification } from "../models/notification.model";
import { BaseRequest } from "./base.request";

const notificationSchema = Joi.object({
    message: Joi.string().required(),
    user_id :  Joi.number().required(),
    invoice_id: Joi.number().required(),
    status: Joi.string().required(),
});

export const validateNotification = (notification: Notification) => {
    return BaseRequest.validate(notificationSchema, notification);
};