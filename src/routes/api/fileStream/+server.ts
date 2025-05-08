import { createHash } from 'crypto';
import { createReadStream, existsSync, statSync } from 'fs';
import { readFile } from 'fs/promises';
import mime from 'mime';
import path from 'path';
import { Readable } from 'node:stream';

export async function GET({ request, locals, url }) {
    const encodedFileName = url.searchParams.get("fileName") //headers.get("File-Name");
    if (!encodedFileName) {
        return new Response('Missing File-Name header', { status: 400 });
    }

    const userId = locals.user?.id;
    if (!userId) {
        return new Response('Missing User-Id header', { status: 400 });
    }
    const hashedId = createHash('sha256').update(userId).digest("hex");

    const filePathHeaderEncoded =  url.searchParams.get("filePath");//request.headers.get("File-Path");
    let filePathHeader = "";
    if (filePathHeaderEncoded) {
        filePathHeader = decodeURI(filePathHeaderEncoded);
    }

    // const filePathHeader = decodeURI(filePathHeaderEncoded);
    const fileName = decodeURI(encodedFileName);

    const range = request.headers.get("Range");
    if (!range) {
        return new Response('Missing Range header', { status: 400 });
    }
    
    try {
        if (fileName.includes("\\") || fileName.includes("/")) {
            return new Response('Invalid File Name', { status: 400 });
        }

        if (!existsSync("./files/" + hashedId)) {
            return new Response('Invalid user id', { status: 401 });
        }
        
        if (existsSync(path.resolve("./files/" + path.join(hashedId, filePathHeader))) && !filePathHeader.includes("../")) {
            if (existsSync(path.resolve("./files/" + path.join(hashedId, filePathHeader, fileName)))) {
                const filePath = "./files/" + path.join(hashedId, filePathHeader, fileName);
                const fileSize = statSync(filePath).size;

                const CHUNK_SIZE = 10 ** 6;
                const chunkStart = Number(range.replace(/\D/g, ""));
                const chunkEnd = Math.min(chunkStart + CHUNK_SIZE, fileSize - 1);
                
                const contentType = mime.getType(fileName);
                const contentLength = chunkEnd - chunkStart + 1;
                const headers = {
                    "Content-Range": `bytes ${chunkStart}-${chunkEnd}/${fileSize}`,
                    "Accept-Ranges": "bytes",
                    "Content-Length": contentLength,
                    "Content-Type": contentType + ""
                };

                return new Response(createReadStream(filePath, { start: chunkStart, end: chunkEnd }), {
                    status: 206,
                    headers
                });

                // Stream The Video.
            } else {
                return new Response("File Doesn't Exist", { status: 409, statusText: "File Already Exists" });
            }
        } else {
            return new Response('Invalid File Path', { status: 400 });
        }


    } catch (error) {
        console.error('Error uploading file:', error);
        return new Response('Internal server error', { status: 500 });
    }
}