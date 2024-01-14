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
  let id = 0;

  function getLanguageFromFileName(fileName) {
    const parts = fileName.split('.');
    return parts.length >= 2 ? parts[1] : null;
  }

  function getImageInfo(blogFilePath) {
    const blogDirectoryName = path.dirname(blogFilePath);
    const nameDirHash = path.basename(path.dirname(blogFilePath));
    const orgDirHash = path.basename(path.dirname(path.dirname(blogFilePath)));
    const imgFolderPath = path.join(blogDirectoryName, 'img');
    const blogFileName = path.basename(blogFilePath, path.extname(blogFilePath));
    const blogBaseUrl = 'https://tekmonks.com/apps/tekmonks/articles/blogs.md';
    const imageBaseUrl = `${blogBaseUrl}/${orgDirHash}/${nameDirHash}/img`;

    try {
        const imgFiles = fs.readdirSync(imgFolderPath);

        for (const imgFile of imgFiles) {
            const imgFilePath = path.join(imgFolderPath, imgFile);
            const imgFileName = path.basename(imgFilePath, path.extname(imgFilePath));

            if (imgFileName === blogFileName) {
                const imageContent = fs.readFileSync(imgFilePath, 'utf8');
                const imagePath = `${imageBaseUrl}/${imgFile}`;
                return { path: imagePath, content: imageContent };
            }
        }

        return null;
    } catch (error) {
        return null;
    }
}

  function traverseFolder(currentPath) {
    const files = fs.readdirSync(currentPath);

    for (const file of files) {
      const filePath = path.join(currentPath, file);
      const stat = fs.statSync(filePath);

      if (stat.isFile() && path.extname(filePath) === '.md') {
        const title = getTitleOfBlog(filePath);
        const lastModified = new Date(stat.mtime);
        const content = fs.readFileSync(filePath, 'utf8');
        const formattedDate = lastModified.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' });
        const imageInfo = getImageInfo(filePath);

        fileList.push({
          id: id,
          title: title,
          path: filePath,
          lastModified: formattedDate,
          content: content,
          [getLanguageFromFileName(file)]: true,
          image: imageInfo
        });
        id += 1;
      } else if (stat.isDirectory()) {
        let containingFolder = path.basename(filePath);
        let skipFolder = ['ai', 'coding', 'main.md', 'main1.md', 'main2.md', 'main3.md', 'rpa'];
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
