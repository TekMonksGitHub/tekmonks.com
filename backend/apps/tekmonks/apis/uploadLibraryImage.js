const API_CONSTANTS = require(`${__dirname}/lib/constants.js`);
const path = require("path");
const fs = require("fs");
const util = require("util");
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

exports.doService = async jsonReq => {
  if (!validateRequest(jsonReq)) {
    return { error: "Validation failure." };
  }
  const folderPath = `${API_CONSTANTS.CMS_ROOT}/media/`;
  
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
  }
  
  //save image under path
  const filePath = path.join(folderPath, jsonReq.name.replace(/\s+/g, '-'));

  try {
    await writeFile(filePath, jsonReq.image.base64String, "base64");
    return { message: "File uploaded successfully.", success: true};
  } catch (error) {
    console.error("Error writing file:", error);
    return { message: "Error adding image" + error, success: false};
  }
  
};

function validateRequest(jsonReq) {
  return jsonReq
}