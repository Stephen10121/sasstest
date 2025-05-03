import { createHash } from "crypto";
import { existsSync, renameSync, rmSync, unlinkSync } from "fs";
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
        const fileOrFolder = type === "file" ? "File" : "Folder";

        if (!filePath || !type || !oldFileName || !newFileName) {
            return {
                success: false,
                errorMsg: "Missing Parameters."
            }
        }
        
        if (filePath.includes("\\") || filePath.includes("../")) {
            return {
                success: false,
                errorMsg: "Invalid " + fileOrFolder + " Path."
            }
        }

        if (oldFileName.includes("\\") || oldFileName.includes("/")) {
            return {
                success: false,
                errorMsg: "Invalid Old " + fileOrFolder + " Name."
            }
        }

        if (newFileName.includes("\\") || newFileName.includes("/")) {
            return {
                success: false,
                errorMsg: "Invalid " + fileOrFolder + " Name."
            }
        }

        if (!existsSync("./files/" + hashedId)) {
            return {
                success: false,
                errorMsg: "Invalid User Id."
            }
        }

        const oldFile = path.resolve("./files/" + path.join(hashedId, filePath.split("/").slice(2).join("/"), oldFileName));
        if(!existsSync(oldFile)) {
            return {
                success: false,
                errorMsg: fileOrFolder + " Doesn't Exist."
            }
        }

        const newFile = path.resolve("./files/" + path.join(hashedId, filePath.split("/").slice(2).join("/"), newFileName));
        if(existsSync(newFile)) {
            return {
                success: false,
                errorMsg: "Renamed " + fileOrFolder + " already Exists."
            }
        }

        try {
            renameSync(oldFile, newFile);
            return { success: true } 
        } catch (err) {
            console.log(err);
            return {
                success: false,
                errorMsg: "Failed to rename " + fileOrFolder + "."
            }
        }
    },
    deleteFile: async ({ locals, request }) => {
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
        const fileName = formData.get("fileName") as string;
        const fileOrFolder = type === "file" ? "File" : "Folder";

        if (!filePath || !type || !fileName) {
            return {
                success: false,
                errorMsg: "Missing Parameters."
            }
        }
        
        if (filePath.includes("\\") || filePath.includes("../")) {
            return {
                success: false,
                errorMsg: "Invalid " + fileOrFolder + " Path."
            }
        }

        if (fileName.includes("\\") || fileName.includes("/")) {
            return {
                success: false,
                errorMsg: "Invalid " + fileOrFolder + " Name."
            }
        }

        if (!existsSync("./files/" + hashedId)) {
            return {
                success: false,
                errorMsg: "Invalid User Id."
            }
        }

        const oldFile = path.resolve("./files/" + path.join(hashedId, filePath.split("/").slice(2).join("/"), fileName));
        if(!existsSync(oldFile)) {
            return {
                success: false,
                errorMsg: fileOrFolder + " Doesn't Exist."
            }
        }

        try {
            if (type === "file") {
                unlinkSync(oldFile)
            } else {
                rmSync(oldFile, { recursive: true, force: true });
            }
            return { success: true } 
        } catch (err) {
            console.log(err);
            return {
                success: false,
                errorMsg: "Failed to delete " + fileOrFolder+ "."
            }
        }
    }
}