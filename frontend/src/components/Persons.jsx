import "./Form.jsx"

import entryService from "../services/entry.js";

const Persons = ({ persons, search, setPersons }) => {
    const personsToShow = persons.filter((person) =>
        person.name.toLowerCase().includes(search)
    );

    const deleteEntry = (id, name) => {

        if (window.confirm(`Do you want to delete ${name}?`)){
            entryService.remove(id).then(() => {
                setPersons(persons.filter((person) => person.id !== id));
            });
        }
    };

    return (
        <ul className={"person-list"}>
            {personsToShow.map((person) => (
                <li key={person.name}
                    className={"person-item"}>
                    {person.name} 
                    <div className={"person-number"}>
                        {person.number}
                    </div>
                    <button 
                        onClick={() => deleteEntry(person.id, person.name)}
                        className={"delete-button"}
                    >
                        Delete
                    </button>
                </li>
            ))}
        </ul>
    );
};

export default Persons;
