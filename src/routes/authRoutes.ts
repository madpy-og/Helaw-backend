import express from "express";
import { login, logout, register, getMe, updateMe } from "../controllers/authController";
import { protectRoute } from "../middlewares/authMiddleware";
import { authLimiter } from "../middlewares/rateLimiter";

const router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Mendaftarkan akun pengguna baru (UMKM)
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Roti Maju Bersama
 *               email:
 *                 type: string
 *                 format: email
 *                 example: roti@majubersama.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: rahasia123
 *     responses:
 *       201:
 *         description: Pendaftaran berhasil. Token JWT diset pada cookie `jwt`.
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: jwt=eyJhbGciOi...; Path=/; HttpOnly; Secure
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StandardSuccessResponse'
 *       400:
 *         description: Validasi input gagal atau email sudah digunakan.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StandardErrorResponse'
 *       429:
 *         description: Terlalu banyak percobaan pendaftaran (maksimal 5 kali per 15 menit).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StandardErrorResponse'
 */
router.post("/register", authLimiter, register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Authentication pengguna dan set cookie session
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: roti@majubersama.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: rahasia123
 *     responses:
 *       200:
 *         description: Authentication berhasil. Token JWT diset pada cookie `jwt`.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StandardSuccessResponse'
 *       401:
 *         description: Email atau password salah.
 *       429:
 *         description: Terlalu banyak percobaan login (maksimal 5 kali per 15 menit).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StandardErrorResponse'
 */
router.post("/login", authLimiter, login);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Mengakhiri sesi pengguna (menghapus cookie)
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Logout berhasil. Cookie `jwt` dihapus.
 */
router.post("/logout", logout);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Mengambil data profil pengguna yang sedang login
 *     tags: [Authentication]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Data pengguna ditemukan.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Akses ditolak karena tidak memiliki token atau token tidak valid.
 *   put:
 *     summary: Memperbarui profil pengguna (nama & email)
 *     tags: [Authentication]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Roti Maju Bersama Baru
 *               email:
 *                 type: string
 *                 format: email
 *                 example: roti.baru@majubersama.com
 *     responses:
 *       200:
 *         description: Profil berhasil diperbarui.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/User'
 */
router.get("/me", protectRoute, getMe);
router.put("/me", protectRoute, updateMe);

export default router;
