import { Link } from "react-router-dom";
import { Settings } from "lucide-react";

const SettingsButton = () => {
    return (
        <Link
            to="/settings"
            className="text-muted-foreground hover:text-foreground transition-colors"
        >
            <Settings size={17} />
        </Link>
    );
};

export default SettingsButton;
