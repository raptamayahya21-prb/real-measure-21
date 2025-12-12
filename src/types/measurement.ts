// Real Number Measurement Types

export interface MeasurementValue {
  id: string;
  value: number;
  epsilon: number;
  label: string;
  timestamp: Date;
}

export interface IntervalConfig {
  type: 'closed' | 'open' | 'half-open-left' | 'half-open-right';
  lowerBound: number;
  upperBound: number;
}

export interface RealNumberInterval {
  config: IntervalConfig;
  supremum: number;
  infimum: number;
  contains: (x: number) => boolean;
}

export type RealPropertyType = 
  | 'commutative-add'
  | 'commutative-mult'
  | 'associative-add'
  | 'associative-mult'
  | 'order'
  | 'absolute-value'
  | 'distributive'
  | 'identity'
  | 'inverse';

export interface RealPropertyDemo {
  type: RealPropertyType;
  values: number[];
  result: number;
  explanation: string;
  formula: string;
}

export type MeasurementMode = 'manual' | 'camera';
export type LearningMode = 'theory' | 'practice' | 'challenge';

export interface EducationTopic {
  id: string;
  title: string;
  titleId: string;
  description: string;
  descriptionId: string;
  content: string;
  contentId: string;
  examples: string[];
}
