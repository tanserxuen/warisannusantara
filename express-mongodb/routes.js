const express = require("express");
const router = express.Router();
// const multer = require("multer");

const multer = require('multer');
const { Storage } = require('@google-cloud/storage');
const { format } = require('util');

const {
  authenticateUser,
  register,
  editProfile,
  getUserById,
} = require("./service/userService");
const {
  getAllWarisanNusantara,
  getWarisanNusantaraById,
  addWarisanNusantara,
  editWarisanNusantara,
  getWarisanNusantaraByCategory,
  deleteWarisanNusantara,
} = require("./service/warisanService");

//* To store logged in user details
var loggedInUser = null;

// Initialize the Google Cloud Storage client
// const storage = new Storage({
//   projectId: 'wt-programming',
//   keyFilename: 'wt-programming-c1b7d8b75884.json'
// });

// Get the Google Cloud Storage bucket reference
const bucketName = 'warisan';
// const bucket = storage.bucket(bucketName);

//set to public for object
// bucket.acl.default.update({
//   entity: 'allUsers',
//   role: storage.acl.READER_ROLE,
// });

const storageMulter = multer.memoryStorage();
const upload = multer({
  storage: storageMulter,
  limits: {
    fileSize: 10 * 1024 * 1024, // Set the file size limit (e.g., 10MB)
  },
});

router.post("/login", async (req, res) => {
  await authenticateUser(req.body.email, req.body.password)
    .then((result) => {
      loggedInUser = result.user;
      res.json({ message: "Login Successful", status: "Success" });
    })
    .catch((err) => {
      res.json({ err: "Invalid Credentials" });
    });
});

router.post("/register", async (req, res) => {
  await register(req.body.name, req.body.email, req.body.password)
    .then((result) => {
      res.json({ message: "Register Successful" });
    })
    .catch((err) => {
      res.json({ err: "Server Error" });
    });
});


router.get("/user-id", async (req, res) => {
  res.json(loggedInUser);
});

router.get("/user/:id", async (req, res) => {
  try {
    await getUserById(req.params.id).then((result) => {
      res.json(result);
    });
  } catch (error) {
    console.error("Error retrieving user: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/profile/update", async (req, res) => {
  try {
    console.log(req.body.name, req.body.email, req.body.password);

    await editProfile(
      loggedInUser._id,
      req.body.name,
      req.body.email,
      req.body.password
    )
      .then((result) => {
        console.log("result")
        console.log(result)
        loggedInUser = result;
        res.json({ result, message: "Update Successful", status: "Success" });
      })
      .catch((err) => res.json({ err: "Server Error" }));
  } catch (err) {
    console.log(err)
  }
});

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

// search specific warisanNsantara
router.get("/warisan/:id", async (req, res) => {
  console.log(req.params.id);
  try {
    await getWarisanNusantaraById(req.params.id).then((result) => {
      res.json(result);
    });
  } catch (error) {
    console.error("Error retrieving warisan nusantara: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/warisan", upload.single("picture"), async (req, res) => {

  const picture = req.file;
  try {
    // Upload the file to Google Cloud Storage
    const gcsFileName = format('img/%s', picture.originalname); // Set the desired file path and name in the bucket
    const gcsFile = bucket.file(gcsFileName);

    const stream = gcsFile.createWriteStream({
      metadata: {
        contentType: picture.mimetype,
        predefinedAcl: 'publicRead', // Set the ACL to public-read
      },
    });

    stream.on('error', (err) => {
      console.error(err);
      return res.status(500).json({ message: 'Error uploading file to Google Cloud Storage' });
    });

    stream.on('finish', async () => {
      const publicUrl = format('https://storage.googleapis.com/%s/%s', bucketName, gcsFileName);

      await addWarisanNusantara(
        req.body.category,
        req.body.name,
        req.body.description,
        req.body.date,
        publicUrl
      ).then((result) => {
        res.json({ message: "Add Successful", status: "Success" });
      })
        .catch((err) => {
          console.error("Error adding warisan nusantara: ", err);
          res.status(500).json({ err: "Internal Server Error" });
        });
      // Perform other operations with the uploaded data
    });
    stream.end(picture.buffer);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error processing the request' });
  }
});

router.get("/warisan/category/:category", async (req, res) => {
  try {
    var category = req.params.category;
    // res.json({ message: category });
    await getWarisanNusantaraByCategory(category).then((result) => {
      res.json(result);
    });
  } catch (error) {
    console.error("Error retrieving warisan nusantara: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// edit warisanNusantara
router.put("/warisan/update/:id", upload.single("picture"), async (req, res) => {
  const picture = req.file;

  try {
    // Upload the file to Google Cloud Storage
    const gcsFileName = format('img/%s', picture.originalname); // Set the desired file path and name in the bucket
    const gcsFile = bucket.file(gcsFileName);

    const stream = gcsFile.createWriteStream({
      metadata: {
        contentType: picture.mimetype,
        predefinedAcl: 'publicRead', // Set the ACL to public-read
      },
    });

    stream.on('error', (err) => {
      console.error(err);
      return res.status(500).json({ message: 'Error uploading file to Google Cloud Storage' });
    });

    stream.on('finish', async () => {
      const publicUrl = format('https://storage.googleapis.com/%s/%s', bucketName, gcsFileName);
      try {
        var id = req.params.id;

        var category = req.body.category;
        var name = req.body.name;
        var description = req.body.description;
        var date = req.body.date;
        var picture = publicUrl;

        await editWarisanNusantara(
          id,
          category,
          name,
          description,
          date,
          picture
        ).then((result) => {
          res.json({ message: "Update Successful", status: "Success" });
        });
      } catch (error) {
        console.error("Error editing warisan nusantara: ", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });
    stream.end(picture.buffer);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error processing the request' });
  }
});


// delete warisanNusantara
router.delete("/warisan/delete/:id", async (req, res) => {
  try {
    var id = req.params.id;
    await deleteWarisanNusantara(id).then((result) => {
      res.json({ message: "Delete Successful", status: "Success" });
    });
  } catch (error) {
    console.error("Error deleting warisan nusantara: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
