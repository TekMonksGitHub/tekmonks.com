/* 
 * (C) 2019 Tekmonks. All rights reserved.
 * License: MIT - see enclosed license.txt file.
 */
import {monkshu_component} from "/framework/js/monkshu_component.mjs";
import { apimanager as apiman } from "/framework/js/apimanager.mjs"
import { loginmanager } from "../../js/loginmanager.mjs";
import {session} from "/framework/js/session.mjs";
import {router} from "/framework/js/router.mjs";


async function elementConnected(element) {
    const userID = session.get(APP_CONSTANTS.USERID);
    const org = session.get(APP_CONSTANTS.USERORG);
    await apiman.rest(APP_CONSTANTS.API_CHECK_FOLDER, "POST", {userid: userID, org: org}, false, false);
    let blogList = await(await fetch(`${APP_CONSTANTS.API_GET_BLOG_LIST}`)).json();
    blogList.file = blogList.file.map(blog => {
      blog.content = removeFirstHashLine(blog.content)
      blog.path = blog.path.replace(/\\/g, '\\\\');
      return blog;
    })
    let styleBody; if (element.getAttribute("styleBody")) styleBody = `<style>${element.getAttribute("styleBody")}</style>`;

    if (element.id) {
        if (!blog_list.datas) blog_list.datas = {}; blog_list.datas[element.id] = {...blogList, styleBody};
    } else blog_list.data = {...blogList};
}

function removeFirstHashLine(content) {
  let lines = content.split('\n');
  let index = lines.findIndex(line => line.trim().startsWith('#'));
  if (index !== -1) {
    lines.splice(index, 1);
  }
  return lines.join('\n');
}
  
async function editBlog(element, id) {
  const modal = element.parentElement.querySelectorAll('.edit-modal')[0];
  const image = element.parentElement.querySelector('#image');
  const title = element.parentElement.querySelector('#blogTitle');
  const blogList = await(await fetch(`${APP_CONSTANTS.API_GET_BLOG_LIST}`)).json();
  //const blog = modal.querySelectorAll(`.editor-${id}`)[0];
  let result = await apiman.rest(APP_CONSTANTS.API_GET_IMAGE, "POST", {blogs: blogList, id: id}, false, false);
  title.value = blogList.file[id].title;
  if(result.result){
    image.src = result.image;
  }
  modal.style.display = 'block'
}

async function confirmDelete(element, id){
  const modal = element.parentElement.querySelectorAll('.delete-modal')[0];
  const blogToDelete = element.parentElement.querySelector('#deleteTitle')
  const blogList = await(await fetch(`${APP_CONSTANTS.API_GET_BLOG_LIST}`)).json();
  for(let i = 0; i < blogList.file.length; i++){
   if(blogList.file[i].id == id){
      blogToDelete.innerText += blogList.file[i].title;
      break;
    }
  }
  modal.style.display = 'block'
}

async function deleteBlog(element, path){
  let input = element.parentElement.parentElement.querySelector('#confirmDelete').value
  if(input != "DELETE"){
    alert("Please enter DELETE to confirm deletion")
    return
  }
  
   let result = await apiman.rest(APP_CONSTANTS.API_DELETE_BLOG, "POST", {path: path}, false, false);
   element.parentElement.parentElement.parentElement.parentElement.style.display = 'none'
   refreshPageView(element)
   result.status ? alert(result.message) : alert('Error in deleting blog')
}

async function saveEditedBlog(element, title){
  let blogEditor = element.parentElement.parentElement.querySelectorAll('.edit-editor')[0]
  let blogTitle = element.parentElement.parentElement.querySelectorAll('#blogTitle')[0].value
  let language = element.parentElement.parentElement.querySelectorAll('#language')[0].value
  const imageFile = element.parentElement.parentElement.querySelectorAll('#imageUpload')[0].files[0];
  const imageBase64 = await convertImageToBase64(imageFile);
  let updatedContent = `# ${blogTitle}\n\n${blogEditor.innerHTML}`
  const params = {
    title: title, 
    blog: updatedContent,
    language: language,
    image: imageBase64,
  }
  const apiResponse = await apiman.rest(APP_CONSTANTS.API_UPDATE_BLOG, "POST", params, false, false);
  element.parentElement.parentElement.parentElement.style.display = 'none'
  refreshPageView(element)
  apiResponse.status ? alert(apiResponse.message) : alert('Error in editing blog')
}

function openAddEditor(element){
  let modal = element.parentElement.querySelectorAll('.modal')[0]
  modal.style.display = 'block'
}

async function addNewBlog(element){
  let blogEditor = element.parentElement.parentElement.querySelectorAll('.add-editor')[0]
  let language = element.parentElement.parentElement.querySelectorAll('#language')[0].value
  let blogTitle = element.parentElement.parentElement.querySelectorAll('#blogTitle')[0].value
  let updatedContent = `# ${blogTitle}\n\n${blogEditor.innerHTML}`
  const userID = session.get(APP_CONSTANTS.USERID);
  const org = session.get(APP_CONSTANTS.USERORG);
  const imageFile = element.parentElement.parentElement.querySelectorAll('#imageUpload')[0].files[0];
  const imageBase64 = await convertImageToBase64(imageFile);
  console.log(imageFile);
  const params = {
      blog: updatedContent,
      language: language,
      userid: userID,
      org: org,
      image: imageBase64
  };
  const apiResponse = await apiman.rest(APP_CONSTANTS.API_ADD_BLOG, "POST", params, false, false);
  element.parentElement.parentElement.parentElement.style.display = 'none'
  refreshPageView(element)
  apiResponse.status ? alert(apiResponse.message) : alert('Error in adding blog')
}

async function refreshPageView(element){
  let body = blog_list.getShadowRootByContainedElement(element).querySelector(`body`)
  let data = await(await fetch(`${APP_CONSTANTS.API_GET_BLOG_LIST}`)).json()
  let template = await(await fetch(APP_CONSTANTS.COMPONENT_BLOG_LIST)).text();
  data.file = data.file.map(blog => {
    blog.content = removeFirstHashLine(blog.content)
    blog.path = blog.path.replace(/\\/g, '\\\\');
    return blog;
  })
  const rendered = await router.expandPageData(template, router.getLastSessionURL(), data);
  body.innerHTML = rendered;
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

function performAction(element){
  let contentEditable = element.parentElement.parentElement.querySelector('.edit-editor') || element.parentElement.parentElement.querySelector('.add-editor')
  contentEditable.focus(); // Focus on the contentEditable element
  let selectedText = window.getSelection().toString();
  
  //make the selected text bold, italic, underlined depending on the classList of element; use switch case
  switch(element.classList[1]){
    case 'bold':
      document.execCommand('bold', false, null);
      element.classList.toggle('active-button');
      break;
    case 'italic':
      document.execCommand('italic', false, null);
      element.classList.toggle('active-button');
      break;
    case 'underline':
      document.execCommand('underline', false, null);
      element.classList.toggle('active-button');
      break;
    case 'list-order':
      document.execCommand('insertOrderedList', false, null);
      break;
    case 'list-unorder':
      document.execCommand('insertUnorderedList', false, null);
      break;
    case 'text-left':
      document.execCommand('justifyLeft', false, null);
      break;
    case 'text-center':
      document.execCommand('justifyCenter', false, null);
      break;
    case 'text-right':
      document.execCommand('justifyRight', false, null);
      break;
    case 'insert-image':
      const shadowRoot = monkshu_env.components["blog-list"].getShadowRootByContainedElement(element)
      const mediaLibrary = shadowRoot.querySelectorAll('.media-library-modal')[0]
      fetchLibraryImages(element);
      mediaLibrary.style.display = 'block'
      break;
    case 'link':
      let link = prompt("Enter the link URL");
      if (link) {
        document.execCommand('createLink', false, link);
      }
      break;
  }
}

async function uploadLibraryImage(element){
  let params = {
    image: await convertImageToBase64(element.files[0]),
    name: element.files[0].name,
  }
  await apiman.rest(APP_CONSTANTS.API_UPLOAD_LIBRARY_IMAGE, "POST", params, false, false);
  fetchLibraryImages(element);
}

async function fetchLibraryImages(element){
  const apiResponse = await apiman.rest(APP_CONSTANTS.API_GET_LIBRARY_IMAGES, "GET", {}, false, false);
  let shadowRoot = blog_list.getShadowRootByContainedElement(element)
  shadowRoot.querySelector('.media-library-images').innerHTML = ''
  apiResponse.data.forEach(image => {
    let div = document.createElement('div')
    div.classList.add('image-item')
    div.innerHTML = `<img src="${image.path}" alt="Library Image">`
    div.addEventListener('click', function() {
      let contentEditable = shadowRoot.querySelector('.add-editor') || shadowRoot.querySelector('.edit-editor')
      contentEditable.focus()
      document.execCommand('insertImage', false, this.querySelector('img').src)
      shadowRoot.querySelector('.media-library-modal').style.display = 'none'
    })
    shadowRoot.querySelector('.media-library-images').appendChild(div)
  })
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

export const blog_list = {trueWebComponentMode, register, elementConnected, editBlog, saveEditedBlog, confirmDelete, deleteBlog, openAddEditor, performAction, closeEditor, addNewBlog, uploadLibraryImage, logout}
