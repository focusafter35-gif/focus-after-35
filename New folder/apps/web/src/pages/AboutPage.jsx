
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Mail, ArrowRight, Brain, Calendar, Activity, HeartPulse } from 'lucide-react';
import TestimonialsSection from '@/components/TestimonialsSection.jsx';

const AboutPage = () => {
  const tools = [
    {
      title: 'Brain Fog Quiz',
      description: 'Assess your cognitive symptoms and discover if they might be linked to hormonal fluctuations.',
      icon: <Brain className="w-6 h-6 text-[#c9a84c]" />,
      link: '/brain-fog-quiz'
    },
    {
      title: 'Cycle Calculator',
      description: 'Track your hormonal phases to better understand your energy levels and mental clarity throughout the month.',
      icon: <Calendar className="w-6 h-6 text-[#c9a84c]" />,
      link: '/cycle-calculator'
    },
    {
      title: 'Perimenopause Checker',
      description: 'Identify common signs of perimenopause early to take proactive steps for your health and wellbeing.',
      icon: <Activity className="w-6 h-6 text-[#c9a84c]" />,
      link: '/perimenopause-checker'
    },
    {
      title: 'Hormone Mood Tracker',
      description: 'Monitor your emotional wellbeing alongside your cycle to find patterns and regain control.',
      icon: <HeartPulse className="w-6 h-6 text-[#c9a84c]" />,
      link: '/hormone-mood-tracker'
    }
  ];

  return (
    <div className="min-h-[100dvh] bg-[#0a0a0f] text-white flex flex-col">
      <Helmet>
        <title>{`About FocusAfter35`}</title>
        <meta name="description" content="Learn about FocusAfter35's mission to help women over 35 understand their hormone health." />
        <link rel="canonical" href="https://focusafter35.com/about" />
      </Helmet>

      <main className="flex-grow flex flex-col w-full">
        {/* Hero Section */}
        <section className="w-full py-24 md:py-32 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-[#c9a84c]/10 via-transparent to-transparent pointer-events-none" />
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 text-balance" style={{ letterSpacing: '-0.02em' }}>
              About <span className="text-[#c9a84c]">FocusAfter35</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 text-balance leading-relaxed max-w-[65ch] mx-auto">
              Empowering women to navigate cognitive changes, reclaim mental clarity, and optimize hormonal health with science-backed tools.
            </p>
          </div>
        </section>

        {/* Mission Statement */}
        <section className="w-full py-16 px-4 bg-white/5 border-y border-white/10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-[#c9a84c]">Our Mission</h2>
            <p className="text-base md:text-lg text-gray-300 leading-relaxed text-balance">
              We believe that women over 35 deserve clear, accessible, and actionable information about their bodies. Our mission is to demystify hormone health, provide support through the perimenopause transition, and offer practical tools that improve daily quality of life. You shouldn't have to guess why your focus is shifting—we're here to help you understand and thrive.
            </p>
          </div>
        </section>

        {/* Tools Overview */}
        <section className="w-full py-20 px-4 max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4">Free Tools for Your Journey</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Explore our suite of interactive assessments designed specifically for women navigating hormonal changes.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tools.map((tool, index) => (
              <Card key={index} className="bg-white/5 border-white/10 hover:border-[#c9a84c]/50 transition-all duration-300">
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <div className="p-3 rounded-xl bg-[#c9a84c]/10">
                    {tool.icon}
                  </div>
                  <CardTitle className="text-xl text-white">{tool.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 mb-6 leading-relaxed">
                    {tool.description}
                  </p>
                  <Button asChild variant="link" className="text-[#c9a84c] hover:text-[#c9a84c]/80 p-0 h-auto font-medium">
                    <Link to={tool.link} className="flex items-center gap-2">
                      Try Tool <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Testimonials Section */}
        <TestimonialsSection />

        {/* Contact & CTA */}
        <section className="w-full py-20 px-4 text-center">
          <div className="max-w-2xl mx-auto bg-[#c9a84c]/10 border border-[#c9a84c]/20 rounded-3xl p-8 md:p-12">
            <h2 className="text-2xl font-semibold mb-4 text-white">Get in Touch</h2>
            <p className="text-gray-300 mb-8">
              Have questions, feedback, or just want to share your story? We'd love to hear from you.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="bg-[#c9a84c] text-[#0a0a0f] hover:bg-[#c9a84c]/90 font-semibold w-full sm:w-auto">
                <a href="mailto:contact@focusafter35.com" className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Email Us
                </a>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10 w-full sm:w-auto">
                <Link to="/">Back to Home</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AboutPage;
