/**
 * BUSINESS GRAPH — FUTURISTIC INTERACTIVE ENGINE
 * Features:
 * - Interactive Neural Graph Canvas with traveling data packets & mouse magnetism
 * - 3D Holographic Gyroscope & Card Tilt Physics
 * - Ambient Cursor Spotlight Tracker
 * - Telemetry Metric Counting Animations
 * - Interactive Autonomous AI Chat Assistant with typing state
 * - Navigation Scrollspy & Smooth Responsive Menu
 */

function init() {
  try { initAssetVerification(); } catch(e) { console.warn(e); }
  try { initNav(); } catch(e) { console.warn(e); }
  try { initGraphCanvas(); } catch(e) { console.warn(e); }
  try { initCursorGlow(); } catch(e) { console.warn(e); }
  try { init3DTilt(); } catch(e) { console.warn(e); }
  try { initCounters(); } catch(e) { console.warn(e); }
  try { initAIChat(); } catch(e) { console.warn(e); }
  try { initContactForm(); } catch(e) { console.warn(e); }
  try { initScrollReveal(); } catch(e) { console.warn(e); }
}

function initAssetVerification() {
  if (typeof window !== 'undefined' && window.BUSINESS_GRAPH_ASSETS) {
    document.querySelectorAll('img').forEach(function(img) {
      const src = img.getAttribute('src');
      if (src && window.BUSINESS_GRAPH_ASSETS[src]) {
        img.addEventListener('error', function() {
          this.src = window.BUSINESS_GRAPH_ASSETS[src];
        });
        if (img.complete && (img.naturalWidth === 0 || img.naturalHeight === 0)) {
          img.src = window.BUSINESS_GRAPH_ASSETS[src];
        }
      }
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

/* ==========================================================================
   1. NAVIGATION & SCROLLSPY
   ========================================================================== */

function initNav() {
  const menuBtn = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav-links');
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section[id]');
  const yearEl = document.getElementById('year');

  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile Menu Toggle
  if (menuBtn && nav) {
    menuBtn.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Scrollspy: highlight active section
  window.addEventListener('scroll', () => {
    let current = '';
    const scrollY = window.pageYOffset;

    sections.forEach(sec => {
      const top = sec.offsetTop - 140;
      const height = sec.offsetHeight;
      if (scrollY >= top && scrollY < top + height) {
        current = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });
}

/* ==========================================================================
   2. INTERACTIVE NEURAL GRAPH CANVAS (The "Business Graph")
   ========================================================================== */

function initGraphCanvas() {
  const canvas = document.getElementById('graphCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let animationFrameId;
  let isPaused = false;

  const mouse = {
    x: -1000,
    y: -1000,
    radius: 160,
    active: false
  };

  const particles = [];
  const packets = []; // Packets of data traveling along graph edges
  const PARTICLE_COUNT_DESKTOP = 65;
  const PARTICLE_COUNT_MOBILE = 28;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', () => {
    resize();
    initParticles();
  });

  window.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = -1000;
    mouse.y = -1000;
    mouse.active = false;
  });

  // Click generates burst of energy packets
  window.addEventListener('click', e => {
    for (let i = 0; i < 5; i++) {
      packets.push({
        x: e.clientX,
        y: e.clientY,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        life: 1,
        color: Math.random() > 0.4 ? '#39d9ed' : '#f0be42'
      });
    }
  });

  class Particle {
    constructor() {
      this.reset();
      this.x = Math.random() * width;
      this.y = Math.random() * height;
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.45;
      this.vy = (Math.random() - 0.5) * 0.45;
      this.radius = Math.random() * 2 + 1;
      this.isGold = Math.random() > 0.72;
      this.baseColor = this.isGold ? '240, 190, 66' : '57, 217, 237';
      this.pulseSpeed = Math.random() * 0.03 + 0.01;
      this.pulse = Math.random() * Math.PI;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.pulse += this.pulseSpeed;

      // Wrap boundaries
      if (this.x < -20) this.x = width + 20;
      if (this.x > width + 20) this.x = -20;
      if (this.y < -20) this.y = height + 20;
      if (this.y > height + 20) this.y = -20;

      // Mouse gentle attraction/repulsion
      if (mouse.active) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 1.5;
          this.y -= (dy / dist) * force * 1.5;
        }
      }
    }

    draw() {
      const currentRadius = this.radius + Math.sin(this.pulse) * 0.8;
      const alpha = 0.5 + Math.sin(this.pulse) * 0.3;

      ctx.beginPath();
      ctx.arc(this.x, this.y, Math.max(0.5, currentRadius), 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.baseColor}, ${alpha})`;
      ctx.shadowColor = `rgba(${this.baseColor}, 0.8)`;
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  function initParticles() {
    particles.length = 0;
    const count = window.innerWidth < 768 ? PARTICLE_COUNT_MOBILE : PARTICLE_COUNT_DESKTOP;
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  // Spawn traveling data packets along connections
  function spawnPacket(p1, p2) {
    if (packets.length > 25) return;
    packets.push({
      p1,
      p2,
      progress: 0,
      speed: Math.random() * 0.012 + 0.008,
      color: Math.random() > 0.5 ? '#39d9ed' : '#f0be42'
    });
  }

  function animate() {
    if (isPaused) {
      animationFrameId = requestAnimationFrame(animate);
      return;
    }

    ctx.clearRect(0, 0, width, height);

    // Update & draw particles
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }

    // Connect particles
    const maxDist = 135;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.28;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);

          const grad = ctx.createLinearGradient(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
          grad.addColorStop(0, `rgba(${particles[i].baseColor}, ${alpha})`);
          grad.addColorStop(1, `rgba(${particles[j].baseColor}, ${alpha})`);

          ctx.strokeStyle = grad;
          ctx.lineWidth = 1;
          ctx.stroke();

          // Occasionally spawn a data packet
          if (Math.random() < 0.001) {
            spawnPacket(particles[i], particles[j]);
          }
        }
      }

      // Connect to mouse cursor
      if (mouse.active) {
        const dx = mouse.x - particles[i].x;
        const dy = mouse.y - particles[i].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const alpha = (1 - dist / mouse.radius) * 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(57, 217, 237, ${alpha})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
      }
    }

    // Update & draw data packets
    for (let i = packets.length - 1; i >= 0; i--) {
      const pkt = packets[i];
      if (pkt.life !== undefined) {
        // Click burst packet
        pkt.x += pkt.vx;
        pkt.y += pkt.vy;
        pkt.life -= 0.03;
        if (pkt.life <= 0) {
          packets.splice(i, 1);
          continue;
        }
        ctx.beginPath();
        ctx.arc(pkt.x, pkt.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = pkt.color;
        ctx.shadowColor = pkt.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      } else {
        // Edge connection packet
        pkt.progress += pkt.speed;
        if (pkt.progress >= 1) {
          packets.splice(i, 1);
          continue;
        }
        const x = pkt.p1.x + (pkt.p2.x - pkt.p1.x) * pkt.progress;
        const y = pkt.p1.y + (pkt.p2.y - pkt.p1.y) * pkt.progress;

        ctx.beginPath();
        ctx.arc(x, y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = pkt.color;
        ctx.shadowColor = pkt.color;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    animationFrameId = requestAnimationFrame(animate);
  }

  resize();
  initParticles();
  animate();

  // Pause when tab not visible to save battery/resources
  document.addEventListener('visibilitychange', () => {
    isPaused = document.hidden;
  });
}

/* ==========================================================================
   3. AMBIENT CURSOR SPOTLIGHT
   ========================================================================== */

function initCursorGlow() {
  const glow = document.getElementById('cursorGlow');
  if (!glow || window.innerWidth < 768) return;

  let currentX = window.innerWidth / 2;
  let currentY = window.innerHeight / 2;
  let targetX = currentX;
  let targetY = currentY;

  window.addEventListener('mousemove', e => {
    targetX = e.clientX;
    targetY = e.clientY;
  });

  function render() {
    currentX += (targetX - currentX) * 0.12;
    currentY += (targetY - currentY) * 0.12;
    glow.style.transform = `translate(${currentX}px, ${currentY}px) translate(-50%, -50%)`;
    requestAnimationFrame(render);
  }
  render();
}

/* ==========================================================================
   4. 3D PERSPECTIVE TILT PHYSICS
   ========================================================================== */

function init3DTilt() {
  const tiltCards = document.querySelectorAll('[data-tilt]');
  const holoStage = document.getElementById('holoStage');
  const dashCard = document.getElementById('dashCard');

  // Generic 3D tilt with multi-layered parallax depth and specular reflection
  tiltCards.forEach(card => {
    const glare = card.querySelector('.card-glare');
    const photoStage = card.querySelector('.team-photo-stage');
    const reticle = card.querySelector('.hud-reticle');
    const telem = card.querySelector('.photo-telemetry');
    const statusTag = card.querySelector('.team-status-tag');

    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;

      card.style.transform = `perspective(1100px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;

      if (glare) {
        glare.style.opacity = '1';
        glare.style.background = `radial-gradient(circle 240px at ${x}px ${y}px, rgba(255, 255, 255, 0.18) 0%, transparent 65%)`;
      }
      if (reticle) {
        reticle.style.transform = `translateZ(46px) translate(${rotateY * 0.8}px, ${-rotateX * 0.8}px) scale(1.15)`;
      }
      if (photoStage) {
        photoStage.style.transform = `translateZ(38px)`;
      }
      if (statusTag) {
        statusTag.style.transform = `translateZ(60px) translate(${rotateY * 0.5}px, ${-rotateX * 0.5}px)`;
      }
      if (telem) {
        telem.style.transform = `translateZ(42px) translate(${rotateY * 0.4}px, 0px)`;
      }
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      if (glare) glare.style.opacity = '0';
      if (reticle) reticle.style.transform = '';
      if (photoStage) photoStage.style.transform = '';
      if (statusTag) statusTag.style.transform = '';
      if (telem) telem.style.transform = '';
    });
  });

  // Hero visual holographic stage tilt tracking
  const heroVisual = document.getElementById('heroVisual');
  if (heroVisual) {
    heroVisual.addEventListener('mousemove', e => {
      const rect = heroVisual.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      if (holoStage) {
        holoStage.style.transform = `rotateY(${x * 16}deg) rotateX(${-y * 16}deg)`;
      }
      if (dashCard) {
        dashCard.style.transform = `perspective(1000px) rotateY(${x * 10 - 4}deg) rotateX(${-y * 10 + 2}deg)`;
      }
    });

    heroVisual.addEventListener('mouseleave', () => {
      if (holoStage) holoStage.style.transform = '';
      if (dashCard) dashCard.style.transform = 'perspective(1000px) rotateY(-4deg) rotateX(2deg)';
    });
  }
}

/* ==========================================================================
   5. TELEMETRY COUNTER ANIMATIONS
   ========================================================================== */

function initCounters() {
  const counters = document.querySelectorAll('.counter');
  let animated = false;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        counters.forEach(counter => {
          const target = parseFloat(counter.getAttribute('data-target') || '0');
          const prefix = counter.getAttribute('data-prefix') || '';
          const suffix = counter.getAttribute('data-suffix') || '';
          const isDecimal = String(target).includes('.');
          const duration = 1600;
          const startTime = performance.now();

          function updateCount(now) {
            const progress = Math.min((now - startTime) / duration, 1);
            // Ease out cubic
            const ease = 1 - Math.pow(1 - progress, 3);
            const current = target * ease;

            counter.textContent = `${prefix}${isDecimal ? current.toFixed(1) : Math.floor(current)}${suffix}`;

            if (progress < 1) {
              requestAnimationFrame(updateCount);
            } else {
              counter.textContent = `${prefix}${target}${suffix}`;
            }
          }

          requestAnimationFrame(updateCount);
        });
        observer.disconnect();
      }
    });
  }, { threshold: 0.25 });

  const dashCard = document.getElementById('dashCard');
  if (dashCard) observer.observe(dashCard);
}

/* ==========================================================================
   6. INTERACTIVE AUTONOMOUS AI CHATBOT PREVIEW
   ========================================================================== */

function initAIChat() {
  const chatBody = document.getElementById('chatBody');
  const chatChoices = document.getElementById('chatChoices');
  const resetBtn = document.getElementById('chatResetBtn');
  const inputMock = document.getElementById('chatInputMock');
  const sendMock = document.getElementById('chatSendMock');

  if (!chatBody) return;

  const responses = {
    website: {
      text: "⚡ <b>High-Speed Web Architecture:</b> We build custom, ultra-fast websites designed with DM Sans & Space Grotesk typography, conversion architecture, and sub-second load speeds. Typical delivery is 2–3 weeks with full SEO foundation.",
      nextChoices: ["What's the process?", "Can you integrate AI chat?", "Request proposal"]
    },
    automate: {
      text: "✳ <b>Autonomous AI Integration:</b> Our custom agents answer customer questions in &lt;0.3s, qualify warm leads, capture phone/emails, and sync seamlessly into your CRM or WhatsApp. Active 24/7 with zero downtime.",
      nextChoices: ["See live CRM demo", "How much does it cost?", "Book a discovery call"]
    },
    ads: {
      text: "📈 <b>Meta Ads Growth Engine:</b> We develop multi-angle creative funnels on Facebook & Instagram with rapid A/B testing and pixel attribution tracking, consistently yielding 3.2x–5.4x return on ad spend.",
      nextChoices: ["What budget is needed?", "Do you handle creatives?", "Start scaling"]
    },
    pricing: {
      text: "💎 <b>Custom Tailored Scopes:</b> Because every enterprise has distinct goals, we tailor scopes based on your immediate deliverables, scale targets, and timeline. No rigid tiers — just measurable ROI.",
      nextChoices: ["Talk to founders", "Build a custom plan"]
    },
    default: {
      text: "✦ Thank you for reaching out! Our leadership team can tailor a bespoke growth blueprint for your business. Click below to connect directly with Balakumaran & Nagaraj.",
      nextChoices: ["Book Consultation ↗", "Explore our system"]
    }
  };

  function appendMessage(text, isUser = false) {
    const msg = document.createElement('div');
    msg.className = `chat-message ${isUser ? 'user' : 'bot'}`;

    const content = document.createElement('div');
    content.className = 'msg-content';
    content.innerHTML = text;

    const time = document.createElement('span');
    time.className = 'msg-time';
    time.textContent = 'Just now';

    msg.appendChild(content);
    msg.appendChild(time);
    chatBody.appendChild(msg);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function showTypingIndicator() {
    const typing = document.createElement('div');
    typing.className = 'typing-indicator';
    typing.id = 'botTyping';
    typing.innerHTML = `
      <span class="typing-dot"></span>
      <span class="typing-dot"></span>
      <span class="typing-dot"></span>
    `;
    chatBody.appendChild(typing);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function removeTypingIndicator() {
    const el = document.getElementById('botTyping');
    if (el) el.remove();
  }

  function handleUserReply(replyText) {
    appendMessage(replyText, true);

    // If choices exist, remove them temporarily
    const existingChoices = document.querySelector('.chat-choices');
    if (existingChoices) existingChoices.remove();

    showTypingIndicator();

    setTimeout(() => {
      removeTypingIndicator();

      const lower = replyText.toLowerCase();
      let match = responses.default;

      if (lower.includes('website') || lower.includes('build')) match = responses.website;
      else if (lower.includes('automat') || lower.includes('ai')) match = responses.automate;
      else if (lower.includes('ad') || lower.includes('meta') || lower.includes('growth')) match = responses.ads;
      else if (lower.includes('price') || lower.includes('cost') || lower.includes('plan')) match = responses.pricing;
      else if (lower.includes('consultation') || lower.includes('talk') || lower.includes('proposal') || lower.includes('call')) {
        appendMessage("Redirecting you to our proposal form below...", false);
        setTimeout(() => {
          document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
        }, 600);
        return;
      }

      appendMessage(match.text, false);

      // Render new choices
      const choicesWrap = document.createElement('div');
      choicesWrap.className = 'chat-choices';
      match.nextChoices.forEach(choiceText => {
        const btn = document.createElement('button');
        btn.textContent = choiceText;
        btn.dataset.reply = choiceText;
        choicesWrap.appendChild(btn);
      });
      chatBody.appendChild(choicesWrap);
      chatBody.scrollTop = chatBody.scrollHeight;
    }, 650);
  }

  // Click delegation for buttons inside chat
  chatBody.addEventListener('click', e => {
    const btn = e.target.closest('button[data-reply]');
    if (!btn) return;
    handleUserReply(btn.dataset.reply);
  });

  // Handle mock input field
  function handleInputSubmit() {
    const val = inputMock.value.trim();
    if (!val) return;
    inputMock.value = '';
    handleUserReply(val);
  }

  if (sendMock && inputMock) {
    sendMock.addEventListener('click', handleInputSubmit);
    inputMock.addEventListener('keypress', e => {
      if (e.key === 'Enter') handleInputSubmit();
    });
  }

  // Reset conversation
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      chatBody.innerHTML = `
        <div class="chat-message bot">
          <div class="msg-content">
            Hello! 👋 Welcome to Business Graph. I am your autonomous growth assistant. What can I help you build today?
          </div>
          <span class="msg-time">Just now</span>
        </div>
        <div class="chat-choices" id="chatChoices">
          <button data-reply="I need a modern website for my business.">🌐 Build a Website</button>
          <button data-reply="I want 24/7 AI automation for customer enquiries.">⚡ Automate with AI</button>
          <button data-reply="I need to scale with targeted Meta Ads.">📈 Meta Ads Growth</button>
          <button data-reply="Can you explain your end-to-end pricing?">💰 Custom Pricing</button>
        </div>
      `;
    });
  }
}

/* ==========================================================================
   7. CONTACT FORM SUBMISSION
   ========================================================================== */

function initContactForm() {
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(form);
    const services = data.getAll('services');
    const name = data.get('name') || 'Partner';
    const business = data.get('business') || 'Not specified';
    const email = data.get('email') || '';
    const phone = data.get('phone') || 'Not specified';
    const message = data.get('message') || 'No additional note provided.';

    const subject = encodeURIComponent(`Business Graph Enquiry from ${name} [${business}]`);
    const body = encodeURIComponent(
`Business Graph Project Enquiry:
--------------------------------
Client Name: ${name}
Company / Business: ${business}
Email: ${email}
Phone: ${phone}
Capabilities Selected: ${services.join(', ') || 'General Consultation'}

Project Scope & Goals:
${message}

--------------------------------
Submitted via Business Graph Interactive Web Portal.`
    );

    const recipient = 'hello@businessgraph.in';
    if (status) {
      status.textContent = 'Preparing email dispatch... Opening your default email client with project parameters.';
      status.style.color = '#39d9ed';
    }

    setTimeout(() => {
      window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
    }, 400);
  });
}

/* ==========================================================================
   8. SCROLL REVEAL OBSERVER
   ========================================================================== */

function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  const showAll = () => reveals.forEach(el => el.classList.add('visible'));

  if (!('IntersectionObserver' in window)) {
    showAll();
    return;
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.02, rootMargin: '80px' });

  reveals.forEach(el => observer.observe(el));

  // Immediate check for elements currently visible in window
  setTimeout(() => {
    reveals.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight + 120) {
        el.classList.add('visible');
      }
    });
  }, 80);

  // Safety fallback: ensure nothing stays hidden after 600ms
  setTimeout(showAll, 600);
}
