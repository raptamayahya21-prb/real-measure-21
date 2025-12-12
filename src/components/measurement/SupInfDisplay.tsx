import { motion } from 'framer-motion';
import { formatNumber } from '@/lib/real-numbers';
import { Info, ArrowUp, ArrowDown } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface SupInfDisplayProps {
  supremum: number;
  infimum: number;
  intervalType: 'closed' | 'open' | 'half-open-left' | 'half-open-right';
}

export function SupInfDisplay({ supremum, infimum, intervalType }: SupInfDisplayProps) {
  const supInInterval = intervalType === 'closed' || intervalType === 'half-open-left';
  const infInInterval = intervalType === 'closed' || intervalType === 'half-open-right';

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Supremum */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="glass-panel rounded-xl p-4"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-primary/10 rounded-lg">
              <ArrowUp className="w-4 h-4 text-primary" />
            </div>
            <span className="font-medium text-sm text-foreground">Supremum</span>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="p-1 rounded-full hover:bg-secondary transition-colors">
                <Info className="w-4 h-4 text-muted-foreground" />
              </button>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p className="text-sm font-medium mb-1">Least Upper Bound</p>
              <p className="text-xs text-muted-foreground">
                The supremum (sup) is the smallest number that is greater than or equal to every element in the set.
                {supInInterval 
                  ? ' In this interval, the supremum IS an element of the set.'
                  : ' In this interval, the supremum is NOT an element of the set (it\'s a limit point).'}
              </p>
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="text-center">
          <div className="font-mono text-3xl font-bold text-primary">
            {formatNumber(supremum)}
          </div>
          <div className="text-xs text-muted-foreground mt-2">
            sup = {formatNumber(supremum)}
            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
              supInInterval 
                ? 'bg-green-100 text-green-700' 
                : 'bg-amber-100 text-amber-700'
            }`}>
              {supInInterval ? '∈ interval' : '∉ interval'}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Infimum */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="glass-panel rounded-xl p-4"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-primary/10 rounded-lg">
              <ArrowDown className="w-4 h-4 text-primary" />
            </div>
            <span className="font-medium text-sm text-foreground">Infimum</span>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="p-1 rounded-full hover:bg-secondary transition-colors">
                <Info className="w-4 h-4 text-muted-foreground" />
              </button>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p className="text-sm font-medium mb-1">Greatest Lower Bound</p>
              <p className="text-xs text-muted-foreground">
                The infimum (inf) is the largest number that is less than or equal to every element in the set.
                {infInInterval 
                  ? ' In this interval, the infimum IS an element of the set.'
                  : ' In this interval, the infimum is NOT an element of the set (it\'s a limit point).'}
              </p>
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="text-center">
          <div className="font-mono text-3xl font-bold text-primary">
            {formatNumber(infimum)}
          </div>
          <div className="text-xs text-muted-foreground mt-2">
            inf = {formatNumber(infimum)}
            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
              infInInterval 
                ? 'bg-green-100 text-green-700' 
                : 'bg-amber-100 text-amber-700'
            }`}>
              {infInInterval ? '∈ interval' : '∉ interval'}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
