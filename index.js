const express = require('express'),
      logger = require('./start_up/loggin')(__filename),
      app = express();

require('express-async-errors');
require('./start_up/routesConfig')(app);
require('./start_up/db')();
require('./start_up/production')(app);

const PORT = process.env.PORT;
app.listen(PORT, () => logger.info("express server"));