import { redirect } from '@sveltejs/kit';

export async function GET({ url, locals: { base } }) {
    const code = url.searchParams.get("code") as string;
    const next = url.searchParams.get("next") ?? "/";

    if (code) {
        const { error } = await base.auth.exchangeCodeForSession(code);
        if (!error) {
            throw redirect(303, `/${next.slice(1)}`);
        }
    }

    throw redirect(303, "/");
}