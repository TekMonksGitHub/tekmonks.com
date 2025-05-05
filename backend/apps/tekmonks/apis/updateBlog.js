const fs = require("fs");
const path = require("path");
const fspromises = fs.promises;

exports.doService = async jsonReq => {
  if (!_validateRequest(jsonReq)) return { error: "Validation failure.", ...CONSTANTS.FALSE_RESULT };
  
  const {title, blog, language, image} = jsonReq;
  
  const filePath = await _findFileByTitle(title);
  if (!filePath) return { error: `File with title "${title}" not found.`, ...CONSTANTS.FALSE_RESULT };
  
  if (image) {
    const parentFolder = path.dirname(filePath);
    for (const file of (await fspromises.readdir(parentFolder))) if (file.startsWith('header')) 
      await fspromises.unlinkSync(path.join(parentFolder, file));
    const imageName = `header.${language}.${image.fileType}`
    const imagePath = path.join(parentFolder, imageName);
    try {await fspromises.writeFile(imagePath, image.base64String, "base64")} catch (error) {
      return { error: 'Error saving image: ' + error, ...CONSTANTS.FALSE_RESULT };
    }
  }

  try {
    await fspromises.writeFile(filePath, blog, 'utf8');
    await _renameFileByLanguage(filePath, language);
    return { message: `File with title "${title}" updated successfully.`, status: true, ...CONSTANTS.TRUE_RESULT };
  } catch (error) {return { error: "Failed to update file content." + error, ...CONSTANTS.FALSE_RESULT }}
};

function _validateRequest(jsonReq) {
  return jsonReq && jsonReq.title && jsonReq.blog;
}

async function _findFileByTitle(title) {
  const folderPath = `${TEKMONKS_COM_CONSTANTS.CMS_ROOT}/blogs.md`; // Adjust the folder path as needed

  async function _traverseFolder(currentPath) {
    const files = await fspromises.readdir(currentPath);

    for (const file of files) {
      const filePath = path.join(currentPath, file);
      const stat = await fspromises.stat(filePath);

      if (stat.isFile() && path.extname(filePath) === '.md') {
        const fileTitle = await _getTitleOfBlog(filePath);
        if (fileTitle === title) return filePath;
      } else if (stat.isDirectory()) {
        const foundFilePath = await _traverseFolder(filePath);
        if (foundFilePath) return foundFilePath;
      }
    }
    return null;
  }

  return await _traverseFolder(folderPath);
}

async function _renameFileByLanguage(filePath, newLanguage) {
  try {
    const dirname = path.dirname(filePath);
    const extname = path.extname(filePath);
    const basename = path.basename(filePath, extname);

    const parts = basename.split('.');
    
    if (parts.length >= 2) {
      parts[1] = newLanguage;
      const newFilename = parts.join('.') + extname;
      const newPath = path.join(dirname, newFilename);

      await fspromises.rename(filePath, newPath);
      return newPath;
    } else {
      console.error(`Error splitting file name: ${filePath}`);
      throw new Error("Failed to split file name into parts.");
    }
  } catch (error) {
    console.error(`Error renaming file: ${filePath}`, error);
    throw error;
  }
}

async function _getTitleOfBlog(filePath) {
  try {
    const data = await fspromises.readFile(filePath, 'utf-8');
    const lines = data.split('\n');
    for (const line of lines) if (line.trim().startsWith('#')) return line.trim().replace(/^#+\s*/, '');
    return null;
  } catch (error) {
    console.error(`Error reading file: ${filePath}`, error);
    return null;
  }
}
