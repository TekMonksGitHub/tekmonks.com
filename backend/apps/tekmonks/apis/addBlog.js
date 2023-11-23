const API_CONSTANTS = require(`${__dirname}/lib/constants.js`);
const path = require("path");
const fs = require("fs");
const util = require("util");
const writeFile = util.promisify(fs.writeFile);

exports.doService = async jsonReq => {
  if (!validateRequest(jsonReq)) {
    return { error: "Validation failure." };
  }

  const blog = jsonReq.blog;
  const language = jsonReq.language;
  const org = jsonReq.org
  const userid = jsonReq.userid
  
  if (!blog) {
    return { error: "Blog content is required." };
  }

  const folderPath = `${API_CONSTANTS.CMS_ROOT}/blogs.md/`; // Adjust the folder path as needed
  const fullPath = path.join(folderPath, btoa(org), btoa(userid))

  try {
    ensureDirectoryExists(fullPath);
    await saveBlogToFile(fullPath, blog, language);
    return { message: "Blog added successfully.", status: true};
  } catch (error) {
    return { error: "Failed to add blog. Error is " +  error };
  }
};

function validateRequest(jsonReq) {
  return jsonReq && jsonReq.blog && jsonReq.org && jsonReq.userid && jsonReq.language;
}

async function saveBlogToFile(folderPath, blog, language) {
  // Generate a unique file name or use a timestamp-based name
  const fileName = generateUniqueFileName(language);

  // Create the full file path
  const filePath = path.join(folderPath, fileName + ".md");
  try {
    await writeFile(filePath, blog, "utf8");
  } catch (error) {
    throw 'Error is' + error;
  }
}

function generateUniqueFileName(language) {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}-${hours}-${minutes}.${language}`
}

function ensureDirectoryExists(directoryPath) {
    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath, { recursive: true });
    }
}
