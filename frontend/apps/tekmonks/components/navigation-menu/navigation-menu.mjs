/* 
 * (C) 2019 Tekmonks. All rights reserved.
 * License: MIT - see enclosed license.txt file.
 */
import {i18n} from "/framework/js/i18n.mjs";
import {session} from "/framework/js/session.mjs";
import {monkshu_component} from "/framework/js/monkshu_component.mjs";

async function elementConnected(element) {
	let level1 = [];

	try {
		if (element.getAttribute("file")) level1 = (await(await fetch(
			`${APP_CONSTANTS.CMS_ROOT_URL}/${element.getAttribute("file")}`)).json()).level1;
		else if (element.getAttribute("level")) {
			let level = element.getAttribute("level"), lang = session.get($$.MONKSHU_CONSTANTS.LANG_ID);
			let menuResult = await(await fetch(`${APP_CONSTANTS.API_NAV_MENU_LISTING}?q=${level}&lang=${lang}`)).json();
			if (menuResult.result) level1 = menuResult.menu.level1;
		}
		for(const baseMenu of level1) if(baseMenu.level2) baseMenu.level2[0].selected=true;
	} catch (err) {}

	let data = { logo: element.getAttribute("logo"), level1 }
	data.level1 = element.getAttribute("massage_menu") && (element.getAttribute("massage_menu").toLowerCase() == "false") 
		? data.level1 : await massageMenu(element, data.level1, 1);

	if (element.getAttribute("styleBody")) data.styleBody = `<style>${element.getAttribute("styleBody")}</style>`
	if (element.getAttribute("logo_style")) data.logostyle = `style="${element.getAttribute("logo_style")}"`;

	if (element.id) {
		if (!navigation_menu.datas) navigation_menu.datas = {}; navigation_menu.datas[element.id] = data;
	} else navigation_menu.data = data;
}

function enableRightColumnContent(searchElement, id) {
	const elementDescriptions = searchElement.parentElement.parentElement.querySelectorAll(".description");
	elementDescriptions.forEach(element => {if (element.id == id) element.classList.add("visible"); else element.classList.remove("visible");});

	const elementMenuBgImage = searchElement.parentElement.parentElement.querySelectorAll(".menubgimage");
	elementMenuBgImage.forEach(element => {if (element.id == id) element.classList.add("visible"); else element.classList.remove("visible");});

	const elementSubmenus = searchElement.parentElement.querySelectorAll(".submenu");
	elementSubmenus.forEach(element => {if (element === searchElement) element.classList.add("selected"); else element.classList.remove("selected");});
}

function enableMenu(searchElement) {
   var menuID = searchElement.getAttribute('data-id');
   const elementMenu = searchElement.parentElement.querySelectorAll('.mitem');	
   const elementOuterLayer = searchElement.parentElement.querySelectorAll('.outerlayer');
   const elementCloseMenu = searchElement.parentElement.querySelectorAll('.close-button');
   var elementOuter = '';
   elementOuterLayer.forEach(element => {
		element.classList.add('outerlayer-visible');
		elementOuter = element;
	});
   elementMenu.forEach(element => {
	   	if (element.id == menuID) 
       	{
			element.classList.add('mitem-visible');
			element.parentElement.classList.add('m-active')
		}
		else {
			element.classList.remove('mitem-visible');
			element.parentElement.classList.remove('m-active')
		}
	});
	elementCloseMenu.forEach(element => {
		element.classList.remove('hidden');
	});
}
 
 function showMenuMobile(searchElement){
	const menupopup = searchElement.parentElement.querySelectorAll('.nav-mobile-container');
	const elementOuterLayer = searchElement.parentElement.parentElement.querySelectorAll('.outerlayer');
	menupopup.forEach(element => {
		const elementMenu = element.querySelectorAll('.nav-primary')
		element.classList.contains('menu-visible') ? element.classList.remove('menu-visible') : element.classList.add('menu-visible');
		elementMenu.forEach(element => {
			if(element.innerText == 'Products'){
				element.classList.add('menu-active')
				element.nextSibling.nextSibling.classList.add('visible')
			}else{
				element.nextSibling.nextSibling.classList.add('hidden')
				element.nextSibling.nextSibling.classList.remove('visible')
			}
		});
	});
	var elementOuter = '';
	elementOuterLayer.forEach(element => {
		 element.classList.add('outerlayer-visible');
		 elementOuter = element;
	 });
}

function showSubMenuMobile(searchElement){
	searchElement.classList.toggle('submenu-active')
	searchElement.nextSibling.classList.toggle('menu-visible')
	
	let imgElement = searchElement.querySelector('img');
	imgElement.src = imgElement.src.endsWith('chevron-up.svg') ? './img/chevron-right.svg' : './img/chevron-up.svg';
}

function selectMenuMobile(searchElement, id){
	const elementMenu = searchElement.parentElement.querySelectorAll('.nav-primary')
	elementMenu.forEach(element => {
		element.classList.remove('menu-active');
		element.nextSibling.nextSibling.classList.add('hidden')
		element.nextSibling.nextSibling.classList.remove('visible')
	});
	searchElement.classList.add('menu-active')
	searchElement.nextSibling.nextSibling.classList.add('visible')
}

function toggleMenu(searchElement) {
	const elementActiveMenu = searchElement.parentElement.querySelectorAll('.m-active');
	const elementOuterLayer = searchElement.parentElement.querySelectorAll('.outerlayer-visible');
	const elementMenu = searchElement.parentElement.querySelectorAll('.mitem');
	const elementCloseMenu = searchElement.parentElement.querySelectorAll('.close-button');
	elementOuterLayer.forEach(element => {
			elementActiveMenu[0].classList.remove('m-active')
			element.classList.remove('outerlayer-visible');
			elementMenu.forEach(elementMenu => {
				elementMenu.classList.remove('mitem-visible');
			});
			 elementCloseMenu.forEach(elementClose => {
				elementClose.classList.add('hidden');
			});
	});
 }
 
 function toggleMenuMobile(searchElement) {
	const shadowRoot = navigation_menu.getShadowRootByContainedElement(searchElement);
	const elementOuterLayer = shadowRoot.querySelectorAll('.outerlayer-visible');
	const elementMenuContainer = shadowRoot.querySelectorAll('.nav-mobile-container')
	elementOuterLayer.forEach(element => element.classList.remove('outerlayer-visible'));
	elementMenuContainer.forEach(element => {
		element.classList.remove('menu-visible');
		const elementMenu = element.querySelectorAll('.nav-primary')
		elementMenu.forEach(childElement => childElement.classList.remove('menu-active'));
	});
 }

 function closeMenu(searchElement) {
	const shadowRoot = navigation_menu.getShadowRootByContainedElement(searchElement);
	const elementMenu = shadowRoot.querySelectorAll('.mitem');
	const elementCloseMenu = shadowRoot.querySelectorAll('.close-button');
	elementMenu.forEach(elementClose => {
		elementClose.classList.remove('mitem-visible');
		elementCloseMenu.forEach(elementClose => {
			elementClose.classList.add('hidden');
		});
	});
 }

async function massageMenu(element, entries, level) {
	let i18nObj = await i18n.getI18NObject(session.get($$.MONKSHU_CONSTANTS.LANG_ID));
	const {content_post} = await import(`${APP_CONSTANTS.APP_PATH}/components/content-post/content-post.mjs`);

	let levelCheck = "level"+(level+1);
	for (let entry of entries) {

		// translate the menu item entry or otherwise upcase it properly etc.
		if (i18nObj[entry.item]) entry.item = i18nObj[entry.item]; else {
			if (entry.item.length) entry.item = entry.item.substring(0, 1).toUpperCase() + entry.item.substring(1);
			if (entry.item.indexOf('.') != -1) entry.item = entry.item.substring(0, entry.item.indexOf('.'));
		}

		// render descriptions
		if (entry.description) entry.description = await content_post.renderArticle(null, entry.description);

		if (entry[levelCheck]) {
			entry.level1 = `${entry.item}`;
			entry.item = `${entry.item}`;
			entry[levelCheck] = await massageMenu(element, entry[levelCheck], level+1);
		}
	}

	return entries;
}

function register() {
	// convert this all into a WebComponent so we can use it
	monkshu_component.register("navigation-menu", `${APP_CONSTANTS.APP_PATH}/components/navigation-menu/navigation-menu.html`, navigation_menu);
}

const trueWebComponentMode = true;	// making this false renders the component without using Shadow DOM

export const navigation_menu = {trueWebComponentMode, register, elementConnected, enableRightColumnContent, enableMenu, toggleMenu, closeMenu, toggleMenuMobile, showMenuMobile, showSubMenuMobile, selectMenuMobile}
