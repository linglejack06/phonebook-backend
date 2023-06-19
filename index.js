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
let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
];
app.get('/api/persons', (req, res) => {
  Person.find({}).then((savedPersons) => {
    res.json(savedPersons);
  });
});
app.get('/api/persons/:id', (req, res) => {
  Person.findById(req.params.id).then((person) => {
    res.json(person);
  });
});
app.delete('/api/persons/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  persons = persons.filter((p) => p.id !== id);
  res.status(204).end();
});
app.post('/api/persons', (req, res) => {
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
    person.save().then((savedPerson) => {
      res.json(savedPerson);
    });
  });
});
app.put('/api/persons/:id', (req, res) => {
  const { body } = req;
  Person.findById(req.params.id).then((result) => {
    result.number = body.number;
    result.save().then((savedPerson) => {
      res.json(savedPerson);
    });
  });
});
app.get('/info', (req, res) => {
  res.send(`<p>Phonebook has information for ${persons.length} people</p><p>${new Date().toLocaleString()}</p>`);
});

const { PORT } = process.env;
app.listen(PORT);
