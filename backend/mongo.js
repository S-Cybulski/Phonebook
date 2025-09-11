const mongoose = require("mongoose");
const Person = require("./models/person.js");
const logger = require("./utils/logger.js");

if (process.argv.length < 4) {
    Person.find({}).then((result) => {
        result.forEach((person) => {
            logger.info(`${person.name} ${person.number}`);
        });
        mongoose.connection.close();
    });
} else if (process.argv.length < 5) {
    logger.info(
        "Please provide number information in this format: node mongo.js <password> <name> <number>"
    );
    mongoose.connection.close();
} else {
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4],
    });

    person.save().then(() => {
        logger.info("person saved!");
        mongoose.connection.close();
    });
}
