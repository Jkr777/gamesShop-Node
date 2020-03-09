const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  const token = req.header("X-Grent");
  if(!token) return res.status(401).send("Invalid Token");

  try {
    const decoded = jwt.verify(token, process.env.GRENT_JWT);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).send("Invalid Token");
  }
};