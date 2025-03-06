// frontend/src/components/UserList.jsx
import axios from "axios";
import React, { useEffect, useState } from "react";
const apiUrl = import.meta.env.VITE_API_URL;

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [activeUser, setActiveUser] = useState("");

    useEffect(() => {
        axios
            .get(`${apiUrl}/user/list`, { withCredentials: true })
            .then((response) => {
                setUsers(response.data.users);
                setActiveUser(response.data.activeUser);
            })
            .catch((error) => console.error("Error fetching users:", error));
    }, []);

    return (
        <div>
            <h1>{activeUser.email}</h1>
            <h2>Lista de Usuarios</h2>
            {users.length > 0 ? (
                <ul>
                    {users.map((user) => (
                        <li key={user.id}>
                            {user.id} - {user.email}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No hay usuarios</p>
            )}
        </div>
    );
};

export default UserList;
