document.addEventListener("DOMContentLoaded", function () {
    // Add event listeners for tabs
    document
        .querySelector("#spam-settings-btn")
        .addEventListener("click", () => showTab("Spam Settings"));

    // Event listener for back button
    document.querySelector("#back-button").addEventListener("click", () => {
        history.back(); // Go back to the previous page
    });
});

function showTab(tabName) {
    // Remove previous content
    const tabsDiv = document.querySelector("#tabs-view");
    tabsDiv.innerHTML = "";
    tabsDiv.style.display = "block";

    // Uncomment to show the tab name
    // const tabTitle = document.createElement("h3");
    // tabTitle.innerHTML = `${tabName}`;
    // tabsDiv.append(tabTitle);
}
