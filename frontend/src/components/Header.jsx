import React from "react";
import { useAuth } from "../context/UserContext.jsx";
import { Link } from "react-router-dom";
import LogoutButton from "./LogoutButton.jsx";

const Header = () => {
    const { user, loading } = useAuth(); // Obtenemos el usuario y la función logout

    if (loading) {
        return <div>Cargando...</div>; // Puedes mostrar un spinner o texto mientras cargamos el estado
    }

    return (
        <header>
            {user ? (
                <>
                    <span>Bienvenido, {user.email}</span>
                    <LogoutButton />
                    <nav>
                        <Link to="/">Inicio</Link>
                        <Link to="/list">Lista de Usuarios</Link>
                    </nav>
                </>
            ) : (
                <>
                    <nav>
                        <Link to="/create-user">Crear Usuario</Link>
                        <Link to="/login">Iniciar sesión</Link>
                    </nav>
                </>
            )}
        </header>
    );
};

export default Header;
