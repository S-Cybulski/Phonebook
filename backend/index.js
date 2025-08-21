const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");

if (process.argv.length < 3) {
    console.log("give password as argument");
    process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://test:${password}@phonebook.wt5n1ab.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=phonebook`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
});

const Person = mongoose.model("Person", personSchema);

const app = express();

morgan.token('body', function (req, res) {return JSON.stringify(req.body)})

app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

let persons = [
    {
        id: "1",
        name: "Arto Hellas",
        number: "040-123456",
    },
    {
        id: "2",
        name: "Ada Lovelace",
        number: "39-44-5323523",
    },
    {
        id: "3",
        name: "Dan Abramov",
        number: "12-43-234345",
    },
    {
        id: "4",
        name: "Mary Poppendieck",
        number: "39-23-6423122",
    },
];

app.get('/info', (request, response) => {
    const numOfPeople = persons.length;
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
    const id = request.params.id;
    const person = persons.find(person => person.id === id);
    response.json(person);
});

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id;
    const persons = persons.filter(person => person.id === id);
    response.status(204).end();
});

const generateId = () => {
    const maxId = persons.length > 0 
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
    } else if (!persons.find(personName => personName === body.name)) {
        return response.status(409).json({
            error: 'name must be unique'
        });
    }
    
    const person = {
        id: generateId(),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person);

    response.json(person);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
