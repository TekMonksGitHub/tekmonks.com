/* 
 * (C) 2015 TekMonks. All rights reserved.
 */
const API_CONSTANTS = require(`${__dirname}/lib/constants.js`);
const mailer = require(`${API_CONSTANTS.LIB_DIR}/mailer.js`);

exports.doService = async jsonReq => {

    try {
      let contacts_html = "";
      let product_html = "<br/>Product Inquiries for: <br/> <ul>"
      for(const key in jsonReq) {
        if (key == "name" || key == "company" || key == "email" || key == "phone" || key == "website" || key == "message") {
          details = key[0].toUpperCase() + key.slice(1);
          contacts_html += details + ": " + jsonReq[key] + "<br/>";
        }
        else product_html += "<li>" + jsonReq[key] + "</li>";
        product_html += "</u>"
      }

      const conf = {
        to: "jezrel.sondia@tekmonks.com",
        title: "Contact Request",
        emailText: contacts_html + product_html,
        emailHTML: contacts_html + product_html
      }

      let mailResult = false;
      mailResult = await mailer.email(conf.to, conf.title, conf.emailHTML, conf.emailText)

      return { result: true };
    }
     catch (err) {return CONSTANTS.FALSE_RESULT;}
}