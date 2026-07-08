import React from 'react';

const LoadingFallback = () => {
  return (
    <div className="w-full min-h-[60vh] p-8 max-w-7xl mx-auto flex flex-col items-center justify-center">
      <div className="w-full max-w-4xl space-y-6 animate-pulse opacity-60">
        <div className="h-14 bg-muted rounded-2xl w-2/3 mx-auto"></div>
        <div className="h-6 bg-muted rounded-lg w-1/2 mx-auto"></div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16 w-full">
          <div className="h-64 bg-muted rounded-2xl w-full"></div>
          <div className="h-64 bg-muted rounded-2xl w-full hidden md:block"></div>
          <div className="h-64 bg-muted rounded-2xl w-full hidden lg:block"></div>
        </div>
      </div>
      <span className="sr-only">Loading content...</span>
    </div>
  );
};

export default LoadingFallback;