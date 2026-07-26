import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginForm from "./components/LoginForm";
import NewUserForm from "./components/NewUserForm.jsx";
import UserList from "./components/UserList.jsx";
import GoCardlessCallback from "./pages/GoCardlessCallback.jsx";
import "./App.css";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import NextBalance from "./components/NextBalance.jsx";
import NextTransactions from "./components/NextTransactions.jsx";
import Settings from "./components/Settings.jsx";

function App() {
    return (
        <Router>
            <div className="flex min-h-screen flex-col">
                <Header />
                <Routes>
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/create-user" element={<NewUserForm />} />
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                <NextBalance />
                            </ProtectedRoute>
                        }
                    />
<Route
                        path="/settings"
                        element={
                            <ProtectedRoute>
                                <Settings />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/list"
                        element={
                            <ProtectedRoute>
                                <UserList />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/gocardless/callback"
                        element={
                            <ProtectedRoute>
                                <GoCardlessCallback />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
