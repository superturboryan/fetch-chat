let fetchAndUpdate = () => {
  // 8
  fetch("/messages")
    .then(response => response.text())
    .then(responseBody => {
      // 11
      let parsed = JSON.parse(responseBody);
      let msgListUL = document.getElementById("msg-list");
      msgListUL.innerHTML = ""; // 14
      parsed.forEach(elem => {
        // 15
        let li = document.createElement("li"); // 16
        li.innerText = elem.user + ": " + elem.msg; // 16
        msgListUL.append(li); // 17
      }); // 15
    }); // 11
}; // 8

setInterval(fetchAndUpdate, 300); // 8

let msgForm = document.getElementById("chat-form"); // 1
msgForm.addEventListener("submit", event => {
  event.preventDefault(); // 3
  let msgInput = document.getElementById("msg-input").value; // 4
  let formData = new FormData();
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
        alert("Name changed successfully");
      } else if (resB === "Error") {
        alert("Name already taken");
      }
    });
});
