import { useMemo } from 'react';
import { IntervalConfig } from '@/types/measurement';
import { formatNumber, formatInterval } from '@/lib/real-numbers';
import { motion } from 'framer-motion';

interface NumberLineProps {
  values: number[];
  interval?: IntervalConfig;
  epsilon?: number;
  showLabels?: boolean;
  className?: string;
}

export function NumberLine({ 
  values, 
  interval, 
  epsilon = 0, 
  showLabels = true,
  className = '' 
}: NumberLineProps) {
  const { min, max, range, points } = useMemo(() => {
    const allValues = interval 
      ? [...values, interval.lowerBound, interval.upperBound]
      : values;
    
    const minVal = Math.min(...allValues) - epsilon;
    const maxVal = Math.max(...allValues) + epsilon;
    const padding = (maxVal - minVal) * 0.15;
    
    const min = minVal - padding;
    const max = maxVal + padding;
    const range = max - min;
    
    // Generate tick points
    const step = range / 10;
    const points: number[] = [];
    for (let i = 0; i <= 10; i++) {
      points.push(min + step * i);
    }
    
    return { min, max, range, points };
  }, [values, interval, epsilon]);

  const toPosition = (value: number): number => {
    return ((value - min) / range) * 100;
  };

  return (
    <div className={`relative py-8 px-4 ${className}`}>
      {/* Main line */}
      <div className="relative h-1 bg-border rounded-full">
        {/* Interval highlight */}
        {interval && (
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="absolute top-0 h-full bg-primary/30 origin-left"
            style={{
              left: `${toPosition(interval.lowerBound)}%`,
              width: `${toPosition(interval.upperBound) - toPosition(interval.lowerBound)}%`,
            }}
          />
        )}

        {/* Tick marks */}
        {points.map((point, i) => (
          <div
            key={i}
            className="absolute top-1/2 -translate-y-1/2"
            style={{ left: `${toPosition(point)}%` }}
          >
            <div className="w-px h-3 bg-muted-foreground/40 -translate-x-1/2" />
            {showLabels && i % 2 === 0 && (
              <span className="absolute top-4 left-1/2 -translate-x-1/2 text-xs text-muted-foreground font-mono whitespace-nowrap">
                {formatNumber(point, 1)}
              </span>
            )}
          </div>
        ))}

        {/* Interval endpoints */}
        {interval && (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 }}
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
              style={{ left: `${toPosition(interval.lowerBound)}%` }}
            >
              <div className={`w-3 h-3 rounded-full border-2 border-primary ${
                interval.type === 'closed' || interval.type === 'half-open-right' 
                  ? 'bg-primary' 
                  : 'bg-background'
              }`} />
              <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-mono font-medium text-primary">
                {formatNumber(interval.lowerBound)}
              </span>
            </motion.div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4 }}
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
              style={{ left: `${toPosition(interval.upperBound)}%` }}
            >
              <div className={`w-3 h-3 rounded-full border-2 border-primary ${
                interval.type === 'closed' || interval.type === 'half-open-left' 
                  ? 'bg-primary' 
                  : 'bg-background'
              }`} />
              <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-mono font-medium text-primary">
                {formatNumber(interval.upperBound)}
              </span>
            </motion.div>
          </>
        )}

        {/* Value points */}
        {values.map((value, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0, y: 10 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.1 }}
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
            style={{ left: `${toPosition(value)}%` }}
          >
            {/* Epsilon range */}
            {epsilon > 0 && (
              <div
                className="absolute top-1/2 -translate-y-1/2 h-2 bg-[hsl(var(--epsilon))] opacity-30 rounded-full"
                style={{
                  left: `${-((epsilon / range) * 100 * 0.5)}%`,
                  width: `${(epsilon / range) * 100}%`,
                  minWidth: '20px',
                }}
              />
            )}
            <div className="w-4 h-4 rounded-full bg-primary border-2 border-background shadow-lg relative z-10" />
            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-mono font-semibold whitespace-nowrap">
              {formatNumber(value)}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Interval notation */}
      {interval && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-10"
        >
          <span className="interval-badge bg-primary/10 text-primary">
            Interval: {formatInterval(interval)}
          </span>
        </motion.div>
      )}
    </div>
  );
}
