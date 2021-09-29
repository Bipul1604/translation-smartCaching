//including required modules
const express = require("express");
const mongoose = require("mongoose");
require("./db");
const app = express();

//using route
app.use(require("./route"));

//starting the server
app.listen(3000, () =>
{

    console.log(`Server is running at Port number 3000`)
});
