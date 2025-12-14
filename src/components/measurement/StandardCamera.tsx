import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, Settings, Check, Trash2, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useLanguage } from '../../context/LanguageContext';
import { saveMeasurement } from '../../lib/indexedDB';

interface Point {
    x: number;
    y: number;
}

const StandardCamera = ({ onClose }: { onClose: () => void }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [points, setPoints] = useState<Point[]>([]);
    const [scale, setScale] = useState<number>(37.80); // Default scale (px/cm) based on screenshot
    const [mode, setMode] = useState<'measure' | 'calibrate'>('measure');
    const [activeTab, setActiveTab] = useState<'measure' | 'calibrate'>('measure');
    const [referenceObject, setReferenceObject] = useState<string>('credit_card'); // credit_card = 8.56cm
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Save State
    const [isSaveOpen, setIsSaveOpen] = useState(false);
    const [itemName, setItemName] = useState('');
    const [realValueInput, setRealValueInput] = useState('');

    // Initialize Camera
    useEffect(() => {
        const startCamera = async () => {
            try {
                const mediaStream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: 'environment' }
                });
                setStream(mediaStream);
                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                }
            } catch (err) {
                console.error("Error accessing camera:", err);
                toast.error("Gagal mengakses kamera. Pastikan izin diberikan.");
            }
        };

        startCamera();

        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const handleTap = (e: React.MouseEvent<HTMLDivElement>) => {
        if (points.length >= 2) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        setPoints([...points, { x, y }]);
    };

    const clearPoints = () => {
        setPoints([]);
    };

    const calculateDistance = (p1: Point, p2: Point) => {
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        return Math.sqrt(dx * dx + dy * dy);
    };

    const getDistanceCM = () => {
        if (points.length < 2) return 0;
        const distPx = calculateDistance(points[0], points[1]);
        return (distPx / scale).toFixed(2);
    };

    const getDistancePx = () => {
        if (points.length < 2) return "0";
        return calculateDistance(points[0], points[1]).toFixed(0);
    };

    const handleSave = async () => {
        const measured = parseFloat(getDistanceCM());
        if (measured <= 0) {
            toast.error("Tidak ada data pengukuran valid.");
            return;
        }

        const real = parseFloat(realValueInput);
        let errorPercentage = 0;

        if (!isNaN(real) && real > 0) {
            errorPercentage = Math.abs((measured - real) / real) * 100;
        }

        try {
            await saveMeasurement({
                item_name: itemName || "Benda Tanpa Nama",
                measured_value: measured,
                unit: 'cm',
                real_value: !isNaN(real) ? real : undefined,
                error_percentage: errorPercentage,
                timestamp: new Date().toISOString()
            });

            toast.success("Data berhasil disimpan ke Riwayat!");
            setIsSaveOpen(false);
            setItemName('');
            setRealValueInput('');
            clearPoints(); // Optional: Clear after save
        } catch (error) {
            console.error(error);
            toast.error("Gagal menyimpan data.");
        }
    };

    return (
        <div className="relative w-full h-full bg-black overflow-hidden group">
            {/* Header / Top Bar */}
            <div className="absolute top-0 left-0 right-0 z-20 p-4 flex justify-between items-start pointer-events-none">
                <Button
                    variant="ghost"
                    size="icon"
                    className="bg-white/80 backdrop-blur-md rounded-full text-slate-800 pointer-events-auto hover:bg-white"
                    onClick={onClose}
                >
                    <X className="w-6 h-6" />
                </Button>

                <div className="space-y-2 flex flex-col items-end">
                    <div className="bg-yellow-100/90 backdrop-blur-md text-yellow-700 px-3 py-1 rounded-lg text-xs font-bold border border-yellow-200 flex items-center gap-1 shadow-sm">
                        <AlertTriangle className="w-3 h-3" />
                        {activeTab === 'calibrate' ? 'Mode Kalibrasi' : 'Belum kalibrasi optimal'}
                    </div>
                </div>
            </div>

            {/* Instruction Pill - Hide if collapsed to avoid clutter, or keep it? Keep it. */}
            {points.length < 2 && (
                <div className={`absolute top-20 left-1/2 -translate-x-1/2 z-20 pointer-events-none transition-opacity duration-300 ${isCollapsed ? 'opacity-100' : 'opacity-100'}`}>
                    <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg text-sm font-medium text-slate-700 animate-in fade-in slide-in-from-top-4">
                        {points.length === 0 ? "Tap titik P1 (Awal)" : "Tap titik P2 (Akhir)"}
                    </div>
                </div>
            )}

            {/* Camera View - Full Screen */}
            <div className="absolute inset-0 z-0" onClick={handleTap}>
                {/* Video Feed */}
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover opacity-90"
                />

                {/* Overlays (Points & Lines) */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                    {/* Connection Line */}
                    {points.length === 2 && (
                        <>
                            <line
                                x1={points[0].x}
                                y1={points[0].y}
                                x2={points[1].x}
                                y2={points[1].y}
                                stroke="#3b82f6"
                                strokeWidth="2"
                                strokeDasharray="6 4"
                            />
                            {/* Distance Label on Line Center */}
                            <foreignObject
                                x={(points[0].x + points[1].x) / 2 - 40}
                                y={(points[0].y + points[1].y) / 2 - 15}
                                width="80"
                                height="30"
                            >
                                <div className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-md text-center shadow-md">
                                    {getDistanceCM()} cm
                                </div>
                            </foreignObject>
                        </>
                    )}

                    {/* Points */}
                    {points.map((p, i) => (
                        <g key={i}>
                            <circle cx={p.x} cy={p.y} r="16" fill="transparent" stroke="#3b82f6" strokeWidth="2" />
                            <circle cx={p.x} cy={p.y} r="4" fill="#3b82f6" />
                            <text x={p.x + 20} y={p.y + 5} fill="white" fontSize="12" fontWeight="bold" className="drop-shadow-md">
                                P{i + 1}
                            </text>
                            {/* Reticle-like visual */}
                            <line x1={p.x - 10} y1={p.y} x2={p.x + 10} y2={p.y} stroke="#3b82f6" strokeWidth="1" opacity="0.5" />
                            <line x1={p.x} y1={p.y - 10} x2={p.x} y2={p.y + 10} stroke="#3b82f6" strokeWidth="1" opacity="0.5" />
                        </g>
                    ))}
                </svg>
            </div>

            {/* Bottom Sheet / Controls - Floating at Bottom with Collapse */}
            <div
                className={`absolute bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-xl rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.2)] border-t border-white/20 transition-transform duration-300 ease-in-out ${isCollapsed ? 'translate-y-[calc(100%-60px)]' : 'translate-y-0'}`}
            >
                {/* Collapse Toggle Handle */}
                <div
                    className="flex justify-center items-center py-2 cursor-pointer active:opacity-70 h-[60px]"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                >
                    <div className="w-12 h-1.5 bg-slate-300 rounded-full mb-1" />
                    <button className="absolute right-4 p-2 text-slate-400 hover:text-slate-600">
                        {isCollapsed ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
                    </button>
                    {isCollapsed && (
                        <span className="absolute text-sm font-bold text-slate-500">Buka Kontrol</span>
                    )}
                </div>

                <div className="px-5 pb-8">

                    {/* Tabs */}
                    <div className="flex bg-slate-100 p-1 rounded-xl mb-6 w-full max-w-sm mx-auto">
                        <button
                            onClick={() => setActiveTab('measure')}
                            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'measure' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-200'}`}
                        >
                            Ukur
                        </button>
                        <button
                            onClick={() => setActiveTab('calibrate')}
                            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'calibrate' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-500 hover:bg-slate-200'}`}
                        >
                            <Settings className="w-3 h-3" />
                            Kalibrasi
                        </button>
                    </div>

                    <div className="space-y-4">
                        {activeTab === 'measure' ? (
                            <>
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                    <label className="text-xs font-bold text-slate-400 block mb-2">BANDINGKAN DENGAN</label>
                                    <Select defaultValue="credit_card">
                                        <SelectTrigger className="bg-white border-slate-200 font-medium">
                                            <SelectValue placeholder="Pilih objek referensi" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="credit_card">Kartu Kredit (8.56 cm)</SelectItem>
                                            <SelectItem value="a4_paper">Kertas A4 (Lebar 21 cm)</SelectItem>
                                            <SelectItem value="coin_500">Koin 500 (2.7 cm)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex items-center justify-between px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
                                    <span className="text-sm text-slate-500 font-medium">Skala saat ini</span>
                                    <span className="font-mono font-bold text-slate-900">{scale.toFixed(2)} px/cm</span>
                                </div>

                                <div className="flex gap-3 mt-4">
                                    {points.length > 0 && (
                                        <Button
                                            variant="outline"
                                            size="lg"
                                            className="aspect-square p-0 flex items-center justify-center border-slate-200"
                                            onClick={clearPoints}
                                        >
                                            <Trash2 className="w-5 h-5 text-red-500" />
                                        </Button>
                                    )}
                                    <Button size="lg"
                                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg rounded-xl shadow-blue-500/25 shadow-lg"
                                        onClick={() => {
                                            if (points.length === 2) {
                                                setIsSaveOpen(true);
                                            } else {
                                                // Trigger logic to start if needed, but tap handles it
                                                toast.info("Tap layar untuk mulai mengukur");
                                            }
                                        }}
                                    >
                                        {points.length === 2 ? "Simpan Ukuran" : "Mulai Ukur"}
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <div className="space-y-4">
                                <div className="p-4 bg-orange-50 text-orange-700 rounded-xl border border-orange-100 text-sm">
                                    <h4 className="font-bold mb-1 flex items-center gap-2">
                                        <AlertTriangle className="w-3 h-3" />
                                        Cara Kalibrasi
                                    </h4>
                                    <p>Letakkan objek referensi (misal: KTP/Kartu) di sebelah benda. Ukur panjang kartu tersebut di layar untuk mengupdate skala.</p>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                                        <div className="text-xs text-slate-500 font-bold mb-1">JARAK PIXEL</div>
                                        <div className="text-xl font-mono font-bold">{getDistancePx()} px</div>
                                    </div>
                                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                                        <div className="text-xs text-slate-500 font-bold mb-1">JARAK ASLI (CM)</div>
                                        <div className="flex items-center justify-center gap-2">
                                            <input
                                                type="number"
                                                className="w-16 bg-transparent text-center font-bold font-mono border-b border-slate-300 focus:outline-none"
                                                defaultValue="8.56"
                                                id="real-ref-input"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <Button
                                    size="lg"
                                    className="w-full bg-slate-900 text-white font-bold rounded-xl"
                                    onClick={() => {
                                        const px = parseFloat(getDistancePx());
                                        // @ts-ignore
                                        const real = parseFloat(document.getElementById('real-ref-input').value);
                                        if (px > 0 && real > 0) {
                                            setScale(px / real);
                                            toast.success("Skala berhasil diperbarui!");
                                            setActiveTab('measure');
                                            clearPoints();
                                        } else {
                                            toast.error("Ukur jarak pixel dulu!");
                                        }
                                    }}
                                >
                                    Hitung Skala Baru
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Save Dialog */}
            <Dialog open={isSaveOpen} onOpenChange={setIsSaveOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Simpan Hasil Pengukuran</DialogTitle>
                        <DialogDescription>
                            Masukkan detail benda untuk disimpan ke riwayat.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Nama Benda
                            </Label>
                            <Input
                                id="name"
                                value={itemName}
                                onChange={(e) => setItemName(e.target.value)}
                                placeholder="Contoh: Meja Belajar"
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="measured" className="text-right">
                                Hasil Ukur
                            </Label>
                            <div className="col-span-3 font-mono font-bold text-lg">
                                {getDistanceCM()} cm
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="real" className="text-right">
                                Nilai Asli (Opsional)
                            </Label>
                            <Input
                                id="real"
                                type="number"
                                value={realValueInput}
                                onChange={(e) => setRealValueInput(e.target.value)}
                                placeholder="Untuk hitung error %"
                                className="col-span-3"
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="secondary" onClick={() => setIsSaveOpen(false)}>Batal</Button>
                        <Button onClick={handleSave} className="bg-blue-600 text-white">Simpan</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default StandardCamera;
