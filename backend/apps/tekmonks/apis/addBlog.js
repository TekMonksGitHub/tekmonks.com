const API_CONSTANTS = require(`${__dirname}/lib/constants.js`);
const path = require("path");
const fs = require("fs");
const util = require("util");
const writeFile = util.promisify(fs.writeFile);

exports.doService = async jsonReq => {
  if (!validateRequest(jsonReq)) {
    return { error: "Validation failure." };
  }
  
  const {blog, language, org, userid, image} = jsonReq;

  if (!blog) {
    return { error: "Blog content is required." };
  }

  const folderPath = `${API_CONSTANTS.CMS_ROOT}/blogs.md/`; // Adjust the folder path as needed
  const fullPath = path.join(folderPath, btoa(org), btoa(userid));
  const imgFolderPath = `${fullPath}/img` 

  try {
    ensureDirectoryExists(fullPath);
    ensureDirectoryExists(imgFolderPath)
    
    await saveBlogToFile(fullPath, blog, language);
    await saveImageToFile(fullPath, image, language);

    return { message: "Blog added successfully.", status: true };
  } catch (error) {
    return { error: "Failed to add blog. Error is " + error };
  }
};

function validateRequest(jsonReq) {
  return jsonReq && jsonReq.blog && jsonReq.org && jsonReq.userid && jsonReq.language && jsonReq.image;
}

async function saveBlogToFile(folderPath, blog, language) {
  // Generate a unique file name or use a timestamp-based name
  const fileName = generateUniqueFileName(folderPath, language, true);

  // Create the full file path for the blog content
  const filePath = path.join(folderPath, fileName + ".md");
  try {
    await writeFile(filePath, blog, "utf8");
  } catch (error) {
    throw 'Error is' + error;
  }
}

async function saveImageToFile(folderPath, image, language) {
  const fileName = generateUniqueFileName(folderPath, language, false);
  const filePath = path.join(folderPath, "img", fileName + '.' + image.fileType);
  try {
    await writeFile(filePath, image.base64String, "base64");
  } catch (error) {
    throw 'Error saving image: ' + error;
  }
}

function generateUniqueFileName(folderPath, language, isMDFile) {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const parentFolder = `${year}-${month}-${day}-${hours}-${minutes}`
  const fullPath = path.join(folderPath, parentFolder);
  ensureDirectoryExists(fullPath);
  return isMDFile ? path.join(parentFolder, `${parentFolder}.${language}`) : `${parentFolder}.${language}`
}

function ensureDirectoryExists(directoryPath) {
    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath, { recursive: true });
    }
}
