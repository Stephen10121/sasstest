import { redirect } from '@sveltejs/kit';
import { config } from "dotenv";

config();

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