const express = require("express");
const cors = require("cors");

// Passport Strategies
const { localStrategy } = require("./middleware/passport");

const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());

const db = require("./db/models");
app.use(cors());

const passport = require("passport");

// Passport Setup
app.use(passport.initialize());
passport.use(localStrategy);

const userRoutes = require("./routes");
app.use(userRoutes);

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    message: err.message || "Internal Server Error",
  });
});

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
