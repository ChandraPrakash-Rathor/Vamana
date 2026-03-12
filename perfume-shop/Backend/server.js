const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const { initCronJobs } = require("./config/cronJobs");

dotenv.config();

connectDB().then(() => {
  initCronJobs();
});

const app = express();

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/api/admin", require("./Admin/routes/adminRoutes"));
app.use("/api/member", require("./Member/routes/memberRoutes"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});