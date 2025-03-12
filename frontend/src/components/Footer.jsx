import { SiGithub, SiGithubsponsors } from "react-icons/si";
import "./Footer.css";

function Footer() {
    return (
        <footer>
            <p>
                Made with <SiGithubsponsors className="heart-icon" /> <br />
                by{" "}
                <a href="https://github.com/PachecoBlancoJonas" target="_blank">
                    <SiGithub className="github-icon" /> Jonás Pacheco Blanco
                </a>
            </p>
        </footer>
    );
}

export default Footer;
