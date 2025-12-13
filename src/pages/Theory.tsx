
import React, { useState, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import NumberLine from '../components/NumberLine';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen, Calculator, Sigma, Info, Scale, ListOrdered } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

// --- INDONESIAN CONTENT (ORIGINAL) ---
const TOPICS_ID = [
    {
        id: 'real-numbers',
        title: 'Bilangan Real (ℝ)',
        desc: 'Semua bilangan yang bisa kamu bayangkan di garis bilangan.',
        icon: Calculator,
        color: 'bg-blue-500',
        content: (
            <div className="space-y-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <p className="text-lg font-medium text-blue-800 dark:text-blue-300">
                        Apa itu Bilangan Real?
                    </p>
                    <p className="mt-2 text-slate-700 dark:text-slate-300">
                        Bayangkan sebuah garis panjang tanpa putus. Setiap titik di garis itu adalah <strong>Bilangan Real</strong>.
                        Ini mencakup hampir semua angka yang kamu kenal sehari-hari.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border p-4 rounded-lg">
                        <h4 className="font-bold text-green-600 mb-2">1. Bilangan Rasional (Masuk Akal)</h4>
                        <p className="text-sm mb-2">Bilangan yang bisa ditulis sebagai pecahan (a/b) atau desimal yang berhenti/berulang.</p>
                        <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded text-sm font-mono">
                            Contoh: 5, -2, 0.5 (setengah), 1/3 (0.333...)
                        </div>
                    </div>
                    <div className="border p-4 rounded-lg">
                        <h4 className="font-bold text-orange-600 mb-2">2. Bilangan Irasional (Unik)</h4>
                        <p className="text-sm mb-2">Bilangan yang desimalnya tidak pernah habis dan tidak berulang pola.</p>
                        <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded text-sm font-mono">
                            Contoh: π (3.14159...), √2 (1.414...)
                        </div>
                    </div>
                </div>

                <div>
                    <h4 className="font-bold mb-2">Sifat Penting (Disederhanakan):</h4>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-2">
                        <li><strong>Padat:</strong> Di antara dua bilangan real (misal 1 dan 2), selalu ada bilangan lain (misal 1.5). Tidak ada celah!</li>
                        <li><strong>Lengkap:</strong> Garis bilangannya "penuh", tidak ada bolong-bolong.</li>
                    </ul>
                </div>
            </div>
        )
    },
    {
        id: 'interval',
        title: 'Interval (Selang)',
        desc: 'Cara menulis rentang angka.',
        icon: Scale,
        color: 'bg-green-500',
        interactive: true
    },
    {
        id: 'sup-inf',
        title: 'Supremum & Infimum',
        desc: 'Batas Atas & Batas Bawah.',
        icon: Sigma,
        color: 'bg-orange-500',
        content: (
            <div className="space-y-6">
                <p>Bayangkan kamu punya sekumpulan angka. Kamu ingin tahu "pagar" paling dekat yang membatasi angka-angka itu.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <h4 className="font-bold text-orange-600 text-lg">Supremum (Sup)</h4>
                        <p className="text-sm">Adalah <strong>Batas Atas Terkecil</strong>. </p>
                        <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg border border-orange-100">
                            <p className="text-sm font-semibold mb-1">Contoh Sederhana:</p>
                            <p className="text-sm">Himpunan A = {`{ 1, 2, 3 }`}</p>
                            <p className="text-sm mt-1">Batas atasnya bisa 3, 4, 5, 100... (semua lebih besar dari A).</p>
                            <p className="text-sm font-bold mt-1 text-orange-700">Supremum = 3 (Paling mepet)</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h4 className="font-bold text-blue-600 text-lg">Infimum (Inf)</h4>
                        <p className="text-sm">Adalah <strong>Batas Bawah Terbesar</strong>.</p>
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-100">
                            <p className="text-sm font-semibold mb-1">Contoh Interval:</p>
                            <p className="text-sm">Interval B = (0, 5) -- angka antara 0 sampai 5.</p>
                            <p className="text-sm mt-1">Angka 0 tidak masuk (karena kurung biasa), tapi 0 adalah batasnya.</p>
                            <p className="text-sm font-bold mt-1 text-blue-700">Infimum = 0</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    },
    {
        id: 'epsilon',
        title: 'Epsilon (ε)',
        desc: 'Jarak yang sangat kecil (Error).',
        icon: Info,
        color: 'bg-red-500',
        content: (
            <div className="space-y-6">
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <p className="leading-relaxed">
                        Dalam matematika, <strong>Epsilon (ε)</strong> sering dipakai untuk melambangkan <strong>"kesalahan kecil"</strong> atau <strong>"jarak yang sangat dekat"</strong>.
                    </p>
                </div>

                <div>
                    <h4 className="font-bold mb-2 flex items-center gap-2">
                        <Calculator className="w-4 h-4" />
                        Contoh di Kehidupan Nyata:
                    </h4>
                    <p className="mb-4 text-sm text-muted-foreground">
                        Bayangkan kamu mengukur meja. Panjang aslinya 100 cm.
                    </p>
                    <ul className="space-y-3">
                        <li className="flex items-start gap-3 p-3 border rounded-lg bg-red-50/50">
                            <div className="font-bold text-red-500">❌</div>
                            <div className="text-sm">
                                Kamu mengukur dapat <strong>105 cm</strong>. Errornya besar (5 cm).
                            </div>
                        </li>
                        <li className="flex items-start gap-3 p-3 border rounded-lg bg-green-50/50">
                            <div className="font-bold text-green-500">✅</div>
                            <div className="text-sm">
                                Kamu mengukur dapat <strong>100.1 cm</strong>. Errornya sangat kecil (0.1 cm).
                                <br />Di sini, kita bisa bilang <strong>ε = 0.1</strong>.
                            </div>
                        </li>
                    </ul>
                </div>

                <div className="mt-4 p-4 border border-dashed border-red-300 rounded bg-red-50 text-red-800 text-sm">
                    <strong>Hubungan dengan Aplikasi Ini:</strong><br />
                    Saat kamu mengukur pakai AR, makin kecil "Epsilon" (selisih ukuran AR vs Penggaris asli), makin jago kamu mengukurnya!
                </div>
            </div>
        )
    },
    {
        id: 'field',
        title: 'Sifat Dasar Hitungan',
        desc: 'Cara angka berinteraksi (+ dan ×).',
        icon: BookOpen,
        color: 'bg-indigo-500',
        content: (
            <div className="space-y-6">
                <p>Bilangan Real punya aturan main yang "konsisten". Ini disebut Sifat Lapangan (Field).</p>

                <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center gap-4 p-3 border rounded-lg hover:bg-slate-50 transition-colors">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-600">1</div>
                        <div>
                            <h4 className="font-bold text-sm">Komutatif (Tukar Tempat)</h4>
                            <p className="text-xs text-muted-foreground">Posisi tidak masalah.</p>
                            <p className="text-sm font-mono mt-1 text-slate-600">2 + 3 = 5 <span className="mx-2">sama dengan</span> 3 + 2 = 5</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 p-3 border rounded-lg hover:bg-slate-50 transition-colors">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-600">2</div>
                        <div>
                            <h4 className="font-bold text-sm">Asosiatif (Pengelompokan)</h4>
                            <p className="text-xs text-muted-foreground">Urutan kerja tidak masalah.</p>
                            <p className="text-sm font-mono mt-1 text-slate-600">(1 + 2) + 3 <span className="mx-2">sama dengan</span> 1 + (2 + 3)</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 p-3 border rounded-lg hover:bg-slate-50 transition-colors">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-600">3</div>
                        <div>
                            <h4 className="font-bold text-sm">Distributif (Penyebaran)</h4>
                            <p className="text-xs text-muted-foreground">Perkalian masuk ke penjumlahan.</p>
                            <p className="text-sm font-mono mt-1 text-slate-600">2 × (3 + 4) <span className="mx-2">sama dengan</span> (2×3) + (2×4)</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    },
    {
        id: 'order',
        title: 'Urutan & Nilai Mutlak',
        desc: 'Siapa lebih besar? Berapa jaraknya?',
        icon: ListOrdered,
        color: 'bg-purple-500',
        content: (
            <div className="space-y-6">
                <div className="space-y-2">
                    <h4 className="font-bold flex items-center gap-2">
                        <Scale className="w-4 h-4" />
                        Sifat Trikotomi (Hanya ada 3 kemungkinan)
                    </h4>
                    <p className="text-sm text-muted-foreground">Kalau kamu ambil dua angka sembarang (misal A dan B), pasti berlaku salah satu:</p>
                    <div className="flex justify-around items-center p-4 bg-purple-50 rounded-lg font-mono text-purple-900 font-bold">
                        <div>A &lt; B</div>
                        <div className="text-slate-400 font-normal text-xs">atau</div>
                        <div>A = B</div>
                        <div className="text-slate-400 font-normal text-xs">atau</div>
                        <div>A &gt; B</div>
                    </div>
                </div>

                <div className="border-t pt-4 space-y-2">
                    <h4 className="font-bold">Nilai Mutlak |x|</h4>
                    <p className="text-sm">Nilai mutlak artinya <strong>"Jarak dari Nol"</strong>. Jarak tidak pernah negatif.</p>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                        <div className="text-center p-2 border rounded bg-slate-50">
                            <p className="text-xs text-slate-500">Contoh 1</p>
                            <p className="font-mono font-bold">|5| = 5</p>
                            <p className="text-[10px] text-slate-400">Jarak 5 ke 0 adalah 5 langkah.</p>
                        </div>
                        <div className="text-center p-2 border rounded bg-slate-50">
                            <p className="text-xs text-slate-500">Contoh 2</p>
                            <p className="font-mono font-bold">|-5| = 5</p>
                            <p className="text-[10px] text-slate-400">Jarak -5 ke 0 juga 5 langkah.</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
];

// --- ENGLISH CONTENT (NEW) ---
const TOPICS_EN = [
    {
        id: 'real-numbers',
        title: 'Real Numbers (ℝ)',
        desc: 'All numbers you can imagine on a number line.',
        icon: Calculator,
        color: 'bg-blue-500',
        content: (
            <div className="space-y-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <p className="text-lg font-medium text-blue-800 dark:text-blue-300">
                        What are Real Numbers?
                    </p>
                    <p className="mt-2 text-slate-700 dark:text-slate-300">
                        Imagine a long continuous line. Every point on that line is a <strong>Real Number</strong>.
                        It includes almost every number you use in daily life.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border p-4 rounded-lg">
                        <h4 className="font-bold text-green-600 mb-2">1. Rational Numbers (Make Sense)</h4>
                        <p className="text-sm mb-2">Numbers that can be written as fractions (a/b) or terminating/repeating decimals.</p>
                        <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded text-sm font-mono">
                            Example: 5, -2, 0.5 (half), 1/3 (0.333...)
                        </div>
                    </div>
                    <div className="border p-4 rounded-lg">
                        <h4 className="font-bold text-orange-600 mb-2">2. Irrational Numbers (Unique)</h4>
                        <p className="text-sm mb-2">Numbers with decimals that go on forever without a pattern.</p>
                        <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded text-sm font-mono">
                            Example: π (3.14159...), √2 (1.414...)
                        </div>
                    </div>
                </div>

                <div>
                    <h4 className="font-bold mb-2">Key Properties (Simplified):</h4>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-2">
                        <li><strong>Dense:</strong> Between any two real numbers (e.g., 1 and 2), there is always another number (e.g., 1.5). No gaps!</li>
                        <li><strong>Complete:</strong> The number line is "full", no holes.</li>
                    </ul>
                </div>
            </div>
        )
    },
    {
        id: 'interval',
        title: 'Intervals',
        desc: 'How to write ranges of numbers.',
        icon: Scale,
        color: 'bg-green-500',
        interactive: true
    },
    {
        id: 'sup-inf',
        title: 'Supremum & Infimum',
        desc: 'Upper Bounds & Lower Bounds.',
        icon: Sigma,
        color: 'bg-orange-500',
        content: (
            <div className="space-y-6">
                <p>Imagine a set of numbers. You want to know the "closest fence" that bounds them.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <h4 className="font-bold text-orange-600 text-lg">Supremum (Sup)</h4>
                        <p className="text-sm">Is the <strong>Least Upper Bound</strong>. </p>
                        <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg border border-orange-100">
                            <p className="text-sm font-semibold mb-1">Simple Example:</p>
                            <p className="text-sm">Set A = {`{ 1, 2, 3 }`}</p>
                            <p className="text-sm mt-1">Upper bounds could be 3, 4, 5, 100... (all greater than A).</p>
                            <p className="text-sm font-bold mt-1 text-orange-700">Supremum = 3 (Tightest)</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h4 className="font-bold text-blue-600 text-lg">Infimum (Inf)</h4>
                        <p className="text-sm">Is the <strong>Greatest Lower Bound</strong>.</p>
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-100">
                            <p className="text-sm font-semibold mb-1">Interval Example:</p>
                            <p className="text-sm">Interval B = (0, 5) -- numbers between 0 and 5.</p>
                            <p className="text-sm mt-1">0 is not included (parentheses), but 0 is the boundary.</p>
                            <p className="text-sm font-bold mt-1 text-blue-700">Infimum = 0</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    },
    {
        id: 'epsilon',
        title: 'Epsilon (ε)',
        desc: 'A very small distance (Error).',
        icon: Info,
        color: 'bg-red-500',
        content: (
            <div className="space-y-6">
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <p className="leading-relaxed">
                        In mathematics, <strong>Epsilon (ε)</strong> is often used to represent <strong>"tiny error"</strong> or <strong>"very short distance"</strong>.
                    </p>
                </div>

                <div>
                    <h4 className="font-bold mb-2 flex items-center gap-2">
                        <Calculator className="w-4 h-4" />
                        Real World Example:
                    </h4>
                    <p className="mb-4 text-sm text-muted-foreground">
                        Imagine measuring a table. The real length is 100 cm.
                    </p>
                    <ul className="space-y-3">
                        <li className="flex items-start gap-3 p-3 border rounded-lg bg-red-50/50">
                            <div className="font-bold text-red-500">❌</div>
                            <div className="text-sm">
                                You measure and get <strong>105 cm</strong>. Big error (5 cm).
                            </div>
                        </li>
                        <li className="flex items-start gap-3 p-3 border rounded-lg bg-green-50/50">
                            <div className="font-bold text-green-500">✅</div>
                            <div className="text-sm">
                                You measure and get <strong>100.1 cm</strong>. Very small error (0.1 cm).
                                <br />Here, we can say <strong>ε = 0.1</strong>.
                            </div>
                        </li>
                    </ul>
                </div>

                <div className="mt-4 p-4 border border-dashed border-red-300 rounded bg-red-50 text-red-800 text-sm">
                    <strong>Relation to this App:</strong><br />
                    When measuring with AR, the smaller the "Epsilon" (difference between AR vs Ruler), the better your measurement!
                </div>
            </div>
        )
    },
    {
        id: 'field',
        title: 'Field Properties',
        desc: 'How numbers interact (+ and ×).',
        icon: BookOpen,
        color: 'bg-indigo-500',
        content: (
            <div className="space-y-6">
                <p>Real numbers have "consistent" rules. These are called Field Properties.</p>

                <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center gap-4 p-3 border rounded-lg hover:bg-slate-50 transition-colors">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-600">1</div>
                        <div>
                            <h4 className="font-bold text-sm">Commutative (Swap)</h4>
                            <p className="text-xs text-muted-foreground">Order doesn't matter.</p>
                            <p className="text-sm font-mono mt-1 text-slate-600">2 + 3 = 5 <span className="mx-2">equals</span> 3 + 2 = 5</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 p-3 border rounded-lg hover:bg-slate-50 transition-colors">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-600">2</div>
                        <div>
                            <h4 className="font-bold text-sm">Associative (Grouping)</h4>
                            <p className="text-xs text-muted-foreground">Grouping doesn't matter.</p>
                            <p className="text-sm font-mono mt-1 text-slate-600">(1 + 2) + 3 <span className="mx-2">equals</span> 1 + (2 + 3)</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 p-3 border rounded-lg hover:bg-slate-50 transition-colors">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-600">3</div>
                        <div>
                            <h4 className="font-bold text-sm">Distributive (Spreading)</h4>
                            <p className="text-xs text-muted-foreground">Multiplication distributes over addition.</p>
                            <p className="text-sm font-mono mt-1 text-slate-600">2 × (3 + 4) <span className="mx-2">equals</span> (2×3) + (2×4)</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    },
    {
        id: 'order',
        title: 'Order & Absolute Value',
        desc: 'Who is bigger? How far is it?',
        icon: ListOrdered,
        color: 'bg-purple-500',
        content: (
            <div className="space-y-6">
                <div className="space-y-2">
                    <h4 className="font-bold flex items-center gap-2">
                        <Scale className="w-4 h-4" />
                        Trichotomy Property (Only 3 possibilities)
                    </h4>
                    <p className="text-sm text-muted-foreground">If you pick two numbers (e.g., A and B), one condition must be true:</p>
                    <div className="flex justify-around items-center p-4 bg-purple-50 rounded-lg font-mono text-purple-900 font-bold">
                        <div>A &lt; B</div>
                        <div className="text-slate-400 font-normal text-xs">or</div>
                        <div>A = B</div>
                        <div className="text-slate-400 font-normal text-xs">or</div>
                        <div>A &gt; B</div>
                    </div>
                </div>

                <div className="border-t pt-4 space-y-2">
                    <h4 className="font-bold">Absolute Value |x|</h4>
                    <p className="text-sm">Absolute value means <strong>"Distance from Zero"</strong>. Distance is never negative.</p>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                        <div className="text-center p-2 border rounded bg-slate-50">
                            <p className="text-xs text-slate-500">Example 1</p>
                            <p className="font-mono font-bold">|5| = 5</p>
                            <p className="text-[10px] text-slate-400">Distance from 5 to 0 is 5 steps.</p>
                        </div>
                        <div className="text-center p-2 border rounded bg-slate-50">
                            <p className="text-xs text-slate-500">Example 2</p>
                            <p className="font-mono font-bold">|-5| = 5</p>
                            <p className="text-[10px] text-slate-400">Distance from -5 to 0 is also 5 steps.</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
];

const Theory = () => {
    const { language, t } = useLanguage();
    const [activeTopic, setActiveTopic] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'menu' | 'topic' | 'all'>('menu');

    // NumberLine state
    const [mode, setMode] = useState<'integer' | 'whole' | 'real'>('real');
    const [operator, setOperator] = useState<'>' | '<' | '>=' | '<='>('(');
    const [value, setValue] = useState<number>(2);

    // Compute active topics based on language
    const TOPICS = useMemo(() => {
        return language === 'en' ? TOPICS_EN : TOPICS_ID;
    }, [language]);

    const handleBack = () => {
        setActiveTopic(null);
        setViewMode('menu');
    };

    return (
        <div className="pb-20">
            <AnimatePresence mode="wait">

                {viewMode === 'menu' && (
                    <motion.div
                        key="menu"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="text-center space-y-4 mb-12 relative">
                            <h1 className="text-4xl font-bold tracking-tight text-foreground">
                                {language === 'en' ? 'Real Number Concepts' : 'Konsep Bilangan Real'}
                            </h1>
                            <p className="text-muted-foreground max-w-2xl mx-auto">
                                {language === 'en' ? 'Learn the basics of real analysis through interactive modules.' : 'Pelajari dasar-dasar analisis real melalui modul interaktif.'}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {TOPICS.map((topic, i) => (
                                <Card
                                    key={topic.id}
                                    onClick={() => {
                                        setActiveTopic(topic.id);
                                        setViewMode('topic');
                                    }}
                                    className="p-6 cursor-pointer hover:shadow-lg transition-all duration-300 group border-slate-200 bg-white shadow-sm relative overflow-hidden"
                                >
                                    <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-slate-100 to-transparent opacity-50 rounded-bl-full transition-transform group-hover:scale-110`} />

                                    <div className="flex flex-col h-full space-y-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${topic.color} shadow-lg mb-2`}>
                                            <topic.icon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors text-dashboard-text">{topic.title}</h3>
                                            <p className="text-sm text-dashboard-text-muted leading-relaxed">{topic.desc}</p>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                        <div className="mt-12 text-center">

                            <Button variant="default" size="lg" className="rounded-full px-8 shadow-xl shadow-primary/20" onClick={() => setViewMode('all')}>
                                {t('btn.open', 'Buka Semua Materi')}
                            </Button>
                        </div>
                    </motion.div>
                )}

                {viewMode === 'topic' && activeTopic && (
                    <motion.div
                        key="content"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="max-w-4xl mx-auto"
                    >
                        <Button variant="ghost" onClick={handleBack} className="mb-6 gap-2 pl-0 hover:bg-transparent hover:text-primary">
                            <ArrowLeft className="w-4 h-4" /> {t('btn.back')}
                        </Button>

                        <div className="space-y-6">
                            <div className="flex items-center gap-4 mb-8">
                                {TOPICS.find(t => t.id === activeTopic)?.icon && (
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${TOPICS.find(t => t.id === activeTopic)?.color} shadow-lg`}>
                                        {React.createElement(TOPICS.find(t => t.id === activeTopic)!.icon, { className: 'w-6 h-6' })}
                                    </div>
                                )}
                                <div>
                                    <h1 className="text-3xl font-bold">{TOPICS.find(t => t.id === activeTopic)?.title}</h1>
                                    <p className="text-muted-foreground">{TOPICS.find(t => t.id === activeTopic)?.desc}</p>
                                </div>
                            </div>

                            <Card className="p-8 bg-white border-slate-200 shadow-sm min-h-[400px]">
                                {activeTopic === 'interval' ? (
                                    <div className="space-y-8">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Domain</label>
                                                <Select value={mode} onValueChange={(v: any) => setMode(v)}>
                                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="real">Real (R)</SelectItem>
                                                        <SelectItem value="integer">{language === 'en' ? 'Integer (Z)' : 'Bulat (Z)'}</SelectItem>
                                                        <SelectItem value="whole">{language === 'en' ? 'Whole (W)' : 'Cacah (W)'}</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Notation</label>
                                                <div className="flex gap-2">
                                                    <Select value={operator} onValueChange={(v: any) => setOperator(v)}>
                                                        <SelectTrigger className="w-[80px]"><SelectValue /></SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value=">">{'>'}</SelectItem>
                                                            <SelectItem value="<">{'<'}</SelectItem>
                                                            <SelectItem value=">=">{'≥'}</SelectItem>
                                                            <SelectItem value="<=">{'≤'}</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <Input
                                                        type="number"
                                                        value={value}
                                                        onChange={(e) => setValue(Number(e.target.value))}
                                                        className="flex-1"
                                                    />
                                                </div>
                                            </div>
                                            {/* Visual helper text */}
                                            <div className="flex items-end pb-2">
                                                <div className="text-lg font-mono text-primary font-bold">
                                                    {`{ x | x ∈ ${mode === 'whole' ? (language === 'en' ? 'Whole' : 'Cacah') : mode === 'integer' ? 'Z' : 'R'}, x ${operator} ${value} }`}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="pt-8 border-t border-slate-100">
                                            <NumberLine type={mode} condition={{ operator, value }} />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="prose prose-blue max-w-none text-slate-600">
                                        {TOPICS.find(t => t.id === activeTopic)?.content}
                                    </div>
                                )}
                            </Card>
                        </div>
                    </motion.div>

                )}

                {viewMode === 'all' && (
                    <motion.div
                        key="all-content"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        className="max-w-4xl mx-auto"
                    >
                        <Button variant="ghost" onClick={handleBack} className="mb-6 gap-2 pl-0 hover:bg-transparent hover:text-primary sticky top-20 z-10 backdrop-blur-sm bg-background/50 py-2 rounded-lg">
                            <ArrowLeft className="w-4 h-4" /> {t('btn.back')}
                        </Button>

                        <div className="space-y-12 pb-20">
                            <div className="text-center mb-10">
                                <h2 className="text-3xl font-bold">
                                    {language === 'en' ? 'All Real Number Topics' : 'Semua Materi Bilangan Real'}
                                </h2>
                                <p className="text-muted-foreground">
                                    {language === 'en' ? 'Complete summary of properties and concepts.' : 'Ringkasan lengkap konsep dan sifat-sifat.'}
                                </p>
                            </div>

                            {TOPICS.map((topic, index) => (
                                <div key={topic.id} className="scroll-mt-24" id={topic.id}>
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white ${topic.color} shadow-md`}>
                                            <topic.icon className="w-5 h-5" />
                                        </div>
                                        <h3 className="text-2xl font-bold">{topic.title}</h3>
                                    </div>
                                    <Card className="p-6 bg-dashboard-card border-white/10 shadow-sm">
                                        {topic.id === 'interval' ? (
                                            <div className="space-y-8">
                                                {/* Reusing Interval Logic directly here for simplification */}
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-medium">Domain</label>
                                                        <Select value={mode} onValueChange={(v: any) => setMode(v)}>
                                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="real">Real (R)</SelectItem>
                                                                <SelectItem value="integer">{language === 'en' ? 'Integer (Z)' : 'Bulat (Z)'}</SelectItem>
                                                                <SelectItem value="whole">{language === 'en' ? 'Whole (W)' : 'Cacah (W)'}</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-medium">Notation</label>
                                                        <div className="flex gap-2">
                                                            <Select value={operator} onValueChange={(v: any) => setOperator(v)}>
                                                                <SelectTrigger className="w-[80px]"><SelectValue /></SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value=">">{'>'}</SelectItem>
                                                                    <SelectItem value="<">{'<'}</SelectItem>
                                                                    <SelectItem value=">=">{'≥'}</SelectItem>
                                                                    <SelectItem value="<=">{'≤'}</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                            <Input
                                                                type="number"
                                                                value={value}
                                                                onChange={(e) => setValue(Number(e.target.value))}
                                                                className="flex-1"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="flex items-end pb-2">
                                                        <div className="text-lg font-mono text-primary font-bold">
                                                            {`{ x | x ∈ ${mode === 'whole' ? (language === 'en' ? 'Whole' : 'Cacah') : mode === 'integer' ? 'Z' : 'R'}, x ${operator} ${value} }`}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="pt-8 border-t">
                                                    <NumberLine type={mode} condition={{ operator, value }} />
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="prose prose-blue max-w-none">
                                                {topic.content}
                                            </div>
                                        )}
                                    </Card>
                                    {index < TOPICS.length - 1 && <div className="my-12 border-t border-border/50" />}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}


            </AnimatePresence>
        </div>
    );
};

export default Theory;
