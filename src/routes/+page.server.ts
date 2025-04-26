import { redirect } from '@sveltejs/kit';
import { config } from "dotenv";

config();

export async function load({ locals, url }) {
    console.log((await locals.supabase.auth.getUser()).data.user?.user_metadata)
    return {
        name: "Step"
    }
}

export const actions = {
    githubOath: async ({ locals }) => {
        let { data, error } = await locals.supabase.auth.signInWithOAuth({
            provider: 'github',
            options: {
                redirectTo: process.env.PROJECT_WEB_URL! + "/oath"
            }
        });

        // console.log(data, error);

        return redirect(301, data.url ? data.url : "/");
        // return { success: true }
    }
}