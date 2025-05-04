/* 
 * (C) 2015 Tekmonks. All rights reserved.
 * License: MIT - see enclosed LICENSE file.
 */

const path = require("path");

APP_ROOT = `${path.resolve(`${__dirname}/../../`)}`;
exports.CMS_ROOT = `${path.resolve(`${__dirname}/../../../../../frontend/apps/tekmonks/articles`)}`;
exports.BLOG_ROOT = `${path.resolve(`${__dirname}/../../../../../frontend/apps/tekmonks/articles`)}`;
exports.LIB_DIR = `${APP_ROOT}/apis/lib`;
exports.CONF_DIR = `${APP_ROOT}/conf`;
exports.API_DIR = `${APP_ROOT}/apis`;
exports.TEKMONKS_SALES_LEAD_EMAIL = "sales@tekmonks.com";

/* Constants for the FS Login subsystem */
exports.SALT_PW = "$2a$10$VFyiln/PpFyZc.ABoi4ppf";
exports.APP_DB = `${APP_ROOT}/db/webscrolls.db`;