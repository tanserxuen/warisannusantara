const { User } = require("../schema/userSchema");

async function register(name, email, password) {
  try {
    const existing = await User.findOne({ email: email });
    if (existing == null)
      return await new User({ name, email, password }).save();
    else throw "Duplicate Email";
  } catch (error) {
    throw error;
  }
}

async function authenticateUser(email, password) {
  try {
    const user = await User.findOne({ email: email });
    if (user.password === password) return { user, authenticated: true };
    else throw "Invalid Credentials";
  } catch (error) {
    throw error;
  }
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
