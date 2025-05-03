<script lang="ts">
    import FileUploader from "$lib/FileUploader.svelte";

    export let data;
</script>

Dashboard page. {data.user.user_metadata.name} {data.user.id}
<a href="/home/test">tesr</a>

<FileUploader />