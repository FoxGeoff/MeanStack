const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
  /* "Bearer" */
  const token = req.headers.authorization.split(" ")[1];
  jwt.verify(token, "secret_this_should_be_longer");
  next();
  } catch (eror) {
    res.status(401).json({message: "From server: Authorization failed!"});
  }
};
