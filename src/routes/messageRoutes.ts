import express from "express";
import multer from "multer";
import { protectRoute } from "../middlewares/authMiddleware";
import { sendMessage } from "../controllers/messageController";
import { chatLimiter } from "../middlewares/rateLimiter";


const router = express.Router({ mergeParams: true });

// Setup multer untuk menyimpan file ke memory (sebelum di-upload ke Cloudinary)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

router.use(protectRoute);

/**
 * @swagger
 * /api/conversations/{id}/messages:
 *   post:
 *     summary: Mengirim pesan pengguna ke AI dengan opsi unggah lampiran dokumen
 *     description: Endpoint ini secara otomatis menyisipkan riwayat 5 pesan terakhir dari percakapan sebagai konteks, sehingga AI dapat memahami alur obrolan multi-turn (berkelanjutan).
 *     tags: [Message]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID Percakapan tempat pesan dikirim
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: Isi teks pertanyaan pengguna
 *                 example: Apakah produk kopi susu bubuk saya wajib bersertifikat halal?
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Lampiran file pendukung (PDF, JPG, PNG) - Maksimal 5 file
 *     responses:
 *       201:
 *         description: Pesan berhasil diproses oleh AI dan respons dikembalikan.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     user_message:
 *                       $ref: '#/components/schemas/Message'
 *                     ai_message:
 *                       $ref: '#/components/schemas/Message'
 */

router.post("/", upload.array("files", 5), chatLimiter, sendMessage);

export default router;
