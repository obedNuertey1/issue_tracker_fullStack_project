const mongoose = require('mongoose');
const db = mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
  console.log("Connected to MongoDB Atlas");
}).catch((err) => {
  console.log('Error connecting to MongoDB Atlas:', err);
});

module.exports = db;