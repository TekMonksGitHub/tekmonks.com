const path = require("path");
const fs = require("fs").promises;

exports.doService = async (jsonReq) => {
  if (!validateRequest(jsonReq)) {
    LOG.error("Validation failure.");
    return CONSTANTS.FALSE_RESULT;
  }

  const folderPath = path.join(TEKMONKS_COM_CONSTANTS.CMS_ROOT, "blogs.md");
  let files = await getAllFilesInFolder(folderPath);
  return { file: files };
};

async function getAllFilesInFolder(folderPath) {
  let fileList = [];
  let id = 0;

  function getLanguageFromFileName(fileName) {
    const parts = fileName.split('.');
    return parts.length >= 2 ? parts[1] : null;
  }
  

  async function traverseFolder(currentPath) {
    try {
      const files = await fs.readdir(currentPath, { withFileTypes: true });

      for (const file of files) {
        const filePath = path.join(currentPath, file.name);
        
        if (file.name === 'blogs.en.md') {
          continue;
        }

        if (file.isFile() && path.extname(filePath) === '.md') {
          const title = await getTitleOfBlog(filePath);
          const stat = await fs.stat(filePath);
          const lastModified = new Date(stat.mtime);
          const content = await fs.readFile(filePath, 'utf8');
          const formattedDate = lastModified.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' });
          let subPath = ''
          subPath = path.basename(path.dirname(filePath));
          const nameDirHash = path.basename(path.dirname(currentPath))
          const orgDirHash = path.basename(path.dirname(path.dirname(currentPath)));    
          subPath = subPath.split('-').length == 3 ? subPath : `${orgDirHash}/${nameDirHash}/${subPath}`;

          fileList.push({
            id: id,
            title: title,
            path: filePath,
            lastModified: formattedDate,
            content: content,
            subPath: subPath,
            [getLanguageFromFileName(file.name)]: true,
          });
          id += 1;
        } else if (file.isDirectory()) {
          let containingFolder = path.basename(filePath);
          let skipFolder = ['ai', 'coding', 'main.md', 'main1.md', 'main2.md', 'main3.md', 'rpa', 'blogs.md', 'articleadv.md'];
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
