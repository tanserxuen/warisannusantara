const { User } = require("../schema/userSchema");

function register(name, email, password) {
  const user = new User({ email, password, name });
  return user.save();
}

async function authenticateUser(email, password) {
  const user = await User.findOne({ email: email });
  console.log(password, user.password);
  return { user, authenticated: user.password === password };
}

async function editProfile(id, name, email, password) {
  console.log(id, name, email, password);
  return await User.findOneAndUpdate(
    { email: email },
    { name: name, password: password }
  );
}

// async function getUserById(id) {
//   console.log({id});
// }

module.exports = { register, authenticateUser, editProfile };
