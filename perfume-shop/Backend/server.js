const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const { initCronJobs } = require("./config/cronJobs");

dotenv.config();
connectDB();

const app = express();
app.use("/uploads", express.static("uploads"));

app.use(cors({
  origin: "*",          
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization","X-Requested-With","Accept"],
  credentials: true     
}));
app.use(express.json());

// Routes
app.use("/api/admin", require("./Admin/routes/adminRoutes"));
app.use("/api/member", require("./Member/routes/memberRoutes"));


initCronJobs();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`); 
  console.log(`📋 Admin API: http://localhost:${PORT}/api/admin/health`);
  console.log(`📋 Member API: http://localhost:${PORT}/api/member/health`);
});
