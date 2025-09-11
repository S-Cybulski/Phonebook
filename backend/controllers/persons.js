const personRouter = require("express").Router();
const Person = require("../models/person");
const logger = require("../utils/logger");

personRouter.get("/info", (request, response) => {
    const numOfPeople = Person.countDocuments({});
    const requestTime = new Date();
    response.send(
        `<div>
        <div>Phonebook has info for ${numOfPeople}</div>
        <div>${requestTime}</div>
        </div>`
    );
});

personRouter.get("/", (request, response) => {
    Person.find({}).then((personsObject) => {
        response.json(personsObject);
    });
});

personRouter.get("/:id", (request, response) => {
    Person.findById(request.params.id)
        .then((person) => {
            if (person) {
                response.json(person);
            } else {
                response.status(404).end();
            }
        })
        .catch((error) => {
            logger.error(error);
            response.status(400).send({ error: "malformatted id" });
        });
});

personRouter.delete("/:id", (request, response, next) => {
    Person.deleteOne({ id: request.params.id })
        .then(() => {
            response.status(204).end();
        })
        .catch((error) => next(error));
});

personRouter.put("/:id", (request, response, next) => {
    const { name, number } = request.body;

    Person.findById(request.params.id)
        .then((person) => {
            if (!person) {
                return response.status(404).end();
            }

            person.name = name;
            person.number = number;

            return person.save().then((updatedPerson) => {
                response.json(updatedPerson);
            });
        })
        .catch((error) => next(error));
});

personRouter.post("/", (request, response, next) => {
    const body = request.body;

    if (!body.name) {
        return response.status(400).json({
            error: "name missing",
        });
    } else if (!body.number) {
        return response.status(400).json({
            error: "number missing",
        });
    } else if (!Person.find({ name: body.name })) {
        return response.status(409).json({
            error: "name must be unique",
        });
    }

    const person = new Person({
        name: body.name,
        number: body.number,
    });

    person
        .save()
        .then((savedPerson) => {
            response.json(savedPerson);
        })
        .catch((error) => next(error));
});

module.exports = personRouter;