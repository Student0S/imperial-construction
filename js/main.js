// Imperial Real Estate Construction — Interactive Scripts

document.addEventListener('DOMContentLoaded', () => {
  // Mobile Nav Toggle
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
      mobileToggle.textContent = isOpen ? '✕' : '☰';
    });

    document.querySelectorAll('.nav-links a').forEach(a => {
      a.addEventListener('click', () => {
        navLinks.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileToggle.textContent = '☰';
      });
    });
  }

  // Header Scroll Shadow
  const header = document.querySelector('.header-wrap');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  // Before & After Sliders setup
  const compareSliders = document.querySelectorAll('.compare');
  compareSliders.forEach(slider => {
    const input = slider.querySelector('input[type="range"]');
    if (input) {
      input.addEventListener('input', (e) => {
        slider.style.setProperty('--split', `${e.target.value}%`);
      });
    }
  });

  // Slider tabs if present (scoped per section/page)
  const sliderTabGroups = document.querySelectorAll('.slider-tabs');
  sliderTabGroups.forEach(group => {
    const tabs = group.querySelectorAll('.slider-tab-btn');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        // Hide sibling slider cards within this slider container context
        const parentSection = group.closest('section') || document;
        const targetId = tab.getAttribute('data-target');
        const cards = parentSection.querySelectorAll('.slider-card-item');
        cards.forEach(c => {
          c.style.display = (c.id === targetId) ? 'block' : 'none';
        });
      });
    });
  });

  // Portfolio Filters
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.projects-masonry .project-card');

  if (filterBtns.length && projectCards.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');
        projectCards.forEach(card => {
          if (filter === 'all' || card.getAttribute('data-category') === filter) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // Enquiry demo form
  const enquiryForm = document.getElementById('enquiryForm');
  const formFeedback = document.getElementById('formFeedback');

  if (enquiryForm && formFeedback) {
    enquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Honeypot spam protection
      const honeypot = enquiryForm.querySelector('.hp-field');
      if (honeypot && honeypot.value !== '') {
        // Bot detected, silently ignore
        return;
      }

      // Collect form data
      const formData = new FormData(enquiryForm);
      const data = Object.fromEntries(formData.entries());

      // Show loading state
      const submitBtn = enquiryForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Sending...';
      formFeedback.innerHTML = '';

      // Simulate API call (replace with actual n8n webhook endpoint)
      // In production: fetch('https://your-n8n-webhook-url', { method: 'POST', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } })
      setTimeout(() => {
        // Success state
        formFeedback.innerHTML = `
          <div style="background: rgba(34, 197, 94, 0.1); border: 1px solid rgba(34, 197, 94, 0.3); padding: 24px; border-radius: var(--radius-sm); margin-top: 24px;">
            <strong style="color: #166534; display: block; margin-bottom: 8px; font-size: 16px;">✓ Enquiry Received</strong>
            <p style="margin: 0; font-size: 14px; color: var(--muted); line-height: 1.7;">
              Thank you, <strong>${data.name || 'there'}</strong>. We'll call within one working day to discuss your project.
            </p>
            <p style="margin: 8px 0 0; font-size: 12px; color: var(--muted);">Reference: IMP-${Date.now().toString(36).toUpperCase()}</p>
          </div>
        `;
        submitBtn.innerHTML = '✓ Sent';
        submitBtn.style.background = 'var(--success)';
        enquiryForm.reset();

        // Track conversion (GA4 event)
        if (typeof gtag === 'function') {
          gtag('event', 'submit', {
            'event_category': 'Enquiry Form',
            'event_label': data.project_type || 'General',
            'value': 1
          });
          gtag('event', 'conversion', {
            'send_to': 'AW-XXXXXXXXX/XXXXXXXXX',
            'value': 1.0,
            'currency': 'GBP'
          });
        }
      }, 1000);
    });
  }
});

  // Project Feasibility & Cost Calculator
  const calcContainer = document.querySelector('.calc-container');
  if (calcContainer) {
    const rates = {
      loft: {
        compact: { min: 42000, max: 55000, weeks: '6 - 8 Weeks' },
        medium: { min: 55000, max: 72000, weeks: '8 - 10 Weeks' },
        large: { min: 72000, max: 95000, weeks: '10 - 12 Weeks' }
      },
      extension: {
        compact: { min: 48000, max: 68000, weeks: '10 - 12 Weeks' },
        medium: { min: 68000, max: 95000, weeks: '12 - 16 Weeks' },
        large: { min: 95000, max: 145000, weeks: '16 - 20 Weeks' }
      },
      renovation: {
        compact: { min: 65000, max: 90000, weeks: '12 - 14 Weeks' },
        medium: { min: 90000, max: 150000, weeks: '14 - 18 Weeks' },
        large: { min: 150000, max: 240000, weeks: '18 - 24 Weeks' }
      },
      kitchen: {
        compact: { min: 18000, max: 28000, weeks: '3 - 4 Weeks' },
        medium: { min: 28000, max: 45000, weeks: '4 - 6 Weeks' },
        large: { min: 45000, max: 70000, weeks: '6 - 8 Weeks' }
      }
    };

    let selectedType = 'loft';
    let selectedScale = 'medium';

    const typePills = calcContainer.querySelectorAll('[data-calc-type]');
    const scalePills = calcContainer.querySelectorAll('[data-calc-scale]');
    const priceOutput = calcContainer.querySelector('.calc-estimate-range');
    const timelineOutput = calcContainer.querySelector('.calc-estimate-timeline');

    function updateCalc() {
      const data = rates[selectedType][selectedScale];
      if (priceOutput && timelineOutput && data) {
        priceOutput.textContent = `£${data.min.toLocaleString()} – £${data.max.toLocaleString()}`;
        timelineOutput.textContent = `Estimated Duration: ${data.weeks}`;
      }
    }

    typePills.forEach(pill => {
      pill.addEventListener('click', () => {
        typePills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        selectedType = pill.getAttribute('data-calc-type');
        updateCalc();
      });
    });

    scalePills.forEach(pill => {
      pill.addEventListener('click', () => {
        scalePills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        selectedScale = pill.getAttribute('data-calc-scale');
        updateCalc();
      });
    });

    updateCalc();
  }

  // Scroll reveal observer for .fade-in-up
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in-up').forEach(el => observer.observe(el));
  } else {
    document.querySelectorAll('.fade-in-up').forEach(el => el.classList.add('visible'));
  }
