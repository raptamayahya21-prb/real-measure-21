import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { QUESTIONS, Question } from '../data/questions';
import { Trophy, RotateCcw, CheckCircle2, XCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Challenge = () => {
    const navigate = useNavigate();
    const [challengeQuestions, setChallengeQuestions] = useState<Question[]>([]);
    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

    // Initial load - start challenge immediately or show intro screen?
    // Let's show an intro screen first.
    const [isStarted, setIsStarted] = useState(false);

    const startChallenge = () => {
        const shuffled = [...QUESTIONS].sort(() => 0.5 - Math.random());
        setChallengeQuestions(shuffled.slice(0, 5));
        setCurrentQuestionIdx(0);
        setScore(0);
        setShowResult(false);
        setSelectedAnswer(null);
        setIsStarted(true);
    };

    const handleAnswer = (optionIdx: number) => {
        if (selectedAnswer !== null) return;
        setSelectedAnswer(optionIdx);

        if (optionIdx === challengeQuestions[currentQuestionIdx].correctAnswer) {
            setScore(prev => prev + 1);
        }
    };

    const handleNext = () => {
        if (currentQuestionIdx < challengeQuestions.length - 1) {
            setCurrentQuestionIdx(prev => prev + 1);
            setSelectedAnswer(null);
        } else {
            setShowResult(true);
        }
    };

    const handleBack = () => {
        navigate('/');
    };

    return (
        <div className="max-w-4xl mx-auto pb-20 min-h-screen">
            <AnimatePresence mode="wait">
                {!isStarted ? (
                    <motion.div
                        key="intro"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="text-center space-y-8 py-12"
                    >
                        <div className="inline-flex items-center justify-center p-8 bg-yellow-100 dark:bg-yellow-900/30 rounded-full mb-4 shadow-lg">
                            <Trophy className="w-16 h-16 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <h1 className="text-4xl font-bold">Challenge Mode</h1>
                        <p className="text-xl text-muted-foreground max-w-lg mx-auto">
                            Uji pemahamanmu tentang konsep Bilangan Real, Supremum, Infimum, dan lainnya dengan menjawab 5 pertanyaan acak.
                        </p>
                        <Button size="lg" onClick={startChallenge} className="rounded-full px-8 text-lg font-bold shadow-xl shadow-primary/20">
                            Mulai Tantangan
                        </Button>
                    </motion.div>
                ) : (
                    <motion.div
                        key="quiz"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                    >
                        {!showResult ? (
                            <Card className="p-4 sm:p-6 md:p-8 shadow-2xl border-white/20 overflow-hidden max-w-full">
                                <Button variant="ghost" onClick={() => setIsStarted(false)} className="mb-4 pl-0 hover:bg-transparent text-muted-foreground">
                                    <ArrowLeft className="w-4 h-4 mr-2" /> Keluar
                                </Button>

                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Question {currentQuestionIdx + 1}/{challengeQuestions.length}</span>
                                    <span className="text-sm font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">{score} Poin</span>
                                </div>
                                <Progress value={((currentQuestionIdx) / challengeQuestions.length) * 100} className="mb-8 h-2" />

                                <div className="mb-8 min-h-[100px] overflow-hidden">
                                    <h3 className="text-xl sm:text-2xl font-bold leading-relaxed break-words">{challengeQuestions[currentQuestionIdx]?.question}</h3>
                                </div>

                                <div className="space-y-4 max-w-full overflow-hidden">
                                    {challengeQuestions[currentQuestionIdx]?.options.map((option, idx) => {
                                        const isCorrect = idx === challengeQuestions[currentQuestionIdx].correctAnswer;
                                        const isSelected = selectedAnswer === idx;
                                        let btnClass = "w-full max-w-full overflow-hidden justify-start text-left p-4 sm:p-6 h-auto text-base sm:text-lg transition-all duration-200 border-2";

                                        if (selectedAnswer !== null) {
                                            if (isCorrect) btnClass += " bg-green-50 text-green-900 border-green-500 shadow-md";
                                            else if (isSelected) btnClass += " bg-red-50 text-red-900 border-red-500 shadow-md";
                                            else btnClass += " opacity-100 border-transparent bg-secondary/50";
                                        } else {
                                            btnClass += " hover:bg-secondary/80 hover:border-primary/50 border-transparent bg-secondary/30";
                                        }

                                        return (
                                            <Button
                                                key={idx}
                                                variant="ghost"
                                                className={`${btnClass} max-w-full`}
                                                onClick={() => handleAnswer(idx)}
                                                disabled={selectedAnswer !== null}
                                            >
                                                <div className="flex items-start gap-2 sm:gap-3 w-full overflow-hidden">
                                                    <span className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold shrink-0 transition-colors ${selectedAnswer !== null && isCorrect ? 'border-green-600 text-green-700 bg-green-200' : selectedAnswer !== null && isSelected ? 'border-red-600 text-red-700 bg-red-200' : 'border-muted-foreground/30 text-muted-foreground'}`}>
                                                        {String.fromCharCode(65 + idx)}
                                                    </span>
                                                    <span className="flex-1 font-medium text-left whitespace-normal break-words min-w-0 leading-relaxed" style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}>{option}</span>
                                                    {selectedAnswer !== null && isCorrect && <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 shrink-0" />}
                                                    {selectedAnswer !== null && isSelected && !isCorrect && <XCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 shrink-0" />}
                                                </div>
                                            </Button>
                                        );
                                    })}
                                </div>
                                {selectedAnswer !== null && (
                                    <>
                                        <motion.div
                                            initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                            animate={{ opacity: 1, height: 'auto', marginTop: 24 }}
                                            className="p-4 sm:p-6 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-800 overflow-hidden"
                                        >
                                            <p className="font-bold text-blue-800 dark:text-blue-300 mb-2 flex items-center gap-2">
                                                <InfoIcon className="w-4 h-4" /> Penjelasan
                                            </p>
                                            <p className="text-blue-700 dark:text-blue-200 leading-relaxed break-words">{challengeQuestions[currentQuestionIdx]?.explanation}</p>
                                        </motion.div>
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.2 }}
                                            className="mt-6 flex justify-end"
                                        >
                                            <Button
                                                onClick={handleNext}
                                                size="lg"
                                                className="gap-2 shadow-lg"
                                            >
                                                {currentQuestionIdx < challengeQuestions.length - 1 ? (
                                                    <>
                                                        Pertanyaan Selanjutnya
                                                        <ArrowRight className="w-5 h-5" />
                                                    </>
                                                ) : (
                                                    <>
                                                        Lihat Hasil
                                                        <CheckCircle2 className="w-5 h-5" />
                                                    </>
                                                )}
                                            </Button>
                                        </motion.div>
                                    </>
                                )}
                            </Card>
                        ) : (
                            <Card className="p-12 text-center max-w-2xl mx-auto shadow-2xl border-white/20">
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="mb-8"
                                >
                                    <div className="inline-flex items-center justify-center p-6 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full shadow-inner">
                                        <Trophy className="w-20 h-20 text-yellow-600" />
                                    </div>
                                </motion.div>

                                <h3 className="text-3xl font-bold mb-2">Tantangan Selesai!</h3>
                                <p className="text-muted-foreground mb-10 text-lg">Kamu telah menyelesaikan 5 pertanyaan.</p>

                                <div className="text-7xl font-black text-primary mb-10 tracking-tight">
                                    {Math.round((score / challengeQuestions.length) * 100)}
                                    <span className="text-2xl text-muted-foreground font-normal ml-2">/ 100</span>
                                </div>

                                <div className="grid grid-cols-2 gap-6 max-w-sm mx-auto text-base mb-12">
                                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-2xl border border-green-100 text-green-700 dark:text-green-400">
                                        <p className="font-black text-2xl">{score}</p>
                                        <p className="font-medium">Benar</p>
                                    </div>
                                    <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-2xl border border-red-100 text-red-700 dark:text-red-400">
                                        <p className="font-black text-2xl">{challengeQuestions.length - score}</p>
                                        <p className="font-medium">Salah</p>
                                    </div>
                                </div>

                                <div className="flex gap-4 justify-center">
                                    <Button variant="outline" size="lg" onClick={() => setIsStarted(false)}>
                                        Kembali
                                    </Button>
                                    <Button size="lg" onClick={startChallenge} className="gap-2 shadow-lg shadow-primary/20">
                                        <RotateCcw className="w-4 h-4" /> Coba Lagi
                                    </Button>
                                </div>
                            </Card>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const InfoIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg>
);

export default Challenge;















