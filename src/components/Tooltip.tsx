import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { TooltipProps } from "../types";

export default (props: TooltipProps) => {
    return (
        <div className="group flex flex-col pb-2">
            <div className="relative flex justify-center">
                <div className="fixed rounded mt-2 px-1 text-lg bg-zinc-800 transition group-hover:scale-100 scale-0">
                    <p className="group-hover:block hidden">{props.text}</p>
                </div>
            </div>
            <div className="flex px-2 pt-10">
                <a href={props.href}>
                    <FontAwesomeIcon icon={props.icon} />
                </a>
            </div>
        </div>
    );
};
