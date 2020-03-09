const express = require('express'),
      { Genre, joiValidator } = require('../model/genre'),
      auth = require('../middleware/auth'),
      admin = require('../middleware/admin'),
      router = express.Router();

router.get('/', async(req, res) => {
  const genres = await Genre.find().sort({name: 1});

  res.status(200).send(genres);
});

router.get('/:id', async(req, res) => {
  const genre = await Genre.findById(req.params.id);
  if(!genre) return res.status(404).send("The genre with the given ID was not found");

  res.status(200).send(genre);
});

router.post('/', [auth, admin], async(req, res) => {
  const { error } = joiValidator(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  let genre = await Genre.findOne({name: req.body.name});
  if(genre) return res.status(401).send("This genre already exists");

  genre = new Genre({name: req.body.name});
  await genre.save();

  res.status(201).send(genre);
});

router.put('/:id', [auth, admin], async(req, res) => {
  const { error } = joiValidator(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  let genre = await Genre.findOne({name: req.body.name});
  if(genre) return res.status(401).send("This genre already exists");

  genre = await Genre.findByIdAndUpdate(req.params.id, {name: req.body.name}, {new: true});
  if(!genre) return res.status(404).send("The genre with the given ID was not found");

  res.status(200).send(genre);
});

router.delete('/:id', [auth, admin], async(req, res) => {
  const genre = await Genre.findByIdAndRemove(req.params.id);
  if(!genre) return res.status(404).send("The genre with the given ID was not found");

  res.status(200).send();
});

module.exports = router;