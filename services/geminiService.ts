import { GoogleGenAI } from "@google/genai";
import { Transaction } from "../types";

// Ultra-safe environment variable access
// This prevents "ReferenceError: process is not defined" in browser runtimes (Vercel/Vite/etc)
const getApiKey = (): string | undefined => {
  try {
    // Check if 'process' exists globally before accessing it
    if (typeof process === 'undefined') return undefined;
    // Check if 'process.env' exists
    if (!process.env) return undefined;
    
    return process.env.API_KEY;
  } catch (e) {
    // If anything fails during access, return undefined safely
    return undefined;
  }
};

const getClient = () => {
    const apiKey = getApiKey();
    if (!apiKey) {
        console.warn("API_KEY is missing in environment variables. Gemini features will be disabled.");
        return null;
    }
    return new GoogleGenAI({ apiKey });
};

export const generateProductDescription = async (productName: string, category: string): Promise<string> => {
    try {
        const ai = getClient();
        if (!ai) return "Fitur AI memerlukan API Key (process.env.API_KEY).";

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
        return "Gagal menghubungi layanan AI.";
    }
};

export const analyzeSalesTrend = async (transactions: Transaction[]): Promise<string> => {
    try {
        const ai = getClient();
        if (!ai) return "Fitur analisis memerlukan API Key.";
        
        if (transactions.length === 0) return "Belum ada data transaksi.";

        // Summarize data to save tokens and prevent huge payloads
        const dataSummary = JSON.stringify(transactions.slice(-10).map(t => ({ total: t.total, date: t.date }))); 
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