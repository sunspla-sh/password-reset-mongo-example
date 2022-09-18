const mongoose = require('mongoose');
const DB_CONNECTION_URI = process.env.MONGODB_URI;

module.exports = async function connection(){
  try {
    let myConnection = await mongoose.connect(
      DB_CONNECTION_URI,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        autoIndex: true
      }
    );
    console.log('mongoose successfully connected to database ', myConnection.connections[0].name);
  } catch (err) {
    console.log('mongoose failed to connect to database ', err);
  }
}