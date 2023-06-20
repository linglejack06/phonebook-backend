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
  number: {
    type: String,
    minLength: 8,
    validate: {
      validator: (v) => /\d{3}-\d{3}-\d{4}/.test(v) || /\d{2,3}-\d+/.test(v),
      message: (props) => `${props.value} is not a valid phone number`,
    },
  },
});
personSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  },
});

module.exports = mongoose.model('Person', personSchema);
