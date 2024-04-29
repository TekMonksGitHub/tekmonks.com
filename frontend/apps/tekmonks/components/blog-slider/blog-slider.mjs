/* 
 * (C) 2019 TekMonks. All rights reserved.
 * License: MIT - see enclosed license.txt file.
 */
import {monkshu_component} from "/framework/js/monkshu_component.mjs";
import { apimanager as apiman } from "/framework/js/apimanager.mjs"
import { loginmanager } from "../../js/loginmanager.mjs";
import {session} from "/framework/js/session.mjs";
import {router} from "/framework/js/router.mjs"

let allBlogs = [];

async function elementConnected(element) {
  const userID = session.get(APP_CONSTANTS.USERID);
  const org = session.get(APP_CONSTANTS.USERORG);
  await apiman.rest(APP_CONSTANTS.API_CHECK_FOLDER, "POST", {userid: userID, org: org}, false, false);
  let blogList = await(await fetch(`${APP_CONSTANTS.API_GET_BLOG_LIST}`)).json();
  
  blogList.file = await Promise.all(blogList.file.map(async (blog) => {
    let result = await apiman.rest(APP_CONSTANTS.API_GET_IMAGE, "POST", {blogs: blogList, id: blog.id}, false, false);
    return { ...blog, image: result.image };
  }));
  
  blogList.file = blogList.file.map(blog => {
    const url = `${APP_CONSTANTS.BLOGARTICLE_NEW_HTML}?blogs_path=./blogs.md/${blog.subPath}&image=${blog.image}`
    blog.textContent = removeFirstHashLine(blog.content)
    return { ...blog, subPath: router.encodeURL(url) };
  });
  
  allBlogs = blogList.file;
  let blogsToDisplay = blogList.file.slice(0, 4);
  blogList.file = blogsToDisplay;
  
  let styleBody; if (element.getAttribute("styleBody")) styleBody = `<style>${element.getAttribute("styleBody")}</style>`;
  
  if (element.id) {
      if (!blog_slider.datas) blog_slider.datas = {}; blog_slider.datas[element.id] = {...blogList, styleBody};
  } else blog_slider.data = {...blogList};
}

function removeFirstHashLine(content) {
  let lines = content.split('\n');
  let index = lines.findIndex(line => line.trim().startsWith('#'));
  if (index !== -1) {
    lines.splice(index, 1);
  }
  let textContent = lines.join('\n');
  //remove all other # in text content
  textContent = textContent.replace(/#/g, '');
  return textContent;
}

async function showMore(element){
  let body = blog_slider.getShadowRootByContainedElement(element).querySelector(`body`)
  let data = await(await fetch(`${APP_CONSTANTS.API_GET_BLOG_LIST}`)).json()
  let template = await(await fetch(APP_CONSTANTS.COMPONENT_BLOG_SLIDER)).text();
  data.file = data.file.map(blog => {
    blog.content = removeFirstHashLine(blog.content)
    blog.path = blog.path.replace(/\\/g, '\\\\');
    return blog;
  })
  
  data.file = await Promise.all(data.file.map(async (blog) => {
    let result = await apiman.rest(APP_CONSTANTS.API_GET_IMAGE, "POST", {blogs: data, id: blog.id}, false, false);
    const url = `${APP_CONSTANTS.BLOGARTICLE_NEW_HTML}?blogs_path=./blogs.md/${blog.subPath}&image=${blog.image}`
    blog.textContent = removeFirstHashLine(blog.content)
    return { ...blog, image: result.image, subPath: router.encodeURL(url) };
  }));
  
  data.isMore = true;
  
  const rendered = await router.expandPageData(template, router.getLastSessionURL(), data);
  body.innerHTML = rendered;
}

async function showLess(element){
  let body = blog_slider.getShadowRootByContainedElement(element).querySelector(`body`)
  let data = await(await fetch(`${APP_CONSTANTS.API_GET_BLOG_LIST}`)).json()
  let template = await(await fetch(APP_CONSTANTS.COMPONENT_BLOG_SLIDER)).text();
  data.file = data.file.map(blog => {
    blog.content = removeFirstHashLine(blog.content)
    blog.path = blog.path.replace(/\\/g, '\\\\');
    return blog;
  })
  
  data.file = await Promise.all(data.file.map(async (blog) => {
    let result = await apiman.rest(APP_CONSTANTS.API_GET_IMAGE, "POST", {blogs: data, id: blog.id}, false, false);
    const url = `${APP_CONSTANTS.BLOGARTICLE_NEW_HTML}?blogs_path=./blogs.md/${blog.subPath}&image=${blog.image}`
    blog.textContent = removeFirstHashLine(blog.content)
    return { ...blog, image: result.image, subPath: router.encodeURL(url) };
  }));
  
  data.file = data.file.slice(0, 4);
  
  const rendered = await router.expandPageData(template, router.getLastSessionURL(), data);
  body.innerHTML = rendered;
}



function register() {
	// convert this all into a WebComponent so we can use it
	monkshu_component.register("blog-slider", `${APP_CONSTANTS.APP_PATH}/components/blog-slider/blog-slider.html`, blog_slider);
}

const trueWebComponentMode = true;	// making this false renders the component without using Shadow DOM

export const blog_slider = {trueWebComponentMode, register, elementConnected, showMore, showLess} 