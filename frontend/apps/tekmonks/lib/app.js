/**
 * Initializes the application.
 * (C) TekMonks. All rights reserved.
 */

const TEKMONKS_COM_CONSTANTS_READ = require(`${__dirname}/../apis/lib/constants.js`);
const hostname = require(`${TEKMONKS_COM_CONSTANTS_READ}.CONF_DIR/hostname.json`);

exports.initSync = _appName => {
    global.TEKMONKS_COM_CONSTANTS = TEKMONKS_COM_CONSTANTS_READ;
    TEKMONKS_COM_CONSTANTS.hostname = hostname;
}