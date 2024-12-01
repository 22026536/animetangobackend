import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import express, { json } from 'express';
import session from 'express-session';
import mongoose from 'mongoose';
import path from "path";
import { fileURLToPath } from "url";
import Router from './api/user/index.js';
import corMw from "./middlewares/cors.js";
;
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const app = express();

// Tạo đường dẫn tương tự __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Định tuyến để phục vụ các file tĩnh trong thư mục 'dist'
app.use(express.static(path.join(__dirname, "./dist")));

// Tất cả các request khác sẽ trả về file index.html (React xử lý routing)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./dist/index.html"));
});


app.options('*', corMw);
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }  // Bỏ secure nếu không dùng HTTPS
}));
app.use(express.urlencoded({ extended: true }));
app.use(json());
app.set('trust proxy', 1);
app.use(cookieParser());
app.use('/api', Router);

// Kết nối MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000, // Tăng thời gian chờ lên 30 giây
}).then(() => {
  console.log('MongoDB connected');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at port ${PORT}`));
