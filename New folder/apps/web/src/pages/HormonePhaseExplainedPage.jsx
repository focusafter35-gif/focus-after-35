import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import AdSenseHead from '@/components/AdSenseHead.jsx';
import SchemaMarkup from '@/components/SchemaMarkup.jsx';
import { Button } from '@/components/ui/button.jsx';
import { ArrowRight, Calendar, Brain, Sparkles } from 'lucide-react';

const HormonePhaseExplainedPage = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "The 4 Hormone Cycle Phases: How Each One Affects Your Focus, Energy & Mood",
    "description": "Learn how the 4 phases of your menstrual cycle affect your brain, energy and focus. Free hormone cycle calculator included.",
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
      "@id": "https://focusafter35.com/hormone-phases-explained"
    }
  };

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col items-center">
      {/* CRITICAL SEO FIX: Permanent Meta Tags - DO NOT REMOVE OR CHANGE */}
      <Helmet>
        <title>{`The 4 Hormone Cycle Phases Explained | FocusAfter35`}</title>
        <meta name="description" content="Learn how the 4 phases of your hormone cycle affect your focus, energy and mood every week. Free cycle calculator included." />
        <link rel="canonical" href="https://focusafter35.com/hormone-phases-explained" />
        <meta property="og:title" content="The 4 Hormone Cycle Phases Explained | FocusAfter35" />
        <meta property="og:description" content="Learn how the 4 phases of your hormone cycle affect your focus, energy and mood." />
        <meta property="og:url" content="https://focusafter35.com/hormone-phases-explained" />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="The 4 Hormone Cycle Phases Explained | FocusAfter35" />
        <meta name="twitter:description" content="Learn how the 4 phases of your hormone cycle affect your focus, energy and mood." />
      </Helmet>

      <AdSenseHead />
      <SchemaMarkup schemas={[schema]} />

      <main className="flex-grow w-full max-w-4xl mx-auto px-4 py-16 flex flex-col gap-8">
        <article className="edu-section w-full">
          <header className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-balance mb-6 text-foreground">
              The 4 Hormone Cycle Phases Explained
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-[65ch] mx-auto">
              Your hormones are not just reproductive tools—they are powerful chemical messengers that dictate your brain function, energy levels, and daily mood.
            </p>
          </header>

          <div className="prose prose-invert prose-lg max-w-none text-muted-foreground">
            <p>
              For women over 35, understanding the natural ebb and flow of estrogen and progesterone is the ultimate bio-hack. As we approach perimenopause, these fluctuations can become more erratic, leading to unexpected cognitive friction. By tracking your cycle and aligning your tasks with your hormonal reality, you can stop fighting your biology and start leveraging it.
            </p>
            <p>
              If you've been wondering <Link to="/why-brain-fog-after-35" className="text-primary hover:underline">why brain fog increases after 35</Link>, the answer often lies in how your brain responds to these four distinct phases. Let's break down exactly what is happening in your brain and body during each phase of your cycle.
            </p>

            <div className="my-12 p-8 bg-primary/5 border border-primary/20 rounded-2xl text-center">
              <Calendar className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-foreground mb-3">Track Your Phases Automatically</h3>
              <p className="mb-6 text-muted-foreground">
                Don't want to do the math? Use our free tool to find out exactly which phase you are in today and get personalized cognitive advice.
              </p>
              <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-8">
                <Link to="/cycle-calculator">
                  Open Cycle Calculator <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-foreground mt-12 mb-6">
              Phase 1 — Menstrual (Days 1-5): Rest and Restoration
            </h2>
            <p>
              Day 1 marks the first day of your period. During this phase, all of your primary sex hormones—estrogen, progesterone, and testosterone—drop to their lowest levels. 
            </p>
            <p>
              <strong>Focus & Brain Impact:</strong> Because estrogen is closely tied to serotonin and dopamine production, this sudden drop can leave your brain feeling sluggish. You might experience a mild form of cognitive fatigue or find it difficult to concentrate on highly complex, analytical tasks. This is a natural biological response, not a personal failing.
            </p>
            <p>
              <strong>Energy & Mood:</strong> Your physical energy is typically at its lowest. You may feel more introverted, reflective, and intuitive. Instead of pushing through high-stress meetings, use this time for course-correction, journaling, and low-demand administrative work. Give your brain the grace to rest.
            </p>

            <h2 className="text-2xl md:text-3xl font-bold text-foreground mt-12 mb-6">
              Phase 2 — Follicular (Days 6-13): Peak Energy and Creativity
            </h2>
            <p>
              As your period ends, your pituitary gland releases Follicle Stimulating Hormone (FSH), signaling your ovaries to produce more estrogen. This phase is often described as the "inner spring" of your cycle.
            </p>
            <p>
              <strong>Focus & Brain Impact:</strong> Rising estrogen acts like premium fuel for your brain. It increases neuroplasticity, enhances blood flow to the brain, and boosts the production of neurotransmitters that make you feel sharp and alert. If you've been struggling with mental clarity, this is the phase where the fog lifts. It is the optimal time for learning new skills, strategic planning, and complex problem-solving.
            </p>
            <p>
              <strong>Energy & Mood:</strong> You will likely feel a surge in physical energy, optimism, and creativity. You are more resilient to stress and more open to new experiences. Capitalize on this window to tackle your most demanding projects.
            </p>

            <h2 className="text-2xl md:text-3xl font-bold text-foreground mt-12 mb-6">
              Phase 3 — Ovulatory (Days 14-16): Confidence and Communication Peak
            </h2>
            <p>
              This brief window is triggered by a surge in Luteinizing Hormone (LH), leading to the release of an egg. Estrogen reaches its absolute peak, accompanied by a slight bump in testosterone.
            </p>
            <p>
              <strong>Focus & Brain Impact:</strong> Your verbal fluency and memory are at their highest. The brain's language centers are highly stimulated by peak estrogen levels. You will likely find it easier to articulate your thoughts, read social cues, and connect with others. 
            </p>
            <p>
              <strong>Energy & Mood:</strong> You are at your most magnetic and confident. This is the perfect time for important presentations, negotiations, networking events, or recording videos. However, if you are over 35 and notice these peaks are becoming less predictable, it may be worth taking our <Link to="/perimenopause-checker" className="text-primary hover:underline">Perimenopause Symptom Checker</Link> to see if your cycle is beginning to shift.
            </p>

            <h2 className="text-2xl md:text-3xl font-bold text-foreground mt-12 mb-6">
              Phase 4 — Luteal (Days 17-28): Detail Work and Brain Fog Risk
            </h2>
            <p>
              After ovulation, the ruptured follicle (corpus luteum) begins producing progesterone. This phase is the longest and is often split into two halves. In the first half, you ride a wave of calm focus. In the second half, hormones plummet, leading to PMS symptoms.
            </p>
            <p>
              <strong>Focus & Brain Impact:</strong> Progesterone has a sedating, calming effect on the brain. While this can be great for deep, focused, detail-oriented work (like editing, organizing, or bookkeeping), the steep drop in estrogen right before your period can trigger severe cognitive friction. If you frequently lose your train of thought during this week, you are not alone. You can measure the severity of these symptoms using our <Link to="/brain-fog-quiz" className="text-primary hover:underline">Brain Fog Quiz</Link>.
            </p>
            <p>
              <strong>Energy & Mood:</strong> Your energy turns inward. You may feel a strong desire to "nest," organize your space, and wrap up loose ends. As you approach day 28, energy dips significantly, and mood swings or irritability can surface. Prioritize self-care, magnesium-rich foods, and adequate sleep.
            </p>

            <hr className="my-12 border-border" />

            <h3 className="text-xl font-bold text-foreground mb-4">Navigating the Changes</h3>
            <p>
              As women cross into their late 30s and 40s, these four phases can become compressed, elongated, or erratic. This hormonal rollercoaster is the primary driver behind mid-life cognitive changes. If you have more questions about how to manage these shifts, visit our <Link to="/faq" className="text-primary hover:underline">Frequently Asked Questions</Link> page for expert insights.
            </p>
          </div>
        </article>

        {/* Genius Wave CTA Section */}
        <section className="w-full max-w-4xl mx-auto mt-8 mb-16">
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
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                  Don't let fluctuating estrogen dictate your mental clarity. Discover a science-backed audio protocol designed to stimulate theta brainwaves, helping you reclaim your focus, memory, and sharp thinking regardless of your cycle phase.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-8 h-14 text-lg shadow-lg hover:shadow-primary/20 transition-all">
                    <a href="https://hop.clickbank.net/?affiliate=mohameddda&vendor=geniusbr&pid=vsl" target="_blank" rel="noopener noreferrer">
                      Discover The Genius Wave <ArrowRight className="w-5 h-5 ml-2" />
                    </a>
                  </Button>
                </div>
              </div>
              <div className="w-full md:w-1/3 flex justify-center">
                <div className="w-48 h-48 rounded-full bg-primary/5 border-4 border-primary/20 flex items-center justify-center shadow-inner">
                  <Brain className="w-24 h-24 text-primary opacity-80" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HormonePhaseExplainedPage;