
import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { Slider } from '@/components/ui/slider.jsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.jsx';
import { LineChart, Trash2, BookHeart, PlusCircle } from 'lucide-react';

export default function HormoneeMoodTrackerPage() {
  const getTodayStr = () => {
    const d = new Date();
    const pad = (n) => n.toString().padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  };

  const [entries, setEntries] = useState([]);
  const [formData, setFormData] = useState({
    date: getTodayStr(),
    mood: [5], // Slider uses array
    phase: "Follicular",
    notes: ""
  });

  const handleAddEntry = (e) => {
    e.preventDefault();
    const newEntry = {
      id: Date.now().toString(),
      date: formData.date,
      mood: formData.mood[0],
      phase: formData.phase,
      notes: formData.notes
    };
    
    // Sort entries by date descending
    const updatedEntries = [...entries, newEntry].sort((a, b) => new Date(b.date) - new Date(a.date));
    setEntries(updatedEntries);
    
    // Reset form notes but keep date/phase for ease
    setFormData(prev => ({ ...prev, notes: "", mood: [5] }));
  };

  const handleDelete = (id) => {
    setEntries(entries.filter(entry => entry.id !== id));
  };

  // Analytics
  const analytics = useMemo(() => {
    if (entries.length === 0) return null;

    const phaseStats = entries.reduce((acc, entry) => {
      if (!acc[entry.phase]) acc[entry.phase] = { total: 0, count: 0 };
      acc[entry.phase].total += entry.mood;
      acc[entry.phase].count += 1;
      return acc;
    }, {});

    let highestPhase = { phase: '-', avg: 0 };
    let lowestPhase = { phase: '-', avg: 10 };
    let overallTotal = 0;

    Object.entries(phaseStats).forEach(([phase, data]) => {
      const avg = data.total / data.count;
      if (avg > highestPhase.avg) highestPhase = { phase, avg };
      if (avg < lowestPhase.avg) lowestPhase = { phase, avg };
      overallTotal += data.total;
    });

    const overallAvg = (overallTotal / entries.length).toFixed(1);

    return {
      highestPhase,
      lowestPhase,
      overallAvg
    };
  }, [entries]);

  return (
    <div className="min-h-[100dvh] bg-[#0a0a0a] text-zinc-100 py-16 px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>Hormone Mood Tracker</title>
        <meta name="description" content="Track your daily mood alongside your hormonal phases to find patterns." />
        <link rel="canonical" href="https://focusafter35.com/hormone-mood-tracker" />
      </Helmet>

      <div className="max-w-6xl mx-auto space-y-10">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#D4AF37]">
            Hormone Mood Tracker
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            Log your mood and align it with your cycle to uncover unique personal patterns.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Form Column */}
          <div className="lg:col-span-4 space-y-8">
            <Card className="border-zinc-800 bg-[#111111] rounded-2xl shadow-xl">
              <CardHeader className="bg-zinc-900/30 border-b border-zinc-800/50">
                <CardTitle className="flex items-center gap-2 text-zinc-100">
                  <PlusCircle className="w-5 h-5 text-[#D4AF37]" />
                  New Log Entry
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleAddEntry} className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="date" className="text-zinc-300">Date</Label>
                    <Input 
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                      className="bg-zinc-900 border-zinc-700 text-zinc-100 focus-visible:ring-[#D4AF37]"
                      required
                    />
                  </div>
                  
                  <div className="space-y-4 pt-2">
                    <div className="flex justify-between items-center">
                      <Label className="text-zinc-300">Mood Rating</Label>
                      <span className="text-[#D4AF37] font-bold text-lg">{formData.mood[0]} / 10</span>
                    </div>
                    <Slider
                      value={formData.mood}
                      onValueChange={(val) => setFormData(prev => ({ ...prev, mood: val }))}
                      max={10}
                      min={1}
                      step={1}
                      className="py-2"
                    />
                    <div className="flex justify-between text-xs text-zinc-500 font-medium">
                      <span>Low/Fatigued</span>
                      <span>Great/Energetic</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="phase" className="text-zinc-300">Hormone Phase</Label>
                    <Select value={formData.phase} onValueChange={(val) => setFormData(prev => ({ ...prev, phase: val }))}>
                      <SelectTrigger id="phase" className="bg-zinc-900 border-zinc-700 text-zinc-100 focus:ring-[#D4AF37]">
                        <SelectValue placeholder="Select current phase" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#111111] border-zinc-800 text-zinc-100">
                        <SelectItem value="Menstrual">Menstrual</SelectItem>
                        <SelectItem value="Follicular">Follicular</SelectItem>
                        <SelectItem value="Ovulation">Ovulation</SelectItem>
                        <SelectItem value="Luteal">Luteal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="notes" className="text-zinc-300">Notes (Optional)</Label>
                    <Textarea 
                      id="notes"
                      placeholder="How are you feeling physically and mentally today?"
                      value={formData.notes}
                      onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                      rows={3}
                      className="resize-none bg-zinc-900 border-zinc-700 text-zinc-100 focus-visible:ring-[#D4AF37]"
                    />
                  </div>

                  <Button type="submit" className="w-full bg-[#D4AF37] text-black hover:bg-[#D4AF37]/90 font-bold">
                    Save Entry
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Analytics Card */}
            {analytics && (
              <Card className="border-zinc-800 bg-gradient-to-br from-[#111111] to-zinc-900 rounded-xl overflow-hidden shadow-lg border-l-4 border-l-[#D4AF37]">
                <CardContent className="p-6 flex flex-col items-start space-y-4">
                  <LineChart className="w-8 h-8 text-[#D4AF37] opacity-80" />
                  <div className="w-full">
                    <h3 className="font-semibold text-lg text-zinc-100">Mood Pattern Analysis</h3>
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">Overall Avg</p>
                        <p className="text-3xl font-extrabold text-[#D4AF37]">{analytics.overallAvg}</p>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <p className="text-zinc-500 text-xs uppercase tracking-wider">Best Phase</p>
                          <p className="text-sm font-medium text-zinc-200">{analytics.highestPhase.phase} ({analytics.highestPhase.avg.toFixed(1)})</p>
                        </div>
                        <div>
                          <p className="text-zinc-500 text-xs uppercase tracking-wider">Lowest Phase</p>
                          <p className="text-sm font-medium text-zinc-200">{analytics.lowestPhase.phase} ({analytics.lowestPhase.avg.toFixed(1)})</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* List Column */}
          <div className="lg:col-span-8">
            <Card className="border-zinc-800 bg-[#111111] rounded-2xl shadow-xl h-full flex flex-col">
              <CardHeader className="border-b border-zinc-800/50 pb-4">
                <CardTitle className="text-xl text-zinc-100">Recent Logs</CardTitle>
                <CardDescription className="text-zinc-500">Your documented history for this session.</CardDescription>
              </CardHeader>
              <CardContent className="p-0 flex-grow">
                {entries.length > 0 ? (
                  <div className="overflow-x-auto rounded-b-2xl">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-zinc-800 hover:bg-transparent">
                          <TableHead className="w-[120px] text-zinc-400">Date</TableHead>
                          <TableHead className="text-zinc-400">Phase</TableHead>
                          <TableHead className="text-center text-zinc-400">Mood</TableHead>
                          <TableHead className="w-1/2 text-zinc-400">Notes</TableHead>
                          <TableHead className="text-right text-zinc-400">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {entries.map((entry) => (
                          <TableRow key={entry.id} className="border-zinc-800/50 hover:bg-zinc-900/50 transition-colors">
                            <TableCell className="font-medium text-zinc-300">
                              {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </TableCell>
                            <TableCell>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20">
                                {entry.phase}
                              </span>
                            </TableCell>
                            <TableCell className="text-center font-bold text-lg text-zinc-100">{entry.mood}</TableCell>
                            <TableCell className="text-zinc-400 text-sm max-w-[200px] truncate" title={entry.notes}>
                              {entry.notes || <span className="italic opacity-30">No notes</span>}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleDelete(entry.id)}
                                className="text-zinc-500 hover:text-red-400 hover:bg-red-400/10"
                                aria-label="Delete entry"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-center p-6 text-zinc-500">
                    <div className="p-4 bg-zinc-900 rounded-full mb-4">
                      <BookHeart className="w-8 h-8 text-zinc-700" />
                    </div>
                    <p className="text-lg font-medium text-zinc-300 mb-1">No entries yet</p>
                    <p className="text-sm max-w-sm mx-auto">
                      Fill out the form on the left to start tracking how your hormone phases affect your daily mood.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
        </div>
      </div>
    </div>
  );
}
