import { SiGithub } from "react-icons/si";

function Footer() {
    return (
        <footer className="border-t border-border mt-auto">
            <div className="mx-auto flex max-w-screen-xl items-center justify-center gap-2 px-6 py-6 text-sm text-muted-foreground">
                <a
                    href="https://github.com/PachecoBlancoJonas"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 hover:text-foreground transition-colors"
                >
                    <SiGithub size={14} />
                    Jonás Pacheco Blanco
                </a>
            </div>
        </footer>
    );
}

export default Footer;
