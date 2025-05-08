<script lang="ts">
    const { filePath, fileName, close }: { filePath: string, fileName: string, close: () => unknown } = $props();

    let filePathParsed = filePath.split("/").slice(2).join("/");
</script>

<section>
    <video id="videoPlayerCool" controls autoplay>
        <source src="/api/fileStream?fileName={encodeURIComponent(fileName)}&filePath={encodeURIComponent(filePathParsed)}">
        <track kind="captions">
        <a
            href="https://archive.org/download/ElephantsDream/ed_1024_512kb.mp4"
            download="ed_1024_512kb.mp4">
            Download
        </a>
    </video>
    <button class="dark:bg-black" title="Close Preview" onclick={() => close()}>✕</button>
</section>

<style>
    section {
        position: fixed;
        z-index: 150;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: #000000a1;
        width: 100vw;
        height: 100vh;
        height: 100dvh;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    video {
        max-width: 600px;
        width: 100%;
    }

    button {
        position: absolute;
        top: 10px;
        right: 10px;
        background-color: #ffffff;
        border-radius: 100%;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>