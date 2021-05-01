require("dotenv").config();
const mongoose = require("mongoose");


const db = mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
})
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.log(err));

module.exports = { db };
