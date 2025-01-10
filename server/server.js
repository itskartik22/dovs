const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();

const port = process.env.PORT || 5000;

app.use(express.json());

app.use("/", require("./routes/voting"));

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
