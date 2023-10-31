const API_CONSTANTS = require(`${__dirname}/lib/constants.js`);
const path = require("path");
const fs = require("fs")
const readFile = require("util").promisify(require("fs").readFile)


exports.doService = async jsonReq => {
	if (!validateRequest(jsonReq)) {LOG.error("Validation failure."); return CONSTANTS.FALSE_RESULT;}
    
     const folderPath = `${API_CONSTANTS.CMS_ROOT}/blogs.md`
     const files = getAllFilesInFolder(folderPath);
    
     //LOG.debug({files})
     return {file: files}
}

function getAllFilesInFolder(folderPath) {
    let fileList = [];
    let id = 0
    
    function traverseFolder(currentPath) {
      const files = fs.readdirSync(currentPath);
  
      for (const file of files) {
        const filePath = path.join(currentPath, file);
        const stat = fs.statSync(filePath);
  
        if (stat.isFile() && path.extname(filePath) === '.md') {
          const title = getTitleOfBlog(filePath)
          const lastModified = new Date(stat.mtime)
          const content = fs.readFileSync(filePath, 'utf8');
          const formattedDate = lastModified.toLocaleDateString('en-US', {year: 'numeric', month: 'short', day: '2-digit'})
          fileList.push({
            id: id, 
            title: title, 
            path: filePath, 
            lastModified: formattedDate,
            content: content
          })
          id += 1
        } else if (stat.isDirectory()) {
          let containingFolder = path.basename(filePath)
          let skipFolder = ['ai', 'coding', 'main.md', 'main1.md', 'main2.md', 'main3.md', 'rpa']
          if (skipFolder.includes(containingFolder)) continue;
          traverseFolder(filePath);
        }
      }
    }
    
    traverseFolder(folderPath);
    return fileList;
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

const validateRequest = jsonReq => (jsonReq);
