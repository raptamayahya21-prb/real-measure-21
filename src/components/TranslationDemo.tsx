import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, ArrowRight } from 'lucide-react';
import { translateToEnglish } from '../lib/localTranslator';

const TranslationDemo = () => {
    const [input, setInput] = useState('Halo, selamat datang di aplikasi Real Measure.');
    const [output, setOutput] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('');

    const handleTranslate = async () => {
        setLoading(true);
        setStatus('Memuat model AI (bisa lama di awal)...');
        try {
            const result = await translateToEnglish(input);
            setOutput(result);
            setStatus('Selesai!');
        } catch (e) {
            console.error(e);
            setStatus('Error: Gagal memuat model.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid gap-3 p-3 bg-white rounded-lg border border-slate-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                    <label className="text-xs font-bold text-slate-500 mb-1 block">Indonesia (Input)</label>
                    <Textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="text-sm min-h-[80px]"
                        placeholder="Ketik sesuatu..."
                    />
                </div>
                <div className="relative">
                    <label className="text-xs font-bold text-slate-500 mb-1 block">English (Output)</label>
                    <div className="p-2 text-sm bg-slate-50 border rounded-md min-h-[80px] text-slate-700">
                        {output || <span className="text-slate-400 italic">Hasil terjemahan muncul di sini...</span>}
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-center">
                <span className="text-[10px] text-slate-400">{status}</span>
                <Button
                    onClick={handleTranslate}
                    disabled={loading || !input}
                    size="sm"
                    className="bg-dashboard-accent text-white"
                >
                    {loading ? <Loader2 className="w-3 h-3 animate-spin mr-2" /> : <ArrowRight className="w-3 h-3 mr-2" />}
                    Translate Now
                </Button>
            </div>
        </div>
    );
};

export default TranslationDemo;
