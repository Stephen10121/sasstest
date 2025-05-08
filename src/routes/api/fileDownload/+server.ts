import { createReadStream, existsSync, statSync } from 'fs';
import { fileActionAuthHelper } from '../../../fileHelpers';

export async function GET({ locals, url }) {
    const { error, response, filePath, fileName } = fileActionAuthHelper(url, locals);
    if (error) {
        return response;
    }
    
    try {
        if (!existsSync(filePath)) {
            return new Response("File Doesn't Exist", { status: 409, statusText: "File Doesn't Exist" });
        }

        const fileStream = createReadStream(filePath);
        const fileSize = statSync(filePath).size;

        return new Response(fileStream as any as BodyInit, { status: 200, headers: {
            "Content-Type" : 'application/octet-stream',
            "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(fileName)}`,
            "Content-Length": `${fileSize}`
        } });
    } catch (error) {
        console.error('Error uploading file:', error);
        return new Response('Internal server error', { status: 500 });
    }
}