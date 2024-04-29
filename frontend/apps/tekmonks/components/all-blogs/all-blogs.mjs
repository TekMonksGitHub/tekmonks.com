/* 
 * (C) 2019 TekMonks. All rights reserved.
 * License: MIT - see enclosed license.txt file.
 */
import {monkshu_component} from "/framework/js/monkshu_component.mjs";
import { apimanager as apiman } from "/framework/js/apimanager.mjs"
import { loginmanager } from "../../js/loginmanager.mjs";
import {session} from "/framework/js/session.mjs";
import {router} from "/framework/js/router.mjs"

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
    return { ...blog, subPath: router.encodeURL(url) };
  });
  let styleBody; if (element.getAttribute("styleBody")) styleBody = `<style>${element.getAttribute("styleBody")}</style>`;

  if (element.id) {
      if (!all_blogs.datas) all_blogs.datas = {}; all_blogs.datas[element.id] = {...blogList, styleBody};
  } else all_blogs.data = {...blogList};
}
  
function editBlog(element, id) {
  const modal = element.parentElement.querySelectorAll('.edit-modal')[0]
  const blog = modal.querySelectorAll(`.editor-${id}`)[0]
  modal.style.display = 'block'
}

async function saveEditedBlog(element, title){
  let blogEditor = element.parentElement.parentElement.querySelectorAll('.edit-editor')[0]
  let language = element.parentElement.parentElement.querySelectorAll('#language')[0].value
  const params = {
    title: title, 
    blog: blogEditor.innerText,
    language: language,
  }
  const apiResponse = await apiman.rest(APP_CONSTANTS.API_UPDATE_BLOG, "POST", params, false, false);
  apiResponse.status ? alert(apiResponse.message) : alert('Error in editing blog')
}

function openAddEditor(element){
  let modal = element.parentElement.querySelectorAll('.modal')[0]
  modal.style.display = 'block'
}

async function addNewBlog(element){
  let blogEditor = element.parentElement.parentElement.querySelectorAll('.add-editor')[0]
  let language = element.parentElement.parentElement.querySelectorAll('#language')[0].value
  const userID = session.get(APP_CONSTANTS.USERID);
  const org = session.get(APP_CONSTANTS.USERORG);
  const imageFile = element.parentElement.parentElement.querySelectorAll('#imageUpload')[0].files[0];
  const imageBase64 = await convertImageToBase64(imageFile);
  const params = {
      blog: blogEditor.innerText,
      language: language,
      userid: userID,
      org: org,
      image: imageBase64
  };
  const apiResponse = await apiman.rest(APP_CONSTANTS.API_ADD_BLOG, "POST", params, false, false);
  apiResponse.status ? alert(apiResponse.message) : alert('Error in adding blog')
}

function convertImageToBase64(imageFile) {
  return new Promise((resolve, reject) => {
    if (imageFile) {
      const reader = new FileReader();

      reader.onloadend = () => {
        const base64String = reader.result.split(',')[1];
        let fileType = imageFile.type.split('/')[1];
        fileType = fileType == 'svg+xml' ? 'svg' : fileType;
        resolve({ base64String, fileType });
      };

      reader.onerror = reject;
      reader.readAsDataURL(imageFile);
    } else {
      resolve(null);
    }
  });
}

  
function closeEditor(element){
  element.parentElement.parentElement.style.display = 'none'
}

function logout(){
  loginmanager.logout()
}

function register() {
	// convert this all into a WebComponent so we can use it
	monkshu_component.register("all-blogs", `${APP_CONSTANTS.APP_PATH}/components/all-blogs/all-blogs.html`, all_blogs);
}

const trueWebComponentMode = true;	// making this false renders the component without using Shadow DOM

export const all_blogs = {trueWebComponentMode, register, elementConnected, editBlog, saveEditedBlog, openAddEditor, closeEditor, addNewBlog, logout}
