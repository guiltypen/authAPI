// bcrypt for password Hashing
const bcrypt = require("bcrypt");

// get token
const jwt = require("jsonwebtoken");

// token config
const { JWT_SECRET, JWT_EXPIRATION_MS } = require("./config/key");

// Database
const { User } = require("./db/models");

//**** */ Signup Controller ****

exports.signup = async (req, res, next) => {
  const { password } = req.body;
  const saltRounds = 10;

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log("exports.signup -> hashedPassword", hashedPassword);
    req.body.password = hashedPassword;
    const newUser = await User.create(req.body);
    const payload = {
      id: newUser.id,
      username: newUser.username,
      exp: Date.now() + JWT_EXPIRATION_MS,
    };
    const token = jwt.sign(JSON.stringify(payload), JWT_SECRET);
    res.status(201).json({
      message: token,
    });
  } catch (error) {
    next(error);
  }
};

//**** */ Signin Controller ****
exports.signin = (req, res) => {
  const { user } = req;
  const payload = {
    id: user.id,
    exp: Date.now() + parseInt(JWT_EXPIRATION_MS),
  };
  const token = jwt.sign(JSON.stringify(payload), JWT_SECRET);
  res.json({ token });
};
