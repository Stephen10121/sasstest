import { createHash } from "crypto";
import { existsSync, renameSync } from "fs";
import path from "path";

export const actions = {
    renameFile: async ({ locals, request }) => {
        const id = locals.user?.id;
        if (!id) {
            return {
                success: false,
                errorMsg: "Unauthorized Access."
            }
        }

        const hashedId = createHash('sha256').update(id).digest("hex");
        const formData = await request.formData();
        const filePath = formData.get("filePath") as string;
        const type = formData.get("type") as string;
        const oldFileName = formData.get("oldFileName") as string;
        const newFileName = formData.get("newFileName") as string;

        console.log({ id, filePath, type, oldFileName, newFileName });

        if (!filePath || !type || !oldFileName || !newFileName) {
            return {
                success: false,
                errorMsg: "Missing Parameters."
            }
        }
        
        if (filePath.includes("\\") || filePath.includes("../")) {
            return {
                success: false,
                errorMsg: "Invalid File Path."
            }
        }

        if (oldFileName.includes("\\") || oldFileName.includes("/")) {
            return {
                success: false,
                errorMsg: "Invalid Old File Name."
            }
        }

        if (newFileName.includes("\\") || newFileName.includes("/")) {
            return {
                success: false,
                errorMsg: "Invalid File Name."
            }
        }

        if (!existsSync("./files/" + hashedId)) {
            return {
                success: false,
                errorMsg: "Invalid User Id."
            }
        }

        // if (existsSync(path.resolve("./files/" + path.join(hashedId, filePathHeader))) && !filePathHeader.includes("../")) {
        //     if (existsSync(path.resolve("./files/" + path.join(hashedId, filePathHeader, fileName)))) {
        //         return new Response('File Already Exists', { status: 409, statusText: "File Already Exists" });
        //     }
        //     const readableStream = request.body;
        //     const filePath = "./files/" + path.join(hashedId, filePathHeader, fileName);

        //     if (fileChunkStatus === "first" || fileChunkStatus === "firstlast") {
        //         //@ts-ignore
        //         await writeFile(filePath, readableStream);
        //     } else {
        //         //@ts-ignore
        //         await appendFile(filePath, readableStream);
        //     }
            
        //     return new Response(JSON.stringify({ message: 'File uploaded successfully!' }), { status: 200 });
        // } else {
        //     return new Response('Invalid File Path', { status: 400 });
        // }

        const oldFile = path.resolve("./files/" + path.join(hashedId, filePath.split("/").slice(2).join("/"), oldFileName));
        if(!existsSync(oldFile)) {
            return {
                success: false,
                errorMsg: "File Doesn't Exist."
            }
        }

        const newFile = path.resolve("./files/" + path.join(hashedId, filePath.split("/").slice(2).join("/"), newFileName));
        if(existsSync(newFile)) {
            return {
                success: false,
                errorMsg: "Renamed file already Exists."
            }
        }

        try {
            renameSync(oldFile, newFile);
            return { success: true } 
        } catch (err) {
            console.log(err);
            return {
                success: false,
                errorMsg: "Failed to rename."
            }
        }
    }
}