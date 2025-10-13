/**
 * Price Announcement Banner and Highlighting
 * Handles the interactive elements of the price announcement
 */

document.addEventListener('DOMContentLoaded', function() {
    // Get the announcement banner elements
    const banner = document.querySelector('.announcement-banner');
    const bannerLink = document.querySelector('.banner-link');
    
    // Add smooth scroll to pricing section when banner link is clicked
    bannerLink.addEventListener('click', function(e) {
        e.preventDefault();
        const pricingSection = document.querySelector('#pricing');
        pricingSection.scrollIntoView({ behavior: 'smooth' });
        
        // Briefly highlight the pricing section
        highlightElement(pricingSection);
    });
    
    // Auto-hide banner after 5 seconds with a dismiss button
    setTimeout(function() {
        // Create dismiss button
        if (banner) {
            const dismissBtn = document.createElement('button');
            dismissBtn.className = 'banner-dismiss';
            dismissBtn.innerHTML = '&times;';
            dismissBtn.setAttribute('title', 'Dismiss');
            dismissBtn.addEventListener('click', function() {
                banner.style.height = banner.offsetHeight + 'px';
                banner.style.height = '0';
                banner.style.padding = '0';
                banner.style.opacity = '0';
                
                // Remove from DOM after animation completes
                setTimeout(function() {
                    banner.remove();
                }, 500);
                
                // Store in localStorage so it doesn't show again in this session
                localStorage.setItem('priceBannerDismissed', 'true');
            });
            
            banner.querySelector('.banner-content').appendChild(dismissBtn);
        }
    }, 1000);
    
    // Only show banner if not dismissed before
    if (localStorage.getItem('priceBannerDismissed') === 'true') {
        banner.style.display = 'none';
    }
    
    // Update pricing values in the UI
    updatePricingValues();
});

/**
 * Highlights an element briefly
 * @param {HTMLElement} element - The element to highlight
 */
function highlightElement(element) {
    element.classList.add('highlight-element');
    
    setTimeout(function() {
        element.classList.remove('highlight-element');
    }, 1500);
}

/**
 * Updates pricing values throughout the UI
 */
function updatePricingValues() {
    // Update credit costs if needed based on config
    const genCostElement = document.getElementById('genCost');
    const modelSelectors = document.querySelectorAll('input[name="model"]');
    
    // Add listener to update generation cost when model is changed
    if (modelSelectors && genCostElement) {
        modelSelectors.forEach(function(selector) {
            selector.addEventListener('change', function() {
                if (this.value === 'veo3-fast') {
                    genCostElement.textContent = clientConfig.limits.fastVideoCost;
                } else if (this.value === 'veo3-quality') {
                    genCostElement.textContent = clientConfig.limits.qualityVideoCost;
                }
            });
        });
    }
    
    // Add hover effects to the pricing highlight section
    const pricingHighlight = document.querySelector('.pricing-highlight');
    if (pricingHighlight) {
        pricingHighlight.addEventListener('mouseover', function() {
            this.style.transform = 'scale(1.02)';
            this.style.boxShadow = 'var(--shadow-md)';
        });
        
        pricingHighlight.addEventListener('mouseout', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = 'none';
        });
    }
}