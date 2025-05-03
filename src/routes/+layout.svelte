<script lang="ts">
    import LoggedIn from "$lib/LoggedIn.svelte";
    import NotLoggedIn from "$lib/NotLoggedIn.svelte";

    export let data;
</script>

<header>
    <LoggedIn user={data.user}>
        <a href="/logout">Logout</a>
    </LoggedIn>
    <NotLoggedIn user={data.user}>
        <form action="?/githubOath" method="POST">
            <button>Login with Github</button>
        </form>
    </NotLoggedIn>
</header>
<slot />