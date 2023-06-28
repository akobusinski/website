import { faGithub, faDiscord, faJava, faPython, faReact, faUnity, faSquareJs, faGit, faLinux } from "@fortawesome/free-brands-svg-icons"
// @ts-ignore -- This works fine, but for some reason TypeScript thinks its not
import { ReactComponent as Star } from './assets/star-solid.svg'
import { useEffect, useRef, useState } from 'react'
import Tooltip from './components/Tooltip'
import { StarComponent, User } from "./types"
import { motion } from 'framer-motion'
import useSWR from 'swr'
import './App.css'

const fetcher = async (input: RequestInfo, init: RequestInit, ...args: any[]) => { return (await fetch(input, init)).json(); };

const randomRange = (min: number, max: number) => {
    min = Math.ceil(min);
    // return Math.floor(Math.random() * (Math.floor(max) - min + 1)) + min;
    return Math.random() * (max - min + 1) + min;
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
    const { data, error, isLoading } = useSWR<User, Error>('/api/getUser', fetcher);
    
    useInterval(() => {
        if (!data) return

        const component: StarComponent = {
            x: randomRange(4, window.innerWidth - 12 - 4), // We remove the width of the icon so it doesnt go outside of the screen and give it 4 pixels of a virtual border
            y: randomRange(4, window.innerHeight - 12 - 4), // We remove the height of the icon so it doesnt go outside of the screen and give it 4 pixels of a virtual border
            rotation: randomRange(0, 360),
            id: counter,
        }
        setCounter(counter + 1);
        setComponents(oldComponents => [...oldComponents, component]);
        setTimeout(() => {
            setComponents(oldComponents => oldComponents.filter(c => c.id !== component.id)); // Remove current component
        }, 3000); // Animation takes 2.5 seconds, remove it after 3 seconds just to be safe
    }, 50);

    if (!data) {
        return (<div className="w-full max-h-screen h-full">
            <div className="flex justify-center items-center text-center w-full h-full flex-col">
                <p className="text-2xl">{isLoading ? "Loading.." : "Something went wrong whilst loading information!"}</p>
                {(error && !isLoading) ? (<p className="text-lg">{error.message}</p>) : (<></>)}
            </div>
        </div>);
    }

    document.title = data.name

    return (
        <>
            <div className="absolute left-0 top-0 fill-white">
                {components.map(component => (
                    <Star key={component.id} style={{
                        top: `${component.y}px`,
                        left: `${component.x}px`,
                        rotate: `${component.rotation}deg`,
                        position: "absolute",
                        fontSize: "0.5rem", /* 8px */
                        lineHeight: "0.75rem", /* 12px */
                        zIndex: -5,
                    }} className="star w-3 h-3" />
                ))}
            </div>
            <div className="w-full h-full flex justify-center text-center">
                <motion.div className="w-full flex justify-center items-center" initial={{y: 25, opacity: 0}} animate={{y: 0, opacity: 1}} transition={{duration: 0.5}}>
                    <div className='block'>
                        <div className='flex justify-center'>
                            <img className='w-40 rounded-2xl' src={data.picture} />
                        </div>
                        <p className='text-xl mt-4'>{data.name}</p>
                        <p className='text-lg mt-2'>Software Developer</p>
                        <div className='mt-8 text-2xl'>
                        <p className='text-xl'>My socials</p>
                            <div className='flex flex-row flex-nowrap justify-center'>
                                <Tooltip icon={faGithub} text="My GitHub" href="https://github.com/GacekKosmatek" />
                                <Tooltip icon={faDiscord} text={`${data.tag || `@${data.handle}`}`} href={`https://discord.com/users/${data.id}`} />
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
                </motion.div>
            </div>
        </>
    );
}
