// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric', 
        month: 'long', 
        day: 'numeric'
    });
}

function formatCurrency(amount, currencyCode = 'INR') {
    const currencySymbols = {
        'INR': '₹',
        'USD': '$',
        'EUR': '€',
        'GBP': '£',
        'JPY': '¥',
        'AUD': 'A$'
    };
    
    const symbol = currencySymbols[currencyCode] || currencySymbols['INR'];
    
    return `${symbol}${amount}`;
}

function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
}

// Debounce function to limit function calls
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

// Function to safely parse JSON
function safeJSONParse(str, fallback = {}) {
    try {
        return JSON.parse(str);
    } catch (e) {
        return fallback;
    }
}
