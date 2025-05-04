const fs = require("fs").promises;

exports.doService = async (_jsonReq) => {
 
  const folderPath = `${TEKMONKS_COM_CONSTANTS.CMS_ROOT}/media/`;
  
  //get all images in this path
  const images = await fs.readdir(folderPath);
  const imageList = [];
  const baseURL = `https://${TEKMONKS_COM_CONSTANTS.hostname}/apps/tekmonks/articles/media`;
  for (const image of images) {
    imageList.push({
      name: image,
      path: baseURL + '/' + image
    });
  }
  
  return { data: imageList };
  
};
