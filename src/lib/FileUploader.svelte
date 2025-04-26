<script lang="ts">
    let fileInput: HTMLInputElement;

    function fileInputChange(event: Event) {
        const target = event.target as HTMLInputElement;
        if (!target.files) return;
        if (target.files.length === 0) return;

        const file = target.files[0];

        const formData = new FormData();

        formData.append("user-file", file);

        fetch("/api/fileUpload", {
            method: "POST",
            body: formData
        }).then((res) => {
            res.json().then((data) => {
                console.log(data);
            });
        }).catch((err) => {
            console.log(err);
        })
    }
</script>

<input type="file" name="file" bind:this={fileInput} multiple on:change={fileInputChange}>