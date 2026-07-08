import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-card border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Brand Section */}
          <div className="flex flex-col gap-2">
            <span className="text-lg font-semibold text-card-foreground tracking-tight">Focus After 35</span>
            <span className="text-sm text-muted-foreground max-w-xs">
              Your trusted resource for hormonal health and cognitive optimization.
            </span>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-3">
            <span className="text-sm font-semibold text-card-foreground uppercase tracking-wider">Resources</span>
            <nav className="flex flex-col gap-2">
              <Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                About Us
              </Link>
              <Link to="/why-brain-fog-after-35" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Brain Fog Guide
              </Link>
              <Link to="/hormone-phases-explained" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Hormone Phases
              </Link>
              <Link to="/faq" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                FAQ
              </Link>
            </nav>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border/50 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <span>© {currentYear} Focus After 35. All rights reserved.</span>
          <div className="flex gap-4 sm:gap-6">
            <Link to="/privacy-policy" className="hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms-of-service" className="hover:text-primary transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;