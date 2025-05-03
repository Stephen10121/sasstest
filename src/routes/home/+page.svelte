<script lang="ts">
    import FileUploader from "$lib/FileUploader.svelte";

    export let data;
</script>

Dashboard page. {data.user.user_metadata.name}
<a href="/home/test">tesr</a>
<FileUploader userId={data.user.id} />