import { createHash } from 'crypto';
import { existsSync } from 'fs';
import { writeFile, appendFile } from 'fs/promises';
import path from 'path';

export async function POST({ request, locals }) {
    console.log("File Upload");
    const fileChunkStatus = request.headers.get("File-Chunk-Status");
    const encodedFileName = request.headers.get("File-Name");
    if (!encodedFileName) {
        return new Response('Missing File-Name header', { status: 400 });
    }

    const userId = locals.user?.id;
    if (!userId) {
        return new Response('Missing User-Id header', { status: 400 });
    }
    const hashedId = createHash('sha256').update(userId).digest("hex");

    const filePathHeaderEncoded = request.headers.get("File-Path");
    let filePathHeader = "";
    if (filePathHeaderEncoded) {
        filePathHeader = decodeURI(filePathHeaderEncoded);
    }

    // const filePathHeader = decodeURI(filePathHeaderEncoded);
    const fileName = decodeURI(encodedFileName);
    
    try {
        if (!request.body) {
            return new Response('No file uploaded', { status: 400 });
        }

        if (fileName.includes("\\") || fileName.includes("/")) {
            return new Response('Invalid File Name', { status: 400 });
        }

        if (!existsSync("./files/" + hashedId)) {
            return new Response('Invalid user id', { status: 401 });
        }
        
        if (existsSync(path.resolve("./files/" + path.join(hashedId, filePathHeader))) && !filePathHeader.includes("../")) {
            if (existsSync(path.resolve("./files/" + path.join(hashedId, filePathHeader, fileName))) && (fileChunkStatus === "first" || fileChunkStatus === "firstlast")) {
                return new Response('File Already Exists', { status: 409, statusText: "File Already Exists" });
            }
            const readableStream = request.body;
            const filePath = "./files/" + path.join(hashedId, filePathHeader, fileName);
    
            if (fileChunkStatus === "first" || fileChunkStatus === "firstlast") {
                //@ts-ignore
                await writeFile(filePath, readableStream);
            } else {
                //@ts-ignore
                await appendFile(filePath, readableStream);
            }
            
            return new Response(JSON.stringify({ message: 'File uploaded successfully!' }), { status: 200 });
        } else {
            return new Response('Invalid File Path', { status: 400 });
        }


    } catch (error) {
        console.error('Error uploading file:', error);
        return new Response('Internal server error', { status: 500 });
    }
}