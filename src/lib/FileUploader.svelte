<script lang="ts">
    import { onMount } from "svelte";
    import { uploadFile } from "./uploaderStuff";
    import { FileUploadTracker } from "./uploaderStuff";
    import { toast } from 'svelte-sonner'
    import { showUploadDialog } from "./store";
    import { invalidateAll } from "$app/navigation";

    const { filePath }: { filePath: string } = $props();

    function cancelInputChange() {
        $showUploadDialog = false;
    }

    async function fileInputChange(event: Event) {
        const target = event.target as HTMLInputElement;
        if (!target.files) {
            $showUploadDialog = false;
            return;
        }
        if (target.files.length === 0) {
            $showUploadDialog = false;
            return;
        }

        const file = target.files[0];
        let fileUploadTracker = new FileUploadTracker(file.size);

        let loadingToast: string | number = 0;

        fileUploadTracker.setErrorCallback((error) => {
            // console.log(error);
            // fileUploadStatus = "An error has occured. Oops.";
            if (loadingToast) toast.dismiss(loadingToast);
            toast.error("Failed to upload file");
            //@ts-ignore
            fileUploadTracker = undefined;
            target.value = "";
            $showUploadDialog = false;
        });

        let t1 = new Date();
        fileUploadTracker.setSuccessCallback(() => {
            let t2 = new Date();
            if (loadingToast) toast.dismiss(loadingToast);
            toast.success("Successfully uploaded file");
            invalidateAll();
            // fileUploadStatus = `Successfully uploaded file in ${(t2.getTime() - t1.getTime()) / 1000} Seconds`;
            //@ts-ignore
            fileUploadTracker = undefined;
            target.value = "";
            $showUploadDialog = false;
        });

        fileUploadTracker.setProgressCallback((progress) => {
            if (loadingToast) {
                loadingToast = toast.loading(`${progress}% Uploading "${file.name}"`, {id: loadingToast, duration: 240000});
            } else {
                loadingToast = toast.loading(`${progress}% Uploading "${file.name}"`, { duration: 240000});
            }
            // toast.
            // fileUploadStatus = `${progress}% done.`;
        });
        
        await uploadFile(file, fileUploadTracker, filePath.split("/").slice(2).join("/"));
    }

    onMount(() => {
        const fileInput = document.getElementById('fileInputSelect');
        if (fileInput) {
            fileInput.click();
        }
    });
</script>

<input type="file" name="file" id="fileInputSelect" multiple onchange={fileInputChange} oncancel={cancelInputChange} />

<style>
    input {
        opacity: 0;
        position: fixed;
        z-index: -1;
    }
</style>