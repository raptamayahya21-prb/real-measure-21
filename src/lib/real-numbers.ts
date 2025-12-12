// Real Number Operations and Properties

import { IntervalConfig, RealNumberInterval, RealPropertyDemo, RealPropertyType } from '@/types/measurement';

// Create interval with bounds checking
export function createInterval(config: IntervalConfig): RealNumberInterval {
  const { type, lowerBound, upperBound } = config;
  
  const contains = (x: number): boolean => {
    switch (type) {
      case 'closed':
        return x >= lowerBound && x <= upperBound;
      case 'open':
        return x > lowerBound && x < upperBound;
      case 'half-open-left':
        return x > lowerBound && x <= upperBound;
      case 'half-open-right':
        return x >= lowerBound && x < upperBound;
      default:
        return false;
    }
  };

  return {
    config,
    supremum: upperBound,
    infimum: lowerBound,
    contains,
  };
}

// Format interval notation
export function formatInterval(config: IntervalConfig): string {
  const { type, lowerBound, upperBound } = config;
  const lower = formatNumber(lowerBound);
  const upper = formatNumber(upperBound);
  
  switch (type) {
    case 'closed':
      return `[${lower}, ${upper}]`;
    case 'open':
      return `(${lower}, ${upper})`;
    case 'half-open-left':
      return `(${lower}, ${upper}]`;
    case 'half-open-right':
      return `[${lower}, ${upper})`;
    default:
      return `[${lower}, ${upper}]`;
  }
}

// Format number with appropriate precision
export function formatNumber(n: number, precision: number = 4): string {
  if (Number.isInteger(n)) return n.toString();
  return n.toFixed(precision).replace(/\.?0+$/, '');
}

// Format value with epsilon uncertainty
export function formatWithEpsilon(value: number, epsilon: number): string {
  return `${formatNumber(value)} ± ${formatNumber(epsilon)}`;
}

// Demonstrate real number properties
export function demonstrateProperty(
  type: RealPropertyType,
  values: number[]
): RealPropertyDemo {
  const [a, b, c] = values;
  
  switch (type) {
    case 'commutative-add':
      return {
        type,
        values: [a, b],
        result: a + b,
        formula: `a + b = b + a`,
        explanation: `${formatNumber(a)} + ${formatNumber(b)} = ${formatNumber(b)} + ${formatNumber(a)} = ${formatNumber(a + b)}`,
      };
    
    case 'commutative-mult':
      return {
        type,
        values: [a, b],
        result: a * b,
        formula: `a × b = b × a`,
        explanation: `${formatNumber(a)} × ${formatNumber(b)} = ${formatNumber(b)} × ${formatNumber(a)} = ${formatNumber(a * b)}`,
      };
    
    case 'associative-add':
      return {
        type,
        values: [a, b, c],
        result: a + b + c,
        formula: `(a + b) + c = a + (b + c)`,
        explanation: `(${formatNumber(a)} + ${formatNumber(b)}) + ${formatNumber(c)} = ${formatNumber(a)} + (${formatNumber(b)} + ${formatNumber(c)}) = ${formatNumber(a + b + c)}`,
      };
    
    case 'associative-mult':
      return {
        type,
        values: [a, b, c],
        result: a * b * c,
        formula: `(a × b) × c = a × (b × c)`,
        explanation: `(${formatNumber(a)} × ${formatNumber(b)}) × ${formatNumber(c)} = ${formatNumber(a)} × (${formatNumber(b)} × ${formatNumber(c)}) = ${formatNumber(a * b * c)}`,
      };
    
    case 'order':
      const comparison = a < b ? '<' : a > b ? '>' : '=';
      return {
        type,
        values: [a, b],
        result: a < b ? -1 : a > b ? 1 : 0,
        formula: `a < b ∨ a = b ∨ a > b`,
        explanation: `${formatNumber(a)} ${comparison} ${formatNumber(b)} (Trichotomy property)`,
      };
    
    case 'absolute-value':
      return {
        type,
        values: [a],
        result: Math.abs(a),
        formula: `|a| = { a if a ≥ 0, -a if a < 0 }`,
        explanation: `|${formatNumber(a)}| = ${formatNumber(Math.abs(a))}`,
      };
    
    case 'distributive':
      return {
        type,
        values: [a, b, c],
        result: a * (b + c),
        formula: `a × (b + c) = (a × b) + (a × c)`,
        explanation: `${formatNumber(a)} × (${formatNumber(b)} + ${formatNumber(c)}) = (${formatNumber(a)} × ${formatNumber(b)}) + (${formatNumber(a)} × ${formatNumber(c)}) = ${formatNumber(a * (b + c))}`,
      };
    
    case 'identity':
      return {
        type,
        values: [a],
        result: a,
        formula: `a + 0 = a, a × 1 = a`,
        explanation: `${formatNumber(a)} + 0 = ${formatNumber(a)}, ${formatNumber(a)} × 1 = ${formatNumber(a)}`,
      };
    
    case 'inverse':
      return {
        type,
        values: [a],
        result: 0,
        formula: `a + (-a) = 0, a × (1/a) = 1`,
        explanation: `${formatNumber(a)} + (${formatNumber(-a)}) = 0, ${formatNumber(a)} × ${formatNumber(1/a)} = 1`,
      };
    
    default:
      return {
        type,
        values,
        result: 0,
        formula: '',
        explanation: '',
      };
  }
}

// Calculate error from measurement method
export function calculateAutoEpsilon(method: 'manual' | 'camera', value: number): number {
  if (method === 'manual') {
    // Manual input typically has precision of last decimal place
    return 0.5;
  } else {
    // Camera measurement has pixel-based error
    // Assuming 1 pixel ≈ 0.1 unit at standard distance
    return Math.max(0.5, value * 0.02);
  }
}

// Generate points for number line visualization
export function generateNumberLinePoints(
  center: number,
  range: number,
  steps: number = 10
): number[] {
  const points: number[] = [];
  const step = range / steps;
  const start = center - range / 2;
  
  for (let i = 0; i <= steps; i++) {
    points.push(start + step * i);
  }
  
  return points;
}
