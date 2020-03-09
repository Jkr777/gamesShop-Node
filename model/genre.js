const mongoose = require('mongoose'),
      Joi = require('@hapi/joi');

const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 55,
    trim: true,
    lowercase: true,
    required: true
  }
});

const Genre = mongoose.model("Genre", genreSchema);

function joiValidator(data) {
  const schema = {
    name: Joi.string().min(2).max(55).lowercase().required()
  };
  return Joi.validate(data, schema)
};

module.exports = { Genre, joiValidator, genreSchema };