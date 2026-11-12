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
  try { initFrontNeuralStream(); } catch(e) { console.warn(e); }
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

  // Hide background canvas on mobile — improves performance & prevents touch conflicts
  if (window.innerWidth < 1024 || ('ontouchstart' in window)) {
    canvas.style.display = 'none';
    return;
  }

  // On white theme — make canvas very subtle
  canvas.style.opacity = '0.12';

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
  const tiltCards = document.querySelectorAll('.team-card-3d, .service-card, [data-tilt]');
  const dashCard = document.getElementById('dashCard');

  // Realistic 3D Perspective Tilt on Mouse Movement
  tiltCards.forEach(card => {
    const glare = card.querySelector('.card-3d-glare') || card.querySelector('.card-glare');
    const photoStage = card.querySelector('.team-photo-stage');
    const statusTag = card.querySelector('.team-status-tag');
    let isHovered = false;

    card.addEventListener('mouseenter', () => {
      isHovered = true;
      card.style.transition = 'transform 0.15s ease-out, box-shadow 0.15s ease-out';
    });

    card.addEventListener('mousemove', e => {
      if (!isHovered) return;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;

      // Limit tilt angle between -12 and +12 degrees for realistic physics
      const rotX = ((y - cy) / cy) * -11;
      const rotY = ((x - cx) / cx) * 11;

      card.style.transform = `perspective(1200px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateY(-8px)`;
      card.style.boxShadow = `${(-rotY * 1.5).toFixed(1)}px ${(rotX * 1.5 + 20).toFixed(1)}px 42px -10px rgba(37, 99, 235, 0.22), 0 10px 20px -5px rgba(15, 23, 42, 0.08)`;

      if (glare) {
        glare.style.opacity = '1';
        glare.style.background = `radial-gradient(circle 280px at ${x}px ${y}px, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0.08) 40%, transparent 70%)`;
      }
      if (photoStage) {
        photoStage.style.transform = `translateZ(28px)`;
      }
      if (statusTag) {
        statusTag.style.transform = `translateZ(50px) translate(${(rotY * 0.4).toFixed(1)}px, ${(-rotX * 0.4).toFixed(1)}px)`;
      }
    });

    card.addEventListener('mouseleave', () => {
      isHovered = false;
      card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.5s ease-out';
      card.style.transform = '';
      card.style.boxShadow = '';
      if (glare) glare.style.opacity = '0';
      if (photoStage) photoStage.style.transform = '';
      if (statusTag) statusTag.style.transform = '';
    });
  });

  // Hero Dashboard Card 3D Tilt
  const heroVisual = document.getElementById('heroVisual');
  if (heroVisual && dashCard) {
    heroVisual.addEventListener('mousemove', e => {
      const rect = heroVisual.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      dashCard.style.transform = `perspective(1200px) rotateY(${(x * 12).toFixed(1)}deg) rotateX(${(-y * 12).toFixed(1)}deg)`;
    });

    heroVisual.addEventListener('mouseleave', () => {
      dashCard.style.transform = '';
    });
  }

  // Device Orientation 3D Gyroscope for Mobile / Tablets
  if (window.DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission !== 'function') {
    window.addEventListener('deviceorientation', e => {
      if (e.beta === null || e.gamma === null) return;
      const gamma = Math.min(20, Math.max(-20, e.gamma)); // Left to right
      const beta = Math.min(20, Math.max(-20, e.beta - 45)); // Front to back
      const executiveCards = document.querySelectorAll('.team-card-executive');
      executiveCards.forEach(c => {
        c.style.transform = `perspective(1000px) rotateX(${(-beta * 0.4).toFixed(1)}deg) rotateY(${(gamma * 0.4).toFixed(1)}deg)`;
      });
    }, { passive: true });
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

    const recipient = 'balaoldmaster@gmail.com';
    if (status) {
      status.textContent = 'Preparing email dispatch to balaoldmaster@gmail.com... Launching your email client with full project parameters.';
      status.style.color = '#00f0ff';
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

/* ==========================================================================
   9. FRONT NEURAL STREAM 3D VIDEO CANVAS ENGINE
   ========================================================================== */

function initFrontNeuralStream() {
  const canvas = document.getElementById('frontNeuralStreamCanvas');
  const toggleBtn = document.getElementById('streamToggleBtn');
  const timecodeEl = document.getElementById('videoTimecode');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let isPlaying = true;
  let animId = null;
  let width, height;
  let dpr = window.devicePixelRatio || 1;
  let mouse = { x: 0, y: 0 };
  let startMs = Date.now();

  function resize() {
    const rect = canvas.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    if (width === 0 || height === 0) return;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  window.addEventListener('resize', resize);
  resize();

  // Mouse interactivity on video stage
  canvas.parentElement.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = (e.clientX - rect.left) / width - 0.5;
    mouse.y = (e.clientY - rect.top) / height - 0.5;
  });

  // Toggle button
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      isPlaying = !isPlaying;
      toggleBtn.textContent = isPlaying ? '❚❚ PAUSE STREAM' : '▶ RESUME STREAM';
      if (isPlaying) loop();
      else cancelAnimationFrame(animId);
    });
  }

  // 3D Cyber Warp Particle and Ring System
  const numRings = 14;
  const numStars = 65;
  const stars = [];

  for (let i = 0; i < numStars; i++) {
    stars.push({
      x: (Math.random() - 0.5) * 800,
      y: (Math.random() - 0.5) * 500,
      z: Math.random() * 1000 + 50,
      color: Math.random() > 0.4 ? '#00f0ff' : '#ffd768',
      size: Math.random() * 2 + 1
    });
  }

  let angle = 0;

  function loop() {
    if (!isPlaying) return;
    animId = requestAnimationFrame(loop);

    if (canvas.width === 0 || canvas.height === 0) resize();

    angle += 0.015;
    const elapsed = Date.now() - startMs;

    // Update real-time military timecode
    if (timecodeEl) {
      const minutes = Math.floor(elapsed / 60000).toString().padStart(2, '0');
      const seconds = Math.floor((elapsed % 60000) / 1000).toString().padStart(2, '0');
      const ms2 = Math.floor((elapsed % 1000) / 10).toString().padStart(2, '0');
      timecodeEl.textContent = `00:${minutes}:${seconds}:${ms2}`;
    }

    // Clean background with motion trails
    ctx.fillStyle = 'rgba(2, 5, 11, 0.28)';
    ctx.fillRect(0, 0, width, height);

    const cx = width / 2 + mouse.x * 60;
    const cy = height / 2 + mouse.y * 40;
    const fov = 320;

    // 1. Draw 3D Tunnel Concentric Cyber Rings
    for (let r = 0; r < numRings; r++) {
      const ringZ = ((r * 80 - (angle * 60)) % 1000 + 1000) % 1000 + 30;
      const scale = fov / (fov + ringZ);
      const radiusX = (180 + r * 16) * scale;
      const radiusY = (110 + r * 10) * scale;

      const ringAlpha = Math.min(1, Math.max(0, 1 - ringZ / 950));
      const isGold = r % 3 === 0;

      ctx.save();
      ctx.beginPath();
      ctx.ellipse(cx, cy, radiusX, radiusY, (angle * 0.2) + r * 0.1, 0, Math.PI * 2);
      ctx.strokeStyle = isGold 
        ? `rgba(255, 215, 104, ${ringAlpha * 0.55})` 
        : `rgba(0, 240, 255, ${ringAlpha * 0.65})`;
      ctx.lineWidth = Math.max(1, 2.5 * scale);
      ctx.shadowBlur = 12 * scale;
      ctx.shadowColor = isGold ? '#ffd768' : '#00f0ff';
      ctx.stroke();

      // Cyber Ticks on Ring
      const numTicks = 8;
      for (let t = 0; t < numTicks; t++) {
        const tickAng = (t * (Math.PI * 2 / numTicks)) + angle * (r % 2 ? 0.3 : -0.3);
        const tx = cx + Math.cos(tickAng) * radiusX;
        const ty = cy + Math.sin(tickAng) * radiusY;
        ctx.fillStyle = isGold ? '#ffd768' : '#00f0ff';
        ctx.beginPath();
        ctx.arc(tx, ty, Math.max(1.2, 2.8 * scale), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // 2. Draw Traveling Warp Particles
    ctx.save();
    for (let s = 0; s < stars.length; s++) {
      const star = stars[s];
      star.z -= 4.5;
      if (star.z <= 10) {
        star.z = 1000;
        star.x = (Math.random() - 0.5) * 900;
        star.y = (Math.random() - 0.5) * 550;
      }

      const pScale = fov / (fov + star.z);
      const px = cx + star.x * pScale;
      const py = cy + star.y * pScale;

      if (px >= 0 && px <= width && py >= 0 && py <= height) {
        const pAlpha = Math.min(1, (1000 - star.z) / 800);
        ctx.fillStyle = star.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = star.color;
        ctx.beginPath();
        ctx.arc(px, py, star.size * pScale * 1.8, 0, Math.PI * 2);
        ctx.fill();

        // Warp Streak Tail
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(px + (px - cx) * 0.08, py + (py - cy) * 0.08);
        ctx.strokeStyle = star.color;
        ctx.lineWidth = 1 * pScale;
        ctx.stroke();
      }
    }
    ctx.restore();

    // 3. Central Pulsing Core Energy Orb
    const corePulse = Math.sin(angle * 3) * 0.2 + 0.8;
    ctx.save();
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 65 * corePulse);
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
    grad.addColorStop(0.3, 'rgba(0, 240, 255, 0.6)');
    grad.addColorStop(0.7, 'rgba(255, 215, 104, 0.25)');
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, 65 * corePulse, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  loop();
}
