const { User } = require("../schema/userSchema");

function register(name, email, password) {
  const user = new User({ email, password, name });
  return user.save();
}

async function authenticateUser(email, password) {
  const user = await User.findOne({ email: email });
  console.log(password, user.password);
  return password == user.password;
}

module.exports = { register, authenticateUser };
