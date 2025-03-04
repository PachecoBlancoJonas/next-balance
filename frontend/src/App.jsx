import React from "react";
import "./App.css";
import { BanksComponent } from "./components/BanksComponent";
import { BankLinkComponent } from "./components/BankLinkComponent";
import UserForm from "./components/UserForm.jsx";
import UserList from "./components/UserList.jsx";

function App() {
    return (
        <>
            <h1>Gestión de Usuarios</h1>
            <UserForm />
            <UserList />
            <BanksComponent />
            <BankLinkComponent />
        </>
    );
}

export default App;
