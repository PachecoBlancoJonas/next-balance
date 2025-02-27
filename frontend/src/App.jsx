import React from "react";
import "./App.css";
import { BanksComponent } from "./components/BanksComponent";
import { BankLinkComponent } from "./components/BankLinkComponent";

function App() {
    const [transacciones, setTransacciones] = React.useState(
        "Transacciones iniciales"
    );
    function cargarTransacciones() {
        setTransacciones("Nuevas transacciones");
    }
    return (
        <>
            <BanksComponent />
            <BankLinkComponent />
        </>
    );
}

export default App;
