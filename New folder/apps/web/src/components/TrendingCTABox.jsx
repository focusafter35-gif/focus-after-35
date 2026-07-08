import React from 'react';
import { Button } from '@/components/ui/button.jsx';

const TrendingCTABox = ({ title, description, buttonUrl, buttonText, variant }) => {
  if (variant === 'nagano') {
    return (
      <div className="nagano-cta-box">
        <h3 className="text-xl md:text-2xl font-bold tracking-tight">
          {title || '✦ Also Trending Among Women Over 35'}
        </h3>
        <p className="text-base md:text-lg leading-relaxed max-w-[55ch]">
          {description}
        </p>
        <div className="flex flex-col items-center gap-2 w-full mt-2">
          <button
            onClick={() => window.open('https://hop.clickbank.net/?affiliate=Mohameddda&vendor=lbtonic&pid=18&tid=Focosafter35', '_blank', 'noopener,noreferrer')}
            className="nagano-cta-btn"
          >
            {buttonText || '→ See How It Works'}
          </button>
          <span className="text-xs text-gray-400 uppercase tracking-wider mt-2">
            Results may vary
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 p-6 md:p-8 rounded-2xl border-2 border-primary/40 bg-card shadow-[0_8px_30px_rgba(201,168,76,0.08)] flex flex-col items-center text-center gap-5">
      <h3 className="text-xl md:text-2xl font-bold text-foreground tracking-tight">
        {title}
      </h3>
      <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-[55ch]">
        {description}
      </p>
      <div className="flex flex-col items-center gap-2 w-full mt-2">
        <Button
          onClick={() => window.open(buttonUrl, '_blank', 'noopener,noreferrer')}
          className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-8 h-12 text-base shadow-[0_0_15px_rgba(201,168,76,0.2)] hover:shadow-[0_0_25px_rgba(201,168,76,0.4)] transition-all"
        >
          {buttonText || '→ See How It Works'}
        </Button>
        <span className="text-xs text-muted-foreground/60 uppercase tracking-wider mt-2">
          Results may vary
        </span>
      </div>
    </div>
  );
};

export default TrendingCTABox;