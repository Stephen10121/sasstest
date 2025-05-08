import { existsSync } from 'fs';
import { fileActionAuthHelper } from '../../../fileHelpers';
import { json } from '@sveltejs/kit';
import { parseFile } from 'music-metadata';

export async function GET({ locals, url }) {
    const { error, response, filePath } = fileActionAuthHelper(url, locals);
    if (error) {
        return response;
    }
    
    try {
        if (!existsSync(filePath)) {
            return new Response("File Doesn't Exist", { status: 409, statusText: "File Doesn't Exist" });
        }

        const fileData = await parseFile(filePath);

        return json({
            title: fileData.common.title,
            artist: fileData.common.artist,
            album: fileData.common.album,
            pictures: fileData.common.picture
        });
    } catch (error) {
        console.error('Error fetching metadata:', error);
        return new Response('Internal server error', { status: 500 });
    }
}