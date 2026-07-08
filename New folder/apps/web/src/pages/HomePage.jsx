
import React, { Suspense, lazy, memo } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button.jsx';
import SchemaMarkup from '@/components/SchemaMarkup.jsx';

// Lazy load non-critical components that are below the fold
const TestimonialsSection = lazy(() => import('@/components/TestimonialsSection.jsx'));
const AdSenseHead = lazy(() => import('@/components/AdSenseHead.jsx'));
const FAQSection = lazy(() => import('@/components/FAQSection.jsx'));

const HomePage = memo(() => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Focus After 35",
      "url": "https://focusafter35.com"
    };

    return (
        <div className="min-h-[100dvh] bg-background flex flex-col overflow-visible">
            <Helmet>
                <link rel="canonical" href="https://focusafter35.com/" />
            </Helmet>
            <Suspense fallback={<div aria-hidden="true" className="h-0 w-0 opacity-0" />}>
                <AdSenseHead />
            </Suspense>
            <SchemaMarkup schemas={[schema]} />
            
            <main className="flex-grow flex flex-col items-center w-full overflow-visible">
                {/* Hero Section */}
                <section className="section-padded min-h-[60vh] flex flex-col items-center justify-center text-center max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 text-balance" style={{ letterSpacing: '-0.02em' }}>
                        Focus After 35
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground text-balance leading-relaxed max-w-[65ch] mb-10">
                        Your trusted resource for navigating cognitive changes, reclaiming mental clarity, and optimizing hormonal health.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Button asChild size="lg" className="font-medium bg-primary text-primary-foreground hover:bg-primary/90 hover:-translate-y-0.5 transition-transform">
                            <Link to="/brain-fog-quiz">Take Brain Fog Quiz</Link>
                        </Button>
                        <Button asChild variant="outline" size="lg" className="hover:border-primary/50 hover:text-primary hover:-translate-y-0.5 transition-transform">
                            <Link to="/cycle-calculator">Cycle Calculator</Link>
                        </Button>
                        <Button asChild variant="outline" size="lg" className="hover:border-primary/50 hover:text-primary hover:-translate-y-0.5 transition-transform">
                            <Link to="/perimenopause-checker">Check Symptoms</Link>
                        </Button>
                        <Button asChild variant="outline" size="lg" className="hover:border-primary/50 hover:text-primary hover:-translate-y-0.5 transition-transform">
                            <Link to="/hormone-mood-tracker">Track Your Mood</Link>
                        </Button>
                    </div>
                </section>

                {/* Interactive Tools Section */}
                <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-border overflow-visible">
                    <h2 className="text-2xl md:text-3xl font-semibold mb-10 text-center">Free Tools & Assessments</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                        <Link to="/brain-fog-quiz" className="group p-6 md:p-8 rounded-2xl bg-muted/30 border border-border hover:border-primary/40 hover:bg-primary/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-md flex flex-col h-full">
                            <div className="text-3xl md:text-4xl mb-4">🧠</div>
                            <h3 className="font-medium text-lg mb-3 group-hover:text-primary transition-colors">Brain Fog Quiz</h3>
                            <p className="text-sm md:text-base text-muted-foreground mt-auto">Find out if your brain fog is hormonal with our science-backed assessment.</p>
                        </Link>
                        <Link to="/cycle-calculator" className="group p-6 md:p-8 rounded-2xl bg-muted/30 border border-border hover:border-primary/40 hover:bg-primary/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-md flex flex-col h-full">
                            <div className="text-3xl md:text-4xl mb-4">📅</div>
                            <h3 className="font-medium text-lg mb-3 group-hover:text-primary transition-colors">Cycle Calculator</h3>
                            <p className="text-sm md:text-base text-muted-foreground mt-auto">Calculate your hormone cycle phase and understand your current phase.</p>
                        </Link>
                        <Link to="/perimenopause-checker" className="group p-6 md:p-8 rounded-2xl bg-muted/30 border border-border hover:border-primary/40 hover:bg-primary/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-md flex flex-col h-full">
                            <div className="text-3xl md:text-4xl mb-4">✓</div>
                            <h3 className="font-medium text-lg mb-3 group-hover:text-primary transition-colors">Perimenopause Checker</h3>
                            <p className="text-sm md:text-base text-muted-foreground mt-auto">Identify your perimenopause stage with our quick 5-question assessment.</p>
                        </Link>
                        <Link to="/hormone-mood-tracker" className="group p-6 md:p-8 rounded-2xl bg-muted/30 border border-border hover:border-primary/40 hover:bg-primary/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-md flex flex-col h-full">
                            <div className="text-3xl md:text-4xl mb-4">🎯</div>
                            <h3 className="font-medium text-lg mb-3 group-hover:text-primary transition-colors">Hormone Mood Tracker</h3>
                            <p className="text-sm md:text-base text-muted-foreground mt-auto">Track your mood based on your hormone cycle phase and get personalized insights.</p>
                        </Link>
                    </div>
                </section>

                {/* Educational Links Section */}
                <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-border overflow-visible">
                    <h2 className="text-2xl md:text-3xl font-semibold mb-10 text-center">Learn About Your Hormones</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                        <Link to="/why-brain-fog-after-35" className="group p-6 md:p-8 rounded-2xl bg-muted/30 border border-border hover:border-primary/40 hover:bg-primary/5 transition-all duration-300 flex flex-col h-full">
                            <h3 className="font-medium text-lg mb-3 group-hover:text-primary transition-colors">Why Brain Fog?</h3>
                            <p className="text-sm md:text-base text-muted-foreground mt-auto">Understand the root causes of cognitive changes after 35.</p>
                        </Link>
                        <Link to="/hormone-phases-explained" className="group p-6 md:p-8 rounded-2xl bg-muted/30 border border-border hover:border-primary/40 hover:bg-primary/5 transition-all duration-300 flex flex-col h-full">
                            <h3 className="font-medium text-lg mb-3 group-hover:text-primary transition-colors">Hormone Phases</h3>
                            <p className="text-sm md:text-base text-muted-foreground mt-auto">Learn how your cycle impacts your daily focus.</p>
                        </Link>
                        <Link to="/perimenopause-vs-menopause" className="group p-6 md:p-8 rounded-2xl bg-muted/30 border border-border hover:border-primary/40 hover:bg-primary/5 transition-all duration-300 flex flex-col h-full">
                            <h3 className="font-medium text-lg mb-3 group-hover:text-primary transition-colors">Peri vs Menopause</h3>
                            <p className="text-sm md:text-base text-muted-foreground mt-auto">Know the difference and what to expect.</p>
                        </Link>
                        <Link to="/estrogen-brain-connection" className="group p-6 md:p-8 rounded-2xl bg-muted/30 border border-border hover:border-primary/40 hover:bg-primary/5 transition-all duration-300 flex flex-col h-full">
                            <h3 className="font-medium text-lg mb-3 group-hover:text-primary transition-colors">Estrogen & Brain</h3>
                            <p className="text-sm md:text-base text-muted-foreground mt-auto">Discover how estrogen fuels your cognitive engine.</p>
                        </Link>
                    </div>
                </section>

                {/* Are Your Symptoms Hormonal? Section */}
                <section className="w-full bg-secondary text-secondary-foreground py-16 md:py-24 px-4 sm:px-6 lg:px-8 mt-8 overflow-visible">
                    <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-balance tracking-tight">Are Your Symptoms Hormonal?</h2>
                        <p className="text-lg md:text-xl opacity-90 mb-10 max-w-2xl text-balance leading-relaxed">
                            Fatigue, mood swings, and memory slips aren't just "getting older." They are classic signs of natural hormonal shifts. Discover what's really going on inside your body and take control of your well-being.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xl justify-center">
                            <Button asChild size="lg" className="w-full sm:w-auto h-14 px-8 text-base font-medium shadow-md hover:shadow-lg transition-all hover:-translate-y-1">
                                <Link to="/perimenopause-checker">Check Perimenopause Stage</Link>
                            </Button>
                            <Button asChild size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-base font-medium bg-transparent border-secondary-foreground/20 hover:bg-secondary-foreground/10 text-secondary-foreground">
                                <Link to="/hormone-mood-tracker">Track Your Hormones</Link>
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Clear the Hormonal Brain Fog Section */}
                <section className="w-full bg-background py-16 md:py-24 px-4 sm:px-6 lg:px-8 overflow-visible">
                    <div className="max-w-5xl mx-auto content-card-padded bg-card text-card-foreground">
                        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-3xl mb-8">
                            🧠
                        </div>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-balance tracking-tight">Clear the Hormonal Brain Fog</h2>
                        <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-3xl text-balance leading-relaxed">
                            Struggling to find the right words or remember why you walked into a room? Our science-backed tools help you identify hormonal triggers and regain your mental clarity so you can focus on what matters most.
                        </p>
                        <Button asChild size="lg" className="px-10 h-14 text-base font-medium shadow-md hover:shadow-lg transition-all hover:-translate-y-1">
                            <Link to="/brain-fog-quiz">Take the Brain Fog Quiz</Link>
                        </Button>
                    </div>
                </section>
                
                {/* Testimonials and FAQ Sections */}
                <section className="w-full py-16 md:py-20 flex flex-col items-center justify-center overflow-visible bg-muted/10 border-t border-border">
                    <Suspense fallback={
                        <div className="w-full max-w-7xl mx-auto p-8 opacity-50 animate-pulse grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="h-48 bg-muted rounded-2xl w-full"></div>
                            <div className="h-48 bg-muted rounded-2xl w-full hidden md:block"></div>
                            <div className="h-48 bg-muted rounded-2xl w-full hidden md:block"></div>
                        </div>
                    }>
                        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <TestimonialsSection />
                        </div>
                    </Suspense>
                </section>
                
                <section className="w-full py-16 md:py-24 flex flex-col items-center justify-center overflow-visible">
                    <Suspense fallback={
                        <div className="w-full max-w-2xl mx-auto p-8 opacity-50 animate-pulse space-y-4">
                            <div className="h-12 bg-muted rounded-md w-full"></div>
                            <div className="h-12 bg-muted rounded-md w-full"></div>
                            <div className="h-12 bg-muted rounded-md w-full"></div>
                        </div>
                    }>
                        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                            <FAQSection />
                            <div className="mt-12 text-center">
                                <Button asChild variant="outline" size="lg" className="h-12 px-8 font-medium">
                                    <Link to="/faq">View All FAQs</Link>
                                </Button>
                            </div>
                        </div>
                    </Suspense>
                </section>
            </main>
        </div>
    );
});

HomePage.displayName = 'HomePage';

export default HomePage;
