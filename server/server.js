const express = require("express");
const cors = require("cors");

const app = express();
const dotenv = require("dotenv");
dotenv.config();

const port = process.env.PORT || 5000;

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173"
// Enable Cross-Origin Resource Sharing (CORS)
app.use(
  cors({
    origin: { FRONTEND_URL }, // Allow only this origin (Frontend URL)
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
  })
);

app.use(express.json());

app.use("/", require("./routes/voting"));

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
