const express = require("express"),
    os = require("os"),
    app = express();

app.use(express.static("dist"));


app.listen(8080, () => console.log("Listening on port 8080"));