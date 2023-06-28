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
  User.findOneAndUpdate(
    { email: email },
    { name: name, password: password }
  ).then((result) => {
    console.log("controller-side result")
    console.log(result)
    return { result };
  });
  // return user;
  // return await User.findOneAndUpdate(
  //   { email: email },
  //   { name: name, password: password }
  // );
}

async function getUserById(id) {
  try {
      var result = await User.findOne({_id: id.toString()});
      if(result) return result;
      else throw new Error("User not found");
  } catch (error) {
      console.error("Error retrieving User by id: ", error);
  }
}

module.exports = { register, authenticateUser, editProfile, getUserById };
