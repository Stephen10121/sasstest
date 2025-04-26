import { json } from "@sveltejs/kit";

export async function POST() {
    console.log("yooooo brto");
    return json({msg: "ok"});
}