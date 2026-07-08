
import React, { Suspense, lazy } from 'react';
import { Route, Routes, BrowserRouter, Link, Navigate } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import ScrollToTop from '@/components/ScrollToTop.jsx';
import LoadingFallback from '@/components/LoadingFallback.jsx';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

// Core Interactive Tools (Eagerly loaded to prevent suspense chunks on core features)
import BrainFogQuizPage from '@/pages/BrainFogQuizPage.jsx';
import CycleCalculatorPage from '@/pages/CycleCalculatorPage.jsx';
import PerimenopauseCheckerPage from '@/pages/PerimenopauseCheckerPage.jsx';
import HormoneeMoodTrackerPage from '@/pages/HormoneeMoodTrackerPage.jsx';

// Route-level code splitting for content pages
const HomePage = lazy(() => import('@/pages/HomePage.jsx'));
const AboutPage = lazy(() => import('@/pages/AboutPage.jsx'));
const BrainFogAfter35Page = lazy(() => import('@/pages/BrainFogAfter35Page.jsx'));
const FAQPage = lazy(() => import('@/pages/FAQPage.jsx'));
const HormonePhaseExplainedPage = lazy(() => import('@/pages/HormonePhaseExplainedPage.jsx'));
const PerimenopauseVsMenopausePage = lazy(() => import('@/pages/PerimenopauseVsMenopausePage.jsx'));
const EstrogenBrainConnectionPage = lazy(() => import('@/pages/EstrogenBrainConnectionPage.jsx'));
const PerimenopauseAt35Page = lazy(() => import('@/pages/PerimenopauseAt35Page.jsx'));
const PrivacyPolicyPage = lazy(() => import('@/pages/PrivacyPolicyPage.jsx'));
const TermsOfServicePage = lazy(() => import('@/pages/TermsOfServicePage.jsx'));

function App() {
    return (
        <HelmetProvider>
            <BrowserRouter>
                <Helmet>
                    <title>{`Focus After 35`}</title>
                    <meta name="description" content="Premium Women's Hormone Health Tools" />
                </Helmet>
                
                <ScrollToTop />
                
                <div className="flex flex-col min-h-[100dvh] bg-[#0a0a0a] text-zinc-100">
                    <Header />
                    
                    <main className="flex-grow flex flex-col w-full">
                        <Suspense fallback={<LoadingFallback />}>
                            <Routes>
                                {/* Standard Pages */}
                                <Route path="/" element={<HomePage />} />
                                <Route path="/about" element={<AboutPage />} />
                                <Route path="/faq" element={<FAQPage />} />
                                
                                {/* Refactored Core Interactive Tools */}
                                <Route path="/brain-fog-quiz" element={<BrainFogQuizPage />} />
                                <Route path="/cycle-calculator" element={<CycleCalculatorPage />} />
                                <Route path="/perimenopause-checker" element={<PerimenopauseCheckerPage />} />
                                <Route path="/hormone-mood-tracker" element={<HormoneeMoodTrackerPage />} />
                                
                                {/* Content Articles */}
                                <Route path="/why-brain-fog-after-35" element={<BrainFogAfter35Page />} />
                                <Route path="/hormone-phase-explained" element={<Navigate to="/hormone-phases-explained" replace />} />
                                <Route path="/hormone-phases-explained" element={<HormonePhaseExplainedPage />} />
                                <Route path="/perimenopause-vs-menopause" element={<PerimenopauseVsMenopausePage />} />
                                <Route path="/estrogen-brain-connection" element={<EstrogenBrainConnectionPage />} />
                                <Route path="/perimenopause-at-35" element={<PerimenopauseAt35Page />} />
                                
                                {/* Legal Pages */}
                                <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                                <Route path="/terms-of-service" element={<TermsOfServicePage />} />
                                
                                {/* Catch-all route for unhandled paths */}
                                <Route path="*" element={
                                    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 bg-[#0a0a0a]">
                                        <h1 className="text-4xl font-extrabold mb-4 text-[#D4AF37]">404 - Page Not Found</h1>
                                        <p className="text-zinc-400 mb-8 max-w-md mx-auto">The page you are looking for doesn't exist, has been moved, or is temporarily unavailable.</p>
                                        <Link to="/" className="inline-flex h-10 items-center justify-center rounded-md bg-[#D4AF37] px-8 text-sm font-bold text-black shadow hover:bg-[#D4AF37]/90 transition-colors">
                                            Return to Homepage
                                        </Link>
                                    </div>
                                } />
                            </Routes>
                        </Suspense>
                    </main>

                    <Footer />
                </div>
            </BrowserRouter>
        </HelmetProvider>
    );
}

export default App;
