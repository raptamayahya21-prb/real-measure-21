import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, Crosshair, Check, Settings, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface CameraViewProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (value: number) => void;
}

interface MarkerPoint {
  id: string;
  x: number;
  y: number;
  label: string;
}

type MeasureMode = 'calibrate' | 'measure';

const REFERENCE_OBJECTS = [
  { name: 'Kartu Kredit (panjang)', length: 8.56, unit: 'cm' },
  { name: 'Kartu Kredit (lebar)', length: 5.398, unit: 'cm' },
  { name: 'Koin 1000 Rupiah', length: 2.4, unit: 'cm' },
  { name: 'Kustom', length: 0, unit: 'cm' },
];

export function CameraView({ isOpen, onClose, onCapture }: CameraViewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCamera, setHasCamera] = useState(false);
  const [markers, setMarkers] = useState<MarkerPoint[]>([]);
  const [mode, setMode] = useState<MeasureMode>('measure');
  const [pixelsPerCm, setPixelsPerCm] = useState<number>(() => {
    const saved = localStorage.getItem('camera_calibration');
    return saved ? parseFloat(saved) : 37.8; // Default ~96 DPI / 2.54
  });
  const [selectedReference, setSelectedReference] = useState(0);
  const [customLength, setCustomLength] = useState(10);
  const [isCalibrated, setIsCalibrated] = useState(() => {
    return !!localStorage.getItem('camera_calibration');
  });
  const { toast } = useToast();

  useEffect(() => {
    if (!isOpen) return;

    let stream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { 
            facingMode: 'environment', 
            width: { ideal: 1920 }, 
            height: { ideal: 1080 }
          }
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setHasCamera(true);
        }
      } catch (error) {
        console.error('Camera error:', error);
        toast({
          title: 'Kamera tidak tersedia',
          description: 'Izinkan akses kamera untuk menggunakan fitur ini.',
          variant: 'destructive'
        });
        setHasCamera(false);
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isOpen, toast]);

  const handleTapToMeasure = useCallback((e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!hasCamera || markers.length >= 2) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    
    let x: number, y: number;
    if ('touches' in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }
    
    const newMarker: MarkerPoint = {
      id: Date.now().toString(),
      x,
      y,
      label: markers.length === 0 ? 'P1' : 'P2'
    };
    
    setMarkers(prev => [...prev, newMarker]);
    
    if (markers.length === 1) {
      toast({
        title: 'Titik P2 ditambahkan!',
        description: mode === 'calibrate' ? 'Tap "Kalibrasi" untuk menyimpan.' : 'Tap "Ukur" untuk menghitung jarak.',
      });
    }
  }, [hasCamera, markers.length, mode, toast]);

  const calculatePixelDistance = () => {
    if (markers.length < 2) return 0;
    const dx = markers[1].x - markers[0].x;
    const dy = markers[1].y - markers[0].y;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleCalibrate = () => {
    if (markers.length < 2) {
      toast({
        title: 'Butuh dua titik',
        description: 'Tap dua titik pada objek referensi.',
      });
      return;
    }

    const pixelDistance = calculatePixelDistance();
    const referenceLength = REFERENCE_OBJECTS[selectedReference].name === 'Kustom' 
      ? customLength 
      : REFERENCE_OBJECTS[selectedReference].length;
    
    const newPixelsPerCm = pixelDistance / referenceLength;
    setPixelsPerCm(newPixelsPerCm);
    localStorage.setItem('camera_calibration', newPixelsPerCm.toString());
    setIsCalibrated(true);
    
    toast({
      title: 'Kalibrasi berhasil!',
      description: `Skala: ${newPixelsPerCm.toFixed(2)} px/cm`,
    });
    
    setMarkers([]);
    setMode('measure');
  };

  const handleMeasure = () => {
    if (markers.length < 2) {
      toast({
        title: 'Butuh dua titik',
        description: 'Tap dua titik P1 dan P2 untuk mengukur jarak.',
      });
      return;
    }

    const pixelDistance = calculatePixelDistance();
    const realDistanceCm = pixelDistance / pixelsPerCm;

    onCapture(realDistanceCm);
    toast({
      title: 'Pengukuran selesai',
      description: `Jarak: ${realDistanceCm.toFixed(2)} cm`,
    });
    
    setMarkers([]);
    onClose();
  };

  const clearMarkers = () => {
    setMarkers([]);
  };

  const resetCalibration = () => {
    localStorage.removeItem('camera_calibration');
    setPixelsPerCm(37.8);
    setIsCalibrated(false);
    toast({
      title: 'Kalibrasi direset',
      description: 'Silakan kalibrasi ulang untuk hasil akurat.',
    });
  };

  const liveDistance = markers.length === 2 ? (calculatePixelDistance() / pixelsPerCm).toFixed(2) : null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-foreground"
        >
          {/* Fullscreen video */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="fullscreen-camera"
          />

          {/* Overlay container - tap anywhere to add marker */}
          <div 
            className="overlay-controls cursor-crosshair"
            onClick={handleTapToMeasure}
            onTouchStart={handleTapToMeasure}
          >
            {/* Center crosshair */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              <Crosshair className="w-12 h-12 text-primary/50" strokeWidth={1} />
            </div>

            {/* Connecting line between points */}
            {markers.length === 2 && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <line
                  x1={markers[0].x}
                  y1={markers[0].y}
                  x2={markers[1].x}
                  y2={markers[1].y}
                  stroke="hsl(var(--primary))"
                  strokeWidth="2"
                  strokeDasharray="6 4"
                />
                {/* Distance label at midpoint */}
                {liveDistance && (
                  <text
                    x={(markers[0].x + markers[1].x) / 2}
                    y={(markers[0].y + markers[1].y) / 2 - 12}
                    fill="white"
                    fontSize="14"
                    fontWeight="bold"
                    textAnchor="middle"
                    className="drop-shadow-lg"
                  >
                    {liveDistance} cm
                  </text>
                )}
              </svg>
            )}

            {/* Marker points P1 & P2 */}
            {markers.map((marker) => (
              <motion.div
                key={marker.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute pointer-events-none"
                style={{ 
                  left: marker.x, 
                  top: marker.y,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                {/* Point circle */}
                <div className="w-6 h-6 rounded-full bg-primary border-2 border-background shadow-lg flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-background" />
                </div>
                {/* Label */}
                <span className="absolute left-8 top-1/2 -translate-y-1/2 text-sm font-bold text-primary bg-background/90 px-2 py-1 rounded shadow">
                  {marker.label}
                </span>
              </motion.div>
            ))}

            {/* Top controls */}
            <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none">
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => { e.stopPropagation(); onClose(); }}
                className="glass-panel rounded-full pointer-events-auto"
              >
                <X className="w-5 h-5" />
              </Button>

              <div className="flex gap-2">
                {/* Calibration status */}
                <div className={`glass-panel rounded-xl px-3 py-2 text-xs ${isCalibrated ? 'text-green-400' : 'text-yellow-400'}`}>
                  {isCalibrated ? '✓ Terkalibrasi' : '⚠ Belum kalibrasi'}
                </div>
                
                {markers.length > 0 && (
                  <div className="glass-panel rounded-xl px-4 py-2">
                    <span className="text-sm font-mono">
                      {markers.length === 1 ? 'P1' : 'P1 → P2'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom controls */}
            <div className="absolute bottom-8 left-4 right-4 pointer-events-none">
              <div className="glass-panel rounded-2xl p-4 max-w-lg mx-auto pointer-events-auto" onClick={(e) => e.stopPropagation()}>
                
                {/* Mode tabs */}
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => { setMode('measure'); clearMarkers(); }}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                      mode === 'measure' ? 'bg-primary text-primary-foreground' : 'bg-muted/50 text-muted-foreground'
                    }`}
                  >
                    Ukur
                  </button>
                  <button
                    onClick={() => { setMode('calibrate'); clearMarkers(); }}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                      mode === 'calibrate' ? 'bg-primary text-primary-foreground' : 'bg-muted/50 text-muted-foreground'
                    }`}
                  >
                    <Settings className="w-4 h-4 inline mr-1" />
                    Kalibrasi
                  </button>
                </div>

                {mode === 'calibrate' ? (
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-muted-foreground mb-2 block">
                        Objek Referensi
                      </label>
                      <select
                        value={selectedReference}
                        onChange={(e) => setSelectedReference(Number(e.target.value))}
                        className="w-full p-2 rounded-lg bg-background/50 border border-border text-sm"
                      >
                        {REFERENCE_OBJECTS.map((obj, idx) => (
                          <option key={idx} value={idx}>
                            {obj.name} {obj.length > 0 ? `(${obj.length} ${obj.unit})` : ''}
                          </option>
                        ))}
                      </select>
                    </div>

                    {REFERENCE_OBJECTS[selectedReference].name === 'Kustom' && (
                      <div>
                        <label className="text-xs text-muted-foreground mb-2 block">
                          Panjang referensi (cm)
                        </label>
                        <input
                          type="number"
                          value={customLength}
                          onChange={(e) => setCustomLength(Number(e.target.value))}
                          className="w-full p-2 rounded-lg bg-background/50 border border-border text-sm"
                          min="0.1"
                          step="0.1"
                        />
                      </div>
                    )}

                    <p className="text-xs text-muted-foreground">
                      Letakkan objek referensi dan tap dua ujungnya.
                    </p>

                    <div className="flex gap-2">
                      {markers.length >= 2 && (
                        <Button size="sm" onClick={handleCalibrate} className="flex-1 gap-2">
                          <Check className="w-4 h-4" />
                          Kalibrasi
                        </Button>
                      )}
                      {isCalibrated && (
                        <Button size="sm" variant="ghost" onClick={resetCalibration}>
                          <RotateCcw className="w-4 h-4" />
                        </Button>
                      )}
                      {markers.length > 0 && (
                        <Button size="sm" variant="ghost" onClick={clearMarkers}>
                          Clear
                        </Button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground mb-1">Skala saat ini</div>
                      <div className="text-lg font-mono font-bold">{pixelsPerCm.toFixed(2)} px/cm</div>
                    </div>

                    <div className="flex gap-2">
                      {markers.length >= 2 && (
                        <Button size="sm" onClick={handleMeasure} className="flex-1 gap-2">
                          <Check className="w-4 h-4" />
                          Ukur
                        </Button>
                      )}
                      {markers.length > 0 && (
                        <Button size="sm" variant="ghost" onClick={clearMarkers}>
                          Clear
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Instructions overlay */}
            {!hasCamera && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/90 pointer-events-auto">
                <div className="text-center space-y-4">
                  <Camera className="w-16 h-16 text-muted-foreground mx-auto" />
                  <p className="text-lg text-muted-foreground">
                    Akses kamera diperlukan
                  </p>
                  <Button onClick={onClose}>Tutup</Button>
                </div>
              </div>
            )}

            {/* Tap instruction */}
            {hasCamera && markers.length < 2 && (
              <div className="absolute top-20 left-1/2 -translate-x-1/2 glass-panel rounded-full px-4 py-2 pointer-events-none">
                <p className="text-sm text-center font-medium">
                  {mode === 'calibrate' 
                    ? (markers.length === 0 ? 'Tap ujung pertama objek referensi' : 'Tap ujung kedua objek referensi')
                    : (markers.length === 0 ? 'Tap untuk menentukan titik P1' : 'Tap untuk menentukan titik P2')
                  }
                </p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
