import { Link } from "react-router-dom";
import { IoSettingsSharp } from "react-icons/io5";

const SettingsButton = () => {
    return (
        <Link to="/settings">
            <IoSettingsSharp className="settings-icon" size={32} />
        </Link>
    );
};

export default SettingsButton;
