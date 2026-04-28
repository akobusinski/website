import { faPython, faJava, faRust, faTypescript, faLinux, faGit, faReact, faDocker, faLinkedin, faGithub, faDiscord } from "@fortawesome/free-brands-svg-icons"
import * as motion from "motion/react-client";
import { StarCanvas } from "@/components/stars/canvas";
import type { SocialLink, Tools } from "@/components/UserProfile";
import { getUser } from "./actions";
import { MotionUserProfile } from "@/components/MotionUserProfile";

const LANGUAGES: Tools[] = [
    { icon: faPython, name: "Python" },
    { icon: faJava, name: "Java" },
    { icon: faRust, name: "Rust" },
    { icon: faTypescript, name: "TypeScript" },
];

const SOFTWARE: Tools[] = [
    { icon: faLinux, name: "Linux" },
    { icon: faGit, name: "Git" },
    { icon: faReact, name: "React.js" },
    { icon: faDocker, name: "Docker" },
]

const TOOLS = [...LANGUAGES, ...SOFTWARE];
const LINKS: SocialLink[] = [
    { icon: faLinkedin, platform: "LinkedIn", href: "https://www.linkedin.com/in/antoni-kobusiński-a3045a2b1" },
];

export default async function Home() {
    const user = await getUser();

    const links: SocialLink[] = [];

    if (user.github) {
        links.push({ icon: faGithub, platform: "GitHub", href: `https://github.com/${user.github}` });
    }

    links.push(...LINKS);

    if (user.discord) {
        links.push({ icon: faDiscord, platform: "Discord", href: `https://discord.com/users/${user.discord.id}`});
    }

    return <>
        <motion.div
            className="fixed inset-0 -z-50 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2.5 }}
        >
            <StarCanvas />
        </motion.div>

        <main className="flex flex-1 justify-center items-center">
            <MotionUserProfile
                user={user}
                tools={TOOLS}
                links={links}
                initial={{ y: 25, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1 }}
            />
        </main>
    </>
}
