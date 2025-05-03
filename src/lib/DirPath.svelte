<script lang="ts">
    let { currentPath = $bindable() }: { currentPath: string } = $props();
</script>

<p class="opacity-75 text-sm flex gap-1">
    /{#each currentPath.split("/").slice(1,-1) as aPath, index ("pathfindingindex"+aPath)}
        <span>
            <button onclick={() => {currentPath = "/"+currentPath.split("/").slice(1,index+2).join("/")+"/"}} class="hover:underline">{aPath}</button>
        </span>
        <span>/</span>
    {/each}
</p>