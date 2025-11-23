import { prisma } from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { query } = await request.json();

        if (!query) {
            return NextResponse.json({ error: "Query is required" }, { status: 400 });
        }

        // 1. Perform Keyword Search on Sections
        const sections = await prisma.section.findMany({
            where: {
                OR: [
                    { title: { contains: query } }, // Removed mode: 'insensitive' for SQLite compatibility if needed, but Prisma usually handles it. 
                    // SQLite default is case-insensitive for ASCII characters in LIKE.
                    // For full text search we might need a different approach but 'contains' is good for now.
                    { content: { contains: query } },
                ],
            },
            include: {
                chapter: true,
            },
            take: 5, // Limit results
        });

        // 2. Generate AI Answer using Gemini
        let aiAnswer = null;
        const apiKey = process.env.GEMINI_API_KEY;

        if (apiKey) {
            try {
                const genAI = new GoogleGenerativeAI(apiKey);
                const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

                // Construct context from found sections
                const context = sections.map(s => `Section ${s.number} (${s.title}): ${s.content}`).join("\n\n");

                const prompt = `
          You are a helpful legal assistant for the Digital Personal Data Protection Act, 2023.
          Answer the user's question based ONLY on the following context from the Act.
          If the answer is not in the context, say "I couldn't find specific information about that in the relevant sections found."
          
          Context:
          ${context}
          
          User Question: ${query}
          
          Answer:
        `;

                const result = await model.generateContent(prompt);
                const response = await result.response;
                aiAnswer = response.text();
            } catch (aiError) {
                console.error("Gemini API Error:", aiError);
                // Don't fail the whole request if AI fails
            }
        }

        return NextResponse.json({
            sections,
            aiAnswer,
        });

    } catch (error) {
        console.error("Search Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
