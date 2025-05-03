import type { FileInfo } from '@/utils';
import { json, redirect } from '@sveltejs/kit';
import { createHash } from 'crypto';
import { readdirSync, statSync } from 'fs';
import path from 'path';

function getDirectoryStructure(dir: string) {
    const result: {[key: string]: FileInfo} = {};
    const files = readdirSync(dir);

    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = statSync(filePath);

        if (stat.isDirectory()) {
            result[file] = {
                type: "folder",
                name: file,
                size: stat.size,
                lastModified: stat.mtime,
                children: getDirectoryStructure(filePath),
                extension: "folder"
            }
        } else {
            stat.mtime
            result[file] = {
                type: "file",
                name: file,
                size: stat.size,
                lastModified: stat.mtime,
                extension: path.extname(filePath).slice(1)
            }
        }
    }

    return result;
}

async function searchDir(userId: string) {
	return getDirectoryStructure("./files/" + createHash('sha256').update(userId).digest("hex"));
}

export async function load({ locals, depends }) {
    depends('homebase');

    if (!locals.user) {
        return redirect(301, "/");
    }

    const userDir = await searchDir(locals.user.id);

    return {
        user: locals.user,
        userDir
    }
}