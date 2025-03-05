import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import "./App.css";
import { BanksComponent } from "./components/BanksComponent";
import { BankLinkComponent } from "./components/BankLinkComponent";
import UserForm from "./components/UserForm.jsx";
import UserList from "./components/UserList.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {
    return (
        <>
            <Router>
                <Routes>
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/" element={<UserList />} />
                    <Route
                        path="/new-user"
                        element={
                            <ProtectedRoute>
                                <UserForm />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </Router>

            {/* <h1>New user:</h1>
            <UserForm />
            <UserList /> */}

            {/* <BanksComponent />
            <BankLinkComponent /> */}
        </>
    );
}

export default App;
