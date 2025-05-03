<script lang="ts">
    import { uploadFile } from "./uploaderStuff";

    import { FileUploadTracker } from "./uploaderStuff";

    let fileInput: HTMLInputElement;
    let fileUploadStatus = "";

    async function fileInputChange(event: Event) {
        const target = event.target as HTMLInputElement;
        if (!target.files) return;
        if (target.files.length === 0) return;

        const file = target.files[0];
        const fileUploadTracker = new FileUploadTracker(file.size);

        fileUploadTracker.setErrorCallback((error) => {
            console.log(error);
            fileUploadStatus = "An error has occured. Oops.";
        });

        let t1 = new Date();
        fileUploadTracker.setSuccessCallback(() => {
            let t2 = new Date();
            fileUploadStatus = `Successfully uploaded file in ${(t2.getTime() - t1.getTime()) / 1000} Seconds`;
        });

        fileUploadTracker.setProgressCallback((progress) => {
            fileUploadStatus = `${progress}% done.`;
        });
        
        await uploadFile(file, fileUploadTracker, "test", "/");
    }
</script>

<p>Status: {fileUploadStatus}</p>
<input type="file" name="file" bind:this={fileInput} multiple on:change={fileInputChange}>