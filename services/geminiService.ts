import { GoogleGenAI } from "@google/genai";
import { Product } from "../types";

const getClient = () => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        console.warn("API_KEY is missing. Gemini features will be disabled.");
        throw new Error("API Key missing");
    }
    return new GoogleGenAI({ apiKey });
};

export const generateProductDescription = async (productName: string, category: string): Promise<string> => {
    try {
        const ai = getClient();
        const prompt = `Buatkan deskripsi produk singkat, menarik, dan informatif (maksimal 2 kalimat) untuk toko alat pancing. 
        Produk: ${productName}. 
        Kategori: ${category}. 
        Jelaskan kegunaannya untuk memancing jenis ikan apa atau di kondisi air apa. Bahasa Indonesia.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text?.trim() || "Deskripsi tidak dapat dibuat.";
    } catch (error) {
        console.error("Gemini Error (Product Description):", error);
        return "Fitur AI tidak tersedia (Cek API Key).";
    }
};

export const analyzeSalesTrend = async (transactions: any[]): Promise<string> => {
    try {
        const ai = getClient();
        if (transactions.length === 0) return "Belum ada data transaksi.";

        const dataSummary = JSON.stringify(transactions.slice(-5).map(t => ({ total: t.total, date: t.date }))); 
        const prompt = `Bertindak sebagai analis bisnis retail alat pancing. Berikut adalah data transaksi terakhir (JSON): ${dataSummary}. 
        Berikan 1 kalimat saran strategis singkat, padat, dan actionable untuk meningkatkan penjualan minggu depan. Bahasa Indonesia.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text?.trim() || "Tidak ada saran saat ini.";
    } catch (error) {
        console.error("Gemini Error (Sales Analysis):", error);
        return "Analisis pasar sedang tidak tersedia.";
    }
}