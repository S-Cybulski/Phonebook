import { useState, useEffect } from "react";
import Form from "./components/Form";
import Search from "./components/Search";
import Persons from "./components/Persons";
import Notification from "./components/Notification.jsx";
import entryService from "./services/entry.js";
import "./index.css";

const App = () => {
    const [persons, setPersons] = useState([]);
    const [search, setSearch] = useState("");
    const [notificationMessage, setNotificationMessage] = useState(null);
    const [notificationType, setNotificationType] = useState(null);

    useEffect(() => {
        entryService.getAll().then((entries) => {
            console.log("promise fulfilled");
            setPersons(entries);
        });
    }, []);

    return (
        <div className={"container"}>
            <h2>Phonebook</h2>
            <Notification
                message={notificationMessage}
                notificationType={notificationType}
            ></Notification>
            <Form
                persons={persons}
                setPersons={setPersons}
                setNotificationMessage={setNotificationMessage}
                setNotificationType={setNotificationType}
            />
            <h2>Numbers</h2>
            <Search search={search} setSearch={setSearch} />
            <Persons
                persons={persons}
                search={search}
                setPersons={setPersons}
            />
        </div>
    );
};

export default App;
