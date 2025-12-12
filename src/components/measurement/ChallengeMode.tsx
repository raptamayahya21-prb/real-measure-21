import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, ArrowRight, RotateCcw, Trophy } from 'lucide-react';
import { challengeQuestions } from '@/lib/education-content';
import { Button } from '@/components/ui/button';

interface ChallengeModeProps {
  onClose: () => void;
}

export function ChallengeMode({ onClose }: ChallengeModeProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const question = challengeQuestions[currentQuestion];

  const handleAnswer = (index: number) => {
    if (showResult) return;
    setSelectedAnswer(index);
    setShowResult(true);
    if (index === question.correct) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < challengeQuestions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setCompleted(false);
  };

  if (completed) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel rounded-2xl p-8 text-center max-w-md mx-auto"
      >
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Trophy className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Challenge Complete!</h2>
        <p className="text-muted-foreground mb-6">
          You scored {score} out of {challengeQuestions.length}
        </p>
        <div className="w-full bg-secondary rounded-full h-3 mb-6">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(score / challengeQuestions.length) * 100}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-full bg-primary rounded-full"
          />
        </div>
        <div className="flex gap-3 justify-center">
          <Button variant="outline" onClick={handleRestart} className="gap-2">
            <RotateCcw className="w-4 h-4" />
            Try Again
          </Button>
          <Button onClick={onClose}>
            Done
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel rounded-2xl p-6 max-w-lg mx-auto"
    >
      {/* Progress */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-sm text-muted-foreground">
          Question {currentQuestion + 1} of {challengeQuestions.length}
        </span>
        <div className="flex-1 h-1.5 bg-secondary rounded-full">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestion + 1) / challengeQuestions.length) * 100}%` }}
            className="h-full bg-primary rounded-full"
          />
        </div>
        <span className="text-sm font-medium text-primary">{score} pts</span>
      </div>

      {/* Question */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-1">{question.question}</h3>
        <p className="text-sm text-muted-foreground">{question.questionId}</p>
      </div>

      {/* Options */}
      <div className="space-y-3 mb-6">
        {question.options.map((option, i) => {
          const isCorrect = i === question.correct;
          const isSelected = i === selectedAnswer;
          
          return (
            <motion.button
              key={i}
              whileHover={{ scale: showResult ? 1 : 1.02 }}
              whileTap={{ scale: showResult ? 1 : 0.98 }}
              onClick={() => handleAnswer(i)}
              disabled={showResult}
              className={`w-full p-4 rounded-xl text-left transition-all flex items-center justify-between ${
                showResult
                  ? isCorrect
                    ? 'bg-green-100 border-2 border-green-500 text-green-900'
                    : isSelected
                    ? 'bg-red-100 border-2 border-red-500 text-red-900'
                    : 'bg-secondary text-muted-foreground'
                  : 'bg-secondary hover:bg-secondary/80 text-secondary-foreground'
              }`}
            >
              <div>
                <span className="font-medium">{option}</span>
                <span className="block text-sm opacity-70">{question.optionsId[i]}</span>
              </div>
              {showResult && isCorrect && <CheckCircle2 className="w-5 h-5 text-green-600" />}
              {showResult && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-600" />}
            </motion.button>
          );
        })}
      </div>

      {/* Explanation */}
      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6"
          >
            <div className={`p-4 rounded-xl ${
              selectedAnswer === question.correct 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-amber-50 border border-amber-200'
            }`}>
              <p className="text-sm text-foreground">{question.explanation}</p>
              <p className="text-sm text-muted-foreground mt-1">{question.explanationId}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Actions */}
      {showResult && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-end"
        >
          <Button onClick={handleNext} className="gap-2">
            {currentQuestion < challengeQuestions.length - 1 ? 'Next Question' : 'See Results'}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}
