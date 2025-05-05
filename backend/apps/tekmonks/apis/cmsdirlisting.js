/* 
 * (C) 2015 Tekmonks. All rights reserved.
 */
const path = require("path");
const readdirAsync = require("util").promisify(require("fs").readdir);

exports.doService = async jsonReq => {
	if (!validateRequest(jsonReq)) {LOG.error("Validation failure."); return CONSTANTS.FALSE_RESULT;}
    
    let cmsPath = path.resolve(`${TEKMONKS_COM_CONSTANTS.CMS_ROOT}/${jsonReq.q}`);
	LOG.debug(`Got dir listing request for path: ${cmsPath}`);

    try { return {result: true, files: await readdirAsync(cmsPath)}; } 
    catch (err) {return CONSTANTS.FALSE_RESULT;}
}

const validateRequest = jsonReq => (jsonReq && jsonReq.q);
