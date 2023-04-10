import { faGithub, faDiscord, faJava, faPython, faReact, faUnity, faSquareJs, faGit, faLinux } from "@fortawesome/free-brands-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, useState } from 'react'
import Tooltip from '../components/Tooltip'
import { StarComponent } from "../types"
import './App.css'

const randomRange = (min: number, max: number) => {
    min = Math.ceil(min);
    return Math.floor(Math.random() * (Math.floor(max) - min + 1)) + min;
}

// https://stackoverflow.com/questions/53395147/use-react-hook-to-implement-a-self-increment-counter
function useInterval(callback: () => void, delay: number) {
    const savedCallback = useRef<() => void>();

    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        let id = setInterval(() => {
            if (savedCallback.current === undefined) return;
            savedCallback.current();
        }, delay);
        return () => clearInterval(id);
    }, [delay]);
  }
  

export default () => {
    const [components, setComponents] = useState<StarComponent[]>([]);
    const [counter, setCounter] = useState<number>(0);

    useInterval(() => {
        const component: StarComponent = {
            x: randomRange(0, window.innerWidth - 8), // We remove the fontSize so that it wont go outside the screen
            y: randomRange(0, window.innerHeight - 12), // We remove the lineHeight for the same reasonas above
            rotation: randomRange(0, 360),
            id: counter,
        }
        setCounter(counter + 1);
        setComponents(oldComponents => [...oldComponents, component]);
        setTimeout(() => {
            setComponents(oldComponents => oldComponents.filter(c => c.id !== component.id)); // Remove current component
        }, 3000); // Animation takes 2.5 seconds, remove it after 3 seconds just to be safe
    }, 50);

    return (
        <>
            <div>
                {components.map(component => (
                    <FontAwesomeIcon key={component.id} style={{
                        top: `${component.y}px`,
                        left: `${component.x}px`,
                        rotate: `${component.rotation}deg`,
                        position: "absolute",
                        fontSize: "0.5rem", /* 8px */
                        lineHeight: "0.75rem", /* 12px */
                        zIndex: -5,
                    }} className="star block text-white" icon={faStar} />
                ))}
            </div>
            <div className="w-[100%] flex justify-center items-center mt-24">
                <div className='block'>
                    <div className='flex justify-center'>
                        <img className='w-32 rounded-2xl' src='https://cdn.discordapp.com/avatars/795651331721265153/a02e4287d1474a2f1c5185ba1c324c83.webp?size=2048' />
                    </div>
                    <p className='text-xl mt-4'>GacekKosmatek</p>
                    <p className='text-lg mt-2'>Software Developer</p>
                    <div className='mt-8 text-2xl'>
                    <p className='text-xl'>My socials</p>
                        <div className='flex flex-row flex-nowrap justify-center'>
                            <Tooltip icon={faGithub} text="My GitHub" href="https://github.com/GacekKosmatek" />
                            <Tooltip icon={faDiscord} text="GacekKosmatek#8381" href="https://discord.com/users/795651331721265153" />
                        </div>
                        <p className='text-xl'>Technologies I know and use</p>
                        <div className='flex flex-row flex-nowrap justify-center'>
                            <Tooltip icon={faPython} text='Python' />
                            <Tooltip icon={faJava} text='Java' />
                            <Tooltip icon={faSquareJs} text='JavaScript' />
                            <Tooltip icon={faReact} text='React.js' />
                            <Tooltip icon={faUnity} text='Unity' />
                            <Tooltip icon={faGit} text='Git' />
                            <Tooltip icon={faLinux} text='Linux' />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
