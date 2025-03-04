// frontend/src/components/UserList.jsx
import axios from "axios";
import React, { useEffect, useState } from "react";
const apiUrl = import.meta.env.VITE_API_URL;

const UserList = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        axios
            .get(`${apiUrl}/users`)
            .then((response) => setUsers(response.data))
            .catch((error) => console.error("Error fetching users:", error));
    }, []);

    return (
        <div>
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
