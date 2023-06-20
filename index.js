/* eslint-disable no-param-reassign */
/* eslint-disable consistent-return */
/* eslint-disable import/no-extraneous-dependencies */
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');

const app = express();
app.use(cors());
app.use(express.static('dist'));
// eslint-disable-next-line no-unused-vars
morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));
app.get('/api/persons', (req, res) => {
  Person.find({}).then((savedPersons) => {
    res.json(savedPersons);
  });
});
app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => next(error));
});
app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(() => res.status(204).end())
    .catch((error) => next(error));
});
app.post('/api/persons', (req, res, next) => {
  const { body } = req;
  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'Name or Number missing',
    });
  }
  Person.find({ name: body.name }).then((result) => {
    if (result.length !== 0) {
      return res.status(400).end();
    }
    const person = new Person({
      name: body.name,
      number: body.number,
    });
    person.save()
      .then((savedPerson) => {
        res.json(savedPerson);
      })
      .catch((error) => next(error));
  });
});
app.put('/api/persons/:id', (req, res, next) => {
  const { body } = req;
  Person.findById(req.params.id).then((result) => {
    result.number = body.number;
    result.save()
      .then((savedPerson) => {
        res.json(savedPerson);
      })
      .catch((error) => next(error));
  });
});
app.get('/info', (req, res) => {
  Person.find({})
    .then((result) => res.send(`<p>Phonebook has information for ${result.length} people</p><p>${new Date().toLocaleString()}</p>`));
});
const errorHandler = (error, req, res, next) => {
  console.error(error.message);
  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'incorrectly formatted id' });
  }
  if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message });
  }
  next(error);
};
app.use(errorHandler);
const { PORT } = process.env;
app.listen(PORT);
