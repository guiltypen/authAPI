const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const { JWT_SECRET, JWT_EXPIRATION_MS } = require("./config/key");

// Database
const { User } = require("./db/models");

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
      message:
        "User " +
        newUser.username +
        " created successfully. " +
        "Login Token is :" +
        token,
    });
  } catch (error) {
    next(error);
  }
};

exports.signin = (req, res) => {
  const { user } = req;
  const payload = {
    id: user.id,
    exp: Date.now() + parseInt(JWT_EXPIRATION_MS), // the token will expire 15 minutes from when it's generated
  };
  const token = jwt.sign(JSON.stringify(payload), JWT_SECRET);
  res.json({ token });
};
