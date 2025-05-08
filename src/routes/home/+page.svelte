<script lang="ts">
    import FileUploader from "$lib/FileUploader.svelte";
    import { Button } from "$lib/components/ui/button";
    import { Card } from "@/components/ui/card"
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
    import { ChevronDown, Folder, Grid3X3, List, MoreVertical, Plus, Upload } from "lucide-svelte";
    import GetFileIcon from "@/GetFileIcon.svelte";
    import { getValue, prettyDate, prettySize } from "@/utils.js";
    import DirPath from "@/DirPath.svelte";
	import * as Dialog from "$lib/components/ui/dialog/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import { Label } from "$lib/components/ui/label/index.js";
    import { enhance } from "$app/forms";
	import { toast } from "svelte-sonner";
    import { showNewFolderDialog, showUploadDialog } from "@/store.js";
    import FilePreview from "@/FilePreview.svelte";

    let { data, form } = $props();

    let currentPathStr = $state("/home/");
    let currentPath = $derived(getValue(data.userDir, currentPathStr))

    let viewMode: "grid" | "list" = $state("grid");
	let renamefilePopup: null | { fileName: string, type: "file" | "folder", filePath: string } = $state(null);
	let deletefilePopup: null | { fileName: string, type: "file" | "folder", filePath: string } = $state(null);
	let filePreviewPopup: null | { fileName: string, filePath: string } = $state(null);

	async function downloadFile(fileName: string) {
		const response = await fetch(`/api/fileDownload?fileName=${encodeURIComponent(fileName)}&filePath=${encodeURIComponent(currentPathStr.split("/").slice(2).join("/"))}`, {
            method: "GET",
            headers: {
                "Content-Type": 'application/octet-stream',
                "File-Name": encodeURI(fileName),
                "File-Path": encodeURI(currentPathStr.split("/").slice(2).join("/"))
            }
        })

		if (!response.ok) {
			console.log("Couldnt Download File");
			return
		}
		// Create a stream reader
		const reader = response.body?.getReader();
		const chunks: Uint8Array[] = [];
		let receivedBytes = 0;

		let downloadToast = toast.loading("Downloading File 0%");

		if (reader) {
			const contentLength = response.headers.get('Content-Length');
			const totalSize = contentLength ? parseInt(contentLength, 10) : undefined;
			
			while (true) {
				const { done, value } = await reader.read();
				if (done) break;
				chunks.push(value);
				receivedBytes += value.length;

				// Display download progress
				if (totalSize) {
					toast.loading(`Downloading File ${((receivedBytes / totalSize) * 100).toFixed()}%`, { id: downloadToast });
					// console.log(`Downloaded ${receivedBytes} / ${totalSize} bytes (${((receivedBytes / totalSize) * 100).toFixed()}%)`);
				}
			}
		}

		// Convert chunks to a Blob and trigger download
		const blob = new Blob(chunks);
		// const blob = await response.blob();
		const url = URL.createObjectURL(blob);
		
		// Trigger a download
		const a = document.createElement('a');
		a.href = url;
		a.download = fileName;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		toast.dismiss(downloadToast);
		toast.success("Successfully Downloaded File")
		console.log("Downloading file", fileName, response);
	}
</script>

<div>
	<div class="mb-6 flex items-center justify-between">
		<div class="flex items-end gap-2">
			<h2 class="text-2xl font-semibold">My Drive</h2>
			<DirPath bind:currentPath={currentPathStr} />
		</div>
		<div class="flex items-center gap-2">
			<Button variant="outline" size="sm" on:click={() => viewMode === "grid" ? viewMode="list" : viewMode="grid"}>
				{#if viewMode === "grid"}
					<List size={16} />
				{:else}
					<Grid3X3 size={16} />
				{/if}
			</Button>
			<DropdownMenu.Root>
				<DropdownMenu.Trigger asChild let:builder>
					<Button builders={[builder]} size="sm" class="gap-2">
						<Plus size={16} />
						<span>New</span>
						<ChevronDown size={16} />
					</Button>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content align="end">
					<DropdownMenu.Item on:click={() => $showNewFolderDialog = true}>
						<Folder class="mr-2 h-4 w-4" />
						<span>New Folder</span>
					</DropdownMenu.Item>
					<DropdownMenu.Separator />
					<DropdownMenu.Item on:click={() => $showUploadDialog = true}>
						<Upload class="mr-2 h-4 w-4" />
						<span>File Upload</span>
					</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</div>
	</div>
	{#if viewMode === "grid"}
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
			{#if currentPath}
				{#each Object.entries(currentPath) as [fileName, fileInfo] ("afilegrid"+fileName)}
					<Card class="overflow-hidden">
						<div class="flex h-full flex-col p-4">
							<div class="mb-2 flex items-start justify-between">
								<GetFileIcon iconType={fileInfo.extension} />
								<DropdownMenu.Root>
									<DropdownMenu.Trigger asChild let:builder>
										<Button builders={[builder]} variant="ghost" size="icon" class="h-8 w-8">
											<MoreVertical size={16} />
										</Button>
									</DropdownMenu.Trigger>
									<DropdownMenu.Content align="end">
										<DropdownMenu.Item onclick={() => {renamefilePopup = { fileName, filePath: currentPathStr, type: fileInfo.type }}}>Rename</DropdownMenu.Item>
										<DropdownMenu.Item>Share</DropdownMenu.Item>
										{#if fileInfo.type === "file"}
											<DropdownMenu.Item onclick={() => downloadFile(fileName)}>Download</DropdownMenu.Item>
										{/if}
										<DropdownMenu.Separator />
										<DropdownMenu.Item onclick={() => {deletefilePopup = { fileName, filePath: currentPathStr, type: fileInfo.type }}} class="text-red-500">Delete</DropdownMenu.Item>
									</DropdownMenu.Content>
								</DropdownMenu.Root>
							</div>
							<div class="mt-auto">
								{#if fileInfo.type === "folder"}
									<button onclick={() => currentPathStr = currentPathStr + `${fileName}/`} class="aLink text-left">
										<span><h3 class="font-medium line-clamp-2">{fileName}</h3></span>
									</button>
								{:else}
									<button onclick={() => filePreviewPopup = { fileName, filePath: currentPathStr }} class="aLink text-left">
										<span><h3 class="font-medium line-clamp-2">{fileName}</h3></span>
									</button>
								{/if}
								<div class="mt-1 flex items-center justify-between text-xs text-muted-foreground">
									<span>{prettyDate(fileInfo.lastModified)}</span>
									{#if fileInfo.size}
										<span>{prettySize(fileInfo.size)}</span>
									{/if}
								</div>
							</div>
						</div>
					</Card>
				{/each}
			{/if}
		</div>
	{:else}
		<div class="rounded-lg border">
			<div class="grid grid-cols-12 gap-4 border-b bg-muted/50 p-4 text-sm font-medium">
				<div class="col-span-6">Name</div>
				<div class="col-span-3">Last modified</div>
				<div class="col-span-2">Size</div>
				<div class="col-span-1"></div>
			</div>
            {#if currentPath}
                {#each Object.entries(currentPath) as [fileName, fileInfo] ("afile"+fileName)}
                    <div class="grid grid-cols-12 gap-4 border-b p-4 text-sm">
						{#if fileInfo.type === "folder"}
							<button onclick={() => currentPathStr = currentPathStr + `${fileName}/`} class="text-left gridLink aLink">
								<GetFileIcon iconType={fileInfo.extension} />
								<span>{fileName}</span>
							</button>
						{:else}
							<button onclick={() => filePreviewPopup = { fileName, filePath: currentPathStr }} class="text-left gridLink aLink">
								<GetFileIcon iconType={fileInfo.extension} />
								<span>{fileName}</span>
							</button>
						{/if}
                        <div class="col-span-3 flex items-center">{prettyDate(fileInfo.lastModified)}</div>
                        <div class="col-span-2 flex items-center">{prettySize(fileInfo.size) || "—"}</div>
                        <div class="col-span-1 flex items-center justify-end">
                            <DropdownMenu.Root>
                                <DropdownMenu.Trigger asChild let:builder>
                                    <Button builders={[builder]} variant="ghost" size="icon" class="h-8 w-8">
                                        <MoreVertical size={16} />
                                    </Button>
                                </DropdownMenu.Trigger>
                                <DropdownMenu.Content align="end">
                                    <DropdownMenu.Item onclick={() => {renamefilePopup = { fileName, filePath: currentPathStr, type: fileInfo.type }}}>Rename</DropdownMenu.Item>
                                    <DropdownMenu.Item>Share</DropdownMenu.Item>
                                    {#if fileInfo.type === "file"}
										<DropdownMenu.Item onclick={() => downloadFile(fileName)}>Download</DropdownMenu.Item>
									{/if}
                                    <DropdownMenu.Separator />
                                    <DropdownMenu.Item onclick={() => {deletefilePopup = { fileName, filePath: currentPathStr, type: fileInfo.type }}} class="text-red-500">Delete</DropdownMenu.Item>
                                </DropdownMenu.Content>
                            </DropdownMenu.Root>
                        </div>
                    </div>
                {/each}
            {/if}
		</div>
	{/if}
</div>

<Dialog.Root open={renamefilePopup !== null} onOpenChange={(e) => {if (!e) renamefilePopup = null}}>
	{#if renamefilePopup !== null}
		<Dialog.Content class="sm:max-w-[425px]">
			<Dialog.Header>
				<Dialog.Title>Rename {renamefilePopup.type === "file" ? "File" : "Folder"}</Dialog.Title>
				<Dialog.Description>
					Change "{renamefilePopup.fileName}" to a different name. {#if renamefilePopup.type === "file"} Dont forget about the file extension.{/if}
				</Dialog.Description>
			</Dialog.Header>
			<form
				id="renameFileForm"
				method="POST"
				action="?/renameFile"
				class="grid gap-4 py-4"
				use:enhance={() => {
					const tLoadingMsg = toast.loading(`Renaming.`);

					return async ({ update }) => {
						await update();
						toast.dismiss(tLoadingMsg);
						if (form) {
							if(form.success) {
								toast.success("Renamed!");
								renamefilePopup = null;
							} else {
								toast.error("Raname Failed", {
									description: form.errorMsg
								})
							}
						}
					}
				}}
			>
				<input type="hidden" name="filePath" value={renamefilePopup.filePath} />
				<input type="hidden" name="type" value={renamefilePopup.type} />
				<input type="hidden" name="oldFileName" value={renamefilePopup.fileName} />
				<div class="flex flex-col gap-2">
					<Label for="filename" class="text-left">New {renamefilePopup.type === "file" ? "File" : "Folder"} Name</Label>
					<Input id="filename" autocomplete="off" autocorrect="off" name="newFileName" value={renamefilePopup.fileName} class="col-span-3" />
				</div>
			</form>
			<Dialog.Footer>
				<Button type="submit" form="renameFileForm">Rename</Button>
			</Dialog.Footer>
		</Dialog.Content>
	{/if}
</Dialog.Root>

<Dialog.Root open={$showNewFolderDialog} onOpenChange={(e) => {if (!e) $showNewFolderDialog = false}}>
	{#if $showNewFolderDialog}
		<Dialog.Content class="sm:max-w-[425px]">
			<Dialog.Header>
				<Dialog.Title>Create Folder</Dialog.Title>
				<Dialog.Description>
					Make sure not to user characters like "/".
				</Dialog.Description>
			</Dialog.Header>
			<form
				id="makeFolderForm"
				method="POST"
				action="?/createFolder"
				class="grid gap-4 py-4"
				use:enhance={() => {
					const tLoadingMsg = toast.loading(`Creating Folder.`);

					return async ({ update }) => {
						await update();
						toast.dismiss(tLoadingMsg);
						if (form) {
							if(form.success) {
								toast.success("Created Folder!");
								$showNewFolderDialog = false;
							} else {
								toast.error("Failed to Create Folder", {
									description: form.errorMsg
								})
							}
						}
					}
				}}
			>
				<input type="hidden" name="filePath" value={currentPathStr} />
				<div class="flex flex-col gap-2">
					<Label for="folderName" class="text-left">Folder Name</Label>
					<Input id="folderName" autocomplete="off" autocorrect="off" name="folderName" class="col-span-3" />
				</div>
			</form>
			<Dialog.Footer>
				<Button type="submit" form="makeFolderForm">Create</Button>
			</Dialog.Footer>
		</Dialog.Content>
	{/if}
</Dialog.Root>

<Dialog.Root open={deletefilePopup !== null} onOpenChange={(e) => {if (!e) deletefilePopup = null}}>
	{#if deletefilePopup !== null}
		<Dialog.Content class="sm:max-w-[425px]">
			<Dialog.Header>
				<Dialog.Title>Delete {deletefilePopup.type === "file" ? "File" : "Folder"}</Dialog.Title>
				<Dialog.Description>
					Are you sure you want to delete "{deletefilePopup.fileName}"?
				</Dialog.Description>
			</Dialog.Header>
			<form
				id="deleteFileForm"
				method="POST"
				action="?/deleteFile"
				class="grid gap-4 py-4"
				use:enhance={() => {
					const tLoadingMsg = toast.loading(`Deleting.`);

					return async ({ update }) => {
						await update();
						toast.dismiss(tLoadingMsg);
						if (form) {
							if(form.success) {
								toast.success("Deleted!");
								deletefilePopup = null;
							} else {
								toast.error("Delete Failed", {
									description: form.errorMsg
								})
							}
						}
					}
				}}
			>
				<input type="hidden" name="filePath" value={deletefilePopup.filePath} />
				<input type="hidden" name="type" value={deletefilePopup.type} />
				<input type="hidden" name="fileName" value={deletefilePopup.fileName} />
			</form>
			<Dialog.Footer>
				<Button type="submit" variant="destructive" form="deleteFileForm">I'm Sure</Button>
			</Dialog.Footer>
		</Dialog.Content>
	{/if}
</Dialog.Root>

{#if filePreviewPopup !== null}
	<FilePreview fileName={filePreviewPopup.fileName} filePath={filePreviewPopup.filePath} close={() => {
		filePreviewPopup = null;
	}} download={downloadFile} />
{/if}

{#if $showUploadDialog}
	<FileUploader filePath={currentPathStr} />
{/if}

<style>
    .aLink:hover span {
        text-decoration: underline;
    }

	.gridLink {
		grid-column: span 6 / span 6;
		column-gap: 15px;
		display: grid;
		align-items: center;
		grid-template-columns: 24px auto;
	}

	.gridLink span {
		width: 100%;
		white-space: nowrap;
  		overflow: hidden;
		text-overflow: ellipsis;
	}
</style>