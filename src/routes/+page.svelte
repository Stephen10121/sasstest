<script lang="ts">
    export let data;
</script>

<h1>Welcome to SvelteKit: {data.session?.user ? data.session.user.user_metadata.name : "Guest"}</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>

<form action="?/githubOath" method="POST">
    <button>Login with Github</button>
</form>

<a href="/logout">Logout</a>