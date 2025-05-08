import { createHash } from "crypto";
import { existsSync } from "fs";
import path from "path";

export type FileHelperResponse = {
    error: true;
    response: Response;
    filePathWithoutFileName: null;
    filePath: null;
    fileName: null;
} | {
    error: false;
    filePathWithoutFileName: string;
    filePath: string;
    fileName: string;
    response: null;
}

/**
 * This function does all the basic file endpoint checks. It checks if a fileName url param is passed, filePath url param is passed as well. Then it checks if the user is valid and makes sure that fileName and filePath doesnt contain any illegal chars.
 * @param url
 * @param locals 
 * @returns 
 */
export function fileActionAuthHelper(url: URL, locals: App.Locals): FileHelperResponse {
    const encodedFileName = url.searchParams.get("fileName");
    if (!encodedFileName) {
        return {
			error: true,
			response: new Response('Missing fileName search parameter.', { status: 400, statusText: 'Missing fileName search parameter.' }),
			filePathWithoutFileName: null,
			filePath: null,
			fileName: null,
		}
    }

    if (!locals.user?.id) {
        return {
			error: true,
			response: new Response('Unauthorized.', { status: 401 }),
			filePathWithoutFileName: null,
			filePath: null,
			fileName: null,
		} 
    }

    const hashedId = createHash('sha256').update(locals.user.id).digest("hex");

    const filePathHeaderEncoded =  url.searchParams.get("filePath");
    let filePathHeader = "";
    if (filePathHeaderEncoded) {
        filePathHeader = decodeURIComponent(filePathHeaderEncoded);
    }

    const fileName = decodeURIComponent(encodedFileName);
    
	if (fileName.includes("\\") || fileName.includes("/")) {
		return {
			error: true,
			response: new Response('Invalid file name', { status: 400, statusText: 'Invalid file name' }),
			filePathWithoutFileName: null,
			filePath: null,
			fileName: null,
		}
	}

    if (filePathHeader.includes("../")) {
		return {
			error: true,
			response: new Response('Invalid path.', { status: 400, statusText: 'Invalid path.' }),
			filePathWithoutFileName: null,
			filePath: null,
			fileName: null,
		}
	}

	if (!existsSync("./files/" + hashedId)) {
		return {
			error: true,
			response: new Response('Unauthorized.', { status: 401 }),
			filePathWithoutFileName: null,
			filePath: null,
			fileName: null,
		}
	}

	return {
		error: false,
		filePathWithoutFileName: "./files/" + path.join(hashedId, filePathHeader),
		filePath: "./files/" + path.join(hashedId, filePathHeader, fileName),
		fileName,
		response: null
	}
}