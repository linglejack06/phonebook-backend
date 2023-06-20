/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');

const uri = process.env.DB_URI;

mongoose.connect(uri)
  .then(() => console.log('Connected to Database'))
  .catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
const personSchema = mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: String,
});
personSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  },
});

module.exports = mongoose.model('Person', personSchema);
