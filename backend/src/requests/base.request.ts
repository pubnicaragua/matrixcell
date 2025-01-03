// requests/base.request.js
import Joi from 'joi';

export const BaseRequest = {
  validate<T>(schema: Joi.ObjectSchema, entity: T): Joi.ValidationResult {
    return schema.validate(entity);
  }
};
