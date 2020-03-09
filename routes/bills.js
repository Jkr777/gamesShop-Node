const express = require('express'),
      { Bill, joiValidation } = require('../model/bill'),
      { Game } = require('../model/game'),
      { User } = require('../model/user'),
      auth = require('../middleware/auth'),
      admin = require('../middleware/admin'),
      mongoose = require('mongoose'),
      Fawn = require('fawn'),
      router = express.Router();

Fawn.init(mongoose);
      
router.get('/', [auth, admin], async(req, res) => {
  const bills = await Bill.find().sort('-date');
  if(!bills) return res.status(404).send("No bills");

  res.status(200).send(bills);
});      

router.get('/games', auth, async(req, res) => {
  const bills = await Bill.find({'costumer._id': req.user._id});
  if(!bills) return res.status(404).send("You have no bills");

  res.status(200).send(bills);
});

router.post('/', auth, async(req, res) => {
  const {error} = joiValidation(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  const costumer = await User.findById(req.user._id);
  if(!costumer) return res.status(401).send("Invalid account");

  const game = await Game.findById(req.body.gameId);
  if(!game) return res.status(401).send("Invalid game");

  const bill = new Bill({
    costumer: {
      _id: costumer._id,
      name: costumer.name,
      email: costumer.email
    },
    game: {
      _id: game._id,
      title: game.title,
      price: game.price
    },
    totalPrice: req.body.totalPrice
  });
  
  try {
    new Fawn.Task()
    .save('bills', bill)
    .update('games', { _id: game._id }, {
      $inc: { numberInStock: -1 }
    })
    .run();

    res.status(201).send(bill);
  } catch(err) {
    res.status(500).send("Something failed");
  }
});

module.exports = router;