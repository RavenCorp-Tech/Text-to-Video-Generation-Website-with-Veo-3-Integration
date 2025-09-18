// Create animated background particles
document.addEventListener('DOMContentLoaded', function() {
  const particlesContainer = document.createElement('div');
  particlesContainer.className = 'particles-container';
  document.body.appendChild(particlesContainer);
  
  // Create particles
  for (let i = 0; i < 30; i++) {
    createParticle(particlesContainer);
  }
  
  // Add intersection observer for scroll animations
  const animatedElements = document.querySelectorAll('.fade-in, .slide-up, .slide-in-left, .slide-in-right');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.visibility = 'visible';
      }
    });
  }, { threshold: 0.1 });
  
  animatedElements.forEach(el => {
    el.style.visibility = 'hidden';
    observer.observe(el);
  });
});

function createParticle(container) {
  const particle = document.createElement('div');
  particle.className = 'particle';
  
  // Random size between 5px and 20px
  const size = Math.random() * 15 + 5;
  particle.style.width = `${size}px`;
  particle.style.height = `${size}px`;
  
  // Random position
  const posX = Math.random() * 100;
  const posY = Math.random() * 100;
  particle.style.left = `${posX}%`;
  particle.style.top = `${posY}%`;
  
  // Animation
  const duration = Math.random() * 20 + 10; // 10-30 seconds
  const direction = Math.random() > 0.5 ? 1 : -1;
  
  particle.animate([
    { transform: `translate(0, 0) rotate(0deg)` },
    { transform: `translate(${direction * 50}px, -100px) rotate(${direction * 360}deg)` }
  ], {
    duration: duration * 1000,
    iterations: Infinity,
    easing: 'ease-in-out',
    direction: 'alternate'
  });
  
  container.appendChild(particle);
}
