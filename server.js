//Import statements
let express = require("express");
let fs = require("fs");
let cookieParser = require("cookie-parser");
let multer = require("multer");

let app = express();
let upload = multer();

//Middleware
app.use(cookieParser());
app.use("/static", express.static(__dirname + "/public"));

//Chat variables
let passwordsAssoc = {};
let sessions = {};
let messages = [];

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
  console.log("Sending back the messages");
  res.send(JSON.stringify(messages));
});

app.post("/signup", upload.none(), (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  passwordsAssoc[username] = password;
  res.send("<html><body> signup successful </body></html>");
});

let changeNameMessages = (oldName, newName) => {
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
    passwordsAssoc[newName] = passwordsAssoc[oldName];
    sessions[req.cookies["sid"]] = newName;
    delete passwordsAssoc[oldName];
    changeNameMessages(oldName, newName);
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
