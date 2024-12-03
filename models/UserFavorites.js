const mongoose = require("mongoose");

const userFavoriteSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  favorites: { type: [String], default: [] } // Mảng chỉ chứa anime_id
},{
    collection: 'UserFavorites', // Đặt tên collection
    timestamps: true, // Tự động thêm createdAt, updatedAt
});

const UserFavorites = mongoose.model("UserFavorites", userFavoriteSchema);
export default UserFavorites;