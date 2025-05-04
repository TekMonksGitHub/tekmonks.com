/**
 * Gets the list of blogs
 * (C) 2023 Tekmonks. All rights reserved.
 * License: See enclosed LICENSE file.
 */

async function getBlogList(){
    const blogList = await(await fetch(`${APP_CONSTANTS.API_GET_BLOG_LIST}?q=random`)).json();
    await $$.require("/framework/3p/mustache.min.js");
    const renderedHtml = Mustache.render(template, blogList);
    document.getElementById('blog-list').innerHTML = renderedHtml;
}


export const updateblog = {getBlogList}