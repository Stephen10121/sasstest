<script lang="ts">
    import { Button } from "@/components/ui/button"
    import { Card } from "@/components/ui/card"
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
    import {
    ChevronDown,
    Folder,
    Grid3X3,
    List,
    MoreVertical,
    Plus,
    Upload,
    } from "lucide-svelte";
    import GetFileIcon from "./GetFileIcon.svelte";
    import { invalidate } from "$app/navigation";

    const initialItems = [
        { id: "1", name: "Work Documents", type: "folder", updatedAt: "May 1, 2023" },
        { id: "2", name: "Personal", type: "folder", updatedAt: "Apr 28, 2023" },
        { id: "3", name: "Project Proposal.pdf", type: "pdf", size: "2.4 MB", updatedAt: "May 2, 2023" },
        { id: "4", name: "Budget 2023.xlsx", type: "spreadsheet", size: "1.8 MB", updatedAt: "Apr 30, 2023" },
        { id: "5", name: "Meeting Notes.docx", type: "document", size: "548 KB", updatedAt: "May 3, 2023" },
        { id: "6", name: "Profile Picture.jpg", type: "image", size: "2.1 MB", updatedAt: "Apr 25, 2023" },
        { id: "7", name: "Presentation.pptx", type: "presentation", size: "4.2 MB", updatedAt: "May 1, 2023" },
        { id: "8", name: "Vacation Photos", type: "folder", updatedAt: "Apr 20, 2023" },
    ]

    let items = initialItems
    let viewMode:"grid" | "list" = "list";
    let showUploadDialog = false;
    let showNewFolderDialog = false;
</script>

<div>
	<div class="mb-6 flex items-center justify-between">
		<h2 class="text-2xl font-semibold">My Drive</h2>
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
					<Button builders={[builder]} size="sm" class="gap-2" on:click={() => invalidate("homebase")}>
						<Plus size={16} />
						<span>New</span>
						<ChevronDown size={16} />
					</Button>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content align="end">
					<DropdownMenu.Item on:click={() => showNewFolderDialog = true}>
						<Folder class="mr-2 h-4 w-4" />
						<span>New Folder</span>
					</DropdownMenu.Item>
					<DropdownMenu.Separator />
					<DropdownMenu.Item on:click={() => showUploadDialog = true}>
						<Upload class="mr-2 h-4 w-4" />
						<span>File Upload</span>
					</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</div>
	</div>
	{#if viewMode === "grid"}
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
			{#each items as item (item.id)}
				<Card class="overflow-hidden">
					<div class="flex h-full flex-col p-4">
						<div class="mb-2 flex items-start justify-between">
							<GetFileIcon iconType={item.type} />
							<DropdownMenu.Root>
								<DropdownMenu.Trigger asChild let:builder>
									<Button builders={[builder]} variant="ghost" size="icon" class="h-8 w-8">
										<MoreVertical size={16} />
									</Button>
								</DropdownMenu.Trigger>
								<DropdownMenu.Content align="end">
									<DropdownMenu.Item>Rename</DropdownMenu.Item>
									<DropdownMenu.Item>Share</DropdownMenu.Item>
									<DropdownMenu.Item>Download</DropdownMenu.Item>
									<DropdownMenu.Separator />
									<DropdownMenu.Item class="text-red-500">Delete</DropdownMenu.Item>
								</DropdownMenu.Content>
							</DropdownMenu.Root>
						</div>
						<div class="mt-auto">
							<h3 class="font-medium line-clamp-2">{item.name}</h3>
							<div class="mt-1 flex items-center justify-between text-xs text-muted-foreground">
								<span>{item.updatedAt}</span>
								{#if item.size}
									<span>{item.size}</span>
								{/if}
							</div>
						</div>
					</div>
				</Card>
			{/each}    
		</div>
	{:else}
		<div class="rounded-lg border">
			<div class="grid grid-cols-12 gap-4 border-b bg-muted/50 p-4 text-sm font-medium">
				<div class="col-span-6">Name</div>
				<div class="col-span-3">Last modified</div>
				<div class="col-span-2">Size</div>
				<div class="col-span-1"></div>
			</div>
			{#each items as item (item.id)}
				<div class="grid grid-cols-12 gap-4 border-b p-4 text-sm">
					<div class="col-span-6 flex items-center gap-3">
						<GetFileIcon iconType={item.type} />
						<span>{item.name}</span>
					</div>
					<div class="col-span-3 flex items-center">{item.updatedAt}</div>
					<div class="col-span-2 flex items-center">{item.size || "—"}</div>
					<div class="col-span-1 flex items-center justify-end">
						<DropdownMenu.Root>
							<DropdownMenu.Trigger asChild let:builder>
								<Button builders={[builder]} variant="ghost" size="icon" class="h-8 w-8">
									<MoreVertical size={16} />
								</Button>
							</DropdownMenu.Trigger>
							<DropdownMenu.Content align="end">
								<DropdownMenu.Item>Rename</DropdownMenu.Item>
								<DropdownMenu.Item>Share</DropdownMenu.Item>
								<DropdownMenu.Item>Download</DropdownMenu.Item>
								<DropdownMenu.Separator />
								<DropdownMenu.Item class="text-red-500">Delete</DropdownMenu.Item>
							</DropdownMenu.Content>
						</DropdownMenu.Root>
					</div>
				</div>
			{/each}
		</div>
	{/if}

	<!-- <FileUploadDialog
	open={showUploadDialog}
	onOpenChange={setShowUploadDialog}
	onUpload={(name, type, size) => addNewFile(name, type, size)}
	/>

	<NewFolderDialog open={showNewFolderDialog} onOpenChange={setShowNewFolderDialog} onCreateFolder={addNewFolder} /> -->
</div>