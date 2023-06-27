const express = require("express");
const router = express.Router();
const multer = require("multer");

const {
  authenticateUser,
  register,
  editProfile,
} = require("./service/userService");
const {
  getAllWarisanNusantara,
  getWarisanNusantaraById,
  addWarisanNusantara,
  editWarisanNusantara,
  deleteWarisanNusantara,
} = require("./service/warisanService");

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
      res.json({ message: "Login Successful", status: "Success" });
    })
    .catch((err) => {
      res.json({ err: "Invalid Credentials" });
    });
});

router.get("/register", async (req, res) => {
  res.render("register.html", { err: null });
});

router.post("/register", async (req, res) => {
  await register(req.body.name, req.body.email, req.body.password)
    .then((result) => {
      res.json({ message: "Register Successful", status: "Success" });
    })
    .catch((err) => {
      res.json({ err: "Server Error" });
    });
});

router.get("/profile/edit", (req, res) => {
  res.render("edit-profile.html", { user: loggedInUser });
});

router.put("/profile/update", async (req, res) => {
  await editProfile(
    loggedInUser._id,
    req.body.name,
    req.body.email,
    req.body.password
  )
    .then((result) => {
      if (result) {
        loggedInUser = result;
        res.json({ message: "Update Successful", status: "Success" });
      } else res.json({ err: "Server Error" });
    })
    .catch((err) => res.json({ err: "Server Error" }));
});

/*----------------------------------
/*
/*
/* end of auth
/*
-----------------------------------*/

//  get all warisanNusantara
router.get("/warisan", async (req, res) => {
  try {
    await getAllWarisanNusantara().then((result) => {
      res.json({
        semuaCollection: result,
      });
    });
  } catch (error) {
    console.error("Error retrieving warisan nusantara: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/warisanview", async (req, res) => {
  res.render("warisan.html");
});

// search specific warisanNsantara
router.get("/warisan/:id", async (req, res) => {
  try {
    await getWarisanNusantaraById(req.params.id).then((result) => {
      // res.json(result);
      res.render("update-items.html", { item: result });
    });
  } catch (error) {
    console.error("Error retrieving warisan nusantara: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

// add new warisanNusantara
router.post("/warisan", upload.single("picture"), async (req, res) => {
  await addWarisanNusantara(
    req.body.category,
    req.body.name,
    req.body.description,
    req.body.date,
    req.body.picture
  )
    .then((result) => {
      res.json({ message: "Add Successful", status: "Success" });
    })
    .catch((err) => {
      console.error("Error adding warisan nusantara: ", err);
      res.status(500).json({ err: "Internal Server Error" });
    });
});

// edit warisanNusantara
router.post("/warisan/update/:id", async (req, res) => {
  // return res.json({ message: "Update Method here" });
  try {
    var id = req.params.id;

    var category = req.body.category;
    var name = req.body.name;
    var description = req.body.description;
    var date = req.body.date;
    var picture = req.body.picture;

    await editWarisanNusantara(
      id,
      category,
      name,
      description,
      date,
      picture
    ).then((result) => {
      res.render("warisan.html");
    });
  } catch (error) {
    console.error("Error editing warisan nusantara: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// delete warisanNusantara
router.get("/warisan/delete/:id", async (req, res) => {
  try {
    var id = req.params.id;
    await deleteWarisanNusantara(id).then((result) => {
      res.render("warisan.html");
    });
  } catch (error) {
    console.error("Error deleting warisan nusantara: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/create-items", (req, res) => {
  res.render("create-items.html", { err: null });
});

router.get("/dashboard", (req, res) => {
  res.render("index.html", { err: null, user: loggedInUser });
});

router.get("/*", (req, res) => {
  res.render("login.html", { err: null });
});

module.exports = router;
