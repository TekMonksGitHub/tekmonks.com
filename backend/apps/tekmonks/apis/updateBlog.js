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
  
  const {title, blog, language} = jsonReq;
  
  if (!title || !blog) {
    return { error: "Title and blog content are required." };
  }

  const filePath = findFileByTitle(title);

  if (!filePath) {
    return { error: `File with title "${title}" not found.` };
  }

  try {
    await updateFileContent(filePath, blog);
    await renameFileByLanguage(filePath, language);
    return { message: `File with title "${title}" updated successfully.`, status: true };
  } catch (error) {
    return { error: "Failed to update file content." + error};
  }
};

function validateRequest(jsonReq) {
  return jsonReq && jsonReq.title && jsonReq.blog;
}

function findFileByTitle(title) {
  const folderPath = `${API_CONSTANTS.CMS_ROOT}/blogs.md`; // Adjust the folder path as needed

  function traverseFolder(currentPath) {
    const files = fs.readdirSync(currentPath);

    for (const file of files) {
      const filePath = path.join(currentPath, file);
      const stat = fs.statSync(filePath);

      if (stat.isFile() && path.extname(filePath) === '.md') {
        const fileTitle = getTitleOfBlog(filePath);
        if (fileTitle === title) {
          return filePath;
        }
      } else if (stat.isDirectory()) {
        const foundFilePath = traverseFolder(filePath);
        if (foundFilePath) {
          return foundFilePath;
        }
      }
    }

    return null;
  }

  return traverseFolder(folderPath);
}

async function updateFileContent(filePath, newContent) {
  try {
    await writeFile(filePath, newContent, 'utf8');
  } catch (error) {
    throw error;
  }
}

async function renameFileByLanguage(filePath, newLanguage) {
  try {
    const dirname = path.dirname(filePath);
    const extname = path.extname(filePath);
    const basename = path.basename(filePath, extname);

    const parts = basename.split('.');
    
    if (parts.length >= 2) {
      parts[1] = newLanguage;
      const newFilename = parts.join('.') + extname;
      const newPath = path.join(dirname, newFilename);

      await fs.promises.rename(filePath, newPath);
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

function getTitleOfBlog(filePath) {
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    const lines = data.split('\n');

    for (const line of lines) {
      if (line.trim().startsWith('#')) {
        return line.trim().replace(/^#+\s*/, '');
      }
    }
    return null;
  } catch (error) {
    console.error(`Error reading file: ${filePath}`, error);
    return null;
  }
}
