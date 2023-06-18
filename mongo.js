/* eslint-disable import/no-extraneous-dependencies */
const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('provide password');
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://captainjack0818:${password}@phonebook.mttuh6t.mongodb.net/phonebook?retryWrites=true&w=majority`;

mongoose.set('strictQuery', false);
mongoose.connect(url);

const personSchema = mongoose.Schema({
  name: String,
  number: String,
});
const Person = mongoose.model('Person', personSchema);

if (process.argv.length < 4) {
  Person.find({}).then((result) => {
    console.log('Phonebook');
    result.forEach((res) => {
      console.log(res.name, res.number);
    });
    mongoose.connection.close();
  });
} else {
  const name = process.argv[3];
  const number = process.argv[4];
  const person = new Person({
    name, number,
  });
  person.save().then((result) => {
    console.log(`Added ${result.name} number ${result.number} to phonebook`);
    mongoose.connection.close();
  });
}
