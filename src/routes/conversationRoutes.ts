import express from "express";
import { protectRoute } from "../middlewares/authMiddleware";
import {
  createNewConversation,
  deleteConversationById,
  getConversationDetails,
  getConversations,
  updateConversation,
} from "../controllers/conversationController";

const router = express.Router();

router.use(protectRoute);

/**
 * @swagger
 * /api/conversations:
 *   get:
 *     summary: Mendapatkan daftar riwayat conversation pengguna
 *     tags: [Conversation]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Nomor halaman data
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Jumlah data per halaman
 *     responses:
 *       200:
 *         description: Berhasil mendapatkan daftar conversation.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Conversation'
 *   post:
 *     summary: Membuat sesi conversation baru dengan AI
 *     tags: [Conversation]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 title:
 *                   type: string
 *                   description: Judul conversation opsional. Jika kosong, sistem akan meng-generate otomatis.
 *                   example: Tanya Regulasi Halal Kue Kering
 *                 prompt:
 *                   type: string
 *                   description: Pesan pengguna (prompt) yang dikirimkan dari frontend agar Backend via AI mem-parsing judul percakapan secara dinamis.
 *                   example: Apakah jualan online rumahan wajib pakai NPWP?
 *     responses:
 *       201:
 *         description: Sesi conversation berhasil dibuat.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Conversation'
 */
router.get("/", getConversations);
router.post("/", createNewConversation);

/**
 * @swagger
 * /api/conversations/{id}:
 *   get:
 *     summary: Mengambil detail satu conversation beserta seluruh pesan di dalamnya
 *     tags: [Conversation]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID Conversation
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Nomor halaman data pesan
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Jumlah pesan per halaman
 *     responses:
 *       200:
 *         description: Detail conversation berhasil ditemukan.
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
 *                     conversation:
 *                       $ref: '#/components/schemas/Conversation'
 *                     messages:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Message'
 *       404:
 *         description: Conversation tidak ditemukan.
 *   put:
 *     summary: Mengubah detail/judul conversation
 *     tags: [Conversation]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID Conversation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 example: Judul Conversation Baru
 *     responses:
 *       200:
 *         description: Conversation berhasil diperbarui.
 *       404:
 *         description: Conversation tidak ditemukan.
 *   delete:
 *     summary: Menghapus sesi conversation beserta riwayat pesan terkait
 *     tags: [Conversation]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID Conversation
 *     responses:
 *       200:
 *         description: Conversation berhasil dihapus.
 */
router.get("/:id", getConversationDetails);
router.put("/:id", updateConversation);
router.delete("/:id", deleteConversationById);

export default router;
