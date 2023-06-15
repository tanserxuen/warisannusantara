function saveUser(user) {
  user.save().then(
    () => console.log("One entry added"),
    (err) => console.log(err)
  );
}

module.exports = { saveUser };