import { createReadStream, existsSync, statSync } from 'fs';
import mime from 'mime';
import { fileActionAuthHelper } from '../../../fileHelpers';

export async function GET({ request, locals, url }) {
    const { error, response, filePath, fileName } = fileActionAuthHelper(url, locals);
    if (error) {
        return response;
    }

    const range = request.headers.get("Range");
    if (!range) {
        return new Response('Missing Range header', { status: 400 });
    }
    
    try {
        if (!existsSync(filePath)) {
            return new Response("File Doesn't Exist", { status: 409, statusText: "File Doesn't Exist" });
        }

        const fileSize = statSync(filePath).size;

        const CHUNK_SIZE = 10 ** 6;
        const chunkStart = Number(range.replace(/\D/g, ""));
        const chunkEnd = Math.min(chunkStart + CHUNK_SIZE, fileSize - 1);
        
        const contentType = mime.getType(fileName);
        const contentLength = chunkEnd - chunkStart + 1;

        return new Response(createReadStream(filePath, { start: chunkStart, end: chunkEnd }) as any as BodyInit, {
            status: 206,
            headers: {
                "Content-Range": `bytes ${chunkStart}-${chunkEnd}/${fileSize}`,
                "Accept-Ranges": "bytes",
                "Content-Length": `${contentLength}`,
                "Content-Type": contentType + ""
            }
        });
    } catch (error) {
        console.error('Error uploading file:', error);
        return new Response('Internal server error', { status: 500 });
    }
}