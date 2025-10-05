const mongoose = require("mongoose");

const dbConnect = async () => {
  console.log("conectando a mongo");
  await mongoose.connect(process.env.DB_CNN);
};

module.exports = { dbConnect };
