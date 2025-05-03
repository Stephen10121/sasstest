export type CallbackFuncUpload<ResT> = null | ((res: ResT) => unknown);
export class FileUploadTracker {
    totalBytes = 0;
    first = true;
    charsRecieved = 0;
    charsUploaded = 0;
    #errorCallback: CallbackFuncUpload<unknown> = null;
    progressCallback: CallbackFuncUpload<number> = null;
    #successCallback: CallbackFuncUpload<undefined> = null;


    constructor(totalBytes: number) {
        this.totalBytes = totalBytes;
        this.first = true;
        this.charsUploaded = 0;
    }

    setErrorCallback(callback: CallbackFuncUpload<unknown>) {
        this.#errorCallback = callback;
    }

    setProgressCallback(callback: CallbackFuncUpload<number>) {
        this.progressCallback = callback;
    }

    setSuccessCallback(callback: CallbackFuncUpload<undefined>) {
        this.#successCallback = callback;
    }

    set setCharsRecieved(val: number) {
        this.charsRecieved = val;
        if (this.progressCallback) {
            this.progressCallback(Math.floor(val / this.totalBytes * 100))
        }
    }

    done() {
        if (this.#successCallback) {
            this.#successCallback(undefined);
        }
    }

    errorPush(error: unknown) {
        if (this.#errorCallback) {
            this.#errorCallback(error);
        }
    }
}

async function uploadBlobToServer(blob: Blob, fileTracker: FileUploadTracker, fileName: string, userId: string, filePath: string) {
    console.log("uploading blob to server. Blob size:", blob.size);
    let bytesUploaded = 0;
    try {
        const progressTrackingStream = new TransformStream({
            transform(chunk, controller) {
              controller.enqueue(chunk);
              bytesUploaded += chunk.byteLength;
              if (fileTracker.progressCallback) fileTracker.progressCallback(Math.floor((fileTracker.charsUploaded + bytesUploaded) / fileTracker.totalBytes * 100))
            },
            flush(controller) {
              console.log("completed stream");
            },
        });
        const response = await fetch("/api/fileUpload", {
            method: "POST",
            headers: {
                "Content-Type": 'application/octet-stream',
                "File-Chunk-Status": fileTracker.first ? "first" : "middle",
                "File-Name": encodeURI(fileName),
                "User-Id": userId,
                "File-Path": filePath
            },
            body: blob.stream().pipeThrough(progressTrackingStream),
            //@ts-ignore
            duplex: "half",
        })
        if (!response.ok) {
            console.log(response)
            fileTracker.errorPush("Failed to upload file " + response.statusText);
            return 1
        }
        fileTracker.charsUploaded += blob.size;
        fileTracker.first = false;
        return 0;
    } catch(error) {
        fileTracker.errorPush(error);
        return 1;
    };
}

export async function uploadFile(file: File, fileTracker: FileUploadTracker, userId: string, filePath: string) {
    const fileSize = file.size;
    // const CHUCK_SIZE = 52428800; // 50MB 303 Seconds
    const CHUCK_SIZE = 103809024; // 99MB 282 Seconds
    const numFullChunks = Math.floor(fileSize / CHUCK_SIZE);
    const partialChunkSize = fileSize % CHUCK_SIZE;

    let chunk = 0;

    while (chunk < numFullChunks) {
        const offset = chunk * CHUCK_SIZE;
        await uploadBlobToServer(file.slice(offset, offset + CHUCK_SIZE), fileTracker, file.name, userId, filePath);
        chunk++;
    }

    if (partialChunkSize > 0) {
        const offset = chunk * CHUCK_SIZE;
        await uploadBlobToServer(file.slice(offset, offset + CHUCK_SIZE), fileTracker, file.name, userId, filePath);
    }

    if (fileTracker.charsUploaded === fileSize) {
        fileTracker.done();
    }
}