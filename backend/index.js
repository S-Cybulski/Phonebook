require('dotenv').config();

const express = require("express");
const morgan = require("morgan")
const Person = require("./models/person")
const app = express();

app.use(express.static('dist'));
app.use(express.json());

morgan.token('body', function (req, res) {return JSON.stringify(req.body)})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

app.get('/info', (request, response) => {
    const numOfPeople = Person.countDocuments({});
    const requestTime = new Date();
    response.send(
        `<div>
            <div>Phonebook has info for ${numOfPeople}</div>
            <div>${requestTime}</div>
        </div>`
    )
});

app.get('/api/persons', (request, response) => {
    Person.find({}).then(personsObject => {
        response.json(personsObject);
    })
});

app.get('/api/persons/:id', (request, response) => {
    Person.find({id: request.params.id}).then(person => {
        response.json(person);
    })
});

app.delete('/api/persons/:id', (request, response) => {
    Person.deleteOne({id: request.params.id}).then(() => {
        response.status(204).end();
    })
});

const generateId = () => {
    const persons = Person.find({});
    const maxId = Person.countDocuments({}) > 0 
        ? Math.max(...persons.map(n => Number(n.id))) 
        : 0;
    return String(maxId + 1);
};

app.post('/api/persons', (request, response) => {
    const body = request.body;

    if (!body.name) {
        return response.status(400).json({
            error: 'name missing'
        });
    } else if (!body.number) {
        return response.status(400).json({
            error: 'number missing'
        });
    } else if (!Person.find({name: body.name})) {
        return response.status(409).json({
            error: 'name must be unique'
        });
    }
    
    const person = new Person({
        id: generateId(),
        name: body.name,
        number: body.number
    })

    person.save().then(savedPerson => {
        response.json(savedPerson);
    })
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
