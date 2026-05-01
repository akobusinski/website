import * as z from "zod";
import { createRequest } from "./utils";

const BASE_URL = "https://api.github.com";
const API_VERSION = "2026-03-10";

export const PlanSchema = z.object({
    collaborators: z.number().int(),
    name: z.string(),
    space: z.number().int(),
    private_repos: z.number().int(),
});

export const BaseUserSchema = z.object({
    login: z.string(),
    id: z.number(),
    user_view_type: z.string().optional(),
    node_id: z.string(),
    
    avatar_url: z.url(),
    gravatar_id: z.string().nullable(),
    
    url: z.url(),
    html_url: z.url(),
    followers_url: z.url(),
    // for some really odd reason everything before was a URI, and now they are just strings
    following_url: z.string(),
    gists_url: z.string(),
    starred_url: z.string(),
    // and now again back to URIs
    subscriptions_url: z.url(),
    organizations_url: z.url(),
    repos_url: z.url(),
    // this has to be joke
    events_url: z.string(),
    // like what
    received_events_url: z.url(),
    
    type: z.string(),
    site_admin: z.boolean(),
    name: z.string().nullable(),
    company: z.string().nullable(),
    blog: z.string().nullable(),
    location: z.string().nullable(),
    email: z.email().nullable(),
    notification_email: z.email().nullable().optional(),
    hireable: z.boolean().nullable(),
    bio: z.string().nullable(),
    twitter_username: z.string().nullable().optional(),

    public_repos: z.number(),
    public_gists: z.number(),
    followers: z.number(),
    following: z.number(),
    created_at: z.iso.datetime(),
    updated_at: z.iso.datetime(),

    // can someone please tell me why in the PrivateUser schema this is above the plan object, but in the public one it's under it??
    private_gists: z.number().optional(),
    total_private_repos: z.number().optional(),
    owned_private_repos: z.number().optional(),
    disk_usage: z.number().optional(),
    collaborators: z.number().optional(),
    plan: PlanSchema.optional()
});

export const PrivateUserSchema = z.object({
    ...BaseUserSchema.shape,
    // no longer optional!
    private_gists: z.number(),
    total_private_repos: z.number(),
    owned_private_repos: z.number(),
    disk_usage: z.number(),
    collaborators: z.number(),

    two_factor_authentication: z.boolean(),
    business_plus: z.boolean().nullable().optional(),
    ldap_dn: z.string().nullable().optional(),
}).loose();

export const PublicUserSchema = BaseUserSchema.strict();

export const UserSchema = z.union([
    PrivateUserSchema,
    PublicUserSchema,
]);

export type PlanSchema = z.infer<typeof PlanSchema>;
export type PrivateUserSchema = z.infer<typeof PrivateUserSchema>;
export type PublicUserSchema = z.infer<typeof PublicUserSchema>;
export type UserSchema = z.infer<typeof UserSchema>;

export const request = createRequest(BASE_URL, {
    headers: {
        "X-GitHub-Api-Version": API_VERSION
    },
});

export async function fetchUser(accountId: string | undefined): Promise<UserSchema | undefined> {
    if (accountId === undefined) {
        return undefined;
    }

    const response = await request(`/user/${accountId}`);

    const json = await response.json();
    return UserSchema.parse(json);
}
