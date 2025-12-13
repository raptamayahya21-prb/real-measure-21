
import React from 'react';
import { motion } from 'framer-motion';

interface NumberLineProps {
    condition: {
        operator: '>' | '<' | '>=' | '<=';
        value: number;
    };
    type: 'integer' | 'whole' | 'real'; // real is continuous, others discrete
}

const NumberLine: React.FC<NumberLineProps> = ({ condition, type }) => {
    const range = 10; // Show range around the value
    const center = condition.value;
    const start = Math.floor(center - range / 2);
    const end = Math.ceil(center + range / 2);
    const ticks = Array.from({ length: end - start + 1 }, (_, i) => start + i);

    // Helper to check if a number satisfies the condition
    const checkCondition = (num: number) => {
        switch (condition.operator) {
            case '>': return num > condition.value;
            case '<': return num < condition.value;
            case '>=': return num >= condition.value;
            case '<=': return num <= condition.value;
            default: return false;
        }
    };

    // Helper filters for types
    const isValidType = (num: number) => {
        if (type === 'whole') return num >= 0;
        return true; // integer and real (for ticks visualization) usually show all, but we might hide negatives for whole mode context if strict
    };

    const spacing = 60; // pixels between ticks

    return (
        <div className="w-full overflow-x-auto py-12 px-4 scrollbar-hide">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease: "backOut" }}
                className="relative min-w-[800px] h-32 flex items-center justify-center mx-auto"
            >
                {/* Main Line */}
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-border rounded-full transform -translate-y-1/2" />

                {/* Active Region Highlight (for Real numbers mostly, or continuous visual) */}
                {/* Simplified logic for rendering the highlight line based on operator */}
                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className={`absolute top-1/2 h-1.5 bg-primary/30 rounded-full transform -translate-y-1/2 origin-left`}
                    style={{
                        left: condition.operator.includes('>') ? `50%` : '0',
                        right: condition.operator.includes('<') ? `50%` : '0',
                        // Adjustment for center alignment logic
                        // This is a simplified visual rep. A real robust chart would calculate pixels.
                        // For now, we center the "value" in the middle of the view.
                    }}
                />

                {/* Ticks and Numbers */}
                <div className="flex justify-center items-center gap-0 absolute inset-0">
                    {ticks.map((num, i) => {
                        const isMet = checkCondition(num) && isValidType(num);
                        const isCenter = num === condition.value;
                        const offset = (num - center) * spacing;

                        return (
                            <motion.div
                                key={num}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }} // Show all ticks for context
                                transition={{ delay: i * 0.05 }}
                                className="absolute top-1/2 flex flex-col items-center transform -translate-y-1/2"
                                style={{
                                    left: `calc(50% + ${offset}px)`,
                                    width: '40px'
                                }}
                            >
                                {/* Tick Mark */}
                                <div className="w-0.5 h-4 bg-muted-foreground mb-4" />

                                {/* Number Circle */}
                                <motion.div
                                    animate={{
                                        scale: isMet ? 1.2 : 1,
                                        backgroundColor: isMet ? 'hsl(220, 99%, 61%)' : 'transparent',
                                        color: isMet ? 'white' : 'currentColor',
                                        borderColor: isMet ? 'transparent' : 'transparent'
                                    }}
                                    className={`
                                    w-10 h-10 rounded-full flex items-center justify-center 
                                    text-sm font-bold font-mono transition-colors duration-300
                                    ${!isMet ? 'text-muted-foreground' : 'shadow-lg shadow-primary/40'}
                                `}
                                >
                                    {num}
                                </motion.div>

                                {/* Point indicator for Real Interval (Open/Closed circle) */}
                                {isCenter && (type === 'real' || type === 'integer' || type === 'whole') && (
                                    <div className="absolute -top-6">
                                        <div className={`w-4 h-4 rounded-full border-2 border-primary ${condition.operator.includes('=') ? 'bg-primary' : 'bg-white'}`} />
                                    </div>
                                )}

                            </motion.div>
                        );
                    })}
                </div>
            </motion.div>
        </div>
    );
};

export default NumberLine;
