<script lang="ts">
    import { uploadFile } from "./uploaderStuff";
    import { FileUploadTracker } from "./uploaderStuff";

    export let userId: string;

    let fileUploadStatus = "";

    async function fileInputChange(event: Event) {
        const target = event.target as HTMLInputElement;
        if (!target.files) return;
        if (target.files.length === 0) return;

        const file = target.files[0];
        let fileUploadTracker = new FileUploadTracker(file.size);

        fileUploadTracker.setErrorCallback((error) => {
            console.log(error);
            fileUploadStatus = "An error has occured. Oops.";
        });

        let t1 = new Date();
        fileUploadTracker.setSuccessCallback(() => {
            let t2 = new Date();
            fileUploadStatus = `Successfully uploaded file in ${(t2.getTime() - t1.getTime()) / 1000} Seconds`;
            //@ts-ignore
            fileUploadTracker = undefined;
            target.value = "";
        });

        fileUploadTracker.setProgressCallback((progress) => {
            fileUploadStatus = `${progress}% done.`;
        });
        
        await uploadFile(file, fileUploadTracker, userId, "/");
    }
</script>

<p>Status: {fileUploadStatus}</p>
<input type="file" name="file" multiple on:change={fileInputChange}>