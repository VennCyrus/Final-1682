import mongoose from "mongoose";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import "dotenv/config.js";

const setAdminUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to MongoDB");

    // Admin users to set
    const adminUsers = [
      { 
        email: "admin@admin.com",
        name: "Admin User",
        password: "admin123@"
      },
      { 
        email: "dnd28062002@gmail.com",
        name: "Admin User (Google)"
      }
    ];

    for (const adminUser of adminUsers) {
      let user = await User.findOne({ email: adminUser.email });
      
      if (!user) {
        // Create user if doesn't exist
        if (adminUser.password) {
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(adminUser.password, salt);
          user = await User.create({
            name: adminUser.name || "Admin User",
            email: adminUser.email,
            password: hashedPassword,
            role: 'admin'
          });
          console.log(`✓ Created and set ${adminUser.email} as admin!`);
        } else {
          // For Google users, create a placeholder that will be updated when they log in
          // Set a temporary googleId to bypass password requirement
          user = await User.create({
            name: adminUser.name || "Admin User",
            email: adminUser.email,
            googleId: "temp_" + Date.now(), // Temporary googleId
            password: "", // No password for Google users
            role: 'admin'
          });
          console.log(`✓ Created placeholder admin user ${adminUser.email}. Role will be set when they log in with Google.`);
        }
      } else {
        // Update existing user to admin
        user.role = 'admin';
        await user.save();
        console.log(`✓ User ${adminUser.email} is now an admin!`);
      }
    }

    console.log("\nAll admin users have been set successfully!");
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

setAdminUsers();

