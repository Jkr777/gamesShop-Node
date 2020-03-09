const express = require('express'),
      errorHandler = require('../middleware/error'),
      cors = require('cors'),
      corsOptions = {
        exposedHeaders: 'X-Grent',
      },
      accounts = require('../routes/accounts'),
      register = require('../routes/register'),
      login = require('../routes/login'),
      bills = require('../routes/bills'),
      games = require('../routes/games'),
      genres = require('../routes/genres');

module.exports = (app) => {
  app.use(cors(corsOptions));
  app.use(express.json());
  app.use('/accounts', accounts); 
  app.use('/register', register); 
  app.use('/log_in', login); 
  app.use('/bills', bills); 
  app.use('/games', games); 
  app.use('/genres', genres); 
  app.use(function(req, res) {
    res.status(404).send("Page Not Found");
  });
  
  app.use(errorHandler);
};