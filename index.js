const express = require('express');
// eslint-disable-next-line import/no-extraneous-dependencies
const morgan = require('morgan');

const app = express();
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
  res.json(persons);
});
app.get('/api/persons/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const person = persons.find((p) => p.id === id);
  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});
app.delete('/api/persons/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  persons = persons.filter((p) => p.id !== id);
  res.status(204).end();
});
const generateId = () => Math.floor(Math.random() * 1000);
app.post('/api/persons', (req, res) => {
  const { body } = req;
  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'Name or Number missing',
    });
  }
  if (persons.find((p) => p.name === body.name)) {
    return res.status(400).json({
      error: 'Name already exists in phonebook',
    });
  }
  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  };
  persons = persons.concat(person);
  return res.json(person);
});
app.get('/info', (req, res) => {
  res.send(`<p>Phonebook has information for ${persons.length} people</p><p>${new Date().toLocaleString()}</p>`);
});
app.listen(3001);
