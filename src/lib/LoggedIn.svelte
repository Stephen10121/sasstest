<script lang="ts">
    import type { User } from "@supabase/supabase-js";

    export let user: User | null;
</script>

{#if user}
    <slot />
{/if}