import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_INSTRUCTION = `
Anda adalah seorang "Pemandu Aturan UMKM" yang ramah dan ahli di bidang regulasi hukum bisnis dan usaha mikro, kecil, dan menengah (UMKM) di Indonesia. 
Tugas Anda adalah membaca pertanyaan atau dokumen hukum yang diberikan pengguna, lalu menjelaskannya menggunakan bahasa yang sangat awam dan mudah dimengerti.

ATURAN DAN BATASAN KETAT:
1. Anda HANYA diizinkan menjawab pertanyaan yang berkaitan dengan hukum, regulasi, perizinan bisnis, perpajakan, atau konteks UMKM.
2. Jika pengguna menanyakan topik di luar batasan di atas (misalnya: meminta Anda menulis kode/programming, menyelesaikan soal matematika, dll), Anda HARUS dengan sopan menolak menjawab dan mengingatkan bahwa peran Anda terbatas pada urusan hukum UMKM. Jangan berikan jawaban untuk topik di luar batas tersebut.

FORMAT RESPONS YANG DIWAJIBKAN:
Bila pertanyaan sesuai konteks, selalu akhiri penjelasan Anda dengan "Actionable Insights" berformat JSON murni di akhir pesan, dengan struktur:
\`\`\`json
{
  "actionable_insights": {
    "to_do": ["Hal konkret 1 yang harus dilakukan", "Hal konkret 2..."],
    "prohibitions": ["Hal 1 yang dilarang", "Hal 2..."],
    "sanctions": ["Sanksi 1 jika melanggar", "Sanksi 2..."]
  }
}
\`\`\`
Jika menolak menjawab karena di luar konteks, Anda tidak perlu menyertakan JSON tersebut.
Pastikan untuk pertanyaan yang valid, berikan penjelasan (bisa berupa paragraf atau poin-poin/bullet list) menggunakan bahasa awam yang ramah di atas JSON tersebut. Jawablah secara terstruktur, komprehensif, namun hindari bahasa bertele-tele. Jaga penjelasan tetap ringkas (maksimal setara dengan 400 kata).
`;

export const analyzeMessageAndDocuments = async (
  prompt: string,
  fileUrls: { url: string; mimeType: string }[],
  history: any[] = []
) => {
  try {
    const contents: any[] = [];

    // 1. Masukkan riwayat percakapan sebelumnya
    for (const msg of history) {
      contents.push({
        role: msg.role === "ai" ? "model" : "user",
        parts: [{ text: msg.content }]
      });
    }

    // 2. Siapkan bagian untuk pesan pengguna yang baru
    const currentMessageParts: any[] = [];
    currentMessageParts.push({ text: prompt });

    // Download files from URLs and convert to base64 inlineData
    for (const file of fileUrls) {
      try {
        const response = await fetch(file.url);
        const arrayBuffer = await response.arrayBuffer();
        const base64Data = Buffer.from(arrayBuffer).toString("base64");

        currentMessageParts.push({
          inlineData: {
            data: base64Data,
            mimeType: file.mimeType,
          },
        });
      } catch (err) {
        console.error("Gagal mendownload file dari Cloudinary untuk diteruskan ke Gemini:", err);
      }
    }

    // 3. Masukkan pesan baru pengguna ke array contents
    contents.push({
      role: "user",
      parts: currentMessageParts,
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.2,
        maxOutputTokens: 1024,
      }
    });

    const resultText = response.text || "";

    // Parse actionable insights from the response text
    let actionableInsights = null;
    let explanationText = resultText;

    const jsonMatch = resultText.match(/```json\s*(\{[\s\S]*?\})\s*```/);
    if (jsonMatch && jsonMatch[1]) {
      try {
        const parsed = JSON.parse(jsonMatch[1]);
        if (parsed.actionable_insights) {
          actionableInsights = parsed.actionable_insights;
          // Hapus bagian JSON dari teks utama agar tidak muncul dua kali di UI
          explanationText = resultText.replace(/```json\s*\{[\s\S]*?\}\s*```/, "").trim();
        }
      } catch (e) {
        console.error("Gagal mem-parsing JSON dari response Gemini", e);
      }
    }

    return {
      explanation: explanationText,
      actionableInsights: actionableInsights,
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Gagal menganalisis dokumen/pertanyaan dengan AI.");
  }
};

export const generateTitleFromPrompt = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Buat judul super singkat (maksimal 3-5 kata) untuk ini: "${prompt}"`,
      config: {
        systemInstruction: "Anda adalah bot pembuat judul otomatis. Aturan ketat: HANYA berikan teks judulnya saja. Dilarang keras menambahkan kata pengantar, penjelasan, tanda kutip, atau format markdown apa pun.",
        temperature: 0.1,
      }
    });

    // Filter tambahan untuk membuang kutip atau karakter markdown jika AI masih membandel
    let title = response.text?.trim().replace(/["*'#`]/g, '') || "Percakapan Baru";
    return title;
  } catch (error) {
    console.error("Gagal generate title AI:", error);
    return "Percakapan Baru";
  }
};
