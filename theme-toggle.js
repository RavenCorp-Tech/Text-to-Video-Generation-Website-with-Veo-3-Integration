// Theme toggle functionality
document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('checkbox');
  
  // Set dark theme by default
  document.documentElement.setAttribute('data-theme', 'dark');
  themeToggle.checked = true;
  
  // Save user preference to localStorage
  localStorage.setItem('theme', 'dark');
  
  themeToggle.addEventListener('change', function() {
    if(this.checked) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  });
  
  // Check for saved user preference
  const currentTheme = localStorage.getItem('theme');
  if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);
    if (currentTheme === 'dark') {
      themeToggle.checked = true;
    } else {
      themeToggle.checked = false;
    }
  }
});
