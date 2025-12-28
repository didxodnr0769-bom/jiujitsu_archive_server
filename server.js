const express = require("express");
const app = express();
const port = 3000;

// CORS 미들웨어 (npm install cors 필요)
const cors = require("cors");

const categoryRoutes = require("./routes/categories");
const videoRoutes = require("./routes/videos");
const authRoutes = require("./routes/auth");

app.use(express.json());
app.use(cors()); // CORS 적용

app.use("/api/category", categoryRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
