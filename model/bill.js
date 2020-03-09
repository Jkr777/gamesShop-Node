const mongoose = require('mongoose'),
      Joi = require('@hapi/joi');

const billSchema = new mongoose.Schema({
  costumer: {
    type: new mongoose.Schema({
      name: {
        type: String,
        trim: true,
        lowercase: true,
        minlength: 2,
        maxlength: 200,
        required: true
      },
      email: {
        type: String,
        trim: true,
        minlength: 5,
        maxlength: 200,
        lowercase: true,
        required: true
      }
    }),
    required: true
  },
  game: {
    type: new mongoose.Schema({
      title: {
        type: String,
        minlength: 5,
        maxlength: 200,
        lowercase: true,
        trim: true,
        required: true
      },
      price: {
        type: Number,
        min: 0,
        max: 2000,
        required: true
      }
    }),
    required: true
  },
  totalPrice: {
    type: Number,
    min: 0,
    max: 2000,
    required: true
  },
  date: {
    type: Date,
    default: Date.now()
  }
});

const Bill = mongoose.model("Bill", billSchema);

function joiValidation(data) {
  const schema = {
    gameId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
    totalPrice: Joi.number().min(0).max(2000).required()
  };
  return Joi.validate(data, schema); 
};

module.exports = { Bill, joiValidation };