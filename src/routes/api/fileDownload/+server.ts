import { createHash } from 'crypto';
import { createReadStream, existsSync } from 'fs';
import { readFile } from 'fs/promises';
import path from 'path';

export async function GET({ request, locals }) {
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
        if (fileName.includes("\\") || fileName.includes("/")) {
            return new Response('Invalid File Name', { status: 400 });
        }

        if (!existsSync("./files/" + hashedId)) {
            return new Response('Invalid user id', { status: 401 });
        }
        
        if (existsSync(path.resolve("./files/" + path.join(hashedId, filePathHeader))) && !filePathHeader.includes("../")) {
            if (existsSync(path.resolve("./files/" + path.join(hashedId, filePathHeader, fileName)))) {
                const filePath = "./files/" + path.join(hashedId, filePathHeader, fileName);

                var filename = path.basename(filePath);

                // res.setHeader('Content-disposition', 'attachment; filename=' + filename);
                // res.setHeader('Content-type', mimetype);

                var filestream = readFile(filePath);
                return new Response(createReadStream(filePath, { encoding: 'utf8' }), { status: 200, headers: {
                    "Content-Type" : 'application/octet-stream',
                    "Content-Disposition": 'attachment; filename=' + filename
                } })
                // return{
                //     status:200,
                //     headers: {
                //       "Content-type" : mimetype,
                //       "Content-Disposition": 'attachment; filename=' + filename
                //     },
                //     body: filestream
                //   }
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