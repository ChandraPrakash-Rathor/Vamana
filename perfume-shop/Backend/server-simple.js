console.log("Step 1: Starting...");

const express = require("express");
console.log("Step 2: Express loaded");

const dotenv = require("dotenv");
console.log("Step 3: Dotenv loaded");

dotenv.config();
console.log("Step 4: Config loaded, PORT =", process.env.PORT);
console.log("Step 5: MONGO_URI =", process.env.MONGO_URI);

const app = express();
console.log("Step 6: App created");

app.use(express.json());
console.log("Step 7: Middleware added");

app.get("/", (req, res) => {
  res.json({ message: "Server works!" });
});

app.get("/api/admin/health", (req, res) => {
  res.json({ success: true, message: "Health check OK" });
});

const PORT = process.env.PORT || 5000;
console.log("Step 8: About to listen on port", PORT);

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
