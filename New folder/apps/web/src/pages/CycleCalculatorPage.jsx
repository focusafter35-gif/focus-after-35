
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { CalendarDays, Droplets, ArrowRight } from 'lucide-react';

export default function CycleCalculatorPage() {
  // Use YYYY-MM-DD for native date input binding
  const getTodayStr = () => {
    const d = new Date();
    const pad = (n) => n.toString().padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  };

  const [startDate, setStartDate] = useState(getTodayStr());
  const [cycleLength, setCycleLength] = useState("28");
  const [periodLength, setPeriodLength] = useState("5");
  const [results, setResults] = useState(null);

  const formatDate = (dateObj) => {
    return dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleCalculate = (e) => {
    e.preventDefault();
    
    // Parse input date safely
    const [year, month, day] = startDate.split('-').map(Number);
    const parsedStart = new Date(year, month - 1, day);
    
    const cycleDays = parseInt(cycleLength, 10);
    const periodDays = parseInt(periodLength, 10);
    
    if (isNaN(cycleDays) || isNaN(periodDays)) return;

    // Calculate dates
    const nextPeriodDate = new Date(parsedStart);
    nextPeriodDate.setDate(nextPeriodDate.getDate() + cycleDays);

    const ovulationDate = new Date(nextPeriodDate);
    ovulationDate.setDate(ovulationDate.getDate() - 14);

    const fertileStart = new Date(ovulationDate);
    fertileStart.setDate(fertileStart.getDate() - 5);

    const fertileEnd = new Date(ovulationDate);
    fertileEnd.setDate(fertileEnd.getDate() + 1);

    // Determine current phase based on today
    const today = new Date();
    today.setHours(0,0,0,0);
    const timeDiff = today.getTime() - parsedStart.getTime();
    const daysSinceStart = Math.floor(timeDiff / (1000 * 3600 * 24));
    const currentDayOfCycle = (daysSinceStart % cycleDays) + 1;

    let currentPhase = "Unknown";
    if (currentDayOfCycle >= 1 && currentDayOfCycle <= periodDays) {
      currentPhase = "Menstrual";
    } else if (currentDayOfCycle > periodDays && currentDayOfCycle < (cycleDays - 14)) {
      currentPhase = "Follicular";
    } else if (currentDayOfCycle >= (cycleDays - 15) && currentDayOfCycle <= (cycleDays - 13)) {
      currentPhase = "Ovulation";
    } else {
      currentPhase = "Luteal";
    }

    setResults({
      nextPeriod: formatDate(nextPeriodDate),
      ovulation: formatDate(ovulationDate),
      fertileStart: formatDate(fertileStart),
      fertileEnd: formatDate(fertileEnd),
      currentPhase,
      currentDayOfCycle
    });
  };

  return (
    <div className="min-h-[100dvh] bg-[#0a0a0a] text-zinc-100 py-16 px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>Menstrual Cycle & Hormone Phase Calculator</title>
        <meta name="description" content="Calculate your fertile window, next period, and understand your current hormonal phase." />
        <link rel="canonical" href="https://focusafter35.com/cycle-calculator" />
      </Helmet>

      <div className="max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#D4AF37]">
            Cycle Calculator
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            Track your cycle to predict your next period, fertile window, and current hormonal phase.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <Card className="lg:col-span-4 border-zinc-800 bg-[#111111] rounded-2xl shadow-xl">
            <CardHeader className="border-b border-zinc-800/50 pb-6">
              <CardTitle className="text-xl text-zinc-100">Cycle Details</CardTitle>
              <CardDescription className="text-zinc-500">Enter your most recent cycle information.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleCalculate} className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="startDate" className="text-zinc-300">First day of last period</Label>
                  <Input 
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="bg-zinc-900 border-zinc-700 text-zinc-100 focus-visible:ring-[#D4AF37]"
                    required
                  />
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="cycleLength" className="text-zinc-300">Average cycle length (days)</Label>
                  <Input 
                    id="cycleLength"
                    type="number"
                    min="21"
                    max="45"
                    value={cycleLength}
                    onChange={(e) => setCycleLength(e.target.value)}
                    className="bg-zinc-900 border-zinc-700 text-zinc-100 focus-visible:ring-[#D4AF37]"
                    required
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="periodLength" className="text-zinc-300">Average period length (days)</Label>
                  <Input 
                    id="periodLength"
                    type="number"
                    min="1"
                    max="10"
                    value={periodLength}
                    onChange={(e) => setPeriodLength(e.target.value)}
                    className="bg-zinc-900 border-zinc-700 text-zinc-100 focus-visible:ring-[#D4AF37]"
                    required
                  />
                </div>

                <Button type="submit" className="w-full bg-[#D4AF37] text-black hover:bg-[#D4AF37]/90 font-bold" size="lg">
                  Calculate Cycle <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="lg:col-span-8">
            {results ? (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Card className="bg-gradient-to-br from-[#111111] to-zinc-900 border-zinc-800 rounded-2xl shadow-xl overflow-hidden relative">
                  <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                    <CalendarDays className="w-48 h-48 text-[#D4AF37]" />
                  </div>
                  <CardContent className="p-8 sm:p-10 relative z-10">
                    <div className="mb-8">
                      <span className="inline-block px-3 py-1 bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                        Current Phase: {results.currentPhase}
                      </span>
                      <h3 className="text-zinc-400 font-semibold uppercase tracking-wider text-sm mb-2">Next Period Starts</h3>
                      <p className="text-4xl sm:text-5xl font-extrabold text-zinc-100">
                        {results.nextPeriod}
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-zinc-800">
                      <div className="bg-zinc-900/50 p-5 rounded-xl border border-zinc-800/50">
                        <p className="text-zinc-400 text-sm font-medium mb-1 flex items-center gap-2">
                          <Droplets className="w-4 h-4 text-[#D4AF37]" />
                          Estimated Ovulation
                        </p>
                        <p className="text-xl font-bold text-zinc-200">{results.ovulation}</p>
                      </div>
                      <div className="bg-zinc-900/50 p-5 rounded-xl border border-zinc-800/50">
                        <p className="text-zinc-400 text-sm font-medium mb-1 flex items-center gap-2">
                          <CalendarDays className="w-4 h-4 text-[#D4AF37]" />
                          Fertile Window
                        </p>
                        <p className="text-xl font-bold text-zinc-200">
                          {results.fertileStart} – {results.fertileEnd}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {['Menstrual', 'Follicular', 'Luteal'].map((phase) => {
                    const isActive = results.currentPhase === phase;
                    return (
                      <Card key={phase} className={`border-zinc-800 rounded-xl transition-colors ${isActive ? 'bg-[#D4AF37]/5 border-[#D4AF37]/50' : 'bg-[#111111]'}`}>
                        <CardContent className="p-6 flex flex-col items-center text-center space-y-3">
                          <h4 className={`font-bold ${isActive ? 'text-[#D4AF37]' : 'text-zinc-300'}`}>{phase} Phase</h4>
                          <p className="text-sm text-zinc-500">
                            {phase === 'Menstrual' && `Days 1-${periodLength}`}
                            {phase === 'Follicular' && `Days ${parseInt(periodLength)+1}-13`}
                            {phase === 'Luteal' && `Days 15-${cycleLength}`}
                          </p>
                          {isActive && <span className="text-xs text-[#D4AF37] font-medium px-2 py-1 bg-[#D4AF37]/10 rounded-md">You are here</span>}
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>
            ) : (
              <Card className="h-full min-h-[400px] border-zinc-800 border-dashed bg-[#0a0a0a] rounded-2xl flex flex-col items-center justify-center text-zinc-500 p-8 text-center">
                <CalendarDays className="w-16 h-16 mb-4 opacity-20 text-[#D4AF37]" />
                <p className="text-lg font-medium text-zinc-300">Ready to calculate</p>
                <p className="text-sm max-w-sm mt-2">Enter your cycle details on the left to see your predicted dates and current hormonal phase.</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
