function init() {
    loadHtmlPage("all-content-area", "standard_layout.html")
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