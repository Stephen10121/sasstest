import { redirect } from '@sveltejs/kit';

export async function GET({ url, locals: { supabase }, cookies }) {
    const code = url.searchParams.get("code") as string;
    const next = url.searchParams.get("next") ?? "/";

    if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) {
            throw redirect(303, "/dashboard");
        }
    }

    throw redirect(303, "/");
}