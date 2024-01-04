import Joi from 'joi';

const authSchema = Joi.object({
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ['com', 'net'] }
  }),
  password: Joi.string().min(6).max(30).required()
}).options({ abortEarly: false });

export default authSchema;
