import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import { BanksComponent } from "./components/BanksComponent";
import { BankLinkComponent } from "./components/BankLinkComponent";
import UserForm from "./components/UserForm.jsx";
import UserList from "./components/UserList.jsx";
import "./App.css";

function App() {
    return (
        <>
            <Router>
                <nav>
                    <Link to="/">Inicio</Link>
                    <Link to="/login">Login</Link>
                    <Link to="/create-user">Crear Usuario</Link>
                    <Link to="/list">Lista de Usuarios</Link>
                </nav>

                <Routes>
                    <Route path="/" element={<h1>Inicio</h1>} />
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/create-user" element={<UserForm />} />
                    <Route path="/list" element={<UserList />} />
                </Routes>
            </Router>
        </>
    );
}

export default App;
