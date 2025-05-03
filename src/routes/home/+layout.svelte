<script lang="ts">
    import Sidebar from "@/Sidebar.svelte";

    let { data, children } = $props();

    console.log(data.userDir);
</script>

<div class="flex flex-1 overflow-hidden">
    <Sidebar />
    <main class="flex-1 overflow-auto p-6">
        {@render children?.()}
    </main>
</div>