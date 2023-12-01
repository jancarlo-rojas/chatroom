const express = require("express");
const path = require("path");
const collection = require("./config");
const bcrypt = require('bcrypt');
//socketio stuff
const http = require("http");
const socketIO = require("socket.io");


const app = express();


//creating server
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static('public', { 
    setHeaders: (res, path, stat) => {
      if (path.endsWith('.js')) {
        res.set('Content-Type', 'application/javascript');
      }
    }
  }));

//checking to console if working
io.on("connection", (socket) => {
    console.log("a user connected");
  
    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  
    socket.on("chat message", (msg) => {
      io.emit("chat message", msg);
    });
  });


// convert data into json format
app.use(express.json());
// Static file
app.use(express.static("public"));

app.use(express.urlencoded({ extended: false }));
//use EJS as the view engine
app.set("view engine", "ejs");



app.get("/", (req, res) => {
    res.render("login");
});

app.get("/signup", (req, res) => {
    res.render("signup");
});

app.get("/home", (req, res) => {
    res.render("home");
});

app.get("/messages", (req, res) => {
    res.render("messages");
});

// Register User
app.post("/signup", async (req, res) => {

    const data = {
        name: req.body.username,
        password: req.body.password
    }

    // Check if the username already exists in the database
    const existingUser = await collection.findOne({ name: data.name });

    if (existingUser) {
        res.send('User already exists. Please choose a different username.');
    } else {
        // Hash the password using bcrypt
        const saltRounds = 10; // Number of salt rounds for bcrypt
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);

        data.password = hashedPassword; // Replace the original password with the hashed one

        const userdata = await collection.insertMany(data);
        console.log(userdata);
    }

});

// Login user 
app.post("/login", async (req, res) => {
    try {
        const check = await collection.findOne({ name: req.body.username });
        if (!check) {
            res.send("Username cannot be found");
            return;  // Add return to exit the function if username is not found
        }

        // Compare the hashed password from the database with the plaintext password
        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
        if (!isPasswordMatch) {
            res.send("Wrong Password");
            
        } else {
            res.render("home");

            // Redirect back to the login page after a couple of seconds
              // 2000 milliseconds or 2 seconds
        }
    } catch {
        res.send("Wrong Details");
    }
});



// Define Port for Application
// Define Port for Application

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});