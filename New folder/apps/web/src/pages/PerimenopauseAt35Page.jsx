import React from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import AdSenseHead from '@/components/AdSenseHead.jsx';
import SchemaMarkup from '@/components/SchemaMarkup.jsx';
import TrendingCTABox from '@/components/TrendingCTABox.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent } from '@/components/ui/card.jsx';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table.jsx';

const PerimenopauseAt35Page = () => {
  const navigate = useNavigate();

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Can perimenopause start at 35?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, new 2025 research indicates that early perimenopause symptoms can begin as early as age 35 for many women, driven by environmental factors, stress, and genetic predisposition."
        }
      },
      {
        "@type": "Question",
        "name": "What are the early signs of perimenopause at 35?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Early signs include changes in cycle length, unexplained mood swings, new onset of brain fog, sleep disruptions, and subtle changes in energy levels that differ from normal PMS."
        }
      }
    ]
  };

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col items-center">
      {/* CRITICAL SEO FIX: Permanent Meta Tags - DO NOT REMOVE OR CHANGE */}
      <Helmet>
        <title>{`Can Perimenopause Start at 35? What New Research Shows | FocusAfter35`}</title>
        <meta name="description" content="New 2025 research shows perimenopause can begin at 35. Learn the early signs and take our free stage checker." />
        <link rel="canonical" href="https://focusafter35.com/perimenopause-at-35" />
        <meta property="og:title" content="Can Perimenopause Start at 35? | FocusAfter35" />
        <meta property="og:description" content="New research shows perimenopause can begin at 35. Learn the early signs." />
        <meta property="og:url" content="https://focusafter35.com/perimenopause-at-35" />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Can Perimenopause Start at 35? | FocusAfter35" />
        <meta name="twitter:description" content="New research shows perimenopause can begin at 35. Learn the early signs." />
      </Helmet>

      <AdSenseHead />
      <SchemaMarkup schemas={[schema]} />

      <main className="flex-grow w-full max-w-4xl mx-auto px-4 py-16 flex flex-col gap-12">
        <header className="text-center flex flex-col gap-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-balance text-foreground">
            Can Perimenopause Start at 35?
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Surprising new research reveals that the hormonal transition begins much earlier than previously thought. Here is what you need to know about early perimenopause.
          </p>
        </header>

        <article className="flex flex-col gap-10 text-base md:text-lg leading-relaxed text-foreground/90">
          
          {/* Section 1: What the Research Says */}
          <section className="flex flex-col gap-4">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
              What the Research Says
            </h2>
            <p>
              For decades, the medical consensus held that perimenopause—the transitional phase leading up to menopause—typically began in a woman's mid-to-late 40s. However, groundbreaking 2025 research findings are shifting this paradigm entirely. Recent longitudinal studies indicate that over 50% of women between the ages of 30 and 35 are now reporting symptoms consistent with early perimenopause. This earlier onset is not an anomaly; it is becoming a documented trend in modern women's health.
            </p>
            <p>
              Why is early perimenopause becoming more common? Researchers point to a complex interplay of modern lifestyle factors. Chronic stress, which elevates cortisol and disrupts the delicate balance of the hypothalamic-pituitary-ovarian (HPO) axis, plays a massive role. Additionally, environmental factors such as endocrine-disrupting chemicals found in everyday plastics and cosmetics are accelerating hormonal shifts. Genetic predisposition also remains a key factor; if your mother experienced early menopause, you are statistically more likely to experience early perimenopause.
            </p>
            <p>
              The hormonal changes that begin in your early 30s are often subtle at first. Progesterone is typically the first hormone to decline, leading to estrogen dominance. This fluctuation in estrogen and drop in progesterone can trigger a cascade of physical and cognitive symptoms long before your period actually stops. Understanding these <Link to="/hormone-phases-explained" className="text-primary hover:underline font-medium">hormone phases</Link> is critical for women in their 30s who feel "off" but are told they are too young for menopause.
            </p>
          </section>

          {/* Section 2: Early Perimenopause Signs vs Normal PMS */}
          <section className="flex flex-col gap-6">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
              Early Perimenopause Signs vs Normal PMS
            </h2>
            <p>
              One of the biggest challenges in identifying early perimenopause is that its symptoms closely mimic severe Premenstrual Syndrome (PMS). However, there are distinct differences in severity, duration, and onset.
            </p>
            
            <Card className="overflow-hidden border-border/50 shadow-md">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="w-[30%] font-semibold text-foreground">Symptom</TableHead>
                    <TableHead className="w-[35%] font-semibold text-foreground">Perimenopause</TableHead>
                    <TableHead className="w-[35%] font-semibold text-foreground">Normal PMS</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Mood Changes</TableCell>
                    <TableCell>Unpredictable, intense mood swings or new anxiety that can happen at any point in the cycle.</TableCell>
                    <TableCell>Mild irritability or sadness strictly limited to the days right before menstruation.</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Cycle Length</TableCell>
                    <TableCell>Noticeably shorter or longer cycles (e.g., changing from 28 days to 24 or 35 days).</TableCell>
                    <TableCell>Consistent cycle length, usually varying by no more than 1-2 days each month.</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Temperature</TableCell>
                    <TableCell>Hot flashes, sudden flushing, or night sweats that disrupt sleep.</TableCell>
                    <TableCell>Slightly elevated basal body temperature post-ovulation, but rarely severe sweating.</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Cognitive Function</TableCell>
                    <TableCell>Persistent brain fog, difficulty finding words, and memory lapses.</TableCell>
                    <TableCell>Mild fatigue or distraction, resolving immediately once the period begins.</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Physical Pain</TableCell>
                    <TableCell>New onset of joint pain, muscle stiffness, or frequent headaches.</TableCell>
                    <TableCell>Standard breast tenderness and lower abdominal cramping.</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Card>

            <div className="bg-muted/30 p-6 rounded-xl border border-border/50 mt-2">
              <h3 className="text-xl font-semibold mb-3">Key Differences</h3>
              <p className="text-base">
                The hallmark of perimenopause is unpredictability. While PMS follows a predictable monthly pattern and resolves when bleeding starts, perimenopause symptoms can strike at any time during your cycle. The severity is also notably higher, often impacting daily functioning and quality of life. If you are experiencing cognitive symptoms, you can learn more about the <Link to="/estrogen-brain-connection" className="text-primary hover:underline font-medium">estrogen brain connection</Link> to understand why this happens.
              </p>
            </div>
          </section>

          {/* Section 3: Why Doctors Often Miss Early Perimenopause */}
          <section className="flex flex-col gap-4">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
              Why Doctors Often Miss Early Perimenopause
            </h2>
            <p>
              It is incredibly common for women in their 30s to visit their doctor with a list of valid symptoms, only to be dismissed, prescribed antidepressants, or told they are simply stressed. This happens primarily due to systemic age bias in medical practice. Many healthcare providers are trained to view 51 as the average age of menopause and assume that a 35-year-old is simply "too young" to be experiencing hormonal decline. They do not expect perimenopause in the 30s, leading to frequent misdiagnosis.
            </p>
            <p>
              Furthermore, the symptoms of early perimenopause overlap heavily with other conditions such as thyroid disorders, clinical depression, or chronic fatigue syndrome. When doctors run standard blood panels, they often check Follicle-Stimulating Hormone (FSH) levels. However, hormone testing during perimenopause has severe limitations. FSH and estrogen levels fluctuate wildly from day to day and even hour to hour during this transitional phase. A single blood test showing "normal" hormone levels on a Tuesday does not invalidate the severe hot flashes you experienced on Sunday.
            </p>
            <p>
              Because standard tests can be inconclusive, it is vital for women to advocate for themselves. Do not accept "you're just getting older" as a diagnosis. Request comprehensive hormone panels, including thyroid function, Vitamin D, and a full iron panel, to rule out other issues. Keep a detailed symptom diary to present undeniable data to your provider. Understanding the difference between <Link to="/perimenopause-vs-menopause" className="text-primary hover:underline font-medium">perimenopause vs menopause</Link> will empower you to have more productive conversations with your healthcare team.
            </p>
          </section>

          {/* Section 4: What to Do If You Suspect Early Perimenopause */}
          <section className="flex flex-col gap-4">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
              What to Do If You Suspect Early Perimenopause
            </h2>
            <p>
              If you suspect you are entering early perimenopause, the first and most crucial action step is to start tracking your symptoms meticulously. Document your cycle changes, noting not just the dates you bleed, but the heaviness of the flow and any spotting. Track your mood, energy patterns, and sleep quality daily. Using a <Link to="/cycle-calculator" className="text-primary hover:underline font-medium">cycle calculator</Link> can help you identify irregularities that you might otherwise miss.
            </p>
            <p>
              You should seek medical help when your symptoms persist for more than two consecutive months or when they begin to significantly impact your quality of life, relationships, or career. Bring your tracked data to your appointment. In the meantime, lifestyle modifications can provide substantial relief. Prioritize stress management techniques to lower cortisol, which directly competes with progesterone production. Optimize your sleep environment to combat night sweats, and focus on a nutrient-dense diet rich in phytoestrogens and healthy fats to support hormone synthesis.
            </p>
            <p>
              Regular, moderate exercise—particularly strength training—is also essential for maintaining bone density and metabolic health during hormonal shifts. If cognitive issues are your primary concern, consider taking our <Link to="/brain-fog-quiz" className="text-primary hover:underline font-medium">brain fog quiz</Link> to assess your symptoms. Remember, you do not have to suffer in silence. With the right tracking tools, lifestyle adjustments, and medical support, you can navigate early perimenopause with confidence and vitality. For more common questions, visit our <Link to="/faq" className="text-primary hover:underline font-medium">FAQ page</Link>.
            </p>
          </section>

          {/* CTA Button Section */}
          <section className="flex flex-col items-center justify-center py-12 px-4 bg-muted/20 rounded-2xl border border-border/50 text-center gap-6 my-8">
            <div className="flex flex-col gap-2">
              <h3 className="text-2xl font-bold">Ready to understand your perimenopause stage?</h3>
              <p className="text-muted-foreground">Take our free, comprehensive assessment to see where you stand.</p>
            </div>
            <Button 
              size="lg" 
              onClick={() => navigate('/perimenopause-checker')}
              className="text-lg px-8 h-14 shadow-lg hover:shadow-xl transition-all"
            >
              Check Your Stage Free
            </Button>
          </section>

          {/* Promotional CTA Boxes */}
          <section className="flex flex-col gap-8 mt-4">
            <TrendingCTABox 
              title="Watch the Free Presentation"
              description="Discover the 7-second brain wave ritual that thousands of women are using to clear brain fog and restore mental sharpness naturally during hormonal transitions."
              buttonText="Watch the Free Presentation"
              buttonUrl="https://hop.clickbank.net/?affiliate=mohameddda&vendor=geniusbr&pid=vsl"
            />

            <TrendingCTABox 
              variant="nagano"
              title="✦ Also Trending Among Women Over 35"
              description="Weight gain and fatigue during early perimenopause are often linked to metabolic slowdown. This Japanese morning tonic has helped thousands of women over 35 restore their energy and shed stubborn weight naturally."
              buttonText="→ See How It Works"
            />
          </section>

        </article>
      </main>
    </div>
  );
};

export default PerimenopauseAt35Page;