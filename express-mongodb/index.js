const express = require("express");
const mongoose = require("mongoose");
const { saveUser } = require("./service/userService");
const { User } = require("./schema/userSchema");
require("dotenv").config();

const app = express();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

console.log("Mongo connected!");



const stud = new User({
  roll_no: 1001,
  name: "Madison Hyde",
  year: 3,
  subjects: ["DBMS", "OS", "Graph Theory", "Internet Programming"],
});

saveUser(stud)

app.get("/", (req, res) => {
  User.find({}, (err, found) => {
    if (!err) {
      res.send(found);
    }
    console.log(err);
    res.send("Some error occured!");
  }).catch((err) => console.log("Error occured, " + err));
});

app.listen(3000, () => console.log("Server is running"));
