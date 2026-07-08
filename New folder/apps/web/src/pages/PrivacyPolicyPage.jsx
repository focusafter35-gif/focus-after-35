import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-[100dvh] bg-[#0a0a0f] text-white flex flex-col">
      <Helmet>
        <title>{`Privacy Policy - FocusAfter35`}</title>
        <meta name="description" content="Privacy Policy for FocusAfter35. Learn how we collect, use, and protect your data." />
        <link rel="canonical" href="https://focusafter35.com/privacy-policy" />
      </Helmet>

      <main className="flex-grow flex flex-col w-full">
        {/* Header Section */}
        <section className="w-full pt-24 pb-12 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-[#c9a84c]/10 via-transparent to-transparent pointer-events-none" />
          <div className="max-w-3xl mx-auto text-center relative z-10">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 text-balance" style={{ letterSpacing: '-0.02em' }}>
              Privacy Policy
            </h1>
            <p className="text-lg text-gray-400">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="w-full pb-24 px-4 max-w-4xl mx-auto space-y-8">
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-2xl text-[#c9a84c]">Information Collection</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300 space-y-4 leading-relaxed">
              <p>
                At FocusAfter35, we collect information you provide directly to us when you use our interactive tools, subscribe to our newsletter, or contact us. This may include your email address, name, and any specific health-related data you choose to input into our trackers and calculators.
              </p>
              <p>
                We also automatically collect certain information about your device and how you interact with our website, including IP addresses, browser types, and usage patterns, to help us improve our services.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-2xl text-[#c9a84c]">Cookies</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300 space-y-4 leading-relaxed">
              <p>
                We use cookies and similar tracking technologies to track activity on our service and hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier.
              </p>
              <p>
                You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our tools seamlessly.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-2xl text-[#c9a84c]">Analytics</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300 space-y-4 leading-relaxed">
              <p>
                We may use third-party Service Providers, such as Google Analytics, to monitor and analyze the use of our service. These tools collect information such as how often users visit this site, what pages they visit when they do so, and what other sites they used prior to coming to this site.
              </p>
              <p>
                We use the information we get from analytics providers only to improve this site and our content offerings.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-2xl text-[#c9a84c]">Affiliate Disclosure</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300 space-y-4 leading-relaxed">
              <p>
                FocusAfter35 participates in various affiliate marketing programs. This means we may get paid commissions on editorially chosen products purchased through our links to retailer sites.
              </p>
              <p>
                When you click on an affiliate link and make a purchase, your data is handled according to the privacy policy of the respective third-party platform or retailer.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-2xl text-[#c9a84c]">User Rights</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300 space-y-4 leading-relaxed">
              <p>
                Depending on your location (including under GDPR or CCPA), you may have the following rights regarding your personal data:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>The right to access, update, or delete the information we have on you.</li>
                <li>The right of rectification if your information is inaccurate or incomplete.</li>
                <li>The right to object to our processing of your Personal Data.</li>
                <li>The right to request that we restrict the processing of your personal information.</li>
                <li>The right to data portability.</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-2xl text-[#c9a84c]">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300 space-y-4 leading-relaxed">
              <p>
                If you have any questions about this Privacy Policy, please contact us:
              </p>
              <ul className="list-none space-y-2">
                <li>By email: <a href="mailto:privacy@focusafter35.com" className="text-[#c9a84c] hover:underline">privacy@focusafter35.com</a></li>
                <li>By visiting our website: <a href="https://focusafter35.com/contact" className="text-[#c9a84c] hover:underline">focusafter35.com/contact</a></li>
              </ul>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
};

export default PrivacyPolicyPage;