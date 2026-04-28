import * as z from "zod";

const BASE_URL = "https://discord.com/api/v10";
const TOKEN    = process.env.DISCORD_TOKEN;

export const UserSchema = z.object({
    id: z.string(),
    username: z.string(),
    discriminator: z.string()
        .optional()
        .default("0") // this default is just for safety in case discord removes this field
        .transform(discrim => discrim === "0" ? undefined : discrim), // The discriminator "0" means there actually is no discriminator
    global_name: z.string().optional(),
    avatar: z.string().optional(),
});

export type UserSchema = z.infer<typeof UserSchema>;

export function request(path: string, method: string = "GET", body: BodyInit | null = null) {
    return fetch(BASE_URL + path, {
        method,
        body,
        headers: {
            "Authorization": `Bot ${TOKEN}`
        }
    });
}

export async function fetchUser(userId: string | undefined): Promise<UserSchema | undefined> {
    if (TOKEN === undefined || userId === undefined) {
        return undefined;
    }

    const response = await request(`/users/${userId}`);

    const json = await response.json();
    return UserSchema.parse(json);
}
