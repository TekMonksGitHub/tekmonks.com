const path = require("path");
const fs = require("fs");

exports.doService = async jsonReq => {
    if (!validateRequest(jsonReq)) {
        return { error: "Validation failure." };
    }
    
    console.log(JSON.stringify(jsonReq))
    
    //delete the parent folder of the path
    const filePath = jsonReq.path
    const parentDir = path.dirname(filePath);
    console.log(filePath)
    
    try {
        await fs.promises.rmdir(parentDir, { recursive: true });
        return { message: `Blog deleted successfully.`, status: true };
    } catch (error) {
        return { error: `Failed to delete blog: ${error.message}` };
    }
};

function validateRequest(jsonReq) {
  return jsonReq && jsonReq.path
}
