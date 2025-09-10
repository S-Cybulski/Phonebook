 
const mongoose = require("mongoose");
const Person = require("./models/person.js");

if (process.argv.length < 4) {
    Person.find({}).then((result) => {
        result.forEach((person) => {
            console.log(`${person.name} ${person.number}`);
        });
        mongoose.connection.close();
    });
} else if (process.argv.length < 5) {
    console.log(
        "Please provide number information in this format: node mongo.js <password> <name> <number>"
    );
    mongoose.connection.close();
} else {
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4],
    });

    person.save().then(() => {
        console.log("person saved!");
        mongoose.connection.close();
    });
}
