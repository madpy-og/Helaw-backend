import rateLimit from "express-rate-limit";

export const chatLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20, 
  message: {
    success: false,
    message: "Anda telah mencapai batas pesan. Coba lagi dalam 1 jam."
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 5, // maksimal 5 percobaan login/register
  message: {
    success: false,
    message: "Terlalu banyak percobaan. Silakan coba lagi setelah 15 menit."
  },
  standardHeaders: true,
  legacyHeaders: false,
});
