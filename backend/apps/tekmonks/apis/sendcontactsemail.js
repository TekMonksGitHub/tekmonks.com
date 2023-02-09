/* 
 * (C) 2015 TekMonks. All rights reserved.
 */
const API_CONSTANTS = require(`${__dirname}/lib/constants.js`);
const nodemailer = require(`${__dirname}/../3p/node_modules/nodemailer`);
const mailer = require(`${API_CONSTANTS.LIB_DIR}/mailer.js`);

exports.doService = async jsonReq => {
    if (!validateRequest(jsonReq)) { LOG.error("Validation failure."); return jsonReq; }

    try {
      const conf = {
        to: "sales@tekmonks.com",
        title: "Contact Request",
        emailText: `Name: "${jsonReq.name}"   Company Name: "${jsonReq.company}"   Designation: "${jsonReq.designation}"   Service Offered: "${jsonReq.serviceoffered}"    Email: "${jsonReq.email}"   Tel: "${jsonReq.tel}"   Website: "${jsonReq.website}"   Country: "${jsonReq.country}"  Message: "${jsonReq.message}`,
        emailHTML: `Name: "${jsonReq.name}"<br/>Company Name: "${jsonReq.company}"<br/>Designation: "${jsonReq.designation}"<br/>Service Offered: "${jsonReq.serviceoffered}"<br/>Email: "${jsonReq.email}"<br/>Tel: "${jsonReq.tel}"<br/>Website: "${jsonReq.website}"<br/>Country: "${jsonReq.country}"<br/>Message: "${jsonReq.message}`,
      }
      let mailResult = false;
      mailResult = await mailer.email(conf.to, conf.title, conf.emailHTML, conf.emailText)
      
      return { result: true };
    }
     catch (err) {
      return CONSTANTS.FALSE_RESULT;
    }
}

const validateRequest = jsonReq => (jsonReq && jsonReq.name && jsonReq.company && jsonReq.email && jsonReq.tel && jsonReq.message);