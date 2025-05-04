/* 
 * (C) 2015 Tekmonks. All rights reserved.
 */
const mailer = require(`${TEKMONKS_COM_CONSTANTS.LIB_DIR}/mailer.js`);
const utils = require(`${CONSTANTS.LIBDIR}/utils.js`);

exports.doService = async (jsonReq, servObject) => {
    try {
      let contacts_html = "";
      let product_html = "<br/>Product Inquiries for: <br/> <ul>"
      for(const key in jsonReq) {
        if (key == "name" || key == "company" || key == "email" || key == "phone" || key == "website" || key == "message" || key == "referrer") {
          details = key[0].toUpperCase() + key.slice(1);
          contacts_html += details + ": " + jsonReq[key] + "<br/>";
        }
        else product_html += "<li>" + jsonReq[key] + "</li>"; 
        product_html += "</u>"
      }

      contacts_html += "IP: " + utils.getClientIP(servObject.req) + "<br/>"
      
      const conf = {
        to: jsonReq.contactCompanyInfo == TEKMONKS_COM_CONSTANTS.TEKMONKS_SALES_LEAD_EMAIL,
        title: "Contact Request",
        emailText: contacts_html + product_html,
        emailHTML: contacts_html + product_html
      }
      console.log(JSON.stringify(conf))
      let mailResult = false;
      mailResult = await mailer.email(conf.to, conf.title, conf.emailHTML, conf.emailText)

      return { result: true };
    }
     catch (err) {return CONSTANTS.FALSE_RESULT;}
}