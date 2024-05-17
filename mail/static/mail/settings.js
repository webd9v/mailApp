document.addEventListener("DOMContentLoaded", function () {
    // Add event listeners for tabs
    document
        .querySelector("#spam-settings-btn")
        .addEventListener("click", () => {
            showTab("Spam Settings");
            loadSpamEmails();
        });

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
    const tabTitle = document.createElement("h3");
    tabTitle.innerHTML = `${tabName}`;
    tabsDiv.append(tabTitle);
    if (tabName === "Spam Settings") {
        const spamEmailsDiv = document.createElement("div");
        spamEmailsDiv.id = "spam-emails-list";
        spamEmailsDiv.classList.add("mt-5");

        const newSpamEmailInput = document.createElement("input");
        newSpamEmailInput.type = "email";
        newSpamEmailInput.placeholder = "Enter email to mark as spam";
        newSpamEmailInput.id = "new-spam-email";
        newSpamEmailInput.style.display = "inline-block";
        newSpamEmailInput.style.width = "94%";

        const addSpamEmailButton = document.createElement("button");
        addSpamEmailButton.textContent = "Add";
        addSpamEmailButton.classList.add("btn-primary", "ml-2");
        addSpamEmailButton.style.width = "5%";
        addSpamEmailButton.style.border = "black 2px solid";
        addSpamEmailButton.style.borderRadius = "5%";

        addSpamEmailButton.addEventListener("click", () => {
            const email = newSpamEmailInput.value.trim();
            if (email) {
                addSpamEmail(email);
                newSpamEmailInput.value = ""; // Clear input
            }
        });

        tabsDiv.appendChild(newSpamEmailInput);
        tabsDiv.appendChild(addSpamEmailButton);
        tabsDiv.appendChild(spamEmailsDiv);
    }
}

function loadSpamEmails() {
    const spamEmailsList = document.getElementById("spam-emails-list");
    fetch("/settings/spam-emails") // Use the new API endpoint
        .then((response) => response.json())
        .then((spamEmails) => {
            spamEmailsList.innerHTML = ""; // Clear previous list
            spamEmails.forEach((email) => {
                const spamEmailItem = document.createElement("div");
                spamEmailItem.classList.add("card", "p-2", "mb-2");
                spamEmailItem.innerHTML = `
                    <h2 class="card-title" style="text-align:center;">${email}</h2>
                    <button class="btn btn-danger btn-sm" data-email="${email}">Remove</button>
                `;

                spamEmailItem
                    .querySelector("button")
                    .addEventListener("click", function () {
                        removeSpamEmail(this.dataset.email);
                    });

                spamEmailsList.appendChild(spamEmailItem);
            });
        });
}

function addSpamEmail(email) {
    fetch("/settings/spam-emails", {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: { "Content-Type": "application/json" },
    }).then(() => loadSpamEmails()); // Refresh list after adding
}

function removeSpamEmail(email) {
    fetch(`/settings/spam-emails?email=${email}`, {
        method: "DELETE",
    }).then(() => loadSpamEmails()); // Refresh list after removing
}
