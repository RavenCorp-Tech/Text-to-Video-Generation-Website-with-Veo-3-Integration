```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>VeoCreator: Text-to-Video AI Generator</title>
  <link rel="stylesheet" href="css/styles.css">
  <link rel="stylesheet" href="css/theme-styles.css">
  <link rel="stylesheet" href="css/animations.css">
  <link rel="stylesheet" href="css/futuristic-ui.css">
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
  <!-- Header Section -->
  <header>
    <nav>
      <div class="logo slide-in-left">
        <h1>VeoCreator</h1>
      </div>
      
      <div class="nav-links slide-in-right">
        <a href="#home">Home</a>
        <a href="#features">Features</a>
        <a href="#pricing">Pricing</a>
        <a href="#gallery">Gallery</a>
        <a href="#contact">Contact</a>
        
        <div class="theme-switch-wrapper">
          <label class="theme-switch" for="checkbox">
            <input type="checkbox" id="checkbox" />
            <div class="slider round">
              <span class="moon">🌙</span>
              <span class="sun">☀️</span>
            </div>
          </label>
        </div>
        
        <a href="#login" class="neo-button">Login</a>
      </div>
    </nav>
  </header>

  <!-- Hero Section -->
  <section id="home" class="hero">
    <div class="hero-content">
      <h1 class="fade-in">Transform Text into Stunning Videos</h1>
      <p class="fade-in delay-100">Leverage the power of Veo 3 AI to create impressive videos from simple text prompts.</p>
      <div class="cta-buttons fade-in delay-200">
        <button class="neo-button pulse">Get Started</button>
        <button class="secondary-button">Learn More</button>
      </div>
    </div>
    
    <div class="hero-image slide-in-right delay-300">
      <div class="video-preview-container">
        <img src="assets/video-preview.jpg" alt="AI Generated Video Preview" class="video-preview">
        <div class="play-button">▶</div>
      </div>
    </div>
  </section>

  <!-- Features Section -->
  <section id="features" class="features">
    <h2 class="section-title slide-up">Powerful AI Video Generation</h2>
    
    <div class="features-grid">
      <div class="feature-card glass-card slide-up delay-100">
        <div class="feature-icon">✨</div>
        <h3>Veo 3 Fast</h3>
        <p>Generate up to 4 high-quality videos per week with incredible speed.</p>
      </div>
      
      <div class="feature-card glass-card slide-up delay-200">
        <div class="feature-icon">🎬</div>
        <h3>Veo 3 Quality</h3>
        <p>Create one premium, ultra-high-definition video every week.</p>
      </div>
      
      <div class="feature-card glass-card slide-up delay-300">
        <div class="feature-icon">💰</div>
        <h3>950 Credits</h3>
        <p>Each subscription comes loaded with 950 credits to use as you wish.</p>
      </div>
      
      <div class="feature-card glass-card slide-up delay-400">
        <div class="feature-icon">🌐</div>
        <h3>Global Support</h3>
        <p>Available worldwide with localized pricing for your region.</p>
      </div>
    </div>
  </section>

  <!-- Video Creator Section -->
  <section id="creator" class="creator-section">
    <h2 class="section-title slide-up">Create Your Video</h2>
    
    <div class="creator-container glass-card slide-up delay-100">
      <div class="form-group">
        <textarea class="animated-input" placeholder=" " id="prompt-input"></textarea>
        <label for="prompt-input" class="input-label">Enter your video prompt here</label>
      </div>
      
      <div class="options-container">
        <div class="option">
          <label>Model</label>
          <select class="animated-input">
            <option value="veo3-fast">Veo 3 Fast (4/week)</option>
            <option value="veo3-quality">Veo 3 Quality (1/week)</option>
          </select>
        </div>
        
        <div class="option">
          <label>Duration</label>
          <select class="animated-input">
            <option value="5">5 seconds</option>
            <option value="10">10 seconds</option>
            <option value="15">15 seconds</option>
          </select>
        </div>
      </div>
      
      <button class="neo-button full-width">Generate Video</button>
      
      <div class="loading-animation">
        <div class="loading-dot"></div>
        <div class="loading-dot"></div>
        <div class="loading-dot"></div>
      </div>
      
      <div class="credits-remaining">
        <p>Credits remaining: <span>850</span></p>
      </div>
    </div>
  </section>

  <!-- Pricing Section -->
  <section id="pricing" class="pricing">
    <h2 class="section-title slide-up">Affordable Subscription</h2>
    
    <div class="pricing-card glass-card slide-up delay-100">
      <div class="pricing-header">
        <h3>Monthly Subscription</h3>
        <div class="price">
          <span class="currency">₹</span>
          <span class="amount">99</span>
          <span class="period">/month</span>
        </div>
      </div>
      
      <ul class="pricing-features">
        <li>950 credits monthly</li>
        <li>4 videos with Veo 3 Fast per week</li>
        <li>1 video with Veo 3 Quality per week</li>
        <li>Download in HD quality</li>
        <li>Access to video gallery</li>
      </ul>
      
      <button class="neo-button full-width">Subscribe Now</button>
    </div>
  </section>

  <!-- Footer -->
  <footer>
    <div class="footer-content">
      <div class="footer-logo">
        <h3>VeoCreator</h3>
        <p>Text-to-Video AI Generator</p>
      </div>
      
      <div class="footer-links">
        <div class="link-group">
          <h4>Navigate</h4>
          <a href="#home">Home</a>
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
          <a href="#contact">Contact</a>
        </div>
        
        <div class="link-group">
          <h4>Legal</h4>
          <a href="#">Terms of Service</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Copyright</a>
        </div>
        
        <div class="link-group">
          <h4>Connect</h4>
          <a href="#">Twitter</a>
          <a href="#">Instagram</a>
          <a href="#">YouTube</a>
        </div>
      </div>
    </div>
    
    <div class="copyright">
      <p>&copy; 2025 VeoCreator. All rights reserved.</p>
    </div>
  </footer>

  <script src="js/theme-toggle.js"></script>
  <script src="js/flow-animations.js"></script>
  <script src="js/app.js"></script>
</body>
</html>
```
