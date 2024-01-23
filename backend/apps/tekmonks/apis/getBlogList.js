const API_CONSTANTS = require(`${__dirname}/lib/constants.js`);
const path = require("path");
const fs = require("fs").promises;



const blogBaseUrl = 'https://tekmonks.com/apps/tekmonks/articles/blogs.md';

exports.doService = async (jsonReq) => {
  if (!validateRequest(jsonReq)) {
    LOG.error("Validation failure.");
    return CONSTANTS.FALSE_RESULT;
  }

  const folderPath = path.join(API_CONSTANTS.CMS_ROOT, "blogs.md");
  const files = await getAllFilesInFolder(folderPath);

  // LOG.debug({files})
  return { file: files };
};

async function getAllFilesInFolder(folderPath) {
  let fileList = [];
  let id = 0;

  function getLanguageFromFileName(fileName) {
    const parts = fileName.split('.');
    return parts.length >= 2 ? parts[1] : null;
  }

  async function getImageInfo(blogFilePath) {
    const blogDirectoryName = path.dirname(blogFilePath);
    const nameDirHash = path.basename(path.dirname(path.dirname(blogFilePath)))
    const orgDirHash = path.basename(path.dirname(path.dirname(path.dirname(blogFilePath))));
    const imgFolderPath = path.join(path.dirname(blogDirectoryName), 'img');
    const blogFileName = path.basename(blogFilePath, path.extname(blogFilePath));
    const blogBaseUrl = 'https://tekmonks.com/apps/tekmonks/articles/blogs.md';
    const imageBaseUrl = `${blogBaseUrl}/${orgDirHash}/${nameDirHash}/img`;
  
    try {
      const imgFiles = await fs.readdir(imgFolderPath);
  
      for (const imgFile of imgFiles) {
        console.log(imgFile)
        const imgFilePath = path.join(imgFolderPath, imgFile);
        const imgFileName = path.basename(imgFilePath, path.extname(imgFilePath));
  
        if (imgFileName === blogFileName) {
          const imageContent = await fs.readFile(imgFilePath, 'utf8');
          const imagePath = `${imageBaseUrl}/${imgFile}`;
          return { path: imagePath, content: imageContent };
        }
      }
  
      return null;
    } catch (error) {
      console.error(`Error reading image files: ${error}`);
      return null;
    }
  }
  

  async function traverseFolder(currentPath) {
    try {
      const files = await fs.readdir(currentPath, { withFileTypes: true });

      for (const file of files) {
        const filePath = path.join(currentPath, file.name);

        if (file.isFile() && path.extname(filePath) === '.md') {
          const title = await getTitleOfBlog(filePath);
          const stat = await fs.stat(filePath);
          const lastModified = new Date(stat.mtime);
          const content = await fs.readFile(filePath, 'utf8');
          const formattedDate = lastModified.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' });
          const imageInfo = await getImageInfo(filePath);

          fileList.push({
            id: id,
            title: title,
            path: filePath,
            lastModified: formattedDate,
            content: content,
            subPath: path.basename(path.dirname(filePath)),
            [getLanguageFromFileName(file.name)]: true,
            image: imageInfo,
          });
          id += 1;
        } else if (file.isDirectory()) {
          let containingFolder = path.basename(filePath);
          let skipFolder = ['ai', 'coding', 'main.md', 'main1.md', 'main2.md', 'main3.md', 'rpa'];
          if (!skipFolder.includes(containingFolder)) {
            await traverseFolder(filePath);
          }
        }
      }
    } catch (error) {
      console.error(`Error reading folder: ${currentPath}`, error);
    }
  }

  await traverseFolder(folderPath);
  return fileList;
}

async function getTitleOfBlog(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
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

const validateRequest = (jsonReq) => jsonReq;
