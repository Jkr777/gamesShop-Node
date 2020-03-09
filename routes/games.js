const express = require('express'),
      { Game, joiValidation } = require('../model/game'),
      auth = require('../middleware/auth'),
      admin = require('../middleware/admin'),
      { Genre } = require('../model/genre'),
      router = express.Router();

router.get('/', async(req, res) => {
  const skip = req.query.skip ? Number(req.query.skip) : 0;
  const games = await Game.find()
    .sort("title")
    .skip(skip)
    .limit(10);
  if(!games) return res.status(404).send("No game found");

  res.status(200).send(games);
});    

router.get('/genre', async(req, res) => {
  const skip = req.query.skip ? Number(req.query.skip) : 0;
  const games = await Game.find({'genre._id': req.body.genreId})
    .sort("title")
    .skip(skip)
    .limit(10);
  if(!games) return res.status(404).send("No game found");

  res.status(200).send(games);
});    

router.get('/name', async(req, res) => {
  const games = await Game.findOne({title: req.body.name});
  if(!games) return res.status(404).send("The game with the given name was not found");

  res.status(200).send(games);
});     

router.get('/:id', async(req, res) => {
  const game = await Game.findById(req.params.id);
  if(!game) return res.status(404).send("The game with the given ID was not found");

  res.status(200).send(game);
});

router.post('/', [auth, admin], async(req, res) => {
  const {error} = joiValidation(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  const game = await Game.findOne({title: req.body.title});
  if(game) return res.status(400).send("This game already exists");

  const genre = await Genre.findById(req.body.genreId);
  if(!genre) return res.status(400).send("Invalid genre");

  const newGame = new Game({
    title: req.body.title,
    genre: {
      _id: genre._id,
      name: genre.name
    },
    numberInStock: req.body.numberInStock,
    price: req.body.price
  });

  await newGame.save();
  res.status(201).send(newGame);
});

router.put('/:id', [auth, admin], async(req, res) => {
  const {error} = joiValidation(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if(!genre) return res.status(400).send("Invalid genre");

  const game = await Game.findByIdAndUpdate(req.params.id, {
    title: req.body.title,
    genre: {
      title: genre.title
    },
    numberInStock: req.body.numberInStock,
    price: req.body.price
  }, {new: true});
  if(!game) res.status(404).send("The game with the given ID was not found");

  res.status(200).send(game);
});

router.delete('/:id', [auth, admin], async(req, res) => {
  const game = await Game.findByIdAndRemove(req.params.id);
  if(!game) return res.status(404).send("The game with the given ID was not found");

  res.status(200).send(game);
});

module.exports = router;      