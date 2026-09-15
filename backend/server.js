const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "..")));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});