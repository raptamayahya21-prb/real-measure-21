import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, 
  Keyboard, 
  BookOpen, 
  Trophy, 
  GraduationCap,
  Plus,
  Trash2,
  Calculator,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { NumberLine } from '@/components/measurement/NumberLine';
import { PropertyCard } from '@/components/measurement/PropertyCard';
import { IntervalSelector } from '@/components/measurement/IntervalSelector';
import { EpsilonSlider } from '@/components/measurement/EpsilonSlider';
import { SupInfDisplay } from '@/components/measurement/SupInfDisplay';
import { EducationPopup } from '@/components/measurement/EducationPopup';
import { ChallengeMode } from '@/components/measurement/ChallengeMode';
import { CameraView } from '@/components/measurement/CameraView';
import { 
  MeasurementValue, 
  IntervalConfig, 
  LearningMode, 
  RealPropertyType 
} from '@/types/measurement';
import { 
  demonstrateProperty, 
  formatWithEpsilon, 
  formatNumber,
  calculateAutoEpsilon 
} from '@/lib/real-numbers';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type MeasurementMode = 'manual' | 'camera';
type EpsilonMode = 'auto' | 'fixed' | 'custom';

const Index = () => {
  // Measurement state
  const [measurementMode, setMeasurementMode] = useState<MeasurementMode>('manual');
  const [measurements, setMeasurements] = useState<MeasurementValue[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [inputLabel, setInputLabel] = useState('');

  // Epsilon state
  const [epsilonMode, setEpsilonMode] = useState<EpsilonMode>('auto');
  const [customEpsilon, setCustomEpsilon] = useState(0.5);
  const fixedEpsilon = 0.5;

  // Interval state
  const [intervalConfig, setIntervalConfig] = useState<IntervalConfig>({
    type: 'closed',
    lowerBound: 0,
    upperBound: 10,
  });

  // Learning mode state
  const [learningMode, setLearningMode] = useState<LearningMode>('practice');
  const [showEducation, setShowEducation] = useState(false);
  const [educationTopic, setEducationTopic] = useState<string | undefined>();

  // Camera state
  const [showCamera, setShowCamera] = useState(false);

  // Selected properties
  const [selectedProperties, setSelectedProperties] = useState<RealPropertyType[]>([
    'commutative-add',
    'order',
    'absolute-value'
  ]);

  // Calculate current epsilon
  const currentEpsilon = useMemo(() => {
    if (epsilonMode === 'auto') {
      const avgValue = measurements.length > 0 
        ? measurements.reduce((sum, m) => sum + m.value, 0) / measurements.length 
        : 5;
      return calculateAutoEpsilon(measurementMode, avgValue);
    }
    if (epsilonMode === 'fixed') return fixedEpsilon;
    return customEpsilon;
  }, [epsilonMode, customEpsilon, measurementMode, measurements]);

  // Update interval based on measurements
  const calculatedInterval = useMemo(() => {
    if (measurements.length === 0) return intervalConfig;
    
    const values = measurements.map(m => m.value);
    const minVal = Math.min(...values) - currentEpsilon;
    const maxVal = Math.max(...values) + currentEpsilon;
    
    return {
      ...intervalConfig,
      lowerBound: minVal,
      upperBound: maxVal,
    };
  }, [measurements, intervalConfig.type, currentEpsilon]);

  // Property demonstrations
  const propertyDemos = useMemo(() => {
    const values = measurements.map(m => m.value);
    if (values.length === 0) values.push(3, 5, 2);
    while (values.length < 3) values.push(values[0] || 1);
    
    return selectedProperties.map(type => demonstrateProperty(type, values));
  }, [measurements, selectedProperties]);

  // Handlers
  const handleAddMeasurement = () => {
    const value = parseFloat(inputValue);
    if (isNaN(value)) return;

    const newMeasurement: MeasurementValue = {
      id: Date.now().toString(),
      value,
      epsilon: currentEpsilon,
      label: inputLabel || `Measurement ${measurements.length + 1}`,
      timestamp: new Date(),
    };

    setMeasurements(prev => [...prev, newMeasurement]);
    setInputValue('');
    setInputLabel('');
  };

  const handleCameraCapture = (value: number) => {
    const newMeasurement: MeasurementValue = {
      id: Date.now().toString(),
      value,
      epsilon: currentEpsilon,
      label: `Camera ${measurements.length + 1}`,
      timestamp: new Date(),
    };
    setMeasurements(prev => [...prev, newMeasurement]);
  };

  const handleRemoveMeasurement = (id: string) => {
    setMeasurements(prev => prev.filter(m => m.id !== id));
  };

  const toggleProperty = (prop: RealPropertyType) => {
    setSelectedProperties(prev => 
      prev.includes(prop) 
        ? prev.filter(p => p !== prop)
        : [...prev, prop]
    );
  };

  const openEducation = (topic?: string) => {
    setEducationTopic(topic);
    setShowEducation(true);
  };

  const allProperties: RealPropertyType[] = [
    'commutative-add',
    'commutative-mult',
    'associative-add',
    'associative-mult',
    'order',
    'absolute-value',
    'distributive',
    'identity',
    'inverse'
  ];

  const propertyLabels: Record<RealPropertyType, string> = {
    'commutative-add': 'Kom +',
    'commutative-mult': 'Kom ×',
    'associative-add': 'Asoc +',
    'associative-mult': 'Asoc ×',
    'order': 'Order',
    'absolute-value': '|x|',
    'distributive': 'Dist',
    'identity': 'Id',
    'inverse': 'Inv'
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 glass-panel border-b border-border">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-xl">
                <Calculator className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground">Real Measure</h1>
                <p className="text-xs text-muted-foreground">Bilangan Real & Pengukuran</p>
              </div>
            </div>

            {/* Learning mode tabs */}
            <div className="flex gap-1 p-1 bg-secondary rounded-xl">
              {[
                { mode: 'theory' as LearningMode, icon: BookOpen, label: 'Teori' },
                { mode: 'practice' as LearningMode, icon: GraduationCap, label: 'Praktik' },
                { mode: 'challenge' as LearningMode, icon: Trophy, label: 'Challenge' },
              ].map(({ mode, icon: Icon, label }) => (
                <button
                  key={mode}
                  onClick={() => setLearningMode(mode)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    learningMode === mode 
                      ? 'bg-background text-foreground shadow-sm' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          {/* Theory Mode */}
          {learningMode === 'theory' && (
            <motion.div
              key="theory"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-2">Konsep Bilangan Real</h2>
                <p className="text-muted-foreground">Pelajari dasar-dasar analisis real melalui modul interaktif</p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { id: 'real-numbers', title: 'Bilangan Real (ℝ)', desc: 'Definisi dan sifat dasar' },
                  { id: 'intervals', title: 'Interval', desc: 'Tertutup, terbuka, setengah terbuka' },
                  { id: 'supremum-infimum', title: 'Sup & Inf', desc: 'Batas atas & bawah terkecil' },
                  { id: 'epsilon', title: 'Epsilon (ε)', desc: 'Error dan ketidakpastian pengukuran' },
                  { id: 'field-properties', title: 'Sifat Field', desc: 'Komutatif, asosiatif, distributif' },
                  { id: 'order-properties', title: 'Sifat Urutan', desc: 'Trikotomi dan nilai mutlak' },
                ].map((topic) => (
                  <motion.button
                    key={topic.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => openEducation(topic.id)}
                    className="glass-panel rounded-xl p-6 text-left hover:shadow-lg transition-all"
                  >
                    <h3 className="font-semibold text-foreground mb-2">{topic.title}</h3>
                    <p className="text-sm text-muted-foreground">{topic.desc}</p>
                  </motion.button>
                ))}
              </div>

              <div className="text-center">
                <Button onClick={() => openEducation()} className="gap-2">
                  <BookOpen className="w-4 h-4" />
                  Buka Semua Materi
                </Button>
              </div>
            </motion.div>
          )}

          {/* Practice Mode */}
          {learningMode === 'practice' && (
            <motion.div
              key="practice"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Measurement Mode Toggle */}
              <div className="glass-panel rounded-2xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-foreground">Metode Pengukuran</h2>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button 
                        onClick={() => openEducation('epsilon')}
                        className="p-1.5 rounded-full hover:bg-secondary transition-colors"
                      >
                        <Info className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Klik untuk pelajari tentang pengukuran</p>
                    </TooltipContent>
                  </Tooltip>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setMeasurementMode('manual')}
                    className={`p-4 rounded-xl flex flex-col items-center gap-2 transition-all ${
                      measurementMode === 'manual'
                        ? 'bg-primary text-primary-foreground shadow-lg'
                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    }`}
                  >
                    <Keyboard className="w-6 h-6" />
                    <span className="font-medium">Input Manual</span>
                    <span className="text-xs opacity-70">Ketik nilai pengukuran</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setMeasurementMode('camera');
                      setShowCamera(true);
                    }}
                    className={`p-4 rounded-xl flex flex-col items-center gap-2 transition-all ${
                      measurementMode === 'camera'
                        ? 'bg-primary text-primary-foreground shadow-lg'
                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    }`}
                  >
                    <Camera className="w-6 h-6" />
                    <span className="font-medium">Kamera</span>
                    <span className="text-xs opacity-70">Ukur dengan marker</span>
                  </motion.button>
                </div>

                {/* Manual Input */}
                {measurementMode === 'manual' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-3"
                  >
                    <div className="flex gap-3">
                      <Input
                        type="number"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Nilai (contoh: 5.25)"
                        className="flex-1 font-mono"
                        step="any"
                      />
                      <Input
                        value={inputLabel}
                        onChange={(e) => setInputLabel(e.target.value)}
                        placeholder="Label (opsional)"
                        className="w-40"
                      />
                      <Button onClick={handleAddMeasurement} className="gap-2">
                        <Plus className="w-4 h-4" />
                        Tambah
                      </Button>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Measurements List */}
              {measurements.length > 0 && (
                <div className="glass-panel rounded-2xl p-4">
                  <h3 className="font-semibold text-foreground mb-4">
                    Nilai Pengukuran ({measurements.length})
                  </h3>
                  <div className="space-y-2">
                    {measurements.map((m, i) => (
                      <motion.div
                        key={m.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-center justify-between p-3 bg-secondary/50 rounded-xl"
                      >
                        <div>
                          <span className="font-medium text-foreground">{m.label}</span>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="font-mono text-sm text-muted-foreground">
                              {formatNumber(m.value)}
                            </span>
                            <span className="text-xs epsilon-indicator px-2 py-0.5 rounded-full">
                              ± {formatNumber(currentEpsilon)}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveMeasurement(m.id)}
                          className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </motion.div>
                    ))}
                  </div>

                  {/* Summary */}
                  <div className="mt-4 p-4 bg-primary/5 rounded-xl">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <span className="text-xs text-muted-foreground">Interval Nilai</span>
                        <div className="font-mono text-lg font-semibold text-primary">
                          {formatWithEpsilon(
                            measurements.reduce((sum, m) => sum + m.value, 0) / measurements.length,
                            currentEpsilon
                          )}
                        </div>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">Total Pengukuran</span>
                        <div className="font-mono text-lg font-semibold text-foreground">
                          {measurements.length}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Epsilon Control */}
              <div className="glass-panel rounded-2xl p-4">
                <EpsilonSlider
                  value={customEpsilon}
                  onChange={setCustomEpsilon}
                  mode={epsilonMode}
                  onModeChange={setEpsilonMode}
                  autoValue={calculateAutoEpsilon(measurementMode, 5)}
                />
              </div>

              {/* Interval Selection */}
              <div className="glass-panel rounded-2xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-foreground">Tipe Interval</h3>
                  <button 
                    onClick={() => openEducation('intervals')}
                    className="text-xs text-primary hover:underline"
                  >
                    Pelajari interval →
                  </button>
                </div>
                <IntervalSelector
                  value={calculatedInterval}
                  onChange={(config) => setIntervalConfig(config)}
                />
              </div>

              {/* Number Line Visualization */}
              <div className="glass-panel rounded-2xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-foreground">Garis Bilangan Real</h3>
                  <button 
                    onClick={() => openEducation('real-numbers')}
                    className="text-xs text-primary hover:underline"
                  >
                    Apa itu bilangan real? →
                  </button>
                </div>
                <NumberLine
                  values={measurements.map(m => m.value)}
                  interval={calculatedInterval}
                  epsilon={currentEpsilon}
                />
              </div>

              {/* Supremum & Infimum */}
              <div className="glass-panel rounded-2xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-foreground">Supremum & Infimum</h3>
                  <button 
                    onClick={() => openEducation('supremum-infimum')}
                    className="text-xs text-primary hover:underline"
                  >
                    Pelajari sup & inf →
                  </button>
                </div>
                <SupInfDisplay
                  supremum={calculatedInterval.upperBound}
                  infimum={calculatedInterval.lowerBound}
                  intervalType={calculatedInterval.type}
                />
              </div>

              {/* Property Selection */}
              <div className="glass-panel rounded-2xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-foreground">Sifat Bilangan Real</h3>
                  <button 
                    onClick={() => openEducation('field-properties')}
                    className="text-xs text-primary hover:underline"
                  >
                    Pelajari sifat-sifat →
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {allProperties.map((prop) => (
                    <button
                      key={prop}
                      onClick={() => toggleProperty(prop)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                        selectedProperties.includes(prop)
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                      }`}
                    >
                      {propertyLabels[prop]}
                    </button>
                  ))}
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {propertyDemos.map((demo, i) => (
                    <PropertyCard key={demo.type} demo={demo} index={i} />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Challenge Mode */}
          {learningMode === 'challenge' && (
            <motion.div
              key="challenge"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="py-8"
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Challenge Mode</h2>
                <p className="text-muted-foreground">Uji pemahamanmu tentang bilangan real!</p>
              </div>

              <ChallengeMode onClose={() => setLearningMode('practice')} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Camera View */}
      <CameraView
        isOpen={showCamera}
        onClose={() => setShowCamera(false)}
        onCapture={handleCameraCapture}
      />

      {/* Education Popup */}
      <EducationPopup
        isOpen={showEducation}
        onClose={() => setShowEducation(false)}
        initialTopic={educationTopic}
      />
    </div>
  );
};

export default Index;
