import { useState } from "react";
import entryService from "../services/entry.js";
import "./Form.css";

const Form = ({ persons, setPersons, setNotificationMessage, setNotificationType }) => {
    const [newName, setNewName] = useState("");
    const [newNumber, setNewNumber] = useState("");

    const addName = (event) => {
        event.preventDefault();
        const person = {
            name: newName,
            number: newNumber,
        };

        const existingPerson = persons.find((entry) => entry.name === person.name);

        if (existingPerson) {
            if (existingPerson.number != person.number) {
                if (window.confirm(`${existingPerson.name} is already added to phonebook, replace the old number with a new one?`)) {
                    entryService.update(existingPerson.id, { ...existingPerson, number: person.number })
                    .then((updatedPerson) => {
                        setPersons(persons.map(entry => entry.id !== existingPerson.id ? entry : updatedPerson));
                    }).catch(error => {
                        setNotificationMessage(`Information of ${person.name} has already been removed from server`);
                        setNotificationType("error");
                        setTimeout(() => {
                            setNotificationMessage(null)
                        }, 5000);
                    });
                }
                return;
            }
            alert(`${person.name} is already added to the contact list`);
            console.log(persons);

            return;
        }

        entryService.create(person).then((returnedEntry) => {
            setNotificationMessage(`Added ${person.name}`);
            setNotificationType("success");
            setPersons(persons.concat(returnedEntry));
            setTimeout(() => {
                setNotificationMessage(null);
            }, 5000);
        })

        setNewName("");
        setNewNumber("");
        console.log(persons);
    };

    const handleNameChange = (event) => {
        setNewName(event.target.value);
    };

    const handlePhoneNumberChange = (event) => {
        setNewNumber(event.target.value);
    };

    return (
        <form onSubmit={addName} className={"person-form"}>
            <div className={"input-box"}>
                Name: <input 
                    value={newName} 
                    onChange={handleNameChange} 
                    className={"input-field"}
                    placeholder={"Enter name"}/>
            </div>
            <div className={"input-box"}>
                Number:
                <input 
                    value={newNumber} 
                    onChange={handlePhoneNumberChange} 
                    className={"input-field"}
                    placeholder={"Enter phone number"}/>
            </div>
            <div>
                <button type="submit" className="add-button">Add</button>
            </div>
        </form>
    );
};

export default Form;
