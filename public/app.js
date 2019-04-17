let fetchAndUpdate = () => {
  fetch("/messages")
    .then(response => response.text())
    .then(responseBody => {
      let parsed = JSON.parse(responseBody);
      let msgListUL = document.getElementById("msg-list");
      msgListUL.innerHTML = "";
      parsed.forEach(elem => {
        // 15
        let li = document.createElement("li");
        li.innerText = elem.user + ": " + elem.msg;
        msgListUL.append(li);
      }); // 15
    }); // 11
};

setInterval(fetchAndUpdate, 500);

let chatForm = document.getElementById("chat-form");
chatForm.addEventListener("submit", event => {
  // 2
  event.preventDefault(); // 3
  let msgInput = document.getElementById("msg-input").value; // 4
  let formData = new FormData(); // 5
  formData.append("message", msgInput); // 6
  fetch("/messages", {
    method: "POST",
    body: formData
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
