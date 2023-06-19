const mongoose = require('mongoose');

const url = process.env.DB_URL;

mongoose.connect(url)
  .then(() => console.log('Connected to Database'))
  .catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
const personSchema = mongoose.Schema({
  name: String,
  Number: String,
});

module.exports = mongoose.model('Person', personSchema);
