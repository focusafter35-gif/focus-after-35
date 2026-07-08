// Initialize Google Analytics dataLayer at the very start
window.dataLayer = window.dataLayer || [];
const dataLayer = window.dataLayer || [];

// FocusAfter35 - Global JavaScript

// Math Functions for Hormone Curves
window.getEstrogenLevel = function(t) {
  // Estrogen math model: two bell curves (peaks at 45% and 75% of cycle) + base level
  return 0.8 * Math.exp(-80 * Math.pow(t - 0.45, 2)) + 0.35 * Math.exp(-30 * Math.pow(t - 0.75, 2)) + 0.18;
};

window.getProgesteroneLevel = function(t) {
  // Progesterone math model: one major bell curve in the luteal phase + base level
  return 0.08 + (t > 0.4 ? 0.85 * Math.exp(-30 * Math.pow(t - 0.75, 2)) : 0);
};

// Dynamic Chart Update Logic
window.updateChartIndicator = function(day, cycleLength, animate) {
  // Clamp day between 1 and cycleLength
  day = Math.max(1, Math.min(cycleLength, day));
  
  let t = (day - 1) / (cycleLength - 1);
  let x = 60 + t * 660;
  let eVal = window.getEstrogenLevel(t);
  let pVal = window.getProgesteroneLevel(t);
  let yE = 360 - eVal * 280;
  let yP = 360 - pVal * 280;

  const line = document.getElementById('indicatorLine');
  const badge = document.getElementById('indicatorBadge');
  const text = document.getElementById('indicatorText');
  const dotE = document.getElementById('dotE');
  const dotP = document.getElementById('dotP');
  const tooltip = document.getElementById('chartTooltip');

  if (!line) return;

  // Apply smooth transition if requested (for clicks), or none for instant tracking (for drag)
  const style = animate ? 'all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)' : 'none';
  line.style.transition = style;
  badge.style.transition = style;
  text.style.transition = style;
  dotE.style.transition = style;
  dotP.style.transition = style;

  if (tooltip) {
      tooltip.style.transition = animate 
        ? 'opacity 0.2s ease, left 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)' 
        : 'opacity 0.2s ease';
  }

  line.setAttribute('x1', x);
  line.setAttribute('x2', x);
  badge.setAttribute('x', x - 30);
  text.setAttribute('x', x);
  text.textContent = `DAY ${Math.round(day)}`;

  dotE.setAttribute('cx', x);
  dotE.setAttribute('cy', yE);
  dotP.setAttribute('cx', x);
  dotP.setAttribute('cy', yP);

  if (tooltip) {
      document.getElementById('ttDay').textContent = `Day ${Math.round(day)}`;
      document.getElementById('ttE').textContent = Math.round(eVal * 100);
      document.getElementById('ttP').textContent = Math.round(pVal * 100);
      
      // Position tooltip perfectly scaled relative to responsive container width
      tooltip.style.left = `${(x / 840) * 100}%`;
  }
};

window.initChartInteraction = function(cycleLength) {
  const svg = document.getElementById('hormoneChartSvg');
  const interactionArea = document.getElementById('interactionArea');
  const tooltip = document.getElementById('chartTooltip');
  if (!svg || !interactionArea) return;

  let isDragging = false;

  const updatePosition = (clientX, clientY) => {
      const pt = svg.createSVGPoint();
      pt.x = clientX;
      pt.y = clientY;
      const svgP = pt.matrixTransform(svg.getScreenCTM().inverse());
      
      // Clamp x inside the chart bounds
      let x = Math.max(60, Math.min(720, svgP.x));
      let t = (x - 60) / 660;
      let day = 1 + t * (cycleLength - 1);
      
      window.updateChartIndicator(day, cycleLength, false);
      if (tooltip) tooltip.style.opacity = '1';
  };

  const startDrag = (e) => {
      isDragging = true;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      updatePosition(clientX, clientY);
  };

  const drag = (e) => {
      if (!isDragging && e.type !== 'mousemove') return;
      if (isDragging && e.touches && e.cancelable) e.preventDefault(); // prevent scroll on drag
      
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      updatePosition(clientX, clientY);
  };

  const endDrag = () => {
      isDragging = false;
      if (tooltip) tooltip.style.opacity = '0';
  };

  interactionArea.addEventListener('mousedown', startDrag);
  interactionArea.addEventListener('touchstart', startDrag, {passive: false});
  
  window.addEventListener('mouseup', endDrag);
  window.addEventListener('touchend', endDrag);
  
  interactionArea.addEventListener('mousemove', drag);
  interactionArea.addEventListener('touchmove', drag, {passive: false});
  
  interactionArea.addEventListener('mouseleave', () => {
      if (!isDragging && tooltip) tooltip.style.opacity = '0';
  });
};

// Mobile Navigation
function initMobileNav() {
  const mobileToggle = document.querySelector('.mobile-menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileClose = document.querySelector('.mobile-nav-close');
  const mobileOverlay = document.querySelector('.mobile-overlay');
  const mobileLinks = document.querySelectorAll('.mobile-nav-menu a');

  if (mobileToggle && mobileNav) {
    mobileToggle.addEventListener('click', () => {
      mobileNav.classList.add('active');
      mobileOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });

    const closeNav = () => {
      mobileNav.classList.remove('active');
      mobileOverlay.classList.remove('active');
      document.body.style.overflow = '';
    };

    if (mobileClose) {
      mobileClose.addEventListener('click', closeNav);
    }

    if (mobileOverlay) {
      mobileOverlay.addEventListener('click', closeNav);
    }

    mobileLinks.forEach(link => {
      link.addEventListener('click', closeNav);
    });
  }
}

// Smooth Scrolling
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// Active Navigation Link
function setActiveNavLink() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-menu a, .mobile-nav-menu a');
  
  navLinks.forEach(link => {
    const linkPath = new URL(link.href).pathname;
    if (linkPath === currentPath || (currentPath === '/' && linkPath === '/index.html')) {
      link.classList.add('active');
    }
  });
}

// FAQ Toggle
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
          }
        });
        
        item.classList.toggle('active', !isActive);
      });
    }
  });
}

// Lazy Loading Images
function initLazyLoading() {
  const images = document.querySelectorAll('img[data-src]');
  
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        observer.unobserve(img);
      }
    });
  });
  
  images.forEach(img => imageObserver.observe(img));
}

// Fade In on Scroll
function initScrollAnimations() {
  const elements = document.querySelectorAll('.fade-in, .slide-up');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, {
    threshold: 0.1
  });
  
  elements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
}

// Google Analytics
function initGoogleAnalytics() {
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-Q0VFC2SSNE');
}

// Cycle Calculator Logic - Phase Data
window.getPhaseData = function(cycleLength) {
  return {
    Menstrual: {
      name: 'Menstrual',
      days: '1-5',
      hormones: 'Estrogen and progesterone are at their lowest levels.',
      description: 'Your body is shedding the uterine lining. Energy levels are typically at their lowest.',
      tips: [
        'Rest and prioritize self-care',
        'Stay hydrated and eat iron-rich foods',
        'Light exercise like yoga or walking can help with cramps',
        'Use heat therapy for comfort'
      ]
    },
    Follicular: {
      name: 'Follicular',
      days: '6-13',
      hormones: 'Estrogen is steadily rising while progesterone remains low.',
      description: 'Your body is preparing to release an egg. Energy and mood typically improve.',
      tips: [
        'Great time for challenging workouts',
        'Focus on new projects and creative work',
        'Social activities may feel more enjoyable',
        'Skin tends to look its best during this phase'
      ]
    },
    Ovulatory: {
      name: 'Ovulatory',
      days: '14-16',
      hormones: 'Estrogen peaks, luteinizing hormone surges, and testosterone rises.',
      description: 'An egg is released. You may feel most energetic, confident, and communicative.',
      tips: [
        'Peak energy for high-intensity exercise',
        'Excellent time for important meetings or presentations',
        'Communication skills are enhanced',
        'Libido is typically highest during this phase'
      ]
    },
    Luteal: {
      name: 'Luteal',
      days: `17-${cycleLength}`,
      hormones: 'Progesterone rises and dominates, while estrogen has a smaller second peak.',
      description: 'Your body prepares for potential pregnancy. Energy may decrease toward the end of this phase.',
      tips: [
        'Focus on moderate exercise and stress management',
        'Prioritize sleep and relaxation',
        'Eat balanced meals to manage cravings',
        'Practice self-compassion as PMS symptoms may appear'
      ]
    }
  };
};

// Cycle Calculator Logic - Phase Selection
window.selectPhase = function(phaseName, cycleLength) {
  // Update active styling on phase cards
  document.querySelectorAll('.phase-item').forEach(item => {
    if (item.dataset.phase === phaseName) {
      item.classList.add('active');
      item.style.borderColor = '#c9a84c';
      item.style.backgroundColor = 'rgba(201, 168, 76, 0.1)';
      item.style.transform = 'translateY(-2px)';
    } else {
      item.classList.remove('active');
      item.style.borderColor = 'rgba(255, 255, 255, 0.1)';
      item.style.backgroundColor = 'transparent';
      item.style.transform = 'translateY(0)';
    }
  });

  // Calculate midpoint of the selected phase and animate the chart
  let midDay = 1;
  if (phaseName === 'Menstrual') midDay = Math.min(3, cycleLength);
  else if (phaseName === 'Follicular') midDay = Math.min(10, cycleLength);
  else if (phaseName === 'Ovulatory') midDay = Math.min(15, cycleLength);
  else if (phaseName === 'Luteal') midDay = Math.min(Math.floor((17 + cycleLength) / 2), cycleLength);

  if (window.updateChartIndicator) {
      window.updateChartIndicator(midDay, cycleLength, true);
  }

  // Render detailed phase information
  const data = window.getPhaseData(cycleLength)[phaseName];
  const container = document.getElementById('dynamicPhaseDetails');
  if (container) {
    container.innerHTML = `
      <div class="phase-details-card fade-in" style="background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 1.5rem; margin-top: 1.5rem;">
        <h3 style="color: #c9a84c; margin-bottom: 0.5rem; font-size: 1.5rem;">${data.name} Phase <span style="font-size: 1rem; color: var(--color-text-muted); font-weight: normal;">(Days ${data.days})</span></h3>
        <p style="margin-bottom: 0.75rem;"><strong>Hormones:</strong> <span style="color: var(--color-text-muted);">${data.hormones}</span></p>
        <p style="margin-bottom: 1.25rem;"><strong>What's happening:</strong> <span style="color: var(--color-text-muted);">${data.description}</span></p>
        <h4 style="margin-bottom: 0.75rem; font-size: 1.1rem;">Tips for this phase:</h4>
        <ul style="color: var(--color-text-muted); line-height: 1.8; padding-left: 1.5rem; margin: 0;">
          ${data.tips.map(tip => `<li style="margin-bottom: 0.5rem;">${tip}</li>`).join('')}
        </ul>
      </div>
    `;
  }
};

// Cycle Calculator Logic - Main Calculation
function calculateCycle() {
  const lastPeriodInput = document.getElementById('lastPeriod');
  const cycleLengthInput = document.getElementById('cycleLength');
  const ageRangeInput = document.getElementById('ageRange');
  const resultsContainer = document.getElementById('cycleResults');
  
  if (!lastPeriodInput || !cycleLengthInput || !resultsContainer) return;
  
  const lastPeriod = new Date(lastPeriodInput.value);
  const cycleLength = parseInt(cycleLengthInput.value);
  const ageRange = ageRangeInput ? ageRangeInput.value : '30-40';
  
  if (!lastPeriodInput.value || !cycleLength) {
    alert('Please fill in all required fields');
    return;
  }
  
  const today = new Date();
  const daysSinceLastPeriod = Math.floor((today - lastPeriod) / (1000 * 60 * 60 * 24));
  const cycleDay = (daysSinceLastPeriod % cycleLength) + 1;
  
  let phase = '';
  let phaseDescription = '';
  
  if (cycleDay >= 1 && cycleDay <= 5) {
    phase = 'Menstrual';
    phaseDescription = 'Your body is shedding the uterine lining. Hormone levels are at their lowest.';
  } else if (cycleDay >= 6 && cycleDay <= 13) {
    phase = 'Follicular';
    phaseDescription = 'Estrogen is rising as your body prepares to release an egg. Energy levels increase.';
  } else if (cycleDay >= 14 && cycleDay <= 16) {
    phase = 'Ovulatory';
    phaseDescription = 'Estrogen peaks and an egg is released. You may feel most energetic and confident.';
  } else {
    phase = 'Luteal';
    phaseDescription = 'Progesterone rises to prepare for potential pregnancy. Energy may decrease toward the end.';
  }

  // --- Mathematical Generation for Premium Chart ---
  let ePath = [];
  let pPath = [];
  
  // Create 100 points for perfectly smooth curves
  for(let i=0; i<=100; i++) {
      let t = i/100;
      let x = 60 + t * 660; // Map t(0-1) to X(60-720)
      let eVal = window.getEstrogenLevel(t);
      let pVal = window.getProgesteroneLevel(t);
      
      ePath.push(`${x},${360 - eVal*280}`);
      pPath.push(`${x},${360 - pVal*280}`);
  }
  
  const estrogenPathD = "M " + ePath.join(" L ");
  const progPathD = "M " + pPath.join(" L ");

  // Calculate current day coordinates and specific values for the indicator dots
  let currentT = (cycleDay - 1) / (cycleLength - 1);
  let dotX = 60 + currentT * 660;
  let dotE_Y = 360 - window.getEstrogenLevel(currentT) * 280;
  let dotP_Y = 360 - window.getProgesteroneLevel(currentT) * 280;

  // Calculate perfect 16px gap placement for end labels to prevent overlap
  let endE_Y = 360 - window.getEstrogenLevel(1) * 280;
  let endP_Y = 360 - window.getProgesteroneLevel(1) * 280;
  let center_Y = (endE_Y + endP_Y) / 2;
  // Estrogen explicitly above Progesterone with 16px exact vertical gap (8px offset each side from center)
  let labelE_Y = center_Y - 8;
  let labelP_Y = center_Y + 8;

  // Calculate dynamic, evenly spaced X-axis day labels
  let lbl2 = Math.round(cycleLength * 0.25);
  let lbl3 = Math.round(cycleLength * 0.5);
  let lbl4 = Math.round(cycleLength * 0.75);
  
  let x2 = 60 + ((lbl2 - 1) / (cycleLength - 1)) * 660;
  let x3 = 60 + ((lbl3 - 1) / (cycleLength - 1)) * 660;
  let x4 = 60 + ((lbl4 - 1) / (cycleLength - 1)) * 660;
  
  resultsContainer.innerHTML = `
    <div class="results-container fade-in">
      <h2>Your Current Phase</h2>
      <div class="score-display">${phase}</div>
      <p style="font-size: 1.125rem; color: var(--color-text-muted); margin-bottom: var(--spacing-lg);">
        Day ${cycleDay} of your ${cycleLength}-day cycle
      </p>
      <p style="color: var(--color-text-muted); margin-bottom: var(--spacing-xl);">
        ${phaseDescription}
      </p>
      
      <p style="text-align: center; margin-bottom: 1rem; font-size: 0.9rem; color: #c9a84c;">Click any phase below to explore details:</p>
      <div class="phase-timeline" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 1rem; margin-bottom: 1rem;">
        <div class="phase-item" data-phase="Menstrual" onclick="selectPhase('Menstrual', ${cycleLength})" style="cursor: pointer; padding: 1rem; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); text-align: center; transition: all 0.3s ease;">
          <h4 style="margin-bottom: 0.25rem;">Menstrual</h4>
          <p style="font-size: 0.85rem; color: var(--color-text-muted);">Days 1-5</p>
        </div>
        <div class="phase-item" data-phase="Follicular" onclick="selectPhase('Follicular', ${cycleLength})" style="cursor: pointer; padding: 1rem; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); text-align: center; transition: all 0.3s ease;">
          <h4 style="margin-bottom: 0.25rem;">Follicular</h4>
          <p style="font-size: 0.85rem; color: var(--color-text-muted);">Days 6-13</p>
        </div>
        <div class="phase-item" data-phase="Ovulatory" onclick="selectPhase('Ovulatory', ${cycleLength})" style="cursor: pointer; padding: 1rem; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); text-align: center; transition: all 0.3s ease;">
          <h4 style="margin-bottom: 0.25rem;">Ovulatory</h4>
          <p style="font-size: 0.85rem; color: var(--color-text-muted);">Days 14-16</p>
        </div>
        <div class="phase-item" data-phase="Luteal" onclick="selectPhase('Luteal', ${cycleLength})" style="cursor: pointer; padding: 1rem; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); text-align: center; transition: all 0.3s ease;">
          <h4 style="margin-bottom: 0.25rem;">Luteal</h4>
          <p style="font-size: 0.85rem; color: var(--color-text-muted);">Days 17-${cycleLength}</p>
        </div>
      </div>
      
      <div id="dynamicPhaseDetails"></div>
      
      <div class="hormone-chart hormone-chart-container fade-in" style="margin-top: 3.5rem; max-width: 800px; margin-left: auto; margin-right: auto;">
        <h3 style="margin-bottom: 1.5rem; text-align: center; font-size: 1.5rem; color: var(--color-foreground);">Hormone Fluctuations</h3>
        <p style="text-align: center; font-size: 0.85rem; color: var(--color-text-muted); margin-top: -1rem; margin-bottom: 1rem;">Drag across the chart to explore hormone levels</p>
        
        <div class="chart-wrapper">
          
          <!-- Interactive Tooltip Overlay -->
          <div id="chartTooltip" style="position: absolute; opacity: 0; background: rgba(15, 23, 42, 0.95); border: 1px solid rgba(255,255,255,0.15); padding: 10px 14px; border-radius: 8px; font-size: 13px; pointer-events: none; z-index: 10; transform: translate(-50%, 0); top: 50px; box-shadow: 0 8px 16px rgba(0,0,0,0.6); white-space: nowrap; backdrop-filter: blur(4px);">
            <div style="font-weight: 600; margin-bottom: 8px; text-align: center; color: white;" id="ttDay">Day 1</div>
            <div style="display: flex; justify-content: space-between; gap: 16px; margin-bottom: 4px;">
              <span style="color: #e88fa0; font-weight: 500;">Estrogen:</span>
              <span id="ttE" style="font-weight: 600; color: #fff;">0</span>
            </div>
            <div style="display: flex; justify-content: space-between; gap: 16px;">
              <span style="color: #c9a84c; font-weight: 500;">Progesterone:</span>
              <span id="ttP" style="font-weight: 600; color: #fff;">0</span>
            </div>
          </div>

          <!-- Fully Responsive Premium SVG Implementation -->
          <!-- preserveAspectRatio="none" enables perfect full-width/height scaling without empty space -->
          <svg id="hormoneChartSvg" class="chart-svg" viewBox="0 0 840 420" preserveAspectRatio="none">
            
            <!-- Phase Zones -->
            <rect x="60" y="40" width="118" height="320" fill="rgba(153, 27, 27, 0.15)" />
            <rect x="178" y="40" width="188" height="320" fill="rgba(56, 189, 248, 0.1)" />
            <rect x="366" y="40" width="71" height="320" fill="rgba(234, 179, 8, 0.15)" />
            <rect x="437" y="40" width="283" height="320" fill="rgba(168, 85, 247, 0.1)" />
            
            <!-- Phase Labels -->
            <!-- Desktop full labels -->
            <text class="desktop-label" x="119" y="30" fill="rgba(255,255,255,0.8)" font-size="11" font-weight="600" text-anchor="middle" letter-spacing="1.5">MENSTRUAL</text>
            <text class="desktop-label" x="272" y="30" fill="rgba(255,255,255,0.8)" font-size="11" font-weight="600" text-anchor="middle" letter-spacing="1.5">FOLLICULAR</text>
            <text class="desktop-label" x="401" y="30" fill="rgba(255,255,255,0.8)" font-size="11" font-weight="600" text-anchor="middle" letter-spacing="1.5">OVULATORY</text>
            <text class="desktop-label" x="578" y="30" fill="rgba(255,255,255,0.8)" font-size="11" font-weight="600" text-anchor="middle" letter-spacing="1.5">LUTEAL</text>
            
            <!-- Mobile abbreviated labels (scaled up internally so they remain readable when SVG is condensed) -->
            <text class="mobile-label" x="119" y="30" fill="rgba(255,255,255,0.8)" font-size="28" font-weight="600" text-anchor="middle">M</text>
            <text class="mobile-label" x="272" y="30" fill="rgba(255,255,255,0.8)" font-size="28" font-weight="600" text-anchor="middle">F</text>
            <text class="mobile-label" x="401" y="30" fill="rgba(255,255,255,0.8)" font-size="28" font-weight="600" text-anchor="middle">O</text>
            <text class="mobile-label" x="578" y="30" fill="rgba(255,255,255,0.8)" font-size="28" font-weight="600" text-anchor="middle">L</text>

            <!-- Grid Lines -->
            <line x1="60" y1="80" x2="720" y2="80" stroke="rgba(255,255,255,0.08)" stroke-width="1" stroke-dasharray="4,4" vector-effect="non-scaling-stroke"/>
            <line x1="60" y1="220" x2="720" y2="220" stroke="rgba(255,255,255,0.08)" stroke-width="1" stroke-dasharray="4,4" vector-effect="non-scaling-stroke"/>

            <!-- Axes Lines -->
            <line x1="60" y1="40" x2="60" y2="360" stroke="#c9a84c" stroke-width="1.5" opacity="0.6" vector-effect="non-scaling-stroke"/>
            <line x1="60" y1="360" x2="720" y2="360" stroke="#c9a84c" stroke-width="1.5" opacity="0.6" vector-effect="non-scaling-stroke"/>

            <!-- Y-axis Labels -->
            <text x="50" y="85" fill="rgba(255,255,255,0.6)" font-size="12" font-weight="500" text-anchor="end">High</text>
            <text x="50" y="225" fill="rgba(255,255,255,0.6)" font-size="12" font-weight="500" text-anchor="end">Medium</text>
            <text x="50" y="365" fill="rgba(255,255,255,0.6)" font-size="12" font-weight="500" text-anchor="end">Low</text>

            <!-- X-axis Labels -->
            <text x="60" y="385" fill="rgba(255,255,255,0.7)" font-size="13" font-weight="500" text-anchor="middle">Day 1</text>
            <text x="${x2}" y="385" fill="rgba(255,255,255,0.7)" font-size="13" font-weight="500" text-anchor="middle">Day ${lbl2}</text>
            <text x="${x3}" y="385" fill="rgba(255,255,255,0.7)" font-size="13" font-weight="500" text-anchor="middle">Day ${lbl3}</text>
            <text x="${x4}" y="385" fill="rgba(255,255,255,0.7)" font-size="13" font-weight="500" text-anchor="middle">Day ${lbl4}</text>
            <text x="720" y="385" fill="rgba(255,255,255,0.7)" font-size="13" font-weight="500" text-anchor="middle">Day ${cycleLength}</text>

            <!-- Hormone Curves -->
            <path d="${estrogenPathD}" fill="none" stroke="#e88fa0" stroke-width="3" stroke-linejoin="round" stroke-linecap="round" vector-effect="non-scaling-stroke" />
            <path d="${progPathD}" fill="none" stroke="#c9a84c" stroke-width="3" stroke-linejoin="round" stroke-linecap="round" vector-effect="non-scaling-stroke" />

            <!-- Curve Labels with guaranteed 16px gap to prevent overlap -->
            <text x="732" y="${labelE_Y + 4}" fill="#e88fa0" font-size="13" font-weight="600" text-anchor="start">Estrogen</text>
            <text x="732" y="${labelP_Y + 4}" fill="#c9a84c" font-size="13" font-weight="600" text-anchor="start">Progesterone</text>

            <!-- Interactive Highlight Elements -->
            <line id="indicatorLine" x1="${dotX}" y1="40" x2="${dotX}" y2="360" stroke="rgba(255,255,255,0.4)" stroke-width="1.5" stroke-dasharray="4,4" vector-effect="non-scaling-stroke" />
            <rect id="indicatorBadge" x="${dotX - 30}" y="10" width="60" height="22" rx="4" fill="rgba(255,255,255,0.2)"/>
            <text id="indicatorText" x="${dotX}" y="25" fill="#ffffff" font-size="11" font-weight="bold" text-anchor="middle" letter-spacing="0.5">DAY ${cycleDay}</text>

            <circle id="dotE" cx="${dotX}" cy="${dotE_Y}" r="5.5" fill="#e88fa0" stroke="#0f172a" stroke-width="2.5" vector-effect="non-scaling-stroke" />
            <circle id="dotP" cx="${dotX}" cy="${dotP_Y}" r="5.5" fill="#c9a84c" stroke="#0f172a" stroke-width="2.5" vector-effect="non-scaling-stroke" />

            <!-- Invisible Interaction Area -->
            <rect id="interactionArea" x="60" y="40" width="660" height="320" fill="transparent" style="cursor: crosshair; touch-action: none;" />
          </svg>
        </div>
      </div>
    </div>
    
    <div class="premium-cta-card fade-in" style="animation-delay: 0.3s;">
      <h3>Want to Optimize Your Hormones Naturally?</h3>
      <p style="color: var(--color-text-muted); margin-bottom: var(--spacing-lg);">
        Discover the science-backed approach thousands of women are using to balance their hormones and reclaim their energy.
      </p>
      <button class="btn btn-primary" onclick="window.open('https://hop.clickbank.net/?affiliate=mohameddda&vendor=geniusbr&pid=vsl', '_blank')">
        → Watch the Free Presentation
      </button>
    </div>
  `;
  
  resultsContainer.classList.remove('hidden');
  resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
  
  // Select phase and initialize drag interactions
  setTimeout(() => {
    window.selectPhase(phase, cycleLength);
    window.initChartInteraction(cycleLength);
  }, 50);
}

// Brain Fog Quiz Logic
let quizAnswers = {};

function selectQuizOption(questionId, value) {
  quizAnswers[questionId] = parseInt(value);
  updateQuizProgress();
}

function updateQuizProgress() {
  const totalQuestions = 7;
  const answeredQuestions = Object.keys(quizAnswers).length;
  const progress = (answeredQuestions / totalQuestions) * 100;
  
  const progressFill = document.querySelector('.progress-fill');
  if (progressFill) {
    progressFill.style.width = progress + '%';
  }
}

function calculateBrainFogScore() {
  const totalQuestions = 7;
  const answeredQuestions = Object.keys(quizAnswers).length;
  
  if (answeredQuestions < totalQuestions) {
    alert('Please answer all questions before submitting');
    return;
  }
  
  const totalScore = Object.values(quizAnswers).reduce((sum, val) => sum + val, 0);
  const maxScore = totalQuestions * 4;
  const percentageScore = Math.round((totalScore / maxScore) * 100);
  
  let severity = '';
  let severityColor = '';
  let tips = [];
  
  if (percentageScore <= 20) {
    severity = 'Minimal Brain Fog';
    severityColor = '#4ade80';
    tips = [
      'Your cognitive function appears to be in good shape',
      'Continue maintaining healthy sleep habits',
      'Stay physically active and mentally engaged',
      'Keep up with a balanced, nutrient-rich diet'
    ];
  } else if (percentageScore <= 40) {
    severity = 'Mild Brain Fog';
    severityColor = '#fbbf24';
    tips = [
      'Consider tracking your sleep quality and duration',
      'Reduce caffeine intake, especially in the afternoon',
      'Try stress-reduction techniques like meditation',
      'Ensure adequate hydration throughout the day'
    ];
  } else if (percentageScore <= 60) {
    severity = 'Moderate Brain Fog';
    severityColor = '#fb923c';
    tips = [
      'Consult with a healthcare provider about hormone testing',
      'Prioritize 7-9 hours of quality sleep each night',
      'Consider omega-3 supplementation for brain health',
      'Reduce processed foods and increase whole foods',
      'Practice regular exercise to boost cognitive function'
    ];
  } else {
    severity = 'Severe Brain Fog';
    severityColor = '#ef4444';
    tips = [
      'Schedule an appointment with your healthcare provider',
      'Request comprehensive hormone panel testing',
      'Keep a symptom journal to track patterns',
      'Eliminate potential dietary triggers',
      'Consider working with a functional medicine practitioner',
      'Prioritize stress management and adequate rest'
    ];
  }
  
  const resultsContainer = document.getElementById('quizResults');
  if (!resultsContainer) return;
  
  const circumference = 2 * Math.PI * 70;
  const offset = circumference - (percentageScore / 100) * circumference;
  
  resultsContainer.innerHTML = `
    <div class="results-container fade-in">
      <h2>Your Brain Fog Score</h2>
      <div class="score-meter">
        <svg width="200" height="200" viewBox="0 0 200 200">
          <circle class="score-meter-bg" cx="100" cy="100" r="70"></circle>
          <circle class="score-meter-fill" cx="100" cy="100" r="70" 
            stroke-dasharray="${circumference}" 
            stroke-dashoffset="${offset}"></circle>
        </svg>
        <div class="score-meter-text">${percentageScore}</div>
      </div>
      <div class="score-display" style="color: ${severityColor};">${severity}</div>
      <p style="font-size: 1.125rem; color: var(--color-text-muted); margin-bottom: var(--spacing-xl);">
        Based on your responses, you're experiencing ${severity.toLowerCase()}.
      </p>
      
      <div style="margin-top: var(--spacing-xl); text-align: left;">
        <h3>Personalized Recommendations</h3>
        <ul style="color: var(--color-text-muted); line-height: 1.8;">
          ${tips.map(tip => `<li>${tip}</li>`).join('')}
        </ul>
      </div>
    </div>
    
    <div class="premium-cta-card fade-in" style="animation-delay: 0.3s;">
      <h3>Ready to Clear the Fog?</h3>
      <p style="color: var(--color-text-muted); margin-bottom: var(--spacing-lg);">
        Learn the hormone-balancing protocol that's helping women over 40 reclaim their mental clarity and focus.
      </p>
      <button class="btn btn-primary" onclick="window.open('https://hop.clickbank.net/?affiliate=mohameddda&vendor=geniusbr&pid=vsl', '_blank')">
        → Watch the Free Presentation
      </button>
    </div>
  `;
  
  resultsContainer.classList.remove('hidden');
  resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Perimenopause Checker Logic
function checkPerimenopauseStage() {
  const ageInput = document.getElementById('age');
  const hotFlashesInput = document.querySelector('input[name="hotFlashes"]:checked');
  const periodsInput = document.querySelector('input[name="periods"]:checked');
  const moodInput = document.querySelector('input[name="mood"]:checked');
  const sleepInput = document.querySelector('input[name="sleep"]:checked');
  const painInput = document.querySelector('input[name="pain"]:checked');
  const resultsContainer = document.getElementById('perimenopauseResults');
  
  if (!ageInput || !hotFlashesInput || !periodsInput || !moodInput || !sleepInput || !painInput) {
    alert('Please answer all questions');
    return;
  }
  
  const age = parseInt(ageInput.value);
  const symptomScore = parseInt(hotFlashesInput.value) + 
                       parseInt(periodsInput.value) + 
                       parseInt(moodInput.value) + 
                       parseInt(sleepInput.value) + 
                       parseInt(painInput.value);
  
  let stage = '';
  let stageDescription = '';
  let gaugePosition = 0;
  let insights = [];
  
  if (age < 40 && symptomScore < 3) {
    stage = 'Pre-Menopause';
    stageDescription = 'Your hormones are likely still in their regular cycling pattern.';
    gaugePosition = 10;
    insights = [
      'Your symptoms suggest you\'re not yet in perimenopause',
      'Continue monitoring your cycle and symptoms',
      'Maintain healthy lifestyle habits to support hormone balance',
      'Consider tracking your menstrual cycle for future reference'
    ];
  } else if ((age >= 40 && age < 45) || (age < 40 && symptomScore >= 3)) {
    stage = 'Early Perimenopause';
    stageDescription = 'You may be experiencing the beginning stages of hormonal transition.';
    gaugePosition = 30;
    insights = [
      'Hormone fluctuations are beginning to occur',
      'Cycles may become slightly irregular',
      'Some women experience mild symptoms at this stage',
      'Focus on stress management and quality sleep',
      'Consider discussing hormone testing with your doctor'
    ];
  } else if ((age >= 45 && age < 50) || symptomScore >= 6) {
    stage = 'Mid Perimenopause';
    stageDescription = 'You\'re likely in the active transition phase with more noticeable hormonal changes.';
    gaugePosition = 55;
    insights = [
      'Estrogen levels are fluctuating more significantly',
      'Periods may be irregular or skipped',
      'Symptoms like hot flashes and mood changes are common',
      'This phase can last several years',
      'Lifestyle modifications can help manage symptoms',
      'Discuss treatment options with your healthcare provider'
    ];
  } else if ((age >= 50 && age < 55) || symptomScore >= 9) {
    stage = 'Late Perimenopause';
    stageDescription = 'You\'re approaching menopause with significant hormonal changes.';
    gaugePosition = 80;
    insights = [
      'Estrogen production is declining more rapidly',
      'Periods may be very irregular or absent for months',
      'Symptoms often peak during this phase',
      'You\'re likely within 1-2 years of menopause',
      'Hormone therapy may be beneficial - discuss with your doctor',
      'Focus on bone health and cardiovascular wellness'
    ];
  } else {
    stage = 'Post-Menopause';
    stageDescription = 'You\'ve likely completed the menopausal transition.';
    gaugePosition = 95;
    insights = [
      'Menopause is typically confirmed after 12 months without a period',
      'Hormone levels have stabilized at lower levels',
      'Some symptoms may persist but often improve',
      'Focus on long-term health: bone density, heart health',
      'Regular health screenings become increasingly important',
      'Many women report feeling more balanced in this phase'
    ];
  }
  
  resultsContainer.innerHTML = `
    <div class="results-container fade-in">
      <h2>Your Perimenopause Stage</h2>
      <div class="score-display">${stage}</div>
      <p style="font-size: 1.125rem; color: var(--color-text-muted); margin-bottom: var(--spacing-xl);">
        ${stageDescription}
      </p>
      
      <div class="stage-gauge">
        <h3 style="margin-bottom: var(--spacing-md);">Transition Spectrum</h3>
        <div class="gauge-bar">
          <div class="gauge-marker" style="left: ${gaugePosition}%;"></div>
        </div>
        <div class="gauge-labels">
          <span>Pre-Menopause</span>
          <span>Early</span>
          <span>Mid</span>
          <span>Late</span>
          <span>Post-Menopause</span>
        </div>
      </div>
      
      <div style="margin-top: var(--spacing-xl); text-align: left;">
        <h3>Personalized Insights</h3>
        <ul style="color: var(--color-text-muted); line-height: 1.8;">
          ${insights.map(insight => `<li>${insight}</li>`).join('')}
        </ul>
      </div>
    </div>
    
    <div class="premium-cta-card fade-in" style="animation-delay: 0.3s;">
      <h3>Navigate This Transition with Confidence</h3>
      <p style="color: var(--color-text-muted); margin-bottom: var(--spacing-lg);">
        Discover how to support your body through perimenopause naturally and feel like yourself again.
      </p>
      <button class="btn btn-primary" onclick="window.open('https://hop.clickbank.net/?affiliate=mohameddda&vendor=geniusbr&pid=vsl', '_blank')">
        → Watch the Free Presentation
      </button>
    </div>
  `;
  
  resultsContainer.classList.remove('hidden');
  resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Initialize on DOM Load
document.addEventListener('DOMContentLoaded', function() {
  initMobileNav();
  initSmoothScroll();
  setActiveNavLink();
  initFAQ();
  initLazyLoading();
  initScrollAnimations();
  initGoogleAnalytics();
});