let express = require("express");
let fs = require("fs");
let cookieParser = require("cookie-parser");
let multer = require("multer");

let app = express();
let upload = multer();

app.use(cookieParser());

let passwordsAssoc = {};
let sessions = {};
let messages = [];
app.use("/static", express.static(__dirname + "/public"));
app.get("/", (req, res) => {
  res.send(fs.readFileSync(__dirname + "/public/index.html").toString());
});
app.post("/messages", upload.none(), (req, res) => {
  console.log("POST messages body", req.body);
  let newMessage = {
    user: sessions[req.cookies["sid"]],
    msg: req.body.message
  };
  messages.push(newMessage);
});
app.get("/messages", (req, res) => {
  // console.log("Sending back the messages");
  res.send(JSON.stringify(messages));
});

app.post("/signup", upload.none(), (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  if (passwordsAssoc[username] === undefined) {
    passwordsAssoc[username] = password;
    res.send("<html><body> signup successful </body></html>");
    return;
  }
  res.send(`<html><body> Username ${username} already taken!
  Try something original
  </body></html>`);
});

let changeMessageName = (oldName, newName) => {
  for (message of messages) {
    if (message.user === oldName) {
      message.user = newName;
    }
  }
};

app.post("/setName", upload.none(), (req, res) => {
  let newName = req.body.newName;
  let oldName = sessions[req.cookies["sid"]];
  if (passwordsAssoc[newName] === undefined) {
    //This happens
    passwordsAssoc[newName] = passwordsAssoc[oldName];
    sessions[req.cookies["sid"]] = newName;
    changeMessageName(oldName, newName);
    delete passwordsAssoc[oldName];
    res.send("Success");
  }
  res.send("Error");
});

app.post("/login", upload.none(), (req, res) => {
  let username = req.body.username;
  let passwordGiven = req.body.password;
  let expectedPassword = passwordsAssoc[username];
  if (expectedPassword !== passwordGiven) {
    res.send("<html><body> invalid username or password </body></html>");
    return;
  }
  let sid = Math.floor(Math.random() * 10000000);
  sessions[sid] = username;
  res.cookie("sid", sid);
  res.send(fs.readFileSync(__dirname + "/public/chat.html").toString());
});
app.listen(4000);
