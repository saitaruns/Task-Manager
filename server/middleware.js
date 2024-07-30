const jwt = require("jsonwebtoken");
const User = require("./db/models/User");

const SECRET_TOKEN = process.env.SECRET_TOKEN;

const authMiddleware = async (req, res, next) => {
  try {
    // Get the token from the request headers
    const token = req.header("Authorization").replace("Bearer ", "");

    // Verify the token
    const decoded = jwt.verify(token, SECRET_TOKEN);

    // Find the user associated with the token
    const user = await User.findOne({ _id: decoded.userId });

    if (!user) {
      throw new Error();
    }

    // Attach the user and token to the request object
    req.user = user;

    next();
  } catch (error) {
    res.status(401).send({ error: "Authentication failed" });
  }
};

module.exports = authMiddleware;
