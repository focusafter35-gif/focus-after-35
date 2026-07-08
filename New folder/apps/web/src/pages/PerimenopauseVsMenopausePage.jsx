import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import AdSenseHead from '@/components/AdSenseHead.jsx';
import SchemaMarkup from '@/components/SchemaMarkup.jsx';
import { Button } from '@/components/ui/button.jsx';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from '@/components/ui/table.jsx';
import { ArrowRight, Brain, Sparkles, Activity } from 'lucide-react';

const PerimenopauseVsMenopausePage = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Perimenopause vs Menopause: The Complete Guide",
    "description": "Confused about perimenopause vs menopause? Learn the differences, duration, symptoms and how to know which stage you are in.",
    "author": {
      "@type": "Organization",
      "name": "FocusAfter35"
    },
    "publisher": {
      "@type": "Organization",
      "name": "FocusAfter35",
      "logo": {
        "@type": "ImageObject",
        "url": "https://focusafter35.com/favicon.svg"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://focusafter35.com/perimenopause-vs-menopause"
    }
  };

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col items-center">
      <Helmet>
        <title>{`Perimenopause vs Menopause: Key Differences Explained`}</title>
        <meta name="description" content="Confused about perimenopause vs menopause? Learn the differences, duration, symptoms and how to know which stage you are in." />
        <link rel="canonical" href="https://focusafter35.com/perimenopause-vs-menopause" />
      </Helmet>

      <AdSenseHead />
      <SchemaMarkup schemas={[schema]} />

      <main className="flex-grow w-full max-w-4xl mx-auto px-4 py-16 flex flex-col gap-10">
        <article className="w-full">
          <header className="mb-12 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-foreground text-sm font-medium mb-6">
              <Activity className="w-4 h-4" />
              <span>Hormonal Health</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-balance mb-6 text-foreground">
              Perimenopause vs Menopause: The Complete Guide
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-[65ch] mx-auto">
              Many women use these terms interchangeably, but they represent two vastly different hormonal environments. Understanding exactly which phase you are in is the first step to reclaiming your mental clarity and physical energy.
            </p>
          </header>

          <div className="prose prose-invert prose-lg max-w-none text-muted-foreground">
            <p>
              When a woman experiences her first hot flash or sudden memory lapse in her late thirties or early forties, she often wonders, <em>"Am I in menopause?"</em> In reality, menopause is a single, specific milestone. The turbulent years leading up to that milestone—the years characterized by mood swings, irregular cycles, and profound cognitive shifts—are known as perimenopause. 
            </p>
            <p>
              Before diving into the detailed biological mechanisms of each phase, let's look at a clear comparison of how perimenopause and menopause differ across four critical dimensions: duration, hormonal activity, menstrual periods, and physical symptoms.
            </p>

            <div className="my-12 overflow-hidden rounded-xl border-2 border-primary/30 shadow-[0_0_20px_rgba(201,168,76,0.1)] bg-card">
              <Table>
                <TableHeader className="bg-primary/10">
                  <TableRow className="border-b-2 border-primary/30 hover:bg-transparent">
                    <TableHead className="text-primary font-bold text-lg py-4 w-1/5">Stage</TableHead>
                    <TableHead className="text-primary font-bold text-lg py-4">Duration</TableHead>
                    <TableHead className="text-primary font-bold text-lg py-4">Hormones</TableHead>
                    <TableHead className="text-primary font-bold text-lg py-4">Periods</TableHead>
                    <TableHead className="text-primary font-bold text-lg py-4">Symptoms</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="border-b border-primary/10 hover:bg-primary/5 transition-colors">
                    <TableCell className="font-semibold text-foreground py-5">Perimenopause</TableCell>
                    <TableCell className="py-5">4 to 10 years</TableCell>
                    <TableCell className="py-5">Wild, unpredictable fluctuations in estrogen and progesterone</TableCell>
                    <TableCell className="py-5">Irregular lengths, skipped months, varying flow</TableCell>
                    <TableCell className="py-5">Peak severity for hot flashes, brain fog, and sleep disruption</TableCell>
                  </TableRow>
                  <TableRow className="hover:bg-primary/5 transition-colors border-none">
                    <TableCell className="font-semibold text-foreground py-5">Menopause</TableCell>
                    <TableCell className="py-5">Rest of life (Post-menopause)</TableCell>
                    <TableCell className="py-5">Consistently low, stable hormone levels</TableCell>
                    <TableCell className="py-5">Completely absent for 12+ consecutive months</TableCell>
                    <TableCell className="py-5">Gradual stabilization; focus shifts to bone and heart health</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-foreground mt-16 mb-6">
              How Long Does Perimenopause Last?
            </h2>
            <p>
              Perimenopause translates directly to "around menopause." It is the extended transitional phase where your ovaries gradually decrease their production of estrogen and progesterone. However, this decline is not a smooth, linear slope. During perimenopause, your hormone levels can swing erratically—spiking higher than they did in your twenties one week, and plummeting the next.
            </p>
            <p>
              For most women, perimenopause begins in their early to mid-40s, though subtle changes can initiate as early as age 35. The entire phase typically lasts anywhere from 4 to 10 years. Because the brain thrives on chemical consistency, these unpredictable hormonal swings are highly disruptive. This erratic hormonal environment is exactly <Link to="/why-brain-fog-after-35" className="text-primary font-medium hover:underline">why brain fog increases after 35</Link>. 
            </p>
            <p>
              During this timeframe, you will still experience menstrual cycles, but they will likely change in nature. You might have a 21-day cycle followed by a 40-day cycle, or experience heavier flows followed by months of very light spotting. Tracking these changes is critical. We recommend using our free <Link to="/cycle-calculator" className="text-primary font-medium hover:underline">Hormone Cycle Calculator</Link> to monitor your changing rhythms and predict your cognitive energy windows.
            </p>

            <h2 className="text-2xl md:text-3xl font-bold text-foreground mt-16 mb-6">
              What Are the First Signs of Perimenopause?
            </h2>
            <p>
              The symptoms of perimenopause often catch women off guard because they mirror the signs of extreme stress or burnout. While hot flashes and night sweats are the most culturally recognized symptoms, the neurological and psychological impacts often appear first.
            </p>
            <ul className="space-y-4 my-6 pl-0 list-none">
              <li className="flex items-start">
                <span className="text-primary mr-3 mt-1 text-xl">•</span>
                <span><strong>Cognitive Changes:</strong> Difficulty finding words, losing your train of thought mid-sentence, and short-term memory lapses. You can measure the severity of these specific symptoms using our <Link to="/brain-fog-quiz" className="text-primary font-medium hover:underline">Brain Fog Quiz</Link>.</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-3 mt-1 text-xl">•</span>
                <span><strong>Sleep Disruptions:</strong> Waking up consistently between 2 AM and 4 AM, often accompanied by a racing heart or mild night sweats, driven by dropping estrogen.</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-3 mt-1 text-xl">•</span>
                <span><strong>Mood Instability:</strong> Sudden surges of anxiety, irritability, or depressive moods that feel uncharacteristic or out of proportion to external stressors.</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-3 mt-1 text-xl">•</span>
                <span><strong>Physical Shifts:</strong> Joint pain, changes in body odor, weight redistribution around the midsection, and increased fatigue.</span>
              </li>
            </ul>
            <p>
              If you are experiencing a combination of these symptoms and are unsure if they are related to your age, taking a structured assessment like our <Link to="/perimenopause-checker" className="text-primary font-medium hover:underline">Perimenopause Symptom Checker</Link> can provide clarity.
            </p>

            <h2 className="text-2xl md:text-3xl font-bold text-foreground mt-16 mb-6">
              How Do I Know I Have Reached Menopause?
            </h2>
            <p>
              Unlike perimenopause, which is an era of transition, menopause is definitively diagnosed in hindsight. You have officially reached menopause when you have gone 12 consecutive months without a menstrual period. The average age for this milestone in the United States is 51, though it varies widely based on genetics and lifestyle factors.
            </p>
            <p>
              Once you pass the 12-month mark, you enter the "post-menopause" stage for the rest of your life. At this point, your ovaries have ceased releasing eggs and produce very little estrogen. The silver lining? While estrogen levels are permanently low, they are finally <em>stable</em>. 
            </p>
            <p>
              Many women report that the intense brain fog, severe mood swings, and unpredictable energy crashes of perimenopause begin to lift in post-menopause. The brain successfully adapts to its new, lower-estrogen baseline. However, because systemic estrogen remains low, medical focus shifts toward protecting bone density, cardiovascular health, and managing vaginal atrophy. If you still have questions about your specific timeline or symptoms, our comprehensive <Link to="/faq" className="text-primary font-medium hover:underline">FAQ section</Link> offers deep-dive answers into common concerns.
            </p>

            {/* In-content CTA */}
            <div className="my-8 p-8 md:p-10 bg-card border border-primary/20 rounded-2xl text-center shadow-lg">
              <h3 className="text-2xl font-bold text-foreground mb-4">Are Your Symptoms Hormonal?</h3>
              <p className="mb-8 text-muted-foreground max-w-[50ch] mx-auto">
                Stop guessing. Map your current symptoms against the clinical markers of perimenopause and get a clearer picture of your hormonal health today.
              </p>
              <Button asChild size="lg" className="w-full sm:w-auto min-h-[3.5rem] h-auto py-3 sm:py-4 px-6 sm:px-10 text-base sm:text-lg whitespace-normal text-center bg-primary text-primary-foreground hover:bg-primary/90 font-bold">
                <Link to="/perimenopause-checker">
                  Take the Perimenopause Checker Quiz
                </Link>
              </Button>
            </div>
          </div>
        </article>

        {/* Genius Wave CTA Section */}
        <section className="w-full">
          <div className="relative overflow-hidden rounded-3xl bg-card border border-border shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background pointer-events-none" />
            <div className="relative p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-foreground text-sm font-medium mb-4">
                  <Sparkles className="w-4 h-4" />
                  <span>Cognitive Optimization</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4 text-balance">
                  Clear the Hormonal Brain Fog
                </h2>
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed max-w-[50ch] mx-auto md:mx-0">
                  Whether you are deep in the chaos of perimenopause or navigating the new normal of menopause, you don't have to live with a sluggish brain. Discover a science-backed audio protocol designed to stimulate theta brainwaves, helping you reclaim your focus, memory, and sharp thinking.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <Button asChild size="lg" className="w-full sm:w-auto min-h-[3.5rem] h-auto py-3 sm:py-4 px-6 sm:px-8 text-base sm:text-lg whitespace-normal text-center bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-[0_0_15px_rgba(201,168,76,0.3)] hover:shadow-[0_0_25px_rgba(201,168,76,0.5)] transition-all">
                    <a href="https://hop.clickbank.net/?affiliate=mohameddda&vendor=geniusbr&pid=vsl" target="_blank" rel="noopener noreferrer">
                      Discover The Genius Wave <ArrowRight className="w-5 h-5 ml-2 inline-block" />
                    </a>
                  </Button>
                </div>
              </div>
              <div className="w-full md:w-1/3 flex justify-center mt-6 md:mt-0">
                <div className="w-48 h-48 rounded-full bg-primary/5 border-4 border-primary/20 flex items-center justify-center shadow-inner relative">
                  <div className="absolute inset-0 rounded-full border border-primary/30 animate-ping opacity-20" style={{ animationDuration: '3s' }}></div>
                  <Brain className="w-24 h-24 text-primary opacity-90" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default PerimenopauseVsMenopausePage;