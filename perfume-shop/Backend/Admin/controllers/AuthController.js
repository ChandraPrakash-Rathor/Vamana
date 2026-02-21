const AuthModal = require("../models/AuthModal");


exports.loginAdmin = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      const admin = await AuthModal.findOne({ email });
  
      if (!admin) {
        return res.status(200).json({ status: "error", message: "Admin not found  invalid email" });
      }
  
      if (admin.password !== password) {
        return res.status(200).json({ status: "error",message: "Invalid password" });
      }
  
      res.json({
        status: "success",
        success: true,
        message: "Login successful",
        admin
      });
  
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  