import { useAuth } from "../context/UserContext.jsx";
import { Link } from "react-router-dom";
import LogoutButton from "./LogoutButton.jsx";
import SettingsButton from "./SettingsButton.jsx";

const Header = () => {
    const { user, loading } = useAuth();

    if (loading) return null;

    return (
        <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
            <nav className="mx-auto flex h-14 max-w-screen-xl items-center gap-6 px-6">
                <Link
                    to="/"
                    className="text-base font-bold tracking-tight text-foreground hover:text-foreground/80"
                >
                    Next<span className="text-primary/60">_</span>Balance
                </Link>

                {user ? (
                    <>
                        <div className="ml-auto flex items-center gap-4">
                            <span className="text-sm text-muted-foreground hidden sm:block">
                                {user.email}
                            </span>
                            <LogoutButton />
                            <SettingsButton />
                        </div>
                    </>
                ) : (
                    <div className="ml-auto flex items-center gap-4">
                        <Link
                            to="/login"
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Login
                        </Link>
                        <Link
                            to="/create-user"
                            className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                        >
                            Sign up
                        </Link>
                    </div>
                )}
            </nav>
        </header>
    );
};

export default Header;
