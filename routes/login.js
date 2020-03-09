const express = require('express'),
      { User } = require('../model/user'),
      _ = require('lodash'),
      Joi = require('@hapi/joi'),
      router = express.Router();

router.post('/', async(req, res) => {
  const {error} = joiValidation(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if(!user) return res.status(401).send("Invalid email or password");
  
  const pass = await user.passCheck(req.body.password);
  if(!pass) return res.status(401).send("Invalid email or password");
  await user.save();

  const token = user.jwtSet();
  res.header("X-Grent", token).status(200).send(_.pick(user, ["_id", "name", "lastname", "email"]));
});      

function joiValidation(data) {
  const schema = {
    email: Joi.string().email({minDomainSegments: 2}).min(5).max(200).lowercase().required(),
    password: Joi.string().min(5).max(255).required()
  };
  return Joi.validate(data, schema);
};      

module.exports = router;