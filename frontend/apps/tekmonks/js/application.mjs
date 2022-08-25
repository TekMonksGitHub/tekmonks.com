/* 
 * (C) 2015 TekMonks. All rights reserved.
 * License: MIT - see enclosed license.txt file.
 */
 
import {router} from "/framework/js/router.mjs";
import {session} from "/framework/js/session.mjs";
import {securityguard} from "/framework/js/securityguard.mjs";
import {APP_CONSTANTS as AUTO_APP_CONSTANTS} from "./constants.mjs";

const init = async hostname => {
	window.APP_CONSTANTS = (await import ("./constants.mjs")).APP_CONSTANTS;

	const mustache = await router.getMustache();
	window.APP_CONSTANTS = JSON.parse(mustache.render(JSON.stringify(AUTO_APP_CONSTANTS), {hostname}));

	window.LOG = (await import ("/framework/js/log.mjs")).LOG;
	if (!session.get($$.MONKSHU_CONSTANTS.LANG_ID)) session.set($$.MONKSHU_CONSTANTS.LANG_ID, "en");
	securityguard.setPermissionsMap(APP_CONSTANTS.PERMISSIONS_MAP);
	securityguard.setCurrentRole(securityguard.getCurrentRole() || APP_CONSTANTS.GUEST_ROLE);
	window.webscrolls_env = {};
}	

const main = async _ => {
	try {
		await router.loadPage(window.location.href == APP_CONSTANTS.INDEX_HTML || 
			router.decodeURL(window.location.href) == APP_CONSTANTS.INDEX_HTML ? 
				APP_CONSTANTS.MAIN_HTML : window.location.href);
	} catch (error) { router.loadPage(APP_CONSTANTS.ERROR_HTML,{error, stack: error.stack || new Error().stack}); }
}

export const application = {init, main};