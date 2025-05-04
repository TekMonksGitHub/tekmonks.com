/**
 * Main webapp entry point. 
 * (C) 2015 Tekmonks. All rights reserved.
 * License: See enclosed license.txt file.
 */
 
import {router} from "/framework/js/router.mjs";
import {session} from "/framework/js/session.mjs";
import {securityguard} from "/framework/js/securityguard.mjs";
import {apimanager as apiman} from "/framework/js/apimanager.mjs";
import {APP_CONSTANTS as AUTO_APP_CONSTANTS} from "./constants.mjs";

const mustache = await router.getMustache();

const init = async hostname => {
	window.monkshu_env.apps[AUTO_APP_CONSTANTS.APP_NAME] = {};
	window.APP_CONSTANTS = JSON.parse(mustache.render(JSON.stringify(AUTO_APP_CONSTANTS), {hostname}));
	await _readPageData(); 

	window.LOG = (await import ("/framework/js/log.mjs")).LOG;
	if (!session.get($$.MONKSHU_CONSTANTS.LANG_ID)) session.set($$.MONKSHU_CONSTANTS.LANG_ID, "en");
	
	// setup permissions and roles
	securityguard.setPermissionsMap(APP_CONSTANTS.PERMISSIONS_MAP);
	securityguard.setCurrentRole(securityguard.getCurrentRole() || APP_CONSTANTS.GUEST_ROLE);
	window.webscrolls_env = {};

	// register backend API keys
	apiman.registerAPIKeys(APP_CONSTANTS.API_KEYS, APP_CONSTANTS.KEY_HEADER); 	
}

const main = async _ => {
	await _addPageLoadInterceptors(); _interceptReferrer();
	let url = window.location.href
	let baseURL = router.decodeURL(url).replace(/\?.*$/, '')
	if (baseURL == APP_CONSTANTS.LANDING_HTML || baseURL == APP_CONSTANTS.ARTICLE_HTML) url = url.replace(/%2F/g, '/').replace(/%3D/g, '');

	try {
		const routeToBlogLogin = (securityguard.getCurrentRole() == APP_CONSTANTS.USER_ROLE) 
			&& (router.decodeURL(url) == APP_CONSTANTS.LOGIN_HTML);
		const isIndexPageBeingRequested = (url == APP_CONSTANTS.INDEX_HTML) || 
			(router.decodeURL(url) == APP_CONSTANTS.INDEX_HTML);
		if (routeToBlogLogin) await router.loadPage(APP_CONSTANTS.UPDATEBLOG_HTML);
		else await router.loadPage( isIndexPageBeingRequested ? APP_CONSTANTS.MAIN_HTML : url);
	} catch (error) { 
		console.error(error);
		router.loadPage(APP_CONSTANTS.ERROR_HTML, {error, stack: error.stack || new Error().stack}); 
	}
}

const interceptPageLoadData = _ => router.addOnLoadPageData("*", async (data, _url) => data.APP_CONSTANTS = APP_CONSTANTS); 

function _interceptReferrer() {
	if (document.referrer.includes(APP_CONSTANTS.DLT_DOMAIN)) window.sessionStorage.setItem("referrer", "DLT");
}

async function _readPageData() {
	const conf = await (await fetch(`${APP_CONSTANTS.APP_PATH}/conf/app.json`)).json();
	const confParsed = JSON.parse(mustache.render(JSON.stringify(conf), {hostname: APP_CONSTANTS.hostname}));
	for (const key of Object.keys(confParsed)) APP_CONSTANTS[key] = 
		key == "CURRENT_YEAR" ? new Date().getFullYear() : conf[key];
}

async function _addPageLoadInterceptors() {
	const interceptors = await $$.requireJSON(`${APP_CONSTANTS.CONF_PATH}/pageLoadInterceptors.json`);
	for (const interceptor of interceptors) {
		const modulePath = interceptor.module, functionName = interceptor.function;
		let module = await import(`${APP_CONSTANTS.APP_PATH}/${modulePath}`); module = module[Object.keys(module)[0]];
		(module[functionName])();
	}
}

export const application = {init, main, interceptPageLoadData};