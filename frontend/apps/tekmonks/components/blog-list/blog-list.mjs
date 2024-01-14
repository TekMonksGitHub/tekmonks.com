/* 
 * (C) 2019 TekMonks. All rights reserved.
 * License: MIT - see enclosed license.txt file.
 */
import {monkshu_component} from "/framework/js/monkshu_component.mjs";
import { apimanager as apiman } from "/framework/js/apimanager.mjs"
import { loginmanager } from "../../js/loginmanager.mjs";
import {session} from "/framework/js/session.mjs";

async function elementConnected(element) {
    const userID = session.get(APP_CONSTANTS.USERID);
    const org = session.get(APP_CONSTANTS.USERORG);
    await apiman.rest(APP_CONSTANTS.API_CHECK_FOLDER, "POST", {userid: userID, org: org}, false, false);
    const blogList = await(await fetch(`${APP_CONSTANTS.API_GET_BLOG_LIST}`)).json();
    let styleBody; if (element.getAttribute("styleBody")) styleBody = `<style>${element.getAttribute("styleBody")}</style>`;

    if (element.id) {
        if (!blog_list.datas) blog_list.datas = {}; blog_list.datas[element.id] = {...blogList, styleBody};
    } else blog_list.data = {...blogList};
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
	monkshu_component.register("blog-list", `${APP_CONSTANTS.APP_PATH}/components/blog-list/blog-list.html`, blog_list);
}

const trueWebComponentMode = true;	// making this false renders the component without using Shadow DOM

export const blog_list = {trueWebComponentMode, register, elementConnected, editBlog, saveEditedBlog, openAddEditor, closeEditor, addNewBlog, logout}
