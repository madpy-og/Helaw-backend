import { Request, Response } from "express";
import { uploadToCloudinary } from "../config/cloudinary";
import { createMessage, getConversationMessagesWithDocuments } from "../models/messageModel";
import { createDocument } from "../models/documentModel";
import { analyzeMessageAndDocuments } from "../services/geminiService";
import { getConversationByIdAndUser } from "../models/conversationModel";

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const conversationId = req.params.id as string;
    const { content } = req.body;
    const files = req.files as Express.Multer.File[];

    if (!content && (!files || files.length === 0)) {
      return res.status(400).json({ success: false, message: "Pesan atau dokumen tidak boleh kosong" });
    }

    const conversation = await getConversationByIdAndUser(conversationId, userId);
    if (!conversation) {
      return res.status(404).json({ success: false, message: "Percakapan tidak ditemukan" });
    }

    const history = await getConversationMessagesWithDocuments(conversationId, 5, 0);

    const userMessage = await createMessage(conversationId, "user", content || "");

    const uploadedDocuments: any[] = [];
    const filesForGemini: { url: string; mimeType: string }[] = [];

    if (files && files.length > 0) {
      for (const file of files) {
        const isPdf = file.mimetype === "application/pdf";
        const resourceType = isPdf ? "raw" : "image";

        const folderPath = `helaw/documents/${userId}`;
        const uploadResult = await uploadToCloudinary(file.buffer, folderPath, resourceType);

        const document = await createDocument(
          userMessage.id,
          uploadResult.url,
          isPdf ? "pdf" : "image",
          file.originalname
        );

        uploadedDocuments.push(document);
        filesForGemini.push({ url: uploadResult.url, mimeType: file.mimetype });
      }
    }

    const aiResponse = await analyzeMessageAndDocuments(content || "Tolong jelaskan isi dokumen ini.", filesForGemini, history);

    const aiMessage = await createMessage(
      conversationId,
      "ai",
      aiResponse.explanation,
      aiResponse.actionableInsights
    );

    res.status(201).json({
      success: true,
      data: {
        user_message: {
          ...userMessage,
          documents: uploadedDocuments
        },
        ai_message: aiMessage
      }
    });

  } catch (error: any) {
    console.error("Error in sendMessage controller", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
