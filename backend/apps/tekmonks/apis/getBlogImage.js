const API_CONSTANTS = require(`${__dirname}/lib/constants.js`);
const { name } = require("mustache");
const path = require("path");
const fs = require("fs").promises;

exports.doService = async (jsonReq) => {
  if (!validateRequest(jsonReq)) {
    LOG.error("Validation failure.");
    return CONSTANTS.FALSE_RESULT;
  }

  const ID = jsonReq.id;
  const blogs = jsonReq.blogs.file;

  const blog = blogs.find((blog) => blog.id == ID);
  const blogPath = blog.path;

  //loop on the parent directory of blogPath; then look for a file named 'header'
  const parentDir = path.dirname(blogPath);
  const headerFileName = 'header';
  const headerFiles = await fs.readdir(parentDir);
  const headerFile = headerFiles.find((filename) => {
    return filename.startsWith(headerFileName);
  });
  
  if (!headerFile) {
    return CONSTANTS.FALSE_RESULT
  }
  
  const parentDirName = path.basename(parentDir);
  const nameDirHash = path.basename(path.dirname(parentDir));
  const orgDirHash = path.basename(path.dirname(path.dirname(parentDir)));
  const blogBaseUrl = 'https://tekmonks.com/apps/tekmonks/articles/blogs.md';
  const imageBaseUrl = `${blogBaseUrl}/${orgDirHash}/${nameDirHash}/${parentDirName}`;
  
  return {result: true, image: `${imageBaseUrl}/${headerFile}`};
};


const validateRequest = (jsonReq) => jsonReq;
