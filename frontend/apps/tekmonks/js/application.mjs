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
	window.monkshu_env.apps[AUTO_APP_CONSTANTS.APP_NAME] = {};

	const mustache = await router.getMustache(); 
	window.APP_CONSTANTS = JSON.parse(mustache.render(JSON.stringify(AUTO_APP_CONSTANTS), {hostname}));

	window.LOG = (await import ("/framework/js/log.mjs")).LOG;
	if (!session.get($$.MONKSHU_CONSTANTS.LANG_ID)) session.set($$.MONKSHU_CONSTANTS.LANG_ID, "en");
	securityguard.setPermissionsMap(APP_CONSTANTS.PERMISSIONS_MAP);
	securityguard.setCurrentRole(securityguard.getCurrentRole() || APP_CONSTANTS.GUEST_ROLE);
	window.webscrolls_env = {};
}	

const main = async _ => {
	await _addPageLoadInterceptors(); await _readStyle(); await _readPageData(); await _interceptReferrer(); await _registerComponents();
	let url = window.location.href.replace(/%2F/g, '/').replace(/%3D+$/g, '')
	try {
		if(securityguard.getCurrentRole() == APP_CONSTANTS.USER_ROLE 
			&& router.decodeURL(url) == APP_CONSTANTS.LOGIN_HTML) {
				await router.loadPage(APP_CONSTANTS.UPDATEBLOG_HTML);
		}else{
			await router.loadPage(url == APP_CONSTANTS.INDEX_HTML || 
				router.decodeURL(url) == APP_CONSTANTS.INDEX_HTML ? 
					APP_CONSTANTS.MAIN_HTML : url);
		}
	} catch (error) { 
		console.log(error)
		//router.loadPage(APP_CONSTANTS.ERROR_HTML,{error, stack: error.stack || new Error().stack}); 
	}
}

const _registerComponents = async _ => { for (const component of APP_CONSTANTS.COMPONENTS) 
	await import(`${APP_CONSTANTS.APP_PATH}/${component}/${component.substring(component.lastIndexOf("/")+1)}.mjs`); }

const interceptPageLoadData = _ => router.addOnLoadPageData("*", async (data, _url) => {
	data.APP_CONSTANTS = APP_CONSTANTS; 
});

async function _interceptReferrer(){
	if(document.referrer.includes("deeplogictech.com")){
		window.sessionStorage.setItem("referrer", "DLT")
	}
}

async function _readStyle() {
	const conf = await(await fetch(`${APP_CONSTANTS.APP_PATH}/conf/style.json`)).json();
	for (const key of Object.keys(conf)) APP_CONSTANTS[key] = conf[key];
}

async function _readPageData() {
	const conf = await(await fetch(`${APP_CONSTANTS.APP_PATH}/conf/pageData.json`)).json();
	for (const key of Object.keys(conf)) {
		APP_CONSTANTS[key] = key == "CURRENT_YEAR" ? new Date().getFullYear() : conf[key];
	}
}


async function _addPageLoadInterceptors() {
	const interceptors = await(await fetch(`${APP_CONSTANTS.APP_PATH}/conf/pageLoadInterceptors.json`)).json();
	for (const interceptor of interceptors) {
		const modulePath = interceptor.module, functionName = interceptor.function;
		let module = await import(`${APP_CONSTANTS.APP_PATH}/${modulePath}`); module = module[Object.keys(module)[0]];
		(module[functionName])();
	}
}

export const application = {init, main, interceptPageLoadData};