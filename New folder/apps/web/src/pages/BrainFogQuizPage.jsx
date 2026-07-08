
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Progress } from '@/components/ui/progress.jsx';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group.jsx';
import { Label } from '@/components/ui/label.jsx';
import { ArrowRight, RotateCcw, Sparkles, Brain, CheckCircle2 } from 'lucide-react';

const QUIZ_QUESTIONS = [
  {
    id: 1,
    text: "How often do you walk into a room and completely forget why you're there?",
    options: [
      { label: "Rarely to Never", value: 0 },
      { label: "Sometimes", value: 2 },
      { label: "Often", value: 3 },
      { label: "Multiple times a day", value: 4 }
    ]
  },
  {
    id: 2,
    text: "Do you struggle to recall specific words or names during mid-conversation?",
    options: [
      { label: "Rarely", value: 0 },
      { label: "Occasionally", value: 2 },
      { label: "Frequently", value: 3 },
      { label: "Almost always", value: 4 }
    ]
  },
  {
    id: 3,
    text: "How would you describe your mental energy by mid-afternoon (2-3 PM)?",
    options: [
      { label: "Sharp and focused", value: 0 },
      { label: "A bit sluggish", value: 2 },
      { label: "Drained", value: 3 },
      { label: "Completely exhausted", value: 4 }
    ]
  },
  {
    id: 4,
    text: "Do complex tasks or multi-tasking feel significantly more overwhelming than they used to?",
    options: [
      { label: "Not at all", value: 0 },
      { label: "Slightly more", value: 2 },
      { label: "Noticeably harder", value: 3 },
      { label: "Extremely overwhelming", value: 4 }
    ]
  },
  {
    id: 5,
    text: "How frequently do you misplace everyday items (keys, phone, glasses)?",
    options: [
      { label: "Rarely", value: 0 },
      { label: "Weekly", value: 2 },
      { label: "Daily", value: 3 },
      { label: "Multiple times daily", value: 4 }
    ]
  },
  {
    id: 6,
    text: "Does it feel like there is a 'cloud' or 'fuzziness' over your thinking?",
    options: [
      { label: "Never", value: 0 },
      { label: "Occasionally", value: 2 },
      { label: "Most days", value: 3 },
      { label: "Constantly", value: 4 }
    ]
  },
  {
    id: 7,
    text: "Do you have difficulty following the plot of a book or movie?",
    options: [
      { label: "No difficulty", value: 0 },
      { label: "Sometimes need to re-read/rewind", value: 2 },
      { label: "Often lose track", value: 3 },
      { label: "Very difficult to focus", value: 4 }
    ]
  },
  {
    id: 8,
    text: "How much does cognitive fatigue impact your daily life and relationships?",
    options: [
      { label: "No impact", value: 0 },
      { label: "Minor annoyance", value: 2 },
      { label: "Noticeable disruption", value: 3 },
      { label: "Severe impact", value: 4 }
    ]
  }
];

export default function BrainFogQuizPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isComplete, setIsComplete] = useState(false);

  const handleSelect = (value) => {
    setAnswers(prev => ({ ...prev, [currentStep]: parseInt(value, 10) }));
  };

  const handleNext = () => {
    if (currentStep < QUIZ_QUESTIONS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setIsComplete(true);
    }
  };

  const handleRetake = () => {
    setCurrentStep(0);
    setAnswers({});
    setIsComplete(false);
  };

  const calculateScore = () => {
    const totalPoints = Object.values(answers).reduce((acc, val) => acc + val, 0);
    const maxPoints = QUIZ_QUESTIONS.length * 4;
    return Math.round((totalPoints / maxPoints) * 100);
  };

  const getResults = (score) => {
    if (score < 25) {
      return { level: "Low", description: "You are experiencing minimal cognitive friction. Keep up your healthy habits!" };
    } else if (score < 50) {
      return { level: "Moderate", description: "You have mild but noticeable mental fatigue. This is common and can often be improved with targeted lifestyle tweaks." };
    } else if (score < 75) {
      return { level: "High", description: "You are dealing with significant brain fog. Your symptoms strongly correlate with hormonal shifts or chronic stress." };
    } else {
      return { level: "Severe", description: "Your cognitive fatigue is severe. It is highly recommended to explore comprehensive support strategies and consult a healthcare provider." };
    }
  };

  const progressPercentage = ((currentStep) / QUIZ_QUESTIONS.length) * 100;

  return (
    <div className="min-h-[100dvh] bg-[#0a0a0a] text-zinc-100 py-16 px-4 sm:px-6 lg:px-8 font-sans selection:bg-[#D4AF37]/30">
      <Helmet>
        <title>Brain Fog Assessment Quiz - Focus After 35</title>
        <meta name="description" content="Assess your cognitive clarity and brain fog severity with our interactive quiz." />
        <link rel="canonical" href="https://focusafter35.com/brain-fog-quiz" />
      </Helmet>

      <div className="max-w-3xl mx-auto space-y-10">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-balance text-[#D4AF37]">
            Brain Fog Assessment
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            Measure your cognitive friction and discover personalized strategies for mental clarity.
          </p>
        </div>

        {!isComplete ? (
          <Card className="border-zinc-800 bg-[#111111] shadow-2xl rounded-2xl overflow-hidden">
            <CardHeader className="bg-zinc-900/50 border-b border-zinc-800/50 pb-6">
              <div className="flex justify-between items-center text-sm font-medium text-zinc-400 mb-4">
                <span>Question {currentStep + 1} of {QUIZ_QUESTIONS.length}</span>
                <span className="text-[#D4AF37]">{Math.round(progressPercentage)}%</span>
              </div>
              <Progress value={progressPercentage} className="h-1.5 bg-zinc-800" indicatorClassName="bg-[#D4AF37]" />
            </CardHeader>
            
            <CardContent className="pt-10 pb-8 min-h-[320px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-8"
                >
                  <CardTitle className="text-2xl md:text-3xl leading-snug font-semibold text-zinc-100">
                    {QUIZ_QUESTIONS[currentStep].text}
                  </CardTitle>
                  
                  <RadioGroup 
                    value={answers[currentStep]?.toString() || ""}
                    onValueChange={handleSelect}
                    className="grid gap-3"
                  >
                    {QUIZ_QUESTIONS[currentStep].options.map((option, idx) => (
                      <div key={idx} className="relative">
                        <RadioGroupItem 
                          value={option.value.toString()} 
                          id={`q${currentStep}-opt${idx}`} 
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor={`q${currentStep}-opt${idx}`}
                          className="flex items-center p-5 rounded-xl border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-800/80 peer-data-[state=checked]:border-[#D4AF37] peer-data-[state=checked]:bg-[#D4AF37]/10 peer-data-[state=checked]:text-[#D4AF37] cursor-pointer transition-all text-base font-medium"
                        >
                          <div className="w-5 h-5 rounded-full border border-zinc-600 mr-4 flex items-center justify-center peer-data-[state=checked]:border-[#D4AF37]">
                            {answers[currentStep]?.toString() === option.value.toString() && (
                              <div className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]" />
                            )}
                          </div>
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </motion.div>
              </AnimatePresence>
            </CardContent>

            <CardFooter className="bg-zinc-900/30 border-t border-zinc-800 p-6 flex justify-end">
              <Button 
                onClick={handleNext} 
                disabled={answers[currentStep] === undefined}
                className="gap-2 bg-[#D4AF37] text-black hover:bg-[#D4AF37]/90 font-semibold px-8"
                size="lg"
              >
                {currentStep === QUIZ_QUESTIONS.length - 1 ? 'See Results' : 'Next Question'}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8"
          >
            {(() => {
              const score = calculateScore();
              const result = getResults(score);
              
              return (
                <>
                  <Card className="border-zinc-800 bg-[#111111] shadow-2xl rounded-2xl overflow-hidden text-center relative">
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
                    <CardContent className="p-10 sm:p-14 flex flex-col items-center space-y-6">
                      <div className="p-5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 mb-2">
                        <Brain className="w-12 h-12 text-[#D4AF37]" />
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-semibold uppercase tracking-widest text-zinc-500">Your Cognitive Score</p>
                        <h2 className="text-7xl font-extrabold tracking-tighter text-zinc-100">
                          {score}<span className="text-3xl text-zinc-600">/100</span>
                        </h2>
                      </div>
                      <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 font-medium">
                        Severity Level: <span className="text-[#D4AF37] font-bold">{result.level}</span>
                      </div>
                      <p className="text-lg text-zinc-400 leading-relaxed max-w-xl mx-auto pt-4">
                        {result.description}
                      </p>
                      
                      <div className="pt-6">
                        <Button 
                          variant="outline" 
                          onClick={handleRetake} 
                          className="gap-2 border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800"
                        >
                          <RotateCcw className="w-4 h-4" />
                          Retake Assessment
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Affiliate CTA Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                    <Card className="border-zinc-800 bg-gradient-to-br from-[#111111] to-zinc-900 overflow-hidden hover:border-[#D4AF37]/50 transition-colors">
                      <CardContent className="p-8 flex flex-col h-full space-y-4">
                        <Sparkles className="w-8 h-8 text-[#D4AF37]" />
                        <h3 className="text-xl font-bold text-zinc-100">Activate Your Brain Waves</h3>
                        <p className="text-zinc-400 text-sm leading-relaxed flex-grow">
                          Struggling with focus? The Genius Wave uses advanced brain entrainment audio to activate your Theta waves, helping clear the fog and restore mental sharpness in just 7 minutes a day.
                        </p>
                        <Button className="w-full bg-[#D4AF37] text-black hover:bg-[#D4AF37]/90 font-bold mt-auto" asChild>
                          <a href="https://example.com/genius-wave" target="_blank" rel="noopener noreferrer">
                            Discover The Genius Wave <ArrowRight className="w-4 h-4 ml-2" />
                          </a>
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className="border-zinc-800 bg-gradient-to-br from-[#111111] to-zinc-900 overflow-hidden hover:border-[#D4AF37]/50 transition-colors">
                      <CardContent className="p-8 flex flex-col h-full space-y-4">
                        <CheckCircle2 className="w-8 h-8 text-[#D4AF37]" />
                        <h3 className="text-xl font-bold text-zinc-100">Metabolic & Energy Support</h3>
                        <p className="text-zinc-400 text-sm leading-relaxed flex-grow">
                          When hormonal shifts cause fatigue, targeted nutrition helps. Nagano Tonic is a specialized blend designed to support metabolism, boost energy levels, and provide the vitality needed to stay clear-headed.
                        </p>
                        <Button className="w-full bg-[#D4AF37] text-black hover:bg-[#D4AF37]/90 font-bold mt-auto" asChild>
                          <a href="https://example.com/nagano-tonic" target="_blank" rel="noopener noreferrer">
                            Explore Nagano Tonic <ArrowRight className="w-4 h-4 ml-2" />
                          </a>
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </>
              );
            })()}
          </motion.div>
        )}
      </div>
    </div>
  );
}
