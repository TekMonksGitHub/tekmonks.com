/* 
 * (C) 2019 TekMonks. All rights reserved.
 * License: MIT - see enclosed license.txt file.
 */
import {monkshu_component} from "/framework/js/monkshu_component.mjs";

async function elementConnected(element) {
    const blogList = await(await fetch(`${APP_CONSTANTS.API_GET_BLOG_LIST}`)).json();
    console.log(blogList)
    let styleBody; if (element.getAttribute("styleBody")) styleBody = `<style>${element.getAttribute("styleBody")}</style>`;
    
    if (element.id) {
        if (!blog_list.datas) blog_list.datas = {}; blog_list.datas[element.id] = {...blogList, styleBody};
    } else blog_list.data = {...blogList};
}

function findContainingListElement(element, targetTagName) {
    let currentElement = element.parentElement;
  
    while (currentElement && currentElement.parentElement) {
      if (currentElement.parentElement.tagName.toLowerCase() === targetTagName) {
        return currentElement.parentElement;
      }
  
      currentElement = currentElement.parentElement;
    }
  
    return null;
  }
  
  function editBlog(element, id) {
   
    const listElement = findContainingListElement(element, 'li');
    const blog = listElement.querySelectorAll(`.editor-${id}`)[0];
    blog.classList.toggle('editor-visible')
    
  }

function register() {
	// convert this all into a WebComponent so we can use it
	monkshu_component.register("blog-list", `${APP_CONSTANTS.APP_PATH}/components/blog-list/blog-list.html`, blog_list);
}

const trueWebComponentMode = true;	// making this false renders the component without using Shadow DOM

export const blog_list = {trueWebComponentMode, register, elementConnected, editBlog}