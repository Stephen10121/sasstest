import { redirect } from "@sveltejs/kit";

export async function GET({ locals }) {
    await locals.supabase.auth.signOut();
    
    return redirect(301, "/");
}