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

  // Interactive Case Study Modal for Our Work page
  const projectCardsForModal = document.querySelectorAll('.project-card');
  if (projectCardsForModal.length) {
    // Inject modal backdrop if not present
    let modalBackdrop = document.querySelector('.project-modal-backdrop');
    if (!modalBackdrop) {
      modalBackdrop = document.createElement('div');
      modalBackdrop.className = 'project-modal-backdrop';
      modalBackdrop.innerHTML = `
        <div class="project-modal-dialog" role="dialog" aria-modal="true">
          <button class="project-modal-close" aria-label="Close case study modal">✕</button>
          <div class="project-modal-media">
            <img src="" alt="Imperial Project Inspection">
          </div>
          <div class="project-modal-body">
            <span class="project-modal-location"></span>
            <h3></h3>
            <div class="project-modal-metrics">
              <div class="modal-metric"><strong class="metric-1">-</strong><span>Timeline</span></div>
              <div class="modal-metric"><strong class="metric-2">-</strong><span>Added Area</span></div>
              <div class="modal-metric"><strong class="metric-3">-</strong><span>Planning Scope</span></div>
            </div>
            <div class="project-modal-details">
              <div class="modal-detail-block">
                <strong>The Architectural Challenge</strong>
                <p class="modal-challenge"></p>
              </div>
              <div class="modal-detail-block">
                <strong>The Imperial Engineering Solution</strong>
                <p class="modal-solution"></p>
              </div>
              <div class="modal-detail-block">
                <strong>The Handover Result</strong>
                <p class="modal-result"></p>
              </div>
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px;">
              <a href="contact.html" class="btn">Enquire About A Similar Project →</a>
              <span style="font-size:12px; color:var(--muted);">All projects covered by £10M Insurance & 12–24m warranty</span>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(modalBackdrop);

      // Close handlers
      modalBackdrop.querySelector('.project-modal-close').addEventListener('click', () => {
        modalBackdrop.classList.remove('active');
      });
      modalBackdrop.addEventListener('click', (e) => {
        if (e.target === modalBackdrop) {
          modalBackdrop.classList.remove('active');
        }
      });
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalBackdrop.classList.contains('active')) {
          modalBackdrop.classList.remove('active');
        }
      });
    }

    projectCardsForModal.forEach(card => {
      const link = card.querySelector('.project-link');
      if (link) {
        link.addEventListener('click', (e) => {
          e.preventDefault();

          const title = card.querySelector('h3') ? card.querySelector('h3').textContent : '';
          const location = card.querySelector('.project-location') ? card.querySelector('.project-location').textContent : '';
          const img = card.querySelector('.project-media img') ? card.querySelector('.project-media img').src : '';
          
          const specItems = card.querySelectorAll('.project-specs .spec-item strong');
          const metric1 = specItems[0] ? specItems[0].textContent : 'Flexible';
          const metric2 = specItems[1] ? specItems[1].textContent : 'Custom';
          const metric3 = specItems[2] ? specItems[2].textContent : 'Permitted Dev';

          const narrativePhases = card.querySelectorAll('.project-narrative .narrative-phase p');
          const challenge = narrativePhases[0] ? narrativePhases[0].textContent : card.querySelector('.project-info p') ? card.querySelector('.project-info p').textContent : '';
          const solution = narrativePhases[1] ? narrativePhases[1].textContent : 'Full architectural specification and engineered structural layout.';
          const result = narrativePhases[2] ? narrativePhases[2].textContent : 'Delivered on time, on budget with complete Building Control sign-off.';

          // Populate modal
          modalBackdrop.querySelector('h3').textContent = title;
          modalBackdrop.querySelector('.project-modal-location').textContent = location;
          modalBackdrop.querySelector('.project-modal-media img').src = img;
          modalBackdrop.querySelector('.metric-1').textContent = metric1;
          modalBackdrop.querySelector('.metric-2').textContent = metric2;
          modalBackdrop.querySelector('.metric-3').textContent = metric3;
          modalBackdrop.querySelector('.modal-challenge').textContent = challenge;
          modalBackdrop.querySelector('.modal-solution').textContent = solution;
          modalBackdrop.querySelector('.modal-result').textContent = result;

          modalBackdrop.classList.add('active');
        });
      }
    });
  }

  // Interactive Project Planner Quiz Logic
  const quiz = document.getElementById('projectQuiz');
  if (quiz) {
    let currentStep = 1;
    let quizData = {
      project: 'Loft Conversion',
      planning: 'Full Drawings & Approved Planning',
      timeline: 'Immediately (1-2 Months)'
    };

    const dots = quiz.querySelectorAll('.quiz-indicator-dot');
    const panes = quiz.querySelectorAll('.quiz-step-pane');

    function showStep(step) {
      currentStep = step;
      dots.forEach(d => {
        const stepNum = parseInt(d.getAttribute('data-step'), 10);
        d.classList.remove('active', 'completed');
        if (stepNum === currentStep) d.classList.add('active');
        else if (stepNum < currentStep) d.classList.add('completed');
      });
      panes.forEach((p, idx) => {
        p.classList.toggle('active', (idx + 1) === currentStep);
      });
    }

    // Choice card selections
    quiz.querySelectorAll('.quiz-choice-card').forEach(card => {
      card.addEventListener('click', () => {
        const category = card.getAttribute('data-quiz-choice');
        const val = card.getAttribute('data-val');
        card.closest('.quiz-options-grid').querySelectorAll('.quiz-choice-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        quizData[category] = val;
      });
    });

    const next1 = document.getElementById('quizNext1');
    const next2 = document.getElementById('quizNext2');
    const back2 = document.getElementById('quizBack2');
    const back3 = document.getElementById('quizBack3');
    const complete = document.getElementById('quizComplete');

    if (next1) next1.addEventListener('click', () => showStep(2));
    if (next2) next2.addEventListener('click', () => showStep(3));
    if (back2) back2.addEventListener('click', () => showStep(1));
    if (back3) back3.addEventListener('click', () => showStep(2));

    if (complete) {
      complete.addEventListener('click', () => {
        // Pre-fill form fields
        const projSelect = document.getElementById('projectType');
        const detailsTextarea = document.getElementById('projectScope');
        
        if (projSelect) {
          if (quizData.project.includes('Loft')) projSelect.value = 'loft';
          else if (quizData.project.includes('Extension')) projSelect.value = 'extension';
          else if (quizData.project.includes('Renovation')) projSelect.value = 'renovation';
        }

        if (detailsTextarea) {
          detailsTextarea.value = `[Project Planner Summary]\\nProject: ${quizData.project}\\nPlanning Status: ${quizData.planning}\\nTarget Start: ${quizData.timeline}\\n\\nAdditional details: `;
        }

        // Smooth scroll to top form
        const formTop = document.getElementById('enquiryForm');
        if (formTop) {
          formTop.scrollIntoView({ behavior: 'smooth', block: 'center' });
          formTop.querySelector('#fullName')?.focus();
        }
      });
    }
  }
