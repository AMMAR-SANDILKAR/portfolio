/* ==========================================================================
   Ammar Amjad Sandilkar Portfolio JavaScript
   Interactive Canvas, Animations, and Validations
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================
  // 1. Dynamic Canvas Particles Background
  // ==========================================
  const canvas = document.getElementById('canvas-particles');
  const ctx = canvas.getContext('2d');
  
  let particlesArray = [];
  const particleCount = 70;
  const connectionDistance = 110;
  
  // Mouse coordinates tracking
  let mouse = {
    x: null,
    y: null,
    radius: 130
  };
  window.addEventListener('mousemove', (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
  });
  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });
  // Handle window resize
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
  }
  window.addEventListener('resize', resizeCanvas);
  
  // Initialize canvas size
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  // Particle Class
  class Particle {
    constructor(x, y, directionX, directionY, size, color) {
      this.x = x;
      this.y = y;
      this.directionX = directionX;
      this.directionY = directionY;
      this.size = size;
      this.color = color;
    }
    
    // Draw individual particle
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
    
    // Update particle position & handle collisions
    update() {
      // Check boundaries
      if (this.x > canvas.width || this.x < 0) {
        this.directionX = -this.directionX;
      }
      if (this.y > canvas.height || this.y < 0) {
        this.directionY = -this.directionY;
      }
      
      // Mouse interaction (repelling force)
      if (mouse.x !== null && mouse.y !== null) {
        let dx = this.x - mouse.x;
        let dy = this.y - mouse.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius) {
          // Push particles slightly away from mouse cursor
          let forceDirectionX = dx / distance;
          let forceDirectionY = dy / distance;
          // Max force when cursor is extremely close
          let force = (mouse.radius - distance) / mouse.radius;
          let directionX = forceDirectionX * force * 3;
          let directionY = forceDirectionY * force * 3;
          
          this.x += directionX;
          this.y += directionY;
        }
      }
      
      // Move particle
      this.x += this.directionX;
      this.y += this.directionY;
      
      this.draw();
    }
  }
  // Generate particle array
  function initParticles() {
    particlesArray = [];
    let count = Math.min(particleCount, (canvas.width * canvas.height) / 18000); // Scale with screen size
    
    for (let i = 0; i < count; i++) {
      let size = (Math.random() * 2) + 1; // size between 1 and 3px
      let x = (Math.random() * ((canvas.width - size * 2) - (size * 2)) + size * 2);
      let y = (Math.random() * ((canvas.height - size * 2) - (size * 2)) + size * 2);
      let directionX = (Math.random() * 0.4) - 0.2; // slow motion
      let directionY = (Math.random() * 0.4) - 0.2;
      let color = 'rgba(96, 165, 250, 0.4)'; // faint accent blue
      
      particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
  }
  // Draw lines connecting particles that are close
  function connect() {
    let opacityValue = 1;
    for (let a = 0; a < particlesArray.length; a++) {
      for (let b = a; b < particlesArray.length; b++) {
        let dx = particlesArray[a].x - particlesArray[b].x;
        let dy = particlesArray[a].y - particlesArray[b].y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < connectionDistance) {
          opacityValue = 1 - (distance / connectionDistance);
          ctx.strokeStyle = `rgba(59, 130, 246, ${opacityValue * 0.15})`; // electric blue connection
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
          ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
          ctx.stroke();
        }
      }
      
      // Draw connection to mouse cursor
      if (mouse.x !== null && mouse.y !== null) {
        let dx = particlesArray[a].x - mouse.x;
        let dy = particlesArray[a].y - mouse.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius) {
          opacityValue = 1 - (distance / mouse.radius);
          ctx.strokeStyle = `rgba(96, 165, 250, ${opacityValue * 0.25})`; // highlight near cursor
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }
    }
  }
  // Animation Loop
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
      particlesArray[i].update();
    }
    connect();
    requestAnimationFrame(animate);
  }
  initParticles();
  animate();
  // ==========================================
  // 2. Typing Effect for Job Titles
  // ==========================================
  const typewriterText = document.getElementById('typewriter-text');
  const roles = [
    'Computer Engineering Graduate',
    'Frontend Developer',
    'Aspiring Full-Stack Developer'
  ];
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;
  function typeEffect() {
    const currentRole = roles[roleIndex];
    
    if (isDeleting) {
      // Remove character
      typewriterText.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50; // faster deletion
    } else {
      // Add character
      typewriterText.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 120; // standard typing
    }
    if (!isDeleting && charIndex === currentRole.length) {
      // Pause at full word
      isDeleting = true;
      typingSpeed = 2000; // stay visible
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 500; // brief pause before next word
    }
    setTimeout(typeEffect, typingSpeed);
  }
  // Start Typing
  setTimeout(typeEffect, 1000);
  // ==========================================
  // 3. Scroll Reveal Animations (IntersectionObserver)
  // ==========================================
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Unobserve to keep active state after scrolling once
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });
  revealElements.forEach(el => {
    // Add staggered child index variable if it is part of a stagger-parent list
    if (el.parentElement.classList.contains('stagger-parent')) {
      const children = Array.from(el.parentElement.children);
      const index = children.indexOf(el);
      el.style.setProperty('--stagger-index', index + 1);
    }
    revealObserver.observe(el);
  });
  // ==========================================
  // 4. Header Scroll State (Sticky color shift)
  // ==========================================
  const header = document.querySelector('header');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
  // ==========================================
  // 5. Active Navigation Indicator on Scroll
  // ==========================================
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-links a');
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, {
    threshold: 0.4, // Trigger active state when 40% of section is visible
    rootMargin: '-80px 0px 0px 0px' // adjust for header height
  });
  sections.forEach(section => {
    navObserver.observe(section);
  });
  // ==========================================
  // 6. Mobile Hamburger Navigation Overlay
  // ==========================================
  const mobileToggle = document.getElementById('mobile-nav-toggle');
  const navLinksList = document.getElementById('nav-links');
  const navItems = document.querySelectorAll('.nav-links a');
  mobileToggle.addEventListener('click', () => {
    navLinksList.classList.toggle('open');
    const isOpen = navLinksList.classList.contains('open');
    mobileToggle.innerHTML = isOpen ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
  });
  // Close menu when clicking nav links
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      navLinksList.classList.remove('open');
      mobileToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
    });
  });
  // ==========================================
  // 7. Custom Toast Notification System
  // ==========================================
  const toastContainer = document.getElementById('toast-container');
  function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation';
    toast.innerHTML = `
      <i class="fa-solid ${icon}"></i>
      <span>${message}</span>
    `;
    
    toastContainer.appendChild(toast);
    
    // Trigger transition entry
    setTimeout(() => {
      toast.classList.add('show');
    }, 100);
    
    // Exit & Destroy after 4 seconds
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        toast.remove();
      }, 400);
    }, 4000);
  }
  // ==========================================
  // 8. Contact Form Client-Side Validation
  // ==========================================
  const form = document.getElementById('portfolio-contact-form');
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const nameInput = document.getElementById('form-name');
    const emailInput = document.getElementById('form-email');
    const subjectInput = document.getElementById('form-subject');
    const messageInput = document.getElementById('form-message');
    
    let isValid = true;
    
    // Clear previous errors
    const inputs = [nameInput, emailInput, subjectInput, messageInput];
    inputs.forEach(input => {
      input.classList.remove('error');
      const errDiv = input.nextElementSibling;
      if (errDiv && errDiv.classList.contains('error-message')) {
        errDiv.style.display = 'none';
      }
    });
    
    // 1. Validate Name
    if (nameInput.value.trim().length < 2) {
      showError(nameInput, 'error-name');
      isValid = false;
    }
    
    // 2. Validate Email
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(emailInput.value.trim())) {
      showError(emailInput, 'error-email');
      isValid = false;
    }
    
    // 3. Validate Subject
    if (subjectInput.value.trim().length < 4) {
      showError(subjectInput, 'error-subject');
      isValid = false;
    }
    
    // 4. Validate Message
    if (messageInput.value.trim().length < 10) {
      showError(messageInput, 'error-message-text');
      isValid = false;
    }
    
    if (isValid) {
      // Disable form buttons & inputs to show submitting state
      const submitBtn = form.querySelector('button[type="submit"]');
      const origBtnContent = submitBtn.innerHTML;
      
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin btn-icon"></i> Sending...';
      inputs.forEach(inp => inp.disabled = true);
      
      // Simulate API submit delay (1.5 seconds)
      setTimeout(() => {
        // Re-enable form
        submitBtn.disabled = false;
        submitBtn.innerHTML = origBtnContent;
        inputs.forEach(inp => {
          inp.disabled = false;
          inp.value = ''; // Reset values
        });
        
        showToast('Thank you! Your message has been sent successfully.', 'success');
      }, 1500);
    } else {
      showToast('Please correct the errors in the form.', 'error');
    }
  });
  function showError(inputElement, errorDivId) {
    inputElement.classList.add('error');
    const errDiv = document.getElementById(errorDivId);
    if (errDiv) {
      errDiv.style.display = 'block';
    }
  }
  // ==========================================
  // 9. Back to Top Button
  // ==========================================
  const backToTopBtn = document.getElementById('back-to-top');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  });
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
});