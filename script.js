let menuIsOpen = false;
let lastOpenPage;
let lastOpenID;
let currentToggleID = "summary";
let currentImgID = "summary_img";
let page;
let isloggedIn;
let isGuestLogin;

/**
 * Init loads the header, the sidebar, and the main content. isloggedIn checks here
 * whether the user is logged in.
 */
async function init() {
  /* THIS IS ONLY FOR DEVELOPMENT 
  isloggedIn = false;
  localStorage.setItem("loginState", JSON.stringify(isloggedIn));*/

  isloggedIn = localStorage.getItem("loginState") === "true";
  await loadHtmlPage("all-content-area", "standard_layout.html");
  const params = new URLSearchParams(window.location.search);
  page = params.get("page");
  checkLogin(page);
  loadSidbarAndContent();
  
}

async function loadSidbarAndContent() {
  if (!isloggedIn) {
    const html = document.getElementById("navigation-items");
    html.innerHTML = notLoggedInNavigation();

    if (page === "privacy") {
      await loadHtmlPage("content", "./footerpages/privacy_policy.html");
      toggleIsActive("privacy_policy");
    } else if (page === "legal") {
      await loadHtmlPage("content", "./footerpages/legal_notice.html");
      toggleIsActive("legal_notice");
    }
  } else {
    const mainNavigation = document.getElementById("navigation-items");
    mainNavigation.innerHTML = LoggedInNavigation();

    const headerMenu = document.getElementById("help-and-logout");
    headerMenu.innerHTML = helpAndLogout();
    setInitials()
    await loadHtmlPage("content", "./templates/summary.html");
   /* initAddTaskElements(); */
    document.getElementById("privacy-legal").classList.add("display-none");
    initialToggle();
  }
}

function checkLogin(page) {
  const publicPages = ["privacy", "legal"];

  if (!isloggedIn && !publicPages.includes(page)) {
    window.location.replace("login.html");
  }
}

/**
 * This function allows you to load and open an HTML file asynchronously
 * @param {The ID of the div container} divID
 * @param {The name or the folder and the name of the HTML file} pagefile
 */
async function loadHtmlPage(divID, pagefile) {
  const response = await fetch(pagefile);
  const html = await response.text();
  document.getElementById(divID).innerHTML = html;
  if (
    pagefile != "./footerpages/help.html" &&
    pagefile != "./footerpages/privacy_policy.html" &&
    pagefile != "./footerpages/legal_notice.html"
  ) {
    lastOpenID = divID;
    lastOpenPage = pagefile;
  }
}

/**
 * This function opens and closes the menu by replacing classes
 */
function openCloseHeaderMenu() {
  let headerClass = document.getElementById("header-menu");
  if (!menuIsOpen) {
    headerClass.classList.replace("header-menu-hide", "header-menu");
    menuIsOpen = true;
  } else {
    headerClass.classList.replace("header-menu", "header-menu-hide");
    menuIsOpen = false;
  }
}

/**
 * Allows you to close the menu by clicking outside of it
 */
document.addEventListener("click", function (event) {
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

/**
 * Return from the help page to the previously opened page. This includes setting “isActive”
 */
function backToPreviousPage() {
  if (isloggedIn) {
    loadHtmlPage(lastOpenID, lastOpenPage);
    let id = document.getElementById(currentToggleID);
    id.classList.add("isActive");
  } else {
    window.location.href = "./login.html";
  }
}

/**
 * Initial settings for background and text color
 */
function initialToggle() {
  document.getElementById(currentToggleID).classList.toggle("isActive");
  let img = document.getElementById(currentImgID);
  img.src = img.src.replace("grey", "white");
}

/**
 * This function sets “isActive” to change the background and text color.
 * @param {passes the ID for the “isActive” setting} id
 * @param {passes the ID for the image to change it from gray to white} imgId
 * The if statement checks whether an img element is available
 */
function toggleIsActive(id, imgId) {
  let newID = document.getElementById(id);
  let oldID = document.getElementById(currentToggleID);
  checkAvilableID(newID, oldID);
  currentToggleID = id;

  let img = document.getElementById(imgId);
  if (img) {
    currentImgID = imgId;
    img.src = img.src.replace("grey", "white");
  }
}

/**
 * Check if the ID is available
 * @param {passes the ID for the “isActive” setting} id
 * @param {passes the ID for the image to change it from gray to white} imgId
 */
function checkAvilableID(newID, oldID) {
  if (newID) {
    newID.classList.add("isActive");
  }
  if (oldID) {
    oldID.classList.remove("isActive");
  }
}

/**
 * Removes “isActive” from the element when switching to the help page
 */
function removeActiveState() {
  let id = document.getElementById(currentToggleID);
  id.classList.remove("isActive");
}

function removeActiveStatefromSummary() {
  let id = document.getElementById(currentToggleID);
  id.classList.remove("isActive");
}

function clickInSummaryBoard() {
  loadHtmlPage('content', './templates/add_tasks.html')
  removeActiveState()
  toggleIsActive('add_task', 'add_task_img')
}

function setInitials () {
  isGuestLogin = localStorage.getItem("isGuestLogin") === "true";
  const initialsText = document.getElementById("initials-menu");
  console.log(initialsText);  
  if (isGuestLogin === true) {
    console.log("Test");
    initialsText.innerText = "G"
  } else {
    initialsText.innerText = "SM"
  }
}