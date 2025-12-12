import { motion } from 'framer-motion';
import { RealPropertyDemo, RealPropertyType } from '@/types/measurement';
import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface PropertyCardProps {
  demo: RealPropertyDemo;
  index?: number;
}

const propertyInfo: Record<RealPropertyType, { name: string; nameId: string; description: string }> = {
  'commutative-add': {
    name: 'Commutative (Addition)',
    nameId: 'Komutatif (Penjumlahan)',
    description: 'Changing the order of operands does not change the result.',
  },
  'commutative-mult': {
    name: 'Commutative (Multiplication)',
    nameId: 'Komutatif (Perkalian)',
    description: 'Changing the order of operands does not change the result.',
  },
  'associative-add': {
    name: 'Associative (Addition)',
    nameId: 'Asosiatif (Penjumlahan)',
    description: 'Grouping of operands does not affect the result.',
  },
  'associative-mult': {
    name: 'Associative (Multiplication)',
    nameId: 'Asosiatif (Perkalian)',
    description: 'Grouping of operands does not affect the result.',
  },
  'order': {
    name: 'Order Property',
    nameId: 'Sifat Keterurutan',
    description: 'Real numbers can be compared and ordered.',
  },
  'absolute-value': {
    name: 'Absolute Value',
    nameId: 'Nilai Mutlak',
    description: 'The distance of a number from zero on the number line.',
  },
  'distributive': {
    name: 'Distributive',
    nameId: 'Distributif',
    description: 'Multiplication distributes over addition.',
  },
  'identity': {
    name: 'Identity Elements',
    nameId: 'Elemen Identitas',
    description: '0 for addition, 1 for multiplication.',
  },
  'inverse': {
    name: 'Inverse Elements',
    nameId: 'Elemen Invers',
    description: 'Every real number has an additive and multiplicative inverse.',
  },
};

export function PropertyCard({ demo, index = 0 }: PropertyCardProps) {
  const info = propertyInfo[demo.type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="property-card group"
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          <h4 className="font-semibold text-foreground text-sm">{info.name}</h4>
          <p className="text-xs text-muted-foreground">{info.nameId}</p>
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="p-1.5 rounded-full hover:bg-secondary transition-colors">
              <Info className="w-4 h-4 text-muted-foreground" />
            </button>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <p className="text-sm">{info.description}</p>
          </TooltipContent>
        </Tooltip>
      </div>

      <div className="space-y-2">
        <div className="px-3 py-2 bg-secondary rounded-lg">
          <code className="text-xs font-mono text-secondary-foreground">{demo.formula}</code>
        </div>
        <p className="text-sm font-mono text-foreground">{demo.explanation}</p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Result:</span>
          <span className="font-mono font-semibold text-primary">{demo.result}</span>
        </div>
      </div>
    </motion.div>
  );
}
