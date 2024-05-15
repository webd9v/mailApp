document.addEventListener("DOMContentLoaded", function () {
    // Use buttons to toggle between views
    document
        .querySelector("#inbox")
        .addEventListener("click", () => load_mailbox("inbox"));
    document
        .querySelector("#sent")
        .addEventListener("click", () => load_mailbox("sent"));
    document
        .querySelector("#archived")
        .addEventListener("click", () => load_mailbox("archive"));
    document.querySelector("#compose").addEventListener("click", compose_email);
    document
        .querySelector("#spam")
        .addEventListener("click", () => load_mailbox("spam"));
    // By default, load the inbox
    if (history.state) {
        if (history.state["mailbox"] === "compose") {
            reply(history.state["recipient"], history.state["subject"]);
            history.pushState({ mailbox: "inbox" }, "", "");
        }
    } else {
        load_mailbox("inbox");
    }
});

function compose_email() {
    // history.pushState({mailbox:"compose"},"","compose");

    // Show compose view and hide other views
    document.querySelector("#emails-view").style.display = "none";
    document.querySelector("#compose-view").style.display = "block";

    // Clear out composition fields
    recipients = document.querySelector("#compose-recipients");
    recipients.value = "";
    subject = document.querySelector("#compose-subject");
    subject.value = "";
    body = document.querySelector("#compose-body");
    body.value = "";
    //onsubmit form
    document
        .getElementById("compose-form")
        .addEventListener("submit", function (ev) {
            fetch("/emails", {
                method: "POST",
                body: JSON.stringify({
                    recipients: recipients.value,
                    subject: subject.value,
                    body: body.value,
                }),
            })
                .then((response) => response.json())
                .then((result) => {
                    console.log(result);
                });
        });
}

function load_mailbox(mailbox) {
    const emailsDiv = document.querySelector("#emails-view");
    emailsDiv.innerHTML = "";
    // Show the mailbox and hide other views
    emailsDiv.style.display = "block";
    document.querySelector("#compose-view").style.display = "none";

    // Show the mailbox name
    const mailboxTitle = document.createElement("h3");
    mailboxTitle.innerHTML = `${
        mailbox.charAt(0).toUpperCase() + mailbox.slice(1)
    }`;
    emailsDiv.append(mailboxTitle);
    if (mailbox === "inbox") {
        // history.pushState({mailbox:"inbox"},"","inbox");
        fetch("/emails/inbox")
            .then((response) => response.json())
            .then((emails) => {
                // Print emails
                console.log(emails);
                emails.map((email) => {
                    const divEmailCont = document.createElement("div");
                    const btnSave = document.createElement("button");
                    const emailTitle = document.createElement("h2");
                    const emailSubject = document.createElement("p");
                    const btnOpen = document.createElement("a");
                    btnOpen.href = `/${email["id"]}`;
                    btnOpen.style.color = "#fff";
                    emailTitle.innerText = email["sender"];
                    emailSubject.innerText = `Subject: ${email["subject"]}`;
                    if (email["archived"]) {
                        btnSave.innerHTML = `<abbr title="unarchive"><i class="fa-solid fa-folder"></i></abbr>`;
                        btnSave.onclick = () => {
                            fetch(`/emails/${email["id"]}`, {
                                method: "PUT",
                                body: JSON.stringify({
                                    archived: false,
                                }),
                            });
                            location.reload();
                        };
                    } else {
                        btnSave.innerHTML = `<abbr title="archive"><i class="fa-solid fa-folder-open"></i></abbr>`;
                        btnSave.onclick = () => {
                            fetch(`/emails/${email["id"]}`, {
                                method: "PUT",
                                body: JSON.stringify({
                                    archived: true,
                                }),
                            });
                            location.reload();
                        };
                    }
                    divEmailCont.classList.add("card");
                    divEmailCont.classList.add("p-3");
                    divEmailCont.classList.add("mb-2");
                    divEmailCont.style.position = "relative";
                    emailTitle.classList.add("card-title");
                    emailSubject.style.color = "#55f";
                    emailSubject.style.borderRadius = "5px";
                    emailSubject.style.display = "inline-block";
                    emailSubject.style.width = "260px";
                    emailSubject.style.maxWidth = "400px";
                    emailSubject.style.padding = "9px";
                    emailSubject.style.fontWeight = "bold";
                    btnSave.style = null;
                    btnSave.style.position = "absolute";
                    btnSave.style.border = "0px solid #fff";
                    btnSave.style.color = "#fff";
                    btnSave.style.top = "10px";
                    btnSave.style.right = "8px";
                    btnSave.style.borderRadius = "15px";
                    btnSave.style.backgroundColor = "#ffc107";
                    divEmailCont.append(emailTitle);
                    divEmailCont.append(emailSubject);
                    divEmailCont.append(btnSave);
                    if (!(email["sender"] == email["user"])) {
                        const btnReply = document.createElement("button");
                        btnReply.innerHTML = `<abbr title="reply"><i class="fa-solid fa-reply"></i></abbr>`;
                        btnReply.style = null;
                        btnReply.style.position = "absolute";
                        btnReply.style.border = "0px solid #fff";
                        btnReply.style.color = "#fff";
                        btnReply.style.top = "10px";
                        btnReply.style.right = "45px";
                        btnReply.style.borderRadius = "15px";
                        btnReply.style.backgroundColor = "#c107ff";
                        btnReply.onclick = () => {
                            reply(email["sender"], email["subject"]);
                        };
                        divEmailCont.append(btnReply);
                    }
                    btnOpen.innerHTML = "Open Message";
                    btnOpen.classList.add("btn");
                    btnOpen.classList.add("btn-primary");
                    divEmailCont.append(btnOpen);
                    emailsDiv.append(divEmailCont);
                    return true;
                });
            });
    } else if (mailbox === "archive") {
        // history.pushState({mailbox:"archive"},"","archive");

        fetch("/emails/archive")
            .then((response) => response.json())
            .then((emails) => {
                // Print emails
                console.log(emails);

                emails.map((email) => {
                    const divEmailCont = document.createElement("div");
                    const btnSave = document.createElement("button");
                    const emailTitle = document.createElement("h2");
                    const emailSubject = document.createElement("p");
                    const btnOpen = document.createElement("a");
                    btnOpen.href = `/${email["id"]}`;
                    btnOpen.style.color = "#fff";
                    emailTitle.innerText = email["sender"];
                    emailSubject.innerText = `Subject: ${email["subject"]}`;

                    if (email["archived"]) {
                        btnSave.innerHTML = `<abbr title="unarchive"><i class="fa-solid fa-folder"></i></abbr>`;
                        btnSave.onclick = () => {
                            fetch(`/emails/${email["id"]}`, {
                                method: "PUT",
                                body: JSON.stringify({
                                    archived: false,
                                }),
                            });
                            location.reload();
                        };
                    } else {
                        btnSave.innerHTML = `<abbr title="archive"><i class="fa-solid fa-folder-open"></i></abbr>`;
                        btnSave.onclick = () => {
                            fetch(`/emails/${email["id"]}`, {
                                method: "PUT",
                                body: JSON.stringify({
                                    archived: true,
                                }),
                            });
                            location.reload();
                        };
                    }
                    divEmailCont.classList.add("card");
                    divEmailCont.classList.add("p-3");
                    divEmailCont.classList.add("mb-2");
                    divEmailCont.style.position = "relative";
                    emailTitle.classList.add("card-title");
                    emailSubject.style.color = "#55f";
                    emailSubject.style.borderRadius = "5px";
                    emailSubject.style.display = "inline-block";
                    emailSubject.style.width = "260px";
                    emailSubject.style.maxWidth = "400px";
                    emailSubject.style.padding = "9px";
                    emailSubject.style.fontWeight = "bold";
                    btnSave.style = null;
                    btnSave.style.position = "absolute";
                    btnSave.style.border = "0px solid #fff";
                    btnSave.style.color = "#fff";
                    btnSave.style.top = "10px";
                    btnSave.style.right = "8px";
                    btnSave.style.borderRadius = "15px";
                    btnSave.style.backgroundColor = "#ffc107";
                    btnOpen.innerHTML = "Open Message";
                    btnOpen.classList.add("btn");
                    btnOpen.classList.add("btn-primary");
                    divEmailCont.append(emailTitle);
                    divEmailCont.append(emailSubject);
                    divEmailCont.append(btnSave);
                    divEmailCont.append(btnOpen);
                    if (!(email["sender"] == email["user"])) {
                        const btnReply = document.createElement("button");
                        btnReply.innerHTML = `<abbr title="reply"><i class="fa-solid fa-reply"></i></abbr>`;
                        btnReply.style = null;
                        btnReply.style.position = "absolute";
                        btnReply.style.border = "0px solid #fff";
                        btnReply.style.color = "#fff";
                        btnReply.style.top = "10px";
                        btnReply.style.right = "45px";
                        btnReply.style.borderRadius = "15px";
                        btnReply.style.backgroundColor = "#c107ff";
                        btnReply.onclick = () => {
                            reply(email["sender"], email["subject"]);
                        };
                        divEmailCont.append(btnReply);
                    }
                    divEmailCont.classList.add("custom-email");
                    emailsDiv.append(divEmailCont);
                    return true;
                });
            });
    } else if (mailbox === "sent") {
        // history.pushState({mailbox:"sent"},"","sent");

        fetch("/emails/sent")
            .then((response) => response.json())
            .then((emails) => {
                // Print emails
                emails.map((email) => {
                    console.log(email);
                    const divEmailCont = document.createElement("div");
                    divEmailCont.classList.add("mb-2");
                    const btnOpen = document.createElement("a");
                    btnOpen.href = `/${email["id"]}`;
                    btnOpen.style.color = "#fff";
                    const emailTitle = document.createElement("h2");
                    const emailSubject = document.createElement("p");
                    emailTitle.innerText = `From: ${email["sender"]}`;
                    emailSubject.innerText = `Subject: ${email["subject"]}`;
                    divEmailCont.classList.add("card");
                    divEmailCont.classList.add("p-3");
                    divEmailCont.style.position = "relative";
                    emailTitle.classList.add("card-title");
                    emailSubject.style.color = "#55f";
                    emailSubject.style.borderRadius = "5px";
                    emailSubject.style.display = "inline-block";
                    emailSubject.style.width = "260px";
                    emailSubject.style.maxWidth = "400px";
                    emailSubject.style.padding = "9px";
                    emailSubject.style.fontWeight = "bold";
                    btnOpen.innerHTML = "Open Message";
                    btnOpen.classList.add("btn");
                    btnOpen.classList.add("btn-primary");
                    divEmailCont.append(emailTitle);
                    divEmailCont.append(emailSubject);
                    divEmailCont.append(btnOpen);
                    emailsDiv.append(divEmailCont);
                    return true;
                });
            });
    } else if (mailbox === "spam") {
        // Fetch spam emails and display them
        fetch("/emails/spam")
            .then((response) => response.json())

            .then((emails) => {
                console.log(emails);
                emails.map((email) => {
                    const divEmailCont = document.createElement("div");
                    const btnSave = document.createElement("button");
                    const emailTitle = document.createElement("h2");
                    const emailSubject = document.createElement("p");
                    const btnOpen = document.createElement("a");
                    btnOpen.href = `/${email["id"]}`;
                    btnOpen.style.color = "#fff";
                    emailTitle.innerText = email["sender"];
                    emailSubject.innerText = `Subject: ${email["subject"]}`;
                    if (email["archived"]) {
                        btnSave.innerHTML = `<abbr title="unarchive"><i class="fa-solid fa-folder"></i></abbr>`;
                        btnSave.onclick = () => {
                            fetch(`/emails/${email["id"]}`, {
                                method: "PUT",
                                body: JSON.stringify({
                                    archived: false,
                                }),
                            });
                            location.reload();
                        };
                    } else {
                        btnSave.innerHTML = `<abbr title="archive"><i class="fa-solid fa-folder-open"></i></abbr>`;
                        btnSave.onclick = () => {
                            fetch(`/emails/${email["id"]}`, {
                                method: "PUT",
                                body: JSON.stringify({
                                    archived: true,
                                }),
                            });
                            location.reload();
                        };
                    }
                    divEmailCont.classList.add("card");
                    divEmailCont.classList.add("p-3");
                    divEmailCont.classList.add("mb-2");
                    divEmailCont.style.position = "relative";
                    emailTitle.classList.add("card-title");
                    emailSubject.style.color = "#55f";
                    emailSubject.style.borderRadius = "5px";
                    emailSubject.style.display = "inline-block";
                    emailSubject.style.width = "260px";
                    emailSubject.style.maxWidth = "400px";
                    emailSubject.style.padding = "9px";
                    emailSubject.style.fontWeight = "bold";
                    btnSave.style = null;
                    btnSave.style.position = "absolute";
                    btnSave.style.border = "0px solid #fff";
                    btnSave.style.color = "#fff";
                    btnSave.style.top = "10px";
                    btnSave.style.right = "8px";
                    btnSave.style.borderRadius = "15px";
                    btnSave.style.backgroundColor = "#ffc107";
                    divEmailCont.append(emailTitle);
                    divEmailCont.append(emailSubject);
                    divEmailCont.append(btnSave);
                    if (!(email["sender"] == email["user"])) {
                        const btnReply = document.createElement("button");
                        btnReply.innerHTML = `<abbr title="reply"><i class="fa-solid fa-reply"></i></abbr>`;
                        btnReply.style = null;
                        btnReply.style.position = "absolute";
                        btnReply.style.border = "0px solid #fff";
                        btnReply.style.color = "#fff";
                        btnReply.style.top = "10px";
                        btnReply.style.right = "45px";
                        btnReply.style.borderRadius = "15px";
                        btnReply.style.backgroundColor = "#c107ff";
                        btnReply.onclick = () => {
                            reply(email["sender"], email["subject"]);
                        };
                        divEmailCont.append(btnReply);
                    }
                    btnOpen.innerHTML = "Open Message";
                    btnOpen.classList.add("btn");
                    btnOpen.classList.add("btn-primary");
                    divEmailCont.append(btnOpen);
                    emailsDiv.append(divEmailCont);
                    return true;
                });
            });
    }
}

function reply(recipients, subjects) {
    compose_email();
    document.querySelector("#compose-recipients").value = `${recipients} `;
    subject = document.querySelector("#compose-subject");
    subject.value = `RE: ${subjects}`;
}
