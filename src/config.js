const { name } = require('ejs');
const mongoose = require('mongoose');
const connect = mongoose.connect("mongodb://localhost:27017/");
const dbName = 'test';
const collectionName = 'users';

// Check database connected or not
connect.then(() => {
    console.log("Database Connected Successfully");
})
.catch(() => {
    console.log("Database cannot be Connected");
})

// Create Schema
const Loginschema = new mongoose.Schema({
    name: {
        type:String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});



//find username
collection.findOne({ name: 'desiredUsername' }, { projection: { _id: 0, name: 1 } }, (error, result) => {
    if (error) {
      console.error('Error finding document:', error);
      return;
    }

    if (result) {
      console.log('Username:', result.name);
    } else {
      console.log('User not found');
    }

    // Close the connection
    client.close();
  });

// collection part
const collection = new mongoose.model("users", Loginschema);

module.exports = collection;



//socket io
