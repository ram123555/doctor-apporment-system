const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect("mongodb+srv://ramkrishnatah2020_db_user:3fmwhqnErqCu3fwr@cluster0.v23dpwf.mongodb.net/doctorApp");
  console.log("MongoDB Connected");
};

module.exports = connectDB;
