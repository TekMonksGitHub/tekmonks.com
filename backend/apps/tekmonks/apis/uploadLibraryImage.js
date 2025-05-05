const path = require("path");
const fspromises = require("fs").promises;

exports.doService = async jsonReq => {
  if (!validateRequest(jsonReq)) return {error: "Validation failure.", ...CONSTANTS.FALSE_RESULT};
  const folderPath = `${TEKMONKS_COM_CONSTANTS.CMS_ROOT}/media/`;
  
  if (!(await fspromises.exists(folderPath))) await fspromises.mkdirSync(folderPath);
  
  //save image under path
  const filePath = path.join(folderPath, jsonReq.name.replace(/\s+/g, '-'));

  try {
    await fspromises.writeFile(filePath, jsonReq.image.base64String, "base64");
    return { message: "File uploaded successfully.", success: true, ...CONSTANTS.TRUE_RESULT};
  } catch (error) {
    console.error("Error writing file:", error);
    return { message: "Error adding image" + error, success: false, ...CONSTANTS.FALSE_RESULT};
  }
  
};

const validateRequest = jsonReq => jsonReq && jsonReq.image && jsonReq.name;