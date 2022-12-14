const express = require("express");
const morgan = require("morgan");
const fs = require("fs"); // import built in node modules fs
const path = require("path"); // and path
const colors = require("colors");
const cors = require("cors");
require("dotenv").config();

//Database connection
const {connectMysQLDB} = require("./config/db-mysql.config");

const PORT = process.env.PORT;

const app = express();

const corsOptions = {
  originReactFrontend: "http://localhost:3000",
  originReactNative: "http://localhost:1902",
  angularFrontend: "http://localhost:4200/"
}

// manage cors policies
app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// create a write stream (in append mode)
// a ‘log.txt’ file is created in root directory
const accessLogStream = fs.createWriteStream(path.join(__dirname, "log.txt"), {
  flags: "a",
});
app.use(morgan("combined", { stream: accessLogStream }));
app.use(express.static('public'));

// call database connection
connectMysQLDB();

// app documentation routes
app.get("/documentation", (req, res) => {
  res.sendFile("public/index.html", { root: __dirname });
});

app.use('/api/users', require('./routes/user.routes'));

// app.use('/api/tvshows', require('./routes/tvshow.routes'));
// listen on port
app.listen(PORT, () => {
  console.log(`Your app is listening on port ${PORT}.`);
});

