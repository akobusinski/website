'use server';

import { fetchUser as fetchDiscordUser } from "@/lib/discord";
import { fetchUser as fetchGitHubUser } from "@/lib/github";
import { cacheLife } from "next/cache";
import * as z from "zod";

const DISCORD_USER_ID = process.env.DISCORD_USER_ID as string;
const GITHUB_USER_ID  = process.env.GITHUB_USER_ID as string;

const User = z.object({
    name: z.string(),
    avatar: z.string().optional(),
    discord: z.object({
        id: z.string(),
        handle: z.string(),
    }).optional(),
    github: z.string().optional(),
});

export type User = z.infer<typeof User>;

export async function getUser(): Promise<User> {
    'use cache';
    cacheLife('hours');
    const discordUser = await fetchDiscordUser(DISCORD_USER_ID);
    const githubUser = await fetchGitHubUser(GITHUB_USER_ID);

    const name = githubUser?.name || discordUser?.global_name || discordUser?.username;

    if (name === undefined) {
        throw new Error("No name available");
    }

    return {
        name,
        avatar: githubUser?.avatar_url || (discordUser?.avatar ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}` : undefined),
        discord: discordUser === undefined ? undefined : {
            id: discordUser.id,
            handle: discordUser.discriminator === undefined ? `@${discordUser.username}` : `${discordUser.username}#${discordUser.discriminator}`,
        },
        github: githubUser?.login,
    }
}
