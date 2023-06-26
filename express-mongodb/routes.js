
const express = require('express');
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

//  get all warisanNusantara 
router.get("/warisan/", async (req, res) => {
  try{
    await getAllWarisanNusantara().then((result) => { 
      res.json({ 
        "semuaCollection": result
      })
    });
  }catch(error){
    console.error("Error retrieving warisan nusantara: ", error);
    res.status(500).json({error: "Internal Server Error"});
  }

});

// search specific warisanNsantara
router.get("/warisan/:id", async (req, res) => {
  try{
    await getWarisanNusantaraById(req.params.id).then((result) => {
      res.json({ 
        "collection": result
      })
    });
  }catch(error){
    console.error("Error retrieving warisan nusantara: ", error);
    res.status(500).json({error: "Internal Server Error"});
  }  
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

// add new warisanNusantara
router.post("/warisan/", upload.single('picture'), async (req, res) => {
  try {
    var requestData = req.body; // Assuming an array of objects in the request body

    if(requestData.length > 1){
      for (let i = 0; i < requestData.length; i++) {
        var category = requestData[i].kategory;
        var name = requestData[i].nama;
        var description = requestData[i].desc;
        var date = requestData[i].date;
        var picture = req.file.path;
  
        await addWarisanNusantara(category, name, description, date, picture);
      }
    }else{
      var category = requestData.kategory;
      var name = requestData.nama;
      var description = requestData.desc;
      var date = requestData.date;
      var picture = req.file.path;
  
      await addWarisanNusantara(category, name, description, date, picture);
    }
    res.json({ message: "Post Method here for multiple requests or single request", status: "success"});
  } catch (error) {
    console.error("Error adding warisan nusantara: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// edit warisanNusantara
router.put("/warisan/:id", async (req, res) => {
  // return res.json({ message: "Update Method here" });
  try{
    var id = req.params.id;

    var category = req.body.kategory;
    var name = req.body.nama;
    var description = req.body.desc;
    var date = req.body.date;
    var picture = req.body.gambar;
  
    await editWarisanNusantara(id, category, name, description, date, picture).then((result) => {
      res.json({ message: "Post Method here with the id: " + result._id });
    });
  }catch(error){
    console.error("Error editing warisan nusantara: ", error);
    res.status(500).json({error: "Internal Server Error"});
  }
});

// delete warisanNusantara
router.delete("/warisan/:id", async (req, res) => {
  try{
    var id = req.params.id;
    await deleteWarisanNusantara(id).then((result) => {
      res.json({ message: "Delete Method here with the id: " + result._id });
    });
  }catch(error){
    console.error("Error deleting warisan nusantara: ", error);
    res.status(500).json({error: "Internal Server Error"});
  }
});


router.get("/*", (req, res) => {
  res.render("login.html", { err: null });
});

module.exports = router;