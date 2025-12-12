import { motion } from 'framer-motion';
import { Slider } from '@/components/ui/slider';
import { formatNumber } from '@/lib/real-numbers';
import { Info, Zap, Lock, Settings2 } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type EpsilonMode = 'auto' | 'fixed' | 'custom';

interface EpsilonSliderProps {
  value: number;
  onChange: (value: number) => void;
  mode: EpsilonMode;
  onModeChange: (mode: EpsilonMode) => void;
  autoValue?: number;
}

export function EpsilonSlider({ 
  value, 
  onChange, 
  mode, 
  onModeChange,
  autoValue = 0.5 
}: EpsilonSliderProps) {
  const modes: { mode: EpsilonMode; label: string; icon: React.ReactNode }[] = [
    { mode: 'auto', label: 'Auto', icon: <Zap className="w-3.5 h-3.5" /> },
    { mode: 'fixed', label: 'Fixed', icon: <Lock className="w-3.5 h-3.5" /> },
    { mode: 'custom', label: 'Custom', icon: <Settings2 className="w-3.5 h-3.5" /> },
  ];

  const displayValue = mode === 'auto' ? autoValue : value;

  return (
    <div className="space-y-4">
      {/* Mode selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">Epsilon (ε)</span>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="p-1 rounded-full hover:bg-secondary transition-colors">
                <Info className="w-4 h-4 text-muted-foreground" />
              </button>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p className="text-sm">
                Epsilon represents measurement uncertainty. The true value lies within ± ε of the measured value.
              </p>
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="flex gap-1 p-1 bg-secondary rounded-lg">
          {modes.map(({ mode: m, label, icon }) => (
            <button
              key={m}
              onClick={() => onModeChange(m)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                mode === m 
                  ? 'bg-background text-foreground shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Value display */}
      <motion.div 
        layout
        className="flex items-center justify-center gap-3 p-4 bg-[hsl(var(--epsilon-bg))] rounded-xl border border-[hsl(var(--epsilon))]"
      >
        <span className="text-3xl font-mono font-bold text-[hsl(var(--epsilon))]">
          ε = {formatNumber(displayValue, 3)}
        </span>
      </motion.div>

      {/* Slider (only for custom mode) */}
      {mode === 'custom' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-3"
        >
          <Slider
            value={[value]}
            onValueChange={([v]) => onChange(v)}
            min={0.001}
            max={5}
            step={0.001}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground font-mono">
            <span>0.001</span>
            <span>5.000</span>
          </div>
        </motion.div>
      )}

      {/* Info text */}
      <p className="text-xs text-muted-foreground text-center">
        {mode === 'auto' && 'Epsilon is calculated based on measurement method'}
        {mode === 'fixed' && 'Epsilon is set to a standard value (0.5)'}
        {mode === 'custom' && 'Adjust epsilon manually using the slider'}
      </p>
    </div>
  );
}
