import type { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import type { User } from "@/app/actions";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { AnchorHTMLAttributes, HTMLAttributes } from "react";
import type { ReactNode, Ref } from "react";
import { chunk, cn } from "@/lib/utils";
import { Separator } from "./ui/separator";

export interface SocialLink {
    platform: string;
    icon: IconProp;
    href?: string;
}

export interface Tools {
    name: string;
    icon: IconProp;
}

interface SectionData {
    name: string;
    icon: IconProp;
    href?: string;
}

interface SectionProps {
    title: string;
    array: SectionData[];
}

type SectionItemWrapperProps = {
    className?: string;
    children?: ReactNode;
} & (
    | ({ href: string,    ref?: Ref<HTMLAnchorElement> } & AnchorHTMLAttributes<HTMLAnchorElement>)
    | ({ href: undefined, ref?: Ref<HTMLSpanElement>   } & HTMLAttributes<HTMLSpanElement>)
);

function SectionItemWrapper({
    className,
    href,
    children,
    ref,
    ...rest
}: SectionItemWrapperProps) {
    const classes = cn("inline-flex items-center justify-center", className);

    if (href) {
        return <Link ref={ref} className={classes} href={href} {...rest}>{children}</Link>
    }
    
    return <span ref={ref} className={classes} {...rest}>{children}</span>
}

function Section({ title, array }: SectionProps) {
    const rows = chunk(array, 8).map(items => items.map((item, i) => <Tooltip key={i}>
        <TooltipTrigger asChild>
            <SectionItemWrapper href={item.href}>
                <FontAwesomeIcon icon={item.icon} />
            </SectionItemWrapper>
        </TooltipTrigger>
        <TooltipContent>{item.name}</TooltipContent>
    </Tooltip>));

    return <div className="flex flex-col gap-2">
        <p className="text-xl">{title}</p>
        <div className="flex flex-col justify-center gap-2 text-2xl">
            {rows.map((row, i) => <div key={i} className="flex justify-center gap-2">
                {row}
            </div>)}
        </div>
    </div>
}


export interface UserProfileProps {
    user: User;
    links: SocialLink[];
    tools: Tools[];
    ref?: Ref<HTMLDivElement>
}

export default function UserProfile({
    user,
    links,
    tools,
    ref,
}: UserProfileProps) {
    return <div ref={ref} className="flex flex-col text-center items-center p-5 rounded-2xl gap-2 bg-white/5 backdrop-blur">
        {user.avatar && <Image
            src={user.avatar}
            className="w-40 rounded-2xl"
            width={256}
            height={256}
            alt="The profile picture."
            priority
        />}
        <div className="flex flex-col">
            <h1 className="text-xl">{user?.name}</h1>
            <h2 className="text-lg">Software Developer</h2>
        </div>

        <Section title="Find me" array={links.map((s) => ({ ...s, name: s.platform }))} />
        <Section title="What I use" array={tools} />
    </div>
}
