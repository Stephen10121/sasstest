<script lang="ts">
    import { DownloadIcon, Mouse } from "lucide-svelte";
    const { filePath, fileName, close, download }: { filePath: string, fileName: string, close: () => unknown, download: (fileName: string) => unknown } = $props();

    let filePathParsed = filePath.split("/").slice(2).join("/");

    function mouseDown(e: MouseEvent) {
        //@ts-ignore
        if (e.target.id === "filePreviewBackdropPreview" || e.target.id === "filePreviewBackdropControls") {
            close();
        }
    }
</script>

<section class="dark:bg-white/20 bg-black/50" onmousedown={mouseDown} role="none">
    <!-- <div class="dark:bg-white/50 bg-black/50 controls"> -->
    <div class="controls" id="filePreviewBackdropControls">
        <div class="dark:bg-black bg-white innerControls">
            <button title="Download File" onclick={() => download(fileName)}><DownloadIcon /></button>
        </div>
        <button class="dark:bg-black bg-white closeButton" title="Close Preview" onclick={() => close()}>✕</button>
    </div>
    <div class="preview" id="filePreviewBackdropPreview">
        <video id="videoPlayerCool" controls autoplay controlsList="nodownload">
            <source src="/api/fileStream?fileName={encodeURIComponent(fileName)}&filePath={encodeURIComponent(filePathParsed)}">
            <track kind="captions">
            <a
                href="https://archive.org/download/ElephantsDream/ed_1024_512kb.mp4"
                download="ed_1024_512kb.mp4">
                Download
            </a>
        </video>
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
        width: 100%;
        height: 100%;
    }

    video {
        max-width: 1000px;
        width: 100%;
    }
</style>