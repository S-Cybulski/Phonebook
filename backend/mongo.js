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

if (process.argv.length < 4) {
    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(person);
        })
        mongoose.connection.close();
    })
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

    person.save().then((result) => {
        console.log("person saved!");
        mongoose.connection.close();
    });
}
