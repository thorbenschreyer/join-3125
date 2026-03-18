let menuIsOpen = false;

function init() {
    loadHtmlPage("all-content-area", "standard_layout.html")
    loadHtmlPage("content", "./footerpages/privacy_policy.html")
}


/**
 * This function allows you to load and open an HTML file asynchronously
 * @param {The ID of the div container} divID 
 * @param {The name or the folder and the name of the HTML file} pagefile 
 */
async function loadHtmlPage(divID, pagefile) {
    const response = await fetch(pagefile);
    html = await response.text();
    document.getElementById(divID).innerHTML = html
}

/**
* This function opens and closes the menu by replacing classes 
 */
function openCloseHeaderMenu() {
    let headerClass = document.getElementById("header-menu")
 if (!menuIsOpen) {
    headerClass.classList.replace("header-menu-hide", "header-menu")
    menuIsOpen = true 
 } else {
    headerClass.classList.replace("header-menu", "header-menu-hide")
    menuIsOpen = false
 }
}

/**
* Allows you to close the menu by clicking outside of it
 */
document.addEventListener("click", function(event) {
    let menu = document.getElementById("header-menu");
    let button = document.querySelector(".help-and-logout button");

    if (
        menuIsOpen &&
        !menu.contains(event.target) &&
        !button.contains(event.target)
    ) {
        menu.classList.replace("header-menu", "header-menu-hide");
        menuIsOpen = false;
    }
});