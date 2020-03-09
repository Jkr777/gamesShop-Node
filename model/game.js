const mongoose = require('mongoose'),
      { genreSchema } = require('./genre'),
      Joi = require('@hapi/joi');

const gameSchema = new mongoose.Schema({
  title: {
    type: String,
    minlength: 5,
    maxlength: 200,
    trim: true,
    lowercase: true,
    required: true
  },
  genre: {
    type: genreSchema,
    required: true
  },
  numberInStock: {
    type: Number,
    min: 0,
    max: 2000,
    required: true
  },
  price: {
    type: Number,
    min: 0,
    max: 2000,
    required: true
  }
});

const Game = mongoose.model("Game", gameSchema);

function joiValidation(data) {
  const schema = {
    title: Joi.string().min(5).max(200).required(),
    genreId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
    numberInStock: Joi.number().integer().min(0).max(2000).required(),
    price: Joi.number().integer().min(0).max(2000).required()
  };
  return Joi.validate(data, schema);
};

module.exports = { Game, joiValidation };