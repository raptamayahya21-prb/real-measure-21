
// Mock translation service simulating Google Cloud Translate
// In a real app, this would fetch from an API endpoint

export const translateText = async (text: string, targetLang: string): Promise<string> => {
    console.log(`[Mock Translate] Translating "${text}" to ${targetLang}`);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Simple mock logic for demo purposes
    if (targetLang === 'en') {
        if (text.includes("Bilangan")) return text.replace("Bilangan", "Number");
        return text + " (EN)";
    }
    if (targetLang === 'id') {
        return text.replace(" (EN)", "");
    }
    return text;
};
