import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "HeLaw API Documentation",
      version: "1.0.0",
      description: "Dokumentasi API resmi untuk Platform HeLaw - Pemandu Aturan UMKM.",
      contact: {
        name: "Madda Athia Rahman",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development Server",
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "jwt",
          description: "Autentikasi menggunakan JWT Token yang disimpan dalam HTTP-Only Cookie bernama `jwt`."
        }
      },
      schemas: {
        StandardSuccessResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            data: { type: "object" }
          }
        },
        StandardErrorResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string", example: "Pesan kesalahan spesifik" },
            error_code: { type: "string", example: "UNAUTHORIZED" }
          }
        },
        User: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid", example: "d3b07384-d113-4956-a5cc-be48842c40e6" },
            name: { type: "string", example: "Roti Maju Bersama" },
            email: { type: "string", format: "email", example: "roti@majubersama.com" },
            created_at: { type: "string", format: "date-time", example: "2026-05-23T12:00:00.000Z" }
          }
        },
        Conversation: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid", example: "c2e07894-e513-4256-b5cc-ce48842c70f9" },
            user_id: { type: "string", format: "uuid", example: "d3b07384-d113-4956-a5cc-be48842c40e6" },
            title: { type: "string", example: "Pertanyaan Izin PIRT Roti Basah" },
            created_at: { type: "string", format: "date-time", example: "2026-05-23T12:00:00.000Z" },
            updated_at: { type: "string", format: "date-time", example: "2026-05-23T12:05:00.000Z" }
          }
        },
        Message: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid", example: "m1a07894-e513-4256-b5cc-ce48842c70f9" },
            conversation_id: { type: "string", format: "uuid", example: "c2e07894-e513-4256-b5cc-ce48842c70f9" },
            role: { type: "string", enum: ["user", "ai"], example: "user" },
            content: { type: "string", example: "Apakah roti isi selai perlu izin PIRT?" },
            actionable_insights: { type: "array", items: { type: "string" }, nullable: true, example: ["Mengurus NIB di OSS terlebih dahulu"] },
            created_at: { type: "string", format: "date-time", example: "2026-05-23T12:01:00.000Z" },
            documents: {
              type: "array",
              items: {
                $ref: '#/components/schemas/Document'
              }
            }
          }
        },
        Document: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid", example: "d9e07894-e513-4256-b5cc-ce48842c70f9" },
            message_id: { type: "string", format: "uuid", example: "m1a07894-e513-4256-b5cc-ce48842c70f9" },
            file_url: { type: "string", example: "https://cloudinary.com/helaw/docs/xyz.pdf" },
            file_type: { type: "string", enum: ["pdf", "image"], example: "pdf" },
            file_name: { type: "string", example: "sertifikat_pirt.pdf" },
            created_at: { type: "string", format: "date-time", example: "2026-05-23T12:01:00.000Z" }
          }
        }
      }
    },
    security: [
      {
        cookieAuth: []
      }
    ]
  },
  apis: ["./src/routes/*.ts", "./src/config/swagger.ts", "./dist/routes/*.js"]
};

export const swaggerSpec = swaggerJsdoc(options);
