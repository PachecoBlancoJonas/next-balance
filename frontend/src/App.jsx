import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginForm from "./components/LoginForm";
import UserForm from "./components/UserForm.jsx";
import UserList from "./components/UserList.jsx";
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
                                <h1>Home</h1>
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
