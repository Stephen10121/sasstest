<script lang="ts">
    import { File, FileImage, FileIcon as FilePdf, FileText, Folder, FileAudio } from "lucide-svelte";

    export let iconType: string;
</script>

{#if iconType === "folder"}
    <Folder class="text-blue-500" />
{:else if iconType === "pdf"}
    <FilePdf class="text-red-500" />
{:else if iconType === "png" || iconType === "svg" || iconType === "jpg" || iconType === "jpeg"}
    <FileImage class="text-green-500" />
{:else if iconType === "mp3"}
    <FileAudio class="text-purple-500" />
{:else if iconType === "txt" || iconType === "spreadsheet" || iconType === "presentation"}
    <FileText class="text-yellow-500" />
{:else}
    <File class="text-gray-500" />
{/if}