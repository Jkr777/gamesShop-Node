const express = require('express'),
      auth = require('../middleware/auth'),
      { User } = require('../model/user'),
      Joi = require('@hapi/joi'),
      _ = require('lodash'),
      router = express.Router();

router.get('/', auth, async(req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  if(!user) return res.status(401).send('Invalid account');

  res.status(200).send(user)
});

router.patch('/', auth, async(req, res) => {
  const {error} = joiValidation(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({email: req.body.email});
  if(user) return res.status(401).send("Invalid email");

  const updates = _.pick(req.body, ["name", "email", "password", "address", "city", "zip"]);
  user = await User.findOne({_id: req.user._id});
  if(!user) return res.status(401).send("Invalid account");

  user.set(updates);
  await user.save();

  res.status(200).send(_.pick(user, ["id", "name", "email", "address", "city", "zip"]));
});

function joiValidation(data) {
  const schema = {
    name: Joi.string().min(2).max(200).lowercase(),
    email: Joi.string().email({minDomainSegments: 2}).min(5).max(200).lowercase(),
    address: Joi.string().min(2).max(255),
    city: Joi.string().min(2).max(255).lowercase(),
    zip: Joi.string().min(2).max(20),
    password: Joi.string()
    .min(5)
    .max(255)
    .regex(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])"))
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


module.exports = router;