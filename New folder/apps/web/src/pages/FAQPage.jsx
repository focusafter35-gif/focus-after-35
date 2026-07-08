
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import FAQSection from '@/components/FAQSection.jsx';
import AdSenseHead from '@/components/AdSenseHead.jsx';
import SchemaMarkup from '@/components/SchemaMarkup.jsx';
import { Button } from '@/components/ui/button.jsx';

const FAQPage = () => {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is brain fog?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Brain fog is a symptom characterized by confusion, forgetfulness, and a lack of focus and mental clarity. It is often associated with hormonal changes during perimenopause and menopause."
        }
      }
    ]
  };

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col items-center">
      {/* CRITICAL SEO FIX: Permanent Meta Tags - DO NOT REMOVE OR CHANGE */}
      <Helmet>
        <title>{`Hormone Health FAQ — Your Questions Answered | FocusAfter35`}</title>
        <meta name="description" content="Common questions about hormone cycles, brain fog, and perimenopause for women over 35. Science-backed answers." />
        <link rel="canonical" href="https://focusafter35.com/faq" />
        <meta property="og:title" content="Hormone Health FAQ | FocusAfter35" />
        <meta property="og:description" content="Common questions about hormone cycles, brain fog, and perimenopause for women over 35." />
        <meta property="og:url" content="https://focusafter35.com/faq" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Hormone Health FAQ | FocusAfter35" />
        <meta name="twitter:description" content="Common questions about hormone cycles, brain fog, and perimenopause for women over 35." />
      </Helmet>

      <AdSenseHead />
      <SchemaMarkup schemas={[faqSchema]} />

      <main className="flex-grow w-full max-w-4xl mx-auto px-6 py-24 flex flex-col gap-12">
        <header className="text-center flex flex-col gap-4">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-balance">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-muted-foreground">
            Find answers to common questions about hormone health and cognitive function.
          </p>
        </header>

        <FAQSection />

        <section className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
          <Button asChild variant="outline">
            <Link to="/brain-fog-quiz">Take Brain Fog Quiz</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/perimenopause-checker">Check Symptoms</Link>
          </Button>
        </section>
      </main>
    </div>
  );
};

export default FAQPage;
