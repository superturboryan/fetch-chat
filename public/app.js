let fetchAndUpdate = () => {
  fetch("/messages")
    .then(response => response.text())
    .then(responseBody => {
      let parsed = JSON.parse(responseBody);
      let msgListUL = document.getElementById("msg-list");
      msgListUL.innerHTML = "";
      parsed.forEach(elem => {
        let li = document.createElement("li");
        li.style.color = elem.color;
        li.innerText = elem.user + ": " + elem.msg;
        msgListUL.append(li);
      });
    });
};

setInterval(fetchAndUpdate, 500);

let chatForm = document.getElementById("chat-form");
chatForm.addEventListener("submit", event => {
  event.preventDefault();
  let msgInput = document.getElementById("msg-input").value;
  let msgData = new FormData();
  msgData.append("message", msgInput);
  fetch("/messages", {
    method: "POST",
    body: msgData
  });
});

let nameForm = document.getElementById("name-form");
nameForm.addEventListener("submit", event => {
  event.preventDefault();
  let newName = document.getElementById("name-input").value;
  let nameData = new FormData();
  nameData.append("newName", newName);
  fetch("/setName", {
    method: "POST",
    body: nameData
  })
    .then(resH => {
      return resH.text();
    })
    .then(resB => {
      if (resB === "Success") {
        alert(`Username changed successfully to ${newName}`);
      } else if (resB === "Error") {
        alert(`${newName} is already taken!`);
      }
    });
});

let currentUserLabel = document.getElementById("current-user");
let updateCurrentUser = () => {
  fetch("/currentUser")
    .then(resH => {
      return resH.text();
    })
    .then(resB => {
      currentUserLabel.innerText = `Current user: ${resB}`;
    });
};

setInterval(updateCurrentUser, 500);
