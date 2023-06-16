require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const {
  authenticateUser,
  register,
  editProfile,
} = require("./service/userService");
const { User } = require("./schema/userSchema");

const app = express();

const bodyParser = require("body-parser");
const { log } = require("console");
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true,
  })
);

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
console.log("Mongo connected!");

app.use(express.json()); // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "html");
app.engine("html", require("ejs").renderFile);
app.use(express.static("public"));

/*
/*
/*
/* start coding here
/*
*/

//* To store logged in user details
var loggedInUser = null;

app.post("/login", async (req, res) => {
  await authenticateUser(req.body.email, req.body.password)
    .then((result) => {
      loggedInUser = result.user;
      console.log({ loggedInUser });
      res.render("index.html");
    })
    .catch((err) => {
      res.render("login.html", { err });
    });
});

app.get("/register", async (req, res) => {
  res.render("register.html", { err: null });
});

app.post("/register", async (req, res) => {
  await register(req.body.name, req.body.email, req.body.password)
    .then((result) => {
      res.render("login.html", { err: null });
    })
    .catch((err) => {
      res.render("register.html", { err });
    });
});

app.get("/profile/edit", (req, res) => {
  res.render("edit-profile.html", { user: loggedInUser });
});

app.post("/profile/update", async (req, res) => {
  await editProfile(
    loggedInUser._id,
    req.body.name,
    req.body.email,
    req.body.password
  )
    .then((result) => {
      if (result) {
        loggedInUser = result;
        res.render("index.html");
      } else res.send("Server Error");
    })
    .catch((err) => console.log(err));
});

app.get("/*", (req, res) => {
  res.render("login.html", { err: null });
  //TODO: use redirect to change the url
});

app.listen(3000, () => console.log("Server is running"));
