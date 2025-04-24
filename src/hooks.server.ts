import { error } from "@sveltejs/kit";
import { authorizedOrigins } from "../config";
import { createClient } from '@supabase/supabase-js';
import { config } from "dotenv";

config();

export async function handle({ event, resolve }) {
    console.log(authorizedOrigins);
    if (authorizedOrigins.includes(event.url.host)) {
        const supabaseUrl = process.env.SUPABASE_URL!;
        const supabaseKey = process.env.SUPABASE_KEY!;
        event.locals.base = createClient(supabaseUrl, supabaseKey);

        const response = await resolve(event);
	    return response;
    } else {
        return error(403);
    }
}