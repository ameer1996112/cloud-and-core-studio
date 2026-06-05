(function() {
  'use strict';

  document.documentElement.classList.add('js-enabled');

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── Scroll Reveal ──
  const revealElements = Array.from(document.querySelectorAll('.reveal'));
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0, rootMargin: '0px 0px -8% 0px' });

  function revealSkippedElements() {
    revealElements.forEach(el => {
      if (el.classList.contains('visible')) return;
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.92 || rect.bottom < 0) {
        el.classList.add('visible');
        revealObserver.unobserve(el);
      }
    });
  }

  revealElements.forEach(el => revealObserver.observe(el));
  requestAnimationFrame(revealSkippedElements);

  // ── Navbar Scroll ──
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', scrollY > 50);
    revealSkippedElements();
  }, { passive: true });

  // ── Parallax Elements ──
  const parallaxElements = document.querySelectorAll('.parallax');
  let ticking = false;

  const isMobile = window.innerWidth <= 768;
  if (!reduceMotion && !isMobile) {
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          parallaxElements.forEach(el => {
            const rect = el.parentElement.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
              const speed = parseFloat(el.getAttribute('data-speed')) || 0.05;
              const yOffset = (window.innerHeight - rect.top) * speed;
              el.style.transform = `translateY(${yOffset}px)`;
            }
          });
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  } else if (isMobile) {
    parallaxElements.forEach(el => el.style.transform = '');
  }

  // ── Mobile Menu ──
  const hamburger = document.getElementById('hamburger');
  const drawer = document.getElementById('mobileDrawer');
  const overlay = document.getElementById('mobileOverlay');

  function toggleMenu() {
    const isOpen = drawer.classList.contains('open');
    const nextOpen = !isOpen;
    hamburger.classList.toggle('active', nextOpen);
    hamburger.setAttribute('aria-expanded', nextOpen ? 'true' : 'false');
    drawer.classList.toggle('open', nextOpen);
    drawer.toggleAttribute('inert', !nextOpen);
    drawer.setAttribute('aria-hidden', nextOpen ? 'false' : 'true');
    overlay.classList.toggle('open', nextOpen);
    overlay.setAttribute('aria-hidden', nextOpen ? 'false' : 'true');
    document.body.style.overflow = nextOpen ? 'hidden' : '';
  }

  hamburger.addEventListener('click', toggleMenu);
  overlay.addEventListener('click', toggleMenu);
  drawer.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      if (drawer.classList.contains('open')) toggleMenu();
    });
  });

  // ── FAQ Accordion ──
  document.querySelectorAll('.faq-item').forEach(item => {
    const button = item.querySelector('.faq-q');
    button.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => {
        i.classList.remove('open');
        i.querySelector('.faq-ans').style.maxHeight = null;
        i.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('open');
        button.setAttribute('aria-expanded', 'true');
        item.querySelector('.faq-ans').style.maxHeight =
          item.querySelector('.faq-ans').scrollHeight + 'px';
      }
    });
  });

  // ── Pricing Toggle ──
  const ptBg = document.getElementById('ptBg');
  document.querySelectorAll('.ptoggle button').forEach((btn, idx) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.ptoggle button').forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      ptBg.style.transform = idx === 1 ? 'translateX(-100%)' : 'translateX(0)';
      document.querySelectorAll('.pgrid').forEach(g => g.classList.remove('active'));
      document.getElementById('pg-' + btn.dataset.t).classList.add('active');
    });
  });

  // ── Testimonials Carousel (mobile swipe-snapped) ──
  const track = document.getElementById('tTrack');
  const dots = document.querySelectorAll('.t-dot');
  let currentSlide = 0;
  let autoSlideTimer;
  let isScrolling = false;

  function updateDots(idx) {
    dots.forEach((d, i) => {
      const active = i === idx;
      d.classList.toggle('active', active);
      d.setAttribute('aria-current', active ? 'true' : 'false');
    });
  }

  function goToSlide(idx) {
    currentSlide = idx;
    if (window.innerWidth < 769) {
      const cards = track.querySelectorAll('.t-card');
      if (cards[idx]) {
        isScrolling = true;
        cards[idx].scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'nearest', inline: 'center' });
        // Clear flag after smooth scroll completes
        setTimeout(() => { isScrolling = false; }, 600);
      }
    }
    updateDots(idx);
  }

  function startAutoSlide() {
    clearInterval(autoSlideTimer);
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      clearInterval(autoSlideTimer);
      goToSlide(parseInt(dot.dataset.slide));
    });
  });

  // Native swipe scroll sync
  if (track) {
    track.addEventListener('scroll', () => {
      if (window.innerWidth < 769 && !isScrolling) {
        const slideWidth = track.getBoundingClientRect().width;
        const scrollOffset = Math.abs(track.scrollLeft);
        const activeIdx = Math.round(scrollOffset / slideWidth);
        if (activeIdx >= 0 && activeIdx < dots.length) {
          currentSlide = activeIdx;
          dots.forEach((d, i) => {
            const active = i === activeIdx;
            d.classList.toggle('active', active);
            d.setAttribute('aria-current', active ? 'true' : 'false');
          });
        }
      }
    }, { passive: true });
  }

  // Setup mobile carousel
  function setupCarousel() {
    if (window.innerWidth < 769) {
      track.style.display = 'flex';
      track.querySelectorAll('.t-card').forEach(card => {
        card.style.flex = '0 0 100%';
        card.style.minWidth = '0';
      });
      updateDots(currentSlide);
    } else {
      clearInterval(autoSlideTimer);
      track.style.display = '';
      track.querySelectorAll('.t-card').forEach(card => {
        card.style.flex = '1';
      });
    }
  }

  setupCarousel();
  window.addEventListener('resize', () => {
    clearInterval(autoSlideTimer);
    setupCarousel();
  });

  // ── Smooth Scroll ──
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      const href = a.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
        history.pushState(null, '', href);
      }
    });
  });

  // ── Form Submit Handler ──
  document.getElementById('contactForm').addEventListener('submit', e => {
    e.preventDefault();
    const form = e.target;
    const btn = form.querySelector('.btn-form');
    const status = form.querySelector('.form-status');
    const fallback = form.querySelector('.form-fallback');
    status.textContent = '';
    status.classList.remove('error');
    fallback.classList.remove('visible');

    if (!form.checkValidity()) {
      const invalidField = form.querySelector(':invalid');
      status.textContent = 'חסר פרט קטן. מלאי את השדות המסומנים וננסה שוב.';
      status.classList.add('error');
      if (invalidField) invalidField.focus();
      form.reportValidity();
      return;
    }

    btn.disabled = true;
    btn.textContent = 'שולח פרטים…';

    const showSuccess = () => {
      btn.textContent = 'הפרטים נשלחו בהצלחה!';
      status.textContent = 'הפרטים התקבלו. אחזור אלייך בהקדם.';
      btn.style.background = '#8A9E8C';
      setTimeout(() => {
        btn.textContent = 'שליחת פרטים';
        btn.style.background = '';
        btn.disabled = false;
        form.reset();
      }, 2500);
    };

    const showFailure = () => {
      btn.textContent = 'שליחת פרטים';
      btn.disabled = false;
      status.textContent = 'לא הצלחתי לשלוח כרגע. אפשר לנסות שוב או לשלוח WhatsApp ישירות.';
      status.classList.add('error');
      fallback.classList.add('visible');
    };

    const endpoint = form.dataset.endpoint;
    if (!endpoint) {
      setTimeout(showSuccess, 1000);
      return;
    }

    fetch(endpoint, {
      method: 'POST',
      body: new FormData(form),
    })
      .then(response => {
        if (!response.ok) throw new Error('Form submission failed');
        showSuccess();
      })
      .catch(showFailure);
  });

  // ── Cursor Light Effect ──
  const cursorLight = document.getElementById('cursorLight');
  if (cursorLight && window.innerWidth > 768 && !reduceMotion) {
    let raf;
    document.addEventListener('mousemove', (e) => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        cursorLight.style.left = e.clientX + 'px';
        cursorLight.style.top = e.clientY + 'px';
        if (!cursorLight.classList.contains('active')) {
          cursorLight.classList.add('active');
        }
      });
    });
  }

  // ── 2. Animated Number Counters ──
  function animateCounter(el) {
    const target = parseFloat(el.getAttribute('data-count'));
    const isFloat = el.getAttribute('data-count').includes('.');
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1800;
    const start = performance.now();
    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;
      el.textContent = (isFloat ? value.toFixed(1) : Math.round(value)) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.counted) {
        entry.target.dataset.counted = '1';
        animateCounter(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

  // ── 3. Text Split Word Animation ──
  document.querySelectorAll('.word-split').forEach(el => {
    // Split text nodes into word spans
    const html = el.innerHTML;
    const words = html.split(/(\s+)/);
    el.innerHTML = words.map(w => {
      if (w.trim() === '' || w.match(/^<br/i)) return w;
      // If it's an HTML tag, return as-is
      if (w.startsWith('<')) return w;
      return `<span class="word"><span class="word-inner">${w}</span></span>`;
    }).join('');
  });

  const splitObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        splitObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.word-split').forEach(el => splitObserver.observe(el));

  // ── 4. 3D Card Tilt ──
  if (window.innerWidth > 768) {
    document.querySelectorAll('.tilt-card').forEach(card => {
      const light = card.querySelector('.tilt-inner-light');
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(1000px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) scale(1.02)`;
        if (light) {
          light.style.background = `radial-gradient(circle at ${(x + 0.5) * 100}% ${(y + 0.5) * 100}%, rgba(255,255,255,0.1) 0%, transparent 60%)`;
        }
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateY(0) rotateX(0) scale(1)';
      });
    });
  }

  // ── 5. Gallery Drag-to-Scroll ──
  const galleryTrack = document.getElementById('galleryTrack');
  if (galleryTrack) {
    let isDown = false, startX, scrollLeft;
    galleryTrack.addEventListener('mousedown', e => {
      isDown = true;
      startX = e.pageX - galleryTrack.offsetLeft;
      scrollLeft = galleryTrack.scrollLeft;
    });
    galleryTrack.addEventListener('mouseleave', () => { isDown = false; });
    galleryTrack.addEventListener('mouseup', () => { isDown = false; });
    galleryTrack.addEventListener('mousemove', e => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - galleryTrack.offsetLeft;
      const walk = (x - startX) * 1.5;
      galleryTrack.scrollLeft = scrollLeft - walk;
    });

    let galleryAutoScroll;
    function startGalleryAutoScroll() {
      if (reduceMotion) return;
      clearInterval(galleryAutoScroll);
      galleryAutoScroll = setInterval(() => {
        if (!isDown) {
          galleryTrack.scrollLeft += 1;
          if (galleryTrack.scrollLeft >= galleryTrack.scrollWidth - galleryTrack.clientWidth - 10) {
            galleryTrack.scrollLeft = 0;
          }
        }
      }, 35);
    }

    startGalleryAutoScroll();
    galleryTrack.addEventListener('mouseenter', () => clearInterval(galleryAutoScroll));
    galleryTrack.addEventListener('mouseleave', startGalleryAutoScroll);
  }

  // ── 6. Sticky CTA Bar ──
  const stickyCta = document.getElementById('sticky-cta');
  const heroSection = document.getElementById('hero');
  const contactSection = document.getElementById('contact');
  const whatsappBtn = document.querySelector('.whatsapp-btn');
  if (stickyCta) {
    stickyCta.inert = true;
    window.addEventListener('scroll', () => {
      if (!heroSection || !contactSection) return;
      const heroBottom = heroSection.getBoundingClientRect().bottom;
      const contactTop = contactSection.getBoundingClientRect().top;
      if (heroBottom < 0 && contactTop > window.innerHeight) {
        stickyCta.classList.add('visible');
        stickyCta.setAttribute('aria-hidden', 'false');
        stickyCta.inert = false;
        if (whatsappBtn) whatsappBtn.classList.add('lifted');
      } else {
        stickyCta.classList.remove('visible');
        stickyCta.setAttribute('aria-hidden', 'true');
        stickyCta.inert = true;
        if (whatsappBtn) whatsappBtn.classList.remove('lifted');
      }
    }, { passive: true });
  }

  // ── 7. Social Proof Toasts ──
  const toastContainer = document.getElementById('toast-container');
  const toastMessages = [
    { name: 'מ', text: 'מיכל ממעלות', action: 'נרשמה לשיעור ניסיון 🎉' },
    { name: 'ס', text: 'סמר ובתה מחורפיש', action: 'הזמינו סדנת אמא ובת ✨' },
    { name: 'נ', text: 'נועה מכפר ורדים', action: 'רכשה כרטיסיית 10 שיעורים 🌸' },
    { name: 'ר', text: 'ראניה מיאנוח', action: 'נרשמה למנוי שנתי ⭐' },
    { name: 'ד', text: 'דאליה ומשפחתה מחורפיש', action: 'הזמינו שיעור יום הולדת 🎈' },
    { name: 'ל', text: 'ליאן מפקיעין', action: 'הצטרפה לשיעורי ילדים 👧' },
  ];
  let toastIndex = 0;
  let toastPaused = false;

  // Pause toasts when contact form is focused
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('focusin', () => { toastPaused = true; });
    contactForm.addEventListener('focusout', () => { toastPaused = false; });
  }

  function showToast() {
    if (toastPaused || !toastContainer) return;
    const msg = toastMessages[toastIndex % toastMessages.length];
    toastIndex++;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <div class="toast-avatar">${msg.name}</div>
      <div class="toast-text"><strong>${msg.text}</strong>${msg.action}</div>
    `;
    toastContainer.appendChild(toast);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => { toast.classList.add('show'); });
    });
    setTimeout(() => {
      toast.classList.add('hide');
      setTimeout(() => toast.remove(), 600);
    }, 4500);
  }

  // Start toasts after 6 seconds, then every 10 seconds
  setTimeout(() => {
    showToast();
    setInterval(showToast, 10000);
  }, 6000);

  // ── 8. Scroll-Spy Nav ──
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
  const sections = Array.from(navAnchors).map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);

  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navAnchors.forEach(a => a.classList.remove('active'));
        const activeLink = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        if (activeLink) activeLink.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => spyObserver.observe(s));

  // ── 9. Progressive Image Loading ──
  document.querySelectorAll('.img-progressive').forEach(img => {
    const markLoaded = () => img.classList.add('loaded');
    if (img.complete && img.naturalWidth > 0) {
      markLoaded();
    } else {
      img.addEventListener('load', markLoaded, { once: true });
      img.addEventListener('error', markLoaded, { once: true });
      // Fallback for Safari cached load race conditions
      setTimeout(() => {
        if (img.complete) markLoaded();
      }, 100);
    }
    // Ultimate safety fallback to prevent any permanent blur on slow connections
    setTimeout(markLoaded, 1200);
  });

})();


/* ═══════════════════════════════════════════
   DESIGN SPELLS — Logic
   ═══════════════════════════════════════════ */

// 1. Cursor Aura
document.addEventListener('mousemove', (e) => {
  document.body.style.setProperty('--mouse-x', e.clientX);
  document.body.style.setProperty('--mouse-y', e.clientY);
});

// 2. Magnetic Buttons
const magnetics = document.querySelectorAll('.magnetic');
magnetics.forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = `translate(0px, 0px)`;
  });
});
