import { error, redirect, type Handle } from "@sveltejs/kit";
import { authorizedOrigins } from "../config";
import { createServerClient } from '@supabase/ssr';
import { config } from "dotenv";
import { sequence } from "@sveltejs/kit/hooks";

config();

const supabase: Handle = async ({ event, resolve }) => {
    if (authorizedOrigins.includes(event.url.host)) {
        const supabaseUrl = process.env.SUPABASE_URL!;
        const supabaseKey = process.env.SUPABASE_KEY!;
        event.locals.supabase = createServerClient(supabaseUrl, supabaseKey, {
            cookies: {
                getAll() {
                  return event.cookies.getAll()
                },
                setAll(cookiesToSet) {
                  cookiesToSet.forEach(({ name, value, options }) =>
                    event.cookies.set(name, value, { ...options, path: '/' })
                  )
                },
              },
        });

        event.locals.safeGetSession = async () => {
            const { data: { session } } = await event.locals.supabase.auth.getSession();
            if (!session) {
                return { session: null, user: null }
            }

            const { data: { user }, error } = await event.locals.supabase.auth.getUser()
            if (error) {
                // JWT validation has failed
                return { session: null, user: null }
            }
            return { session, user }
        }

        return resolve(event, {
            filterSerializedResponseHeaders(name) {
                return name === 'content-range' || name === 'x-supabase-api-version'
            }
        })
    } else {
        return error(403);
    }
}

const authGuard: Handle = async ({ event, resolve }) => {
    const { session, user } = await event.locals.safeGetSession();
    event.locals.session = session;
    event.locals.user = user;

    if (!event.locals.session && event.url.pathname.startsWith('/dashboard')) {
        redirect(303, '/auth');
    }

    return resolve(event);
}

  export const handle: Handle = sequence(supabase, authGuard);