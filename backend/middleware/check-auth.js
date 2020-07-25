const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    /* "Bearer" */
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, "secret_this_should_be_longer");
    req.userData = { email: decodedToken.email, userId: decodedToken.id };
    next();
  } catch (error) {
    res.status(401).json({ message: "From server: Authorization failed!" });
  }
};
