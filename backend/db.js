const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const user = new Schema({
  name: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String},
  profile_url: {
    type: String,
    default: "https://res.cloudinary.com/dbqdx1m4t/image/upload/v1771181818/profile_pics/nwirmfxg3fi59tqnxyyj.jpg"
  },

})

const userModel = mongoose.model("users", user);

module.exports = userModel;

