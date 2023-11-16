const API_CONSTANTS = require(`${__dirname}/lib/constants.js`);
const path = require("path");
const fs = require("fs");
const util = require("util");
const writeFile = util.promisify(fs.writeFile);

exports.doService = async jsonReq => {
    if (!validateRequest(jsonReq)) {
        return { error: "Validation failure." };
    }
    
    const org = jsonReq.org;
    const userid = jsonReq.userid;
    const folderPath = `${API_CONSTANTS.CMS_ROOT}/blogs.md/`;
    const fullPath = path.join(folderPath, btoa(org), btoa(userid));
    
    try{
        if (!fs.existsSync(fullPath)) {
            fs.mkdirSync(fullPath, { recursive: true });
        }
        return { message: "Folder created successfully.", path: fullPath, status: true};
    } catch (error) {
        return { error: "Failed to add blog. Error is " +  error };
    }
};

function validateRequest(jsonReq) {
  return jsonReq 
}

