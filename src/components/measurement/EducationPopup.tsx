import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, BookOpen } from 'lucide-react';
import { educationTopics } from '@/lib/education-content';
import { Button } from '@/components/ui/button';

interface EducationPopupProps {
  isOpen: boolean;
  onClose: () => void;
  initialTopic?: string;
}

export function EducationPopup({ isOpen, onClose, initialTopic }: EducationPopupProps) {
  const [currentIndex, setCurrentIndex] = useState(() => {
    if (initialTopic) {
      const idx = educationTopics.findIndex(t => t.id === initialTopic);
      return idx >= 0 ? idx : 0;
    }
    return 0;
  });

  const topic = educationTopics[currentIndex];

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % educationTopics.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + educationTopics.length) % educationTopics.length);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-2xl md:w-full z-50 glass-panel rounded-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <BookOpen className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-semibold text-foreground">{topic.title}</h2>
                  <p className="text-xs text-muted-foreground">{topic.titleId}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-secondary transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                {/* Description */}
                <div>
                  <p className="text-muted-foreground">{topic.description}</p>
                  <p className="text-sm text-muted-foreground/70 mt-1">{topic.descriptionId}</p>
                </div>

                {/* Main content */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-foreground">English</h3>
                    <div className="bg-secondary/50 rounded-xl p-4">
                      <pre className="text-sm text-secondary-foreground whitespace-pre-wrap font-sans leading-relaxed">
                        {topic.content}
                      </pre>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-foreground">Bahasa Indonesia</h3>
                    <div className="bg-secondary/50 rounded-xl p-4">
                      <pre className="text-sm text-secondary-foreground whitespace-pre-wrap font-sans leading-relaxed">
                        {topic.contentId}
                      </pre>
                    </div>
                  </div>
                </div>

                {/* Examples */}
                <div>
                  <h3 className="text-sm font-medium text-foreground mb-3">Examples / Contoh</h3>
                  <div className="flex flex-wrap gap-2">
                    {topic.examples.map((example, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-mono"
                      >
                        {example}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Navigation */}
            <div className="flex items-center justify-between p-4 border-t border-border">
              <Button
                variant="ghost"
                size="sm"
                onClick={prev}
                className="gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>

              <div className="flex gap-1.5">
                {educationTopics.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      i === currentIndex ? 'bg-primary' : 'bg-border hover:bg-muted-foreground'
                    }`}
                  />
                ))}
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={next}
                className="gap-2"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
