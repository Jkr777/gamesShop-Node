module.exports = function (req, res, next) {
  if(req.user.admin) return next();
  return res.status(403).send("Access denied");
};