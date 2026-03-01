require("dotenv").config();
const mongoose = require("mongoose");
const userModel = require("./db");

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  const users = await userModel.find({});
  console.log("Users in DB:", users);
  process.exit(0);
}
main();
