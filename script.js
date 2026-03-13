/* ===========================
   VARIDHI — script.js
   Main JS: GSAP, animations,
   navbar, wave, scrollReveal
   =========================== */

'use strict';

// ===== GSAP PLUGINS =====
gsap.registerPlugin(ScrollTrigger);

// ===== NAVBAR =====
const navbar = document.getElementById('navbar');
const menuBtn = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

// Scroll shrink
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });

// Hamburger toggle
if (menuBtn) {
  menuBtn.addEventListener('click', () => {
    menuBtn.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });

  // Close on link click
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menuBtn.classList.remove('open');
      mobileMenu.classList.remove('open');
    });
  });
}

// ===== SMOOTH SCROLL for # links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ===== HERO GSAP ENTRANCE ANIMATION =====
function heroAnimation() {
  const badge = document.querySelector('.hero-badge');
  const headline = document.querySelector('.hero-headline');
  const sub = document.querySelector('.hero-sub');
  const cta = document.querySelector('.hero-cta');
  const stats = document.querySelector('.hero-stats');

  if (!headline) return;

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.to(badge, { opacity: 1, y: 0, duration: 0.7, delay: 0.2 })
    .to(headline, { opacity: 1, y: 0, duration: 0.9 }, '-=0.3')
    .to(sub, { opacity: 1, y: 0, duration: 0.7 }, '-=0.5')
    .to(cta, { opacity: 1, y: 0, duration: 0.7 }, '-=0.5')
    .to(stats, { opacity: 1, y: 0, duration: 0.7 }, '-=0.4');
}

// ===== SCROLL REVEAL =====
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal-up');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    reveals.forEach(el => observer.observe(el));
  } else {
    // Fallback: show all
    reveals.forEach(el => el.classList.add('visible'));
  }
}

// ===== ANIMATED WAVE CANVAS =====
function initWaveCanvas() {
  const canvas = document.getElementById('wave-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height, animFrame;
  let t = 0;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  function drawWave(y, amplitude, period, speed, color, alpha) {
    ctx.beginPath();
    ctx.moveTo(0, height);
    for (let x = 0; x <= width; x += 2) {
      const waveY = y +
        Math.sin((x / width) * period * Math.PI * 2 + t * speed) * amplitude +
        Math.sin((x / width) * (period * 1.7) * Math.PI * 2 + t * speed * 0.7) * (amplitude * 0.4);
      ctx.lineTo(x, waveY);
    }
    ctx.lineTo(width, height);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.globalAlpha = alpha;
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    t += 0.006;

    drawWave(height * 0.55, 38, 1.8, 0.6, '#1a7fd4', 0.09);
    drawWave(height * 0.62, 28, 2.3, 0.8, '#0f5fa8', 0.08);
    drawWave(height * 0.68, 20, 3.1, 1.0, '#4fa0e8', 0.07);
    drawWave(height * 0.74, 15, 2.7, 0.5, '#1a7fd4', 0.06);

    animFrame = requestAnimationFrame(animate);
  }

  resize();
  animate();
  window.addEventListener('resize', resize, { passive: true });

  // Cleanup if canvas removed
  return () => {
    cancelAnimationFrame(animFrame);
    window.removeEventListener('resize', resize);
  };
}

// ===== PARALLAX BACKGROUND =====
function initParallax() {
  const hero = document.getElementById('hero');
  if (!hero) return;

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const heroBg = hero.querySelector('.hero-bg');
    if (heroBg) {
      heroBg.style.transform = `translateY(${scrolled * 0.35}px)`;
    }
    const canvas = document.getElementById('wave-canvas');
    if (canvas) {
      canvas.style.transform = `translateY(${scrolled * 0.2}px)`;
    }
  }, { passive: true });
}

// ===== GSAP COUNTER ANIMATION for stats =====
function initCounters() {
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseInt(el.getAttribute('data-count'), 10);
    gsap.to({ val: 0 }, {
      val: target,
      duration: 2.5,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        once: true,
      },
      onUpdate: function () {
        el.textContent = Math.round(this.targets()[0].val).toLocaleString();
      }
    });
  });
}

// ===== FAQ ACCORDION (shared across pages) =====
function initFAQ() {
  document.querySelectorAll('.faq-item').forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (!question || !answer) return;

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      // Close all
      document.querySelectorAll('.faq-item').forEach(i => {
        i.classList.remove('open');
        const a = i.querySelector('.faq-answer');
        if (a) a.classList.remove('open');
      });
      // Toggle clicked
      if (!isOpen) {
        item.classList.add('open');
        answer.classList.add('open');
      }
    });
  });
}

// ===== CONTACT FORM HANDLING =====
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const submitBtn = form.querySelector('[type="submit"]');
    const originalText = submitBtn.innerHTML;

    // Loading state
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i> Sending...';
    submitBtn.disabled = true;

    // Simulate API call
    setTimeout(() => {
      submitBtn.innerHTML = '<i class="fa-solid fa-check mr-2"></i> Message Sent!';
      submitBtn.classList.add('bg-green-600');

      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        submitBtn.classList.remove('bg-green-600');
        form.reset();
      }, 3500);
    }, 1500);
  });
}

// ===== GSAP SCROLL-TRIGGERED ANIMATIONS =====
function initGSAPScroll() {
  // Steps stagger
  gsap.utils.toArray('.step-card').forEach((card, i) => {
    gsap.fromTo(card,
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        delay: i * 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          once: true,
        }
      }
    );
  });

  // Feature cards stagger
  gsap.utils.toArray('.feature-card').forEach((card, i) => {
    gsap.fromTo(card,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.7,
        delay: i * 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 88%',
          once: true,
        }
      }
    );
  });

  // Value cards
  gsap.utils.toArray('.value-card').forEach((card, i) => {
    gsap.fromTo(card,
      { x: i % 2 === 0 ? -40 : 40, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          once: true,
        }
      }
    );
  });
}

// ===== BUTTON RIPPLE EFFECT =====
function initRipple() {
  document.querySelectorAll('.btn-primary').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255,255,255,0.25);
        width: 10px; height: 10px;
        left: ${e.clientX - rect.left - 5}px;
        top: ${e.clientY - rect.top - 5}px;
        transform: scale(0);
        animation: rippleAnim 0.55s ease-out forwards;
        pointer-events: none;
      `;
      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  // Inject ripple keyframe if not present
  if (!document.getElementById('ripple-style')) {
    const style = document.createElement('style');
    style.id = 'ripple-style';
    style.textContent = `
      @keyframes rippleAnim {
        to { transform: scale(30); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
}

// ===== INIT ALL =====
document.addEventListener('DOMContentLoaded', () => {
  heroAnimation();
  initScrollReveal();
  initWaveCanvas();
  initParallax();
  initCounters();
  initFAQ();
  initContactForm();
  initGSAPScroll();
  initRipple();
});
