const { sequelize } = require("../config/db");
const User = require("./User");
const Store = require("./Store");
const Rating = require("./Rating");

// Relations
User.hasMany(Rating, { onDelete: "CASCADE" });
Rating.belongsTo(User);

Store.hasMany(Rating, { onDelete: "CASCADE" });
Rating.belongsTo(Store);

User.hasMany(Store, { foreignKey: "ownerId", onDelete: "CASCADE" });
Store.belongsTo(User, { as: "owner", foreignKey: "ownerId" });

module.exports = { sequelize, User, Store, Rating };
