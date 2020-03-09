const mongoose = require('mongoose'),
  logger = require('./loggin')(__filename);

module.exports = () => {
  mongoose.connect(process.env.G_RENT, { useNewUrlParser: true, useCreateIndex: true })
  .then(() => logger.info('mongoDb'))
  .catch(err => logger.info(err));
};