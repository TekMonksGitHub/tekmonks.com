import { monkshu_component } from "/framework/js/monkshu_component.mjs";
import {util} from "/framework/js/util.mjs";

function register() {
    monkshu_component.register("contact-us", null, contact_us);
}

function submit(id, functionName){
    let element = window.monkshu_env.components['page-generator'].elements[id]
    let values = {}
    for(id of element.shadowRoot.querySelectorAll('.grid-item-extension')){
        values[id.children[0].id] = id.children[0].value
    }

	if (functionName.indexOf("()") != 0) functionName = functionName.split("()")[0];
	
	let callable = util.getFunctionFromString(functionName);
	if (callable) callable(values); else LOG.debug(`Form submission handler ${functionName} not available.`); 
}

const trueWebComponentMode = true;

export const contact_us = { trueWebComponentMode, register, submit}