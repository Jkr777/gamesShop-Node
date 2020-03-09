const mongoose = require('mongoose'),
      bcrypt = require('bcrypt'),
      jwt = require('jsonwebtoken'),
      Joi = require('@hapi/joi');

const userSchema = new mongoose.Schema({
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
    unique: true,
    required: true
  },
  password: {
    type: String,
    trim: true,
    minlength: 5,
    maxlength: 255,
    required: true
  },
  address: {
    type: String,
    minlength: 2,
    maxlength: 255,
    trim: true,
    lowercase: true,
    required: true
  },
  city: {
    type: String,
    minlength: 2,
    maxlength: 255,
    trim: true,
    lowercase: true,
    required: true
  },
  zip: {
    type: String,
    minlength: 2,
    maxlength: 20,
    trim: true,
    required: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
});

userSchema.pre('save', async function(next) {
  if(!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  return next();
});

userSchema.methods.jwtSet = function() {
  const token = jwt.sign({_id: this._id, admin: this.isAdmin}, process.env.GRENT_JWT, { expiresIn: '15h' });
  return token;
};

userSchema.methods.passCheck = async function(pass) {
  const result = await bcrypt.compare(pass, this.password);
  return result;
}

const User = mongoose.model("User", userSchema);

function joiValidation(data) {
  const schema = {
    name: Joi.string().min(2).max(200).lowercase().required(),
    email: Joi.string().email({minDomainSegments: 2}).min(5).max(200).lowercase().required(),
    address: Joi.string().min(2).max(255).required(),
    city: Joi.string().min(2).max(255).required(),
    zip: Joi.string().min(2).max(20).required(),
    password: Joi.string()
    .min(5)
    .max(255)
    .regex(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])"))
    .required()
    .error((errors) => {
      return errors.map(e => {
        console.log(e);
      switch(e.type) {
        case "string.min":
          return {message: "password must be of minimum 5 characters length"};
        case "string.max":
          return {message: "password must be of maximum 255 characters length"};
        case "string.regex.base":
          return {message: "the password must contain: At least 1 lowercase alphabetical character, 1 uppercase alphabetical character, 1 numeric character and 1 special character."}
        case "any.required":
          return {message: `"password" is required`}
      }
    })
    })
  }
  return Joi.validate(data, schema);
}; 

module.exports = { User, joiValidation };