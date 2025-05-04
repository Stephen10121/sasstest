<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import { ChevronDown, Clock, Computer, Folder, HardDrive, Plus, Share2, Star, Trash2, Upload } from "lucide-svelte";
    import { Progress } from "$lib/components/ui/progress";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
    import { showNewFolderDialog, showUploadDialog } from "./store";
</script>

<div class="w-64 border-r p-4">
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild let:builder>
        <Button builders={[builder]} class="mb-6 w-full justify-start gap-2 rounded-full">
          <Plus size={18} />
          <span>New</span>
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="center">
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
    <nav class="space-y-1">
      <a href="/drive" class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium bg-muted/50">
        <HardDrive size={18} />
        <span>My Drive</span>
      </a>
      <a
        href="/"
        class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted/50"
      >
        <Computer size={18} />
        <span>Computers</span>
    </a>
      <a
        href="/"
        class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted/50"
      >
        <Share2 size={18} />
        <span>Shared with me</span>
      </a>
      <a
        href="/"
        class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted/50"
      >
        <Clock size={18} />
        <span>Recent</span>
      </a>
      <a
        href="/"
        class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted/50"
      >
        <Star size={18} />
        <span>Starred</span>
      </a>
      <a
        href="/"
        class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted/50"
      >
        <Trash2 size={18} />
        <span>Trash</span>
      </a>
    </nav>

    <div class="mt-6 space-y-1">
      <h3 class="px-3 text-xs font-medium text-muted-foreground">Storage</h3>
      <div class="px-3 py-2">
        <div class="mb-1 flex items-center justify-between text-xs">
          <span>2.5 GB of 15 GB used</span>
          <span>17%</span>
        </div>
        <Progress value={17} class="h-2" />
      </div>
      <Button variant="outline" size="sm" class="mt-2 w-full">
        Buy storage
      </Button>
    </div>
  </div>