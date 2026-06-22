const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect("mongodb+srv://ramkrishnatah2020_db_user:GC7YgSeHXqUVQBx7@cluster0.v23dpwf.mongodb.net/doctorApp");
  console.log("MongoDB Connected");
};

module.exports = connectDB;
