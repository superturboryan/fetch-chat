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
let colorAssoc = {};
let sessions = {};
let messages = [];
let onlineUsers = [];

app.get("/", (req, res) => {
  res.send(fs.readFileSync(__dirname + "/public/index.html").toString());
});

app.post("/messages", upload.none(), (req, res) => {
  console.log("POST messages body", req.body);
  let newMessage = {
    user: sessions[req.cookies["sid"]],
    msg: req.body.message,
    color: colorAssoc[sessions[req.cookies["sid"]]]
  };
  messages.push(newMessage);
});

app.get("/onlineUsers", (req, res) => {
  res.send(JSON.stringify(onlineUsers));
});

//Send current user as response
app.get("/currentUser", (req, res) => {
  res.send(sessions[req.cookies.sid]);
});

app.get("/messages", (req, res) => {
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
  res.send("<html><body> name already taken! </body></html>");
});

let changeNameMessages = (oldName, newName) => {
  for (message of messages) {
    if (message.user === oldName) {
      message.user = newName;
    }
  }
};

let changeColorMessages = (color, user) => {
  for (message of messages) {
    if (message.user === user) {
      message.color = color;
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
    console.log(`Username "${oldName}" has been changed to "${newName}"`);
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
  //Add user to currentUsers array
  onlineUsers.push(sessions[sid]);
  console.log(onlineUsers);
  res.cookie("sid", sid);
  res.send(fs.readFileSync(__dirname + "/public/chat.html").toString());
});

app.post("/red", (req, res) => {
  let sessionId = req.cookies.sid;
  let user = sessions[sessionId];
  colorAssoc[user] = "red";
  changeColorMessages("red", user);
  res.send(fs.readFileSync(__dirname + "/public/chat.html").toString());
});

app.post("/blue", (req, res) => {
  console.log("I'm blue");
  let sessionId = req.cookies.sid;
  let user = sessions[sessionId];
  colorAssoc[user] = "blue";
  changeColorMessages("blue", user);
  res.send(fs.readFileSync(__dirname + "/public/chat.html").toString());
});

app.post("/orange", (req, res) => {
  let sessionId = req.cookies.sid;
  let user = sessions[sessionId];
  colorAssoc[user] = "orange";
  changeColorMessages("orange", user);
  res.send(fs.readFileSync(__dirname + "/public/chat.html").toString());
});

app.get("/signout", (req, res) => {
  let sessionId = req.cookies.sid;
  delete sessions[sessionId];
  let index = onlineUsers.indexOf(sessions[sessionId]);
  onlineUsers.splice(index, 1);
  // res.send(fs.readFileSync(__dirname + "/public/index.html").toString());
  res.send("Signing out");
});

app.listen(4000);
