<script lang="ts">
    import "../app.css";
    import LoggedIn from "$lib/LoggedIn.svelte";
    import NotLoggedIn from "$lib/NotLoggedIn.svelte";
    import { ModeWatcher } from "mode-watcher";
    import LightSwitch from "@/LightSwitch.svelte";
    import * as Avatar from "$lib/components/ui/avatar/index.js";
    import { Toaster } from "$lib/components/ui/sonner";
    
    let { data, children } = $props();
</script>

<ModeWatcher />
<Toaster />

<div class="flex h-screen flex-col">
    <header class="flex h-16 items-center border-b px-6">
        <div class="flex items-center gap-2">
        <h1 class="text-xl font-semibold">MyDrive</h1>
        </div>
        <div class="ml-auto flex items-center gap-4">
        <div class="relative hidden md:block">
            <input
            type="search"
            placeholder="Search in Drive"
            class="h-10 w-64 rounded-full border bg-muted/30 px-4 py-2 pl-10 text-sm"
            />
            <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            class="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground"
            >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
            </svg>
        </div>
        <LightSwitch />
        <LoggedIn user={data.user}>
            <Avatar.Root>
                <Avatar.Image src={data.user?.user_metadata.avatar_url} alt="Your Avatar" />
                <Avatar.Fallback>CN</Avatar.Fallback>
            </Avatar.Root>
        </LoggedIn>
        <NotLoggedIn user={data.user}>
            <form action="?/githubOath" method="POST">
                <button>Login with Github</button>
            </form>
        </NotLoggedIn>
        </div>
    </header>
    {@render children?.()}
</div>
