const Joi = require('joi');

const validateBooking = (data) => {
  const schema = Joi.object({
    customerId: Joi.string().required(),
    customerName: Joi.string().required(),
    customerPhone: Joi.string().required(),
    technicianId: Joi.string().required(),
    location: Joi.object({
      latitude: Joi.number().required(),
      longitude: Joi.number().required(),
      address: Joi.string()
    }).required(),
    bookingTime: Joi.date().required(),
    serviceType: Joi.string().valid('puncture-repair', 'tire-replacement', 'wheel-alignment', 'emergency').required(),
    amount: Joi.number().required()
  });

  return schema.validate(data);
};

const validateTechnician = (data) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    phone: Joi.string().required(),
    email: Joi.string().email().required(),
    experience: Joi.number().min(0).required(),
    serviceArea: Joi.array().items(Joi.string()),
    hourlyRate: Joi.number().required(),
    certifications: Joi.array().items(Joi.string())
  });

  return schema.validate(data);
};

module.exports = {
  validateBooking,
  validateTechnician
};
