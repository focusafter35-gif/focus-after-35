
import React from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion.jsx';
import { faqs } from '@/lib/faqData.js';

const FAQSection = () => {
  return (
    <section className="w-full py-12 fade-in">
      <h2 className="text-2xl md:text-3xl font-semibold text-center mb-8 text-balance">
        Frequently Asked Questions
      </h2>
      
      <Accordion type="single" collapsible className="w-full max-w-2xl mx-auto">
        {faqs.map((faq) => (
          <AccordionItem key={faq.id} value={faq.id}>
            <AccordionTrigger className="text-base text-left hover:no-underline hover:text-primary transition-colors">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
};

export { FAQSection };
export default FAQSection;
