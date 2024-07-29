const API_CONSTANTS = require(`${__dirname}/lib/constants.js`);
const path = require("path");
const fs = require("fs").promises;

exports.doService = async (jsonReq) => {
 
  const folderPath = `${API_CONSTANTS.CMS_ROOT}/media/`;
  
  //get all images in this path
  const images = await fs.readdir(folderPath);
  const imageList = [];
  const baseURL = 'https://tekmonks.com/apps/tekmonks/articles/media';
  for (const image of images) {
    imageList.push({
      name: image,
      path: baseURL + '/' + image
    });
  }
  
  return { data: imageList };
  
};
