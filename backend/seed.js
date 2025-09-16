const bcrypt = require("bcrypt");
const { sequelize } = require("./config/db");
const User = require("./models/User");
const Store = require("./models/Store");
const Rating = require("./models/Rating");

async function seed() {
  try {
    // Disable foreign key checks so Sequelize can drop in any order
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 0");
    await sequelize.sync({ force: true });
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 1");

    const hashedPassword = await bcrypt.hash("Admin@123", 10);

    // Admin
    await User.create({
      name: "Admin User",
      email: "admin@example.com",
      password: hashedPassword,
      role: "admin",
      address: "Admin Address",
    });

    // Store Owner
    const owner = await User.create({
      name: "Store Owner",
      email: "owner@example.com",
      password: hashedPassword,
      role: "store_owner",
      address: "Owner Address",
    });

    // Normal User
    await User.create({
      name: "Normal User",
      email: "user@example.com",
      password: hashedPassword,
      role: "user",
      address: "User Address",
    });

    // Store
    await Store.create({
      name: "My Test Store",
      address: "123 Market Street",
      ownerId: owner.id,
    });

    console.log("✅ Seed completed successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed failed:", err.message);
    process.exit(1);
  }
}

seed();
