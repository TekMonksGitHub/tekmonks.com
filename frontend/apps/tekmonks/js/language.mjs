/**
 * (C) 2015 Tekmonks. All rights reserved.
 * License: See enclosed LICENSE file.
 */

import {session} from "/framework/js/session.mjs";
import {router} from "/framework/js/router.mjs";

function changeLanguage(lang) {
	session.set($$.MONKSHU_CONSTANTS.LANG_ID, lang);
	router.reload(); 
}

export const language = {changeLanguage};