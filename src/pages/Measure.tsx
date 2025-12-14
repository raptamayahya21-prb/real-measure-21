
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Save, Ruler, CheckCircle, Camera } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Button } from "@/components/ui/button";
import { Input } from '@/components/ui/input';
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import ARScene from '../components/ARScene';
import { calculateScaleFactor, applyScaleFactor } from '../logic/measurement';
import { saveMeasurement } from '../lib/indexedDB'; // Import local DB service
import StandardCamera from '../components/measurement/StandardCamera';

type AppState = 'checking-permissions' | 'permission-denied' | 'ready-to-start' | 'idle' | 'calibrating-a' | 'calibrating-b' | 'measuring-start' | 'measuring-end' | 'result';

const Measure = () => {
    const { t } = useLanguage();
    const { user } = useAuth();

    // State
    const [appState, setAppState] = useState<AppState>('checking-permissions');
    // DEFAULT SCALE FACTOR: 100 (1 Meter WebXR = 100 cm Real)
    // Assuming the device tracks in meters, which is standard for WebXR.
    const [scaleFactor, setScaleFactor] = useState<number | null>(100);
    const [calibrationDistRaw, setCalibrationDistRaw] = useState<number | null>(null);
    const [realRefDistance, setRealRefDistance] = useState<string>('8.56');

    const [measuredRaw, setMeasuredRaw] = useState<number | null>(null);
    const [finalResult, setFinalResult] = useState<number | null>(null);
    const [realVerifyValue, setRealVerifyValue] = useState<string>('');

    const [instruction, setInstruction] = useState<string>("Memeriksa izin kamera...");
    const [isSaving, setIsSaving] = useState(false);

    // 1. Check WebXR Support
    // 1. Check WebXR Support (Simplified: Just default to ready, but prefer StandardCamera for universal access)
    // We are overriding the complex logic to use StandardCamera
    useEffect(() => {
        setAppState('ready-to-start');
    }, []);

    // Event Listeners for AR Components
    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const handleCalibrationPoint = (e: CustomEvent) => {
            const { point, rawDistance } = e.detail;
            if (point === 'A') {
                setAppState('calibrating-b');
                setInstruction("Tap di Titik B (ujung lain objek referensi)");
                toast("Titik A tersimpan", { position: "top-center" });
            } else if (point === 'B') {
                if (rawDistance !== undefined) {
                    setCalibrationDistRaw(rawDistance);
                }
            }
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const handleMeasurementPoint = (e: CustomEvent) => {
            const { point, rawDistance } = e.detail;
            if (point === 'start') {
                setAppState('measuring-end');
                // UPDATE: Specific instruction request
                setInstruction("Tap Titik 2 (Akhir)");
                toast("Titik 1 tersimpan", { position: "top-center" });
            } else if (point === 'end') {
                if (rawDistance !== undefined) {
                    setMeasuredRaw(rawDistance);
                }
            }
        };

        window.addEventListener('ar-calibration-point' as any, handleCalibrationPoint as any);
        window.addEventListener('ar-measurement-point' as any, handleMeasurementPoint as any);

        return () => {
            window.removeEventListener('ar-calibration-point' as any, handleCalibrationPoint as any);
            window.removeEventListener('ar-measurement-point' as any, handleMeasurementPoint as any);
        };
    }, []);

    useEffect(() => {
        if (measuredRaw !== null && scaleFactor !== null) {
            const final = applyScaleFactor(measuredRaw, scaleFactor);
            setFinalResult(final);
            setAppState('result');
            toast.success("Pengukuran Selesai!");
        }
    }, [measuredRaw, scaleFactor]);

    // Actions
    const startARSession = () => {
        setAppState('idle');
        setInstruction("Mencari permukaan... Gerakkan HP perlahan.");
    };

    const startCalibration = () => {
        setAppState('calibrating-a');
        setInstruction("Tap di Titik A (ujung kiri objek referensi)");
        setCalibrationDistRaw(null);
    };

    const confirmCalibration = () => {
        if (calibrationDistRaw === null) return;
        const real = parseFloat(realRefDistance);
        if (isNaN(real) || real <= 0) {
            toast.error("Masukkan panjang referensi yang valid!");
            return;
        }

        const calculatedScale = calculateScaleFactor(calibrationDistRaw, real);

        if (calculatedScale === 0 || !isFinite(calculatedScale)) {
            toast.error("Error: Jarak virtual 0. Coba kalibrasi ulang.");
            return;
        }

        setScaleFactor(calculatedScale);
        toast.success(`Kalibrasi Sukses! Skala: ${calculatedScale.toFixed(2)} unit/m`, { duration: 3000 });
        setAppState('idle');
        setInstruction("Siap Mengukur. Tap 'Mulai Ukur' saat siap.");
        setCalibrationDistRaw(null);
    };

    const startMeasuring = () => {
        if (!scaleFactor) {
            // Should not happen with default 100, but safety check
            setScaleFactor(100);
        }
        setAppState('measuring-start');
        // UPDATE: Specific instruction request
        setInstruction("Tap Titik Awal (Start)");
        setFinalResult(null);
        setMeasuredRaw(null);
    };

    const resetAll = () => {
        setAppState('idle');
        setFinalResult(null);
        setMeasuredRaw(null);
        setInstruction("Siap Mengukur.");
    };

    const reCalibrate = () => {
        setAppState('idle');
        // setScaleFactor(null); // Keep default scale
        setCalibrationDistRaw(null);
        setInstruction("Siap Mengukur.");
        setFinalResult(null);
        setMeasuredRaw(null);
    };

    const handleSave = async () => {
        if (!finalResult) {
            toast.error("Tidak ada hasil pengukuran.");
            return;
        }

        setIsSaving(true);
        try {
            const real = realVerifyValue ? parseFloat(realVerifyValue) : undefined;
            const error = real ? Math.abs((finalResult - real) / real) * 100 : undefined;

            // Save to IndexedDB
            await saveMeasurement({
                item_name: `AR Measure ${new Date().toLocaleTimeString()}`,
                measured_value: finalResult,
                unit: 'cm',
                real_value: real,
                error_percentage: error,
                scale_factor: scaleFactor || 0,
                timestamp: new Date().toISOString(),
                user_email: user?.email || undefined
            });

            toast.success("Data tersimpan di Riwayat (Offline)!");
            resetAll();
        } catch (e: any) {
            console.error(e);
            toast.error(e.message || "Gagal menyimpan");
        } finally {
            setIsSaving(false);
        }
    };

    const isARActive = !['checking-permissions', 'permission-denied', 'ready-to-start'].includes(appState);

    // Standard Camera Mode (Force Enable for Universal Access)
    const [showStandardCamera, setShowStandardCamera] = useState(false);

    const startStandardCamera = () => {
        setShowStandardCamera(true);
    }

    if (showStandardCamera) {
        return (
            <div className="flex flex-col h-[calc(100vh-120px)] bg-black rounded-3xl overflow-hidden border border-white/10 relative">
                <StandardCamera onClose={() => setShowStandardCamera(false)} />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[calc(100vh-120px)] bg-black rounded-3xl overflow-hidden border border-white/10 relative">

            {/* Disclaimer Area (Always Visible) */}
            <div id="disclaimer-area" className="relative bg-[#333] p-3 text-center border-b border-white/10 z-10">
                <p id="disclaimer-text" className="text-yellow-400 font-bold text-xs md:text-sm m-0">
                    DISCLAIMER: Pengukuran ini menggunakan pendekatan visual (2D/3D). Harap selalu periksa kembali hasil pengukuran dengan alat fisik.
                </p>
            </div>

            {/* AR Container */}
            <div id="ar-container" className="relative flex-1 bg-black">

                {/* A-Frame Scene (Shown when AR Active) */}
                {isARActive && (
                    <div className="absolute inset-0 z-0">
                        <ARScene appState={appState} />
                    </div>
                )}

                {/* Pre-AR UI (Start Button) */}
                {!isARActive && (
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center bg-slate-900">
                        <div className="max-w-md space-y-6">
                            <div className="p-6 bg-slate-800 rounded-full inline-block mb-4">
                                <Camera className="w-12 h-12 text-dashboard-accent" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-2">Siap Mengukur</h2>
                                <p className="text-slate-400">Gunakan kamera untuk mengukur jarak antar titik.</p>
                            </div>

                            <Button
                                onClick={startStandardCamera}
                                className="w-full h-14 text-lg font-bold bg-dashboard-accent hover:bg-dashboard-accent/90 text-white rounded-xl shadow-lg shadow-dashboard-accent/20"
                            >
                                Mulai Kamera
                            </Button>

                            <p className="text-xs text-slate-500 mt-4">
                                * Mendukung Semua Perangkat (Android/iOS/PC)
                            </p>
                        </div>
                    </div>
                )}

                {/* UI Overlay (When AR Active) */}
                {isARActive && (
                    <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between p-6">
                        {/* Status Strip */}
                        <div className="flex justify-between items-start">
                            <div className={`px-4 py-2 rounded-full backdrop-blur-md border border-green-500/50 bg-green-500/20 text-green-400 text-xs font-mono font-bold shadow-lg pointer-events-auto`}>
                                {scaleFactor ? `Mode: Auto Scale (1m=100cm)` : 'System Ready'}
                            </div>
                            {/* Cancel Button Small */}
                            {(['calibrating-a', 'calibrating-b', 'measuring-start'].includes(appState)) && (
                                <Button onClick={resetAll} size="sm" variant="destructive" className="pointer-events-auto shadow-lg h-8">Batal</Button>
                            )}
                        </div>

                        {/* Instruction Text */}
                        <div className="absolute top-20 left-6 right-6 text-center pointer-events-none">
                            <span className="inline-block bg-black/60 backdrop-blur-md text-white px-4 py-2 rounded-lg text-sm font-medium border border-white/10 shadow-xl animate-in fade-in zoom-in">
                                {instruction}
                            </span>
                        </div>

                        {/* Bottom Controls */}
                        <div className="pointer-events-auto space-y-4">
                            {/* Calibration Modal */}
                            {calibrationDistRaw !== null && !scaleFactor && (
                                <Card className="bg-white/95 backdrop-blur-xl p-4 border-none shadow-2xl animate-in slide-in-from-bottom rounded-2xl">
                                    <h3 className="text-xs font-bold text-slate-500 uppercase mb-2">Jarak Referensi</h3>
                                    <div className="flex gap-4 mb-4">
                                        <Input
                                            value={realRefDistance}
                                            onChange={(e) => setRealRefDistance(e.target.value)}
                                            className="text-lg font-mono bg-white border-slate-200"
                                            placeholder="8.56"
                                        />
                                        <div className="flex items-center px-3 bg-slate-100 rounded-md text-sm font-bold text-slate-500 border border-slate-200">cm</div>
                                    </div>
                                    <Button onClick={confirmCalibration} className="w-full bg-dashboard-accent text-white font-bold h-12">
                                        Simpan Kalibrasi
                                    </Button>
                                </Card>
                            )}

                            {/* Result Modal */}
                            {appState === 'result' && finalResult !== null && (
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    className="bg-white/95 backdrop-blur-xl p-6 rounded-2xl shadow-2xl space-y-4"
                                >
                                    <div className="text-center">
                                        <div className="text-5xl font-bold text-dashboard-accent font-mono">{finalResult.toFixed(2)}<span className="text-lg text-slate-400 ml-1">cm</span></div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Input
                                            type="number"
                                            placeholder="Nilai Real (Validasi)"
                                            value={realVerifyValue}
                                            onChange={(e) => setRealVerifyValue(e.target.value)}
                                        />
                                        <Button onClick={handleSave} disabled={isSaving} size="icon" className="shrink-0 bg-slate-900"><Save className="w-4 h-4" /></Button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <Button variant="outline" onClick={resetAll}>Ulang</Button>
                                        <Button onClick={resetAll} className="bg-dashboard-accent text-white">Selesai</Button>
                                    </div>
                                </motion.div>
                            )}

                            {/* Main Action Buttons */}
                            {appState === 'idle' && (
                                <div className="grid grid-cols-2 gap-3">
                                    <Button onClick={startMeasuring} className="col-span-2 bg-dashboard-accent text-white h-12 rounded-xl text-lg font-bold shadow-lg shadow-dashboard-accent/20">
                                        Mulai Ukur
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <div className="absolute top-4 right-4 pointer-events-none z-20 opacity-50 text-[10px] text-white">
                Ver: 2.0 (Universal)
            </div>
        </div>
    );
};

export default Measure;
