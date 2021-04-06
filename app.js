const express = require("express");
const cors = require("cors");

// Passport Strategies
const { localStrategy } = require("./middleware/passport");

// to get value req.body
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());

const db = require("./db/models");

app.use(cors());

// Passport Setup
const passport = require("passport");
app.use(passport.initialize());
passport.use(localStrategy);

// call routes
const userRoutes = require("./routes");
app.use(userRoutes);

// error handling middleware
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    message: err.message || "Internal Server Error",
  });
});

// localhost main page
app.get("/", (req, res) => {
  res.json({ message: "This is the auth api" });
});

const run = async () => {
  try {
    await db.sequelize.sync({ force: true });
    console.log("Connection to the database successful!");
    await app.listen(8000, () => {
      console.log("The application is running on localhost:8000");
    });
  } catch (error) {
    console.error("Error connecting to the database: ", error);
  }
};

run();
