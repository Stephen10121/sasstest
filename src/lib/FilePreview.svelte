<script lang="ts">
    import { DownloadIcon } from "lucide-svelte";
    import mime from "mime";
    import { Button } from "./components/ui/button";
    const { filePath, fileName, close, download }: { filePath: string, fileName: string, close: () => unknown, download: (fileName: string) => unknown } = $props();

    let filePathParsed = filePath.split("/").slice(2).join("/");
    let fileMimeType = mime.getType(fileName)?.split("/")[0];

    function mouseDown(e: MouseEvent) {
        //@ts-ignore
        if (e.target.id === "filePreviewBackdropPreview" || e.target.id === "filePreviewBackdropControls") {
            close();
        }
    }
</script>

<section class="dark:bg-white/20 bg-black/50" onmousedown={mouseDown} role="none">
    <div class="controls" id="filePreviewBackdropControls">
        <div class="dark:bg-black bg-white innerControls">
            <button title="Download File" onclick={() => download(fileName)}><DownloadIcon /></button>
        </div>
        <button class="dark:bg-black bg-white closeButton" title="Close Preview" onclick={() => close()}>✕</button>
    </div>
    <div class="preview" id="filePreviewBackdropPreview">
        {#if fileMimeType === "video"}
            <video id="videoPlayerCool" controls autoplay controlsList="nodownload">
                <source src="/api/fileStream?fileName={encodeURIComponent(fileName)}&filePath={encodeURIComponent(filePathParsed)}" />
                <track kind="captions">
                Your browser does not support the audio tag.
                <button onclick={() => download(fileName)}>Download File Instead</button>
            </video>
        {:else if fileMimeType === "audio"}
            <audio controls autoplay controlsList="nodownload">
                <source src="/api/fileStream?fileName={encodeURIComponent(fileName)}&filePath={encodeURIComponent(filePathParsed)}" />
                Your browser does not support the audio tag.
                <button onclick={() => download(fileName)}>Download File Instead</button>
            </audio>
        {:else if fileMimeType === "image"}
            <img src="/api/fileDownload?fileName={encodeURIComponent(fileName)}&filePath={encodeURIComponent(filePathParsed)}" alt="File Preview of {fileName}">
        {:else}
            <p class="text-white text-lg">Sorry. This file cannot be previewed.</p>
            <Button onclick={() => download(fileName)} class="text-xs">Download File Instead</Button>
        {/if}
    </div>
</section>

<style>
    section {
        position: fixed;
        z-index: 150;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100%;
        /* background-color: #000000a1; */
        display: grid;
        grid-template-rows: 60px auto;
        align-items: center;
        justify-content: center;
        isolation: isolate;
    }

    .controls {
        width: 100vw;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 10px;
        position: relative;
    }

    .innerControls {
        border-radius: 100vw;
        padding: 0 10px;
    }

    .closeButton {
        position: absolute;
        right: 10px;
        top: 10px;
    }

    button {
        border-radius: 100%;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .preview {
        padding: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        gap: 20px;
        width: 100%;
        height: 100%;
    }

    video {
        max-width: 1000px;
        width: 100%; 
    }

    img {
        max-width: min(1000px, 100%);
    }
</style>