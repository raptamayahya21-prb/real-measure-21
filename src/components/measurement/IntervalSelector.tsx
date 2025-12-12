import { IntervalConfig } from '@/types/measurement';
import { formatInterval } from '@/lib/real-numbers';
import { motion } from 'framer-motion';

interface IntervalSelectorProps {
  value: IntervalConfig;
  onChange: (config: IntervalConfig) => void;
}

const intervalTypes: { type: IntervalConfig['type']; label: string; notation: string }[] = [
  { type: 'closed', label: 'Closed', notation: '[a, b]' },
  { type: 'open', label: 'Open', notation: '(a, b)' },
  { type: 'half-open-right', label: 'Half-open', notation: '[a, b)' },
  { type: 'half-open-left', label: 'Half-open', notation: '(a, b]' },
];

export function IntervalSelector({ value, onChange }: IntervalSelectorProps) {
  return (
    <div className="space-y-4">
      {/* Type selector */}
      <div className="grid grid-cols-2 gap-2">
        {intervalTypes.map(({ type, label, notation }) => (
          <motion.button
            key={type}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onChange({ ...value, type })}
            className={`p-3 rounded-xl text-center transition-all ${
              value.type === type
                ? 'bg-primary text-primary-foreground shadow-lg'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            <span className="font-mono text-lg font-semibold">{notation}</span>
            <span className="block text-xs mt-1 opacity-80">{label}</span>
          </motion.button>
        ))}
      </div>

      {/* Current interval display */}
      <div className="text-center p-4 bg-secondary/50 rounded-xl">
        <span className="text-xs text-muted-foreground uppercase tracking-wider">Current Interval</span>
        <div className="font-mono text-2xl font-bold text-primary mt-1">
          {formatInterval(value)}
        </div>
      </div>

      {/* Visual representation */}
      <div className="flex items-center justify-center gap-1 py-2">
        {/* Left bracket/parenthesis */}
        <span className="text-4xl font-light text-primary">
          {value.type === 'closed' || value.type === 'half-open-right' ? '[' : '('}
        </span>
        
        {/* Line representation */}
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full border-2 border-primary ${
            value.type === 'closed' || value.type === 'half-open-right' 
              ? 'bg-primary' 
              : 'bg-background'
          }`} />
          <div className="w-24 h-1 bg-primary" />
          <div className={`w-3 h-3 rounded-full border-2 border-primary ${
            value.type === 'closed' || value.type === 'half-open-left' 
              ? 'bg-primary' 
              : 'bg-background'
          }`} />
        </div>
        
        {/* Right bracket/parenthesis */}
        <span className="text-4xl font-light text-primary">
          {value.type === 'closed' || value.type === 'half-open-left' ? ']' : ')'}
        </span>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-6 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary" />
          <span>Included</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full border-2 border-primary bg-background" />
          <span>Excluded</span>
        </div>
      </div>
    </div>
  );
}
