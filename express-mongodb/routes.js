
const express = require('express');
const router = express.Router();

const {
  authenticateUser,
  register,
  editProfile,
} = require("./service/userService");


/*----------------------------------
/*
/*
/* start auth
/*
-----------------------------------*/

//* To store logged in user details
var loggedInUser = null;

router.post("/login", async (req, res) => {
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

router.get("/register", async (req, res) => {
  res.render("register.html", { err: null });
});

router.post("/register", async (req, res) => {
  await register(req.body.name, req.body.email, req.body.password)
    .then((result) => {
      res.render("login.html", { err: null });
    })
    .catch((err) => {
      res.render("register.html", { err });
    });
});

router.get("/profile/edit", (req, res) => {
  res.render("edit-profile.html", { user: loggedInUser });
});

router.post("/profile/update", async (req, res) => {
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

/*----------------------------------
/*
/*
/* end of auth
/*
-----------------------------------*/


router.get("/*", (req, res) => {
  res.render("login.html", { err: null });
  //TODO: use redirect to change the url
});

module.exports = router;