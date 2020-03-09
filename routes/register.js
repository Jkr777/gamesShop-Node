const express = require('express'),
      { User, joiValidation } = require('../model/user'),
      _ = require('lodash'),
      router = express.Router();

router.post('/', async(req, res) => {
  const { error } = joiValidation(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({email: req.body.email});
  if(user) return res.status(400).send("Invalid email or password");

  user = new User(_.pick(req.body, ["name", "email", "password", "address", "city", "zip"]));
  await user.save();
  const token = user.jwtSet();

  res.header('X-Grent', token).status(201).send(_.pick(user, ["_id", "name", "email", "password", "address", "city", "zip"]));
});      
      
module.exports = router;