import { pipeline, env } from '@xenova/transformers';

/**
 * KONFIGURASI TRANSLATOR
 * Library: @xenova/transformers
 * Model: Helsinki-NLP/opus-mt-id-en (Indonesian to English)
 * 
 * SETUP:
 * Jalankan perintah: npm install @xenova/transformers
 */

// Konfigurasi Environment (Opsional, sesuaikan dengan kebutuhan project)
// env.allowLocalModels = false; // Paksa ambil dari CDN jika belum ada local server
// env.useBrowserCache = true;   // Cache model di browser (IndexedDB)

// Singleton instance untuk pipeline agar tidak load model berkali-kali
let translatorPipeline: any = null;

// Nama model di Hugging Face
const MODEL_NAME = 'Helsinki-NLP/opus-mt-id-en';

/**
 * 1. INISIALISASI MODEL
 * Fungsi ini akan mendownload model (~300MB) pada saat pertama kali dijalankan.
 * Setelah itu model akan disimpan di cache browser.
 */
export const initModel = async () => {
    if (translatorPipeline) {
        return translatorPipeline;
    }

    try {
        console.log(`⏳ Memuat model translation: ${MODEL_NAME}...`);

        // Membuat pipeline translation
        translatorPipeline = await pipeline('translation', MODEL_NAME);

        console.log('✅ Model berhasil dimuat!');
        return translatorPipeline;
    } catch (error) {
        console.error('❌ Gagal memuat model:', error);
        throw new Error(`Gagal memuat model. Pastikan koneksi internet tersedia untuk unduhan awal. Detail: ${error}`);
    }
};

/**
 * 2. FUNGSI TRANSLATE UTAMA
 * Menerjemahkan teks Indonesia -> Inggris
 * @param text Teks dalam bahasa Indonesia
 * @returns Promise<string> Teks dalam bahasa Inggris
 */
export const translateToEnglish = async (text: string): Promise<string> => {
    // Validasi input
    if (!text || text.trim() === '') return '';

    try {
        // Pastikan model sudah siap
        const pipe = await initModel();

        // Jalankan proses translasi
        // Output dari pipeline adalah array of objects: [{ translation_text: "..." }]
        const result = await pipe(text);

        // Ambil hasil teks
        if (result && result.length > 0 && result[0].translation_text) {
            return result[0].translation_text;
        }

        return text; // Fallback jika hasil kosong
    } catch (error) {
        console.error('❌ Error saat menerjemahkan:', error);
        // Bisa lempar error atau return teks asli tergantung kebutuhan UI
        return text;
    }
};

// --- 3. CONTOH PENGGUNAAN & INTEGRASI WEB ---

/**
 * Contoh cara menggunakan fungsi di atas dalam komponen React atau Script biasa:
 * 
 * Contoh Skenario: Menerjemahkan kalimat "Halo, apa kabar?"
 * 
 * ```typescript
 * import { translateToEnglish } from './lib/localTranslator';
 * 
 * async function demoTranslation() {
 *    const input = "Halo, apa kabar?";
 *    console.log("Input:", input);
 *    
 *    const output = await translateToEnglish(input);
 *    console.log("Output:", output); 
 *    // Hasil: "Hello, how are you?"
 * }
 * ```
 */

/**
 * Contoh Integrasi DOM (Vanilla JS / HTML Logic):
 * 
 * ```typescript
 * async function translatePageContent() {
 *    const paragraph = document.getElementById('my-paragraph');
 *    const button = document.getElementById('btn-translate');
 * 
 *    if (paragraph && button) {
 *        button.innerText = "Sedang menerjemahkan...";
 *        button.disabled = true;
 * 
 *        // Ambil teks
 *        const originalText = paragraph.innerText;
 * 
 *        // Translate
 *        const translatedText = await translateToEnglish(originalText);
 * 
 *        // Update UI
 *        paragraph.innerText = translatedText;
 *        button.innerText = "Selesai!";
 *        button.disabled = false;
 *    }
 * }
 * ```
 */

/*
   OPTIMASI & BATASAN:
   1. Initial Load: Pengguna akan mendownload data besar (~100-300MB) di pertama kali.
      - Solusi: Tampilkan Progress Bar saat loading model.
   2. Performance: Berat di HP low-end. Gunakan Web Worker agar UI tidak freeze.
   3. Akurasi: Model ini generic, mungkin kurang akurat untuk bahasa gaul atau istilah teknis spesifik.
*/
