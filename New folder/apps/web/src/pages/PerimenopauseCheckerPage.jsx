
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Checkbox } from '@/components/ui/checkbox.jsx';
import { Label } from '@/components/ui/label.jsx';
import { ActivitySquare, RotateCcw, AlertTriangle, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const SYMPTOMS = [
  { id: 's1', label: 'Hot flashes or sudden warmth' },
  { id: 's2', label: 'Night sweats disrupting sleep' },
  { id: 's3', label: 'Unexplained mood swings or irritability' },
  { id: 's4', label: 'Difficulty falling or staying asleep' },
  { id: 's5', label: 'Irregular or skipped periods' },
  { id: 's6', label: 'Vaginal dryness or discomfort' },
  { id: 's7', label: 'Brain fog and memory lapses' },
  { id: 's8', label: 'Unexplained weight gain (especially midsection)' },
  { id: 's9', label: 'New or worsening joint/muscle pain' },
  { id: 's10', label: 'More frequent headaches or migraines' },
  { id: 's11', label: 'Increased anxiety or panic feelings' },
  { id: 's12', label: 'Noticeable drop in libido' },
  { id: 's13', label: 'Profound, unexplained fatigue' },
  { id: 's14', label: 'Occasional heart palpitations' },
  { id: 's15', label: 'Changes in skin (dryness, thinning)' }
];

export default function PerimenopauseCheckerPage() {
  const [checkedSymptoms, setCheckedSymptoms] = useState(new Set());
  const [results, setResults] = useState(null);

  const handleToggle = (id) => {
    const newChecked = new Set(checkedSymptoms);
    if (newChecked.has(id)) {
      newChecked.delete(id);
    } else {
      newChecked.add(id);
    }
    setCheckedSymptoms(newChecked);
  };

  const handleCalculate = () => {
    const count = checkedSymptoms.size;
    const score = Math.round((count / SYMPTOMS.length) * 100);
    
    let level = "Low Risk";
    let description = "You are experiencing very few symptoms. Keep monitoring your body for changes over time.";
    
    if (count >= 3 && count <= 6) {
      level = "Moderate Risk";
      description = "You have several classic symptoms. This suggests you may be in the early stages of perimenopause. Lifestyle and nutritional adjustments can be very effective here.";
    } else if (count >= 7 && count <= 10) {
      level = "High Risk";
      description = "Your symptom profile strongly indicates perimenopause. The drop and fluctuation in estrogen are likely causing these widespread effects. Consider exploring targeted supplements and speaking with your doctor.";
    } else if (count > 10) {
      level = "Very High Risk";
      description = "You are experiencing almost all common symptoms. It is highly recommended to speak with a healthcare provider for robust support options, including hormone therapy or targeted treatments.";
    }

    setResults({ score, level, description, count });
  };

  const handleRetake = () => {
    setCheckedSymptoms(new Set());
    setResults(null);
  };

  return (
    <div className="min-h-[100dvh] bg-[#0a0a0a] text-zinc-100 py-16 px-4 sm:px-6 lg:px-8 selection:bg-[#D4AF37]/30">
      <Helmet>
        <title>Perimenopause Symptom Checker</title>
        <meta name="description" content="Check your symptoms to assess your perimenopause risk level." />
        <link rel="canonical" href="https://focusafter35.com/perimenopause-checker" />
      </Helmet>

      <div className="max-w-4xl mx-auto space-y-10">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-balance text-[#D4AF37]">
            Perimenopause Checker
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            Identify common perimenopause symptoms to understand your body's current hormonal transition.
          </p>
        </div>

        {!results ? (
          <Card className="border-zinc-800 bg-[#111111] rounded-2xl shadow-xl">
            <CardHeader className="bg-zinc-900/40 border-b border-zinc-800/50 pb-6">
              <CardTitle className="text-2xl text-zinc-100">Symptom Checklist</CardTitle>
              <CardDescription className="text-zinc-400 text-base">
                Select all the symptoms you have experienced regularly over the past 3 to 6 months.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 sm:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {SYMPTOMS.map((symptom) => {
                  const isChecked = checkedSymptoms.has(symptom.id);
                  return (
                    <div 
                      key={symptom.id} 
                      className={`flex items-start space-x-4 p-4 rounded-xl border transition-all duration-200 ${
                        isChecked 
                          ? 'bg-[#D4AF37]/10 border-[#D4AF37]/50 shadow-sm' 
                          : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-600'
                      }`}
                    >
                      <Checkbox 
                        id={symptom.id} 
                        checked={isChecked}
                        onCheckedChange={() => handleToggle(symptom.id)}
                        className={`mt-1 ${isChecked ? 'border-[#D4AF37] bg-[#D4AF37] text-black' : 'border-zinc-600 data-[state=checked]:bg-[#D4AF37]'}`}
                      />
                      <Label 
                        htmlFor={symptom.id}
                        className={`flex-1 text-base leading-snug cursor-pointer font-medium ${isChecked ? 'text-[#D4AF37]' : 'text-zinc-300'}`}
                      >
                        {symptom.label}
                      </Label>
                    </div>
                  );
                })}
              </div>
            </CardContent>
            <CardFooter className="bg-zinc-900/30 border-t border-zinc-800 p-6 flex justify-end">
              <Button 
                size="lg" 
                onClick={handleCalculate} 
                disabled={checkedSymptoms.size === 0}
                className="bg-[#D4AF37] text-black hover:bg-[#D4AF37]/90 font-bold px-8"
              >
                Calculate Risk Score <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8"
          >
            <Card className="border-zinc-800 bg-[#111111] rounded-2xl shadow-2xl text-center overflow-hidden relative">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
              <CardContent className="p-10 sm:p-14 space-y-6 flex flex-col items-center">
                <div className="p-5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 mb-2">
                  <ActivitySquare className="w-12 h-12 text-[#D4AF37]" />
                </div>
                
                <div>
                  <p className="text-sm font-semibold uppercase tracking-widest text-zinc-500 mb-2">Assessment Result</p>
                  <h2 className="text-4xl md:text-5xl font-extrabold text-[#D4AF37] mb-6">
                    {results.level}
                  </h2>
                </div>

                <div className="flex gap-8 justify-center items-center py-6 border-y border-zinc-800 w-full max-w-md">
                  <div className="space-y-1">
                    <p className="text-4xl font-bold text-zinc-100">{results.score}</p>
                    <p className="text-sm text-zinc-500 uppercase tracking-wide font-medium">Risk Score</p>
                  </div>
                  <div className="w-px h-16 bg-zinc-800"></div>
                  <div className="space-y-1">
                    <p className="text-4xl font-bold text-zinc-100">{results.count}<span className="text-xl text-zinc-600">/{SYMPTOMS.length}</span></p>
                    <p className="text-sm text-zinc-500 uppercase tracking-wide font-medium">Symptoms</p>
                  </div>
                </div>

                <p className="text-lg text-zinc-300 leading-relaxed max-w-2xl mx-auto py-4">
                  {results.description}
                </p>

                <Button variant="outline" size="lg" onClick={handleRetake} className="mt-4 gap-2 border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800">
                  <RotateCcw className="w-4 h-4" />
                  Retake Assessment
                </Button>
              </CardContent>
            </Card>

            {/* Affiliate CTA Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-zinc-800 bg-gradient-to-br from-[#111111] to-zinc-900 overflow-hidden hover:border-[#D4AF37]/50 transition-colors">
                <CardContent className="p-8 flex flex-col h-full space-y-4">
                  <AlertTriangle className="w-8 h-8 text-[#D4AF37]" />
                  <h3 className="text-xl font-bold text-zinc-100">Metabolic Support for Hormones</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed flex-grow">
                    Hormonal shifts often bring weight changes and fatigue. Nagano Tonic offers a natural metabolic boost designed to enhance energy levels and combat the sluggishness of perimenopause safely.
                  </p>
                  <Button className="w-full bg-[#D4AF37] text-black hover:bg-[#D4AF37]/90 font-bold mt-auto" asChild>
                    <a href="https://example.com/nagano-tonic" target="_blank" rel="noopener noreferrer">
                      Discover Nagano Tonic <ArrowRight className="w-4 h-4 ml-2" />
                    </a>
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-zinc-800 bg-gradient-to-br from-[#111111] to-zinc-900 overflow-hidden hover:border-[#D4AF37]/50 transition-colors">
                <CardContent className="p-8 flex flex-col h-full space-y-4">
                  <Sparkles className="w-8 h-8 text-[#D4AF37]" />
                  <h3 className="text-xl font-bold text-zinc-100">Clear Perimenopause Brain Fog</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed flex-grow">
                    Struggling with focus and memory? The Genius Wave helps activate your brain's natural theta state, providing an effortless way to clear mental fog and improve cognitive function in just minutes.
                  </p>
                  <Button className="w-full bg-[#D4AF37] text-black hover:bg-[#D4AF37]/90 font-bold mt-auto" asChild>
                    <a href="https://example.com/genius-wave" target="_blank" rel="noopener noreferrer">
                      Explore The Genius Wave <ArrowRight className="w-4 h-4 ml-2" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>

          </motion.div>
        )}
      </div>
    </div>
  );
}
