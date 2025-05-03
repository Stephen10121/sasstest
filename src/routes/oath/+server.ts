import { redirect } from '@sveltejs/kit';
import { createHash } from 'crypto';
import { existsSync, mkdirSync } from 'fs';

export async function GET({ url, locals: { supabase } }) {
    const code = url.searchParams.get("code") as string;

    if (code) {
        const { error, data } = await supabase.auth.exchangeCodeForSession(code);
        if (data.user) {
            const hashedId = createHash('sha256').update(data.user.id).digest("hex");
            if (!existsSync("./files/" + hashedId)) {
                mkdirSync("./files/" + hashedId);
            }
        }
        
        if (!error) {
            const justCreated = ((new Date(data.user.updated_at ? data.user.updated_at : "")).getTime() - (new Date(data.user.created_at)).getTime()) / 1000 < 5;
            console.log({justCreated});

            throw redirect(303, "/home");
        }
    }

    throw redirect(303, "/");
}