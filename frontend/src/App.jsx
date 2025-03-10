import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { BanksComponent } from "./components/BanksComponent";
import { BankLinkComponent } from "./components/BankLinkComponent";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginForm from "./components/LoginForm";
import UserForm from "./components/UserForm.jsx";
import UserList from "./components/UserList.jsx";
import { useAuth } from "./context/UserContext.jsx";
import "./App.css";
import Header from "./components/Header.jsx";

function App() {
    return (
        <>
            <Router>
                <Header />
                <Routes>
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                <h1>Inicio</h1>
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/create-user" element={<UserForm />} />
                    <Route
                        path="/list"
                        element={
                            <ProtectedRoute>
                                <UserList />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </Router>
        </>
    );
}

export default App;
