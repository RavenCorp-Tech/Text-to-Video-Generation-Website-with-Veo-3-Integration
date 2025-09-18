// Subscription related functions
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('paymentForm').addEventListener('submit', handleSubscription);
    
    // Format card inputs
    document.getElementById('cardNumber').addEventListener('input', formatCardNumber);
    document.getElementById('cardExpiry').addEventListener('input', formatCardExpiry);
    document.getElementById('cardCVC').addEventListener('input', formatCardCVC);
});

function handleSubscription(e) {
    e.preventDefault();
    
    const cardName = document.getElementById('cardName').value;
    const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
    const cardExpiry = document.getElementById('cardExpiry').value;
    const cardCVC = document.getElementById('cardCVC').value;
    
    if (!cardName || !cardNumber || !cardExpiry || !cardCVC) {
        alert('Please fill in all payment details.');
        return;
    }
    
    if (cardNumber.length !== 16 || !/^\d+$/.test(cardNumber)) {
        alert('Please enter a valid card number.');
        return;
    }
    
    if (!cardExpiry.match(/^\d\d\/\d\d$/)) {
        alert('Please enter a valid expiration date (MM/YY).');
        return;
    }
    
    if (cardCVC.length < 3 || !/^\d+$/.test(cardCVC)) {
        alert('Please enter a valid CVC code.');
        return;
    }
    
    // Show loading state
    const submitButton = document.getElementById('paymentForm').querySelector('button[type="submit"]');
    submitButton.textContent = 'Processing...';
    submitButton.disabled = true;
    
    // Simulate payment processing (in a real app, this would be a server request)
    processSubscription(cardNumber, cardExpiry, cardCVC)
        .then(subscriptionData => {
            // Update user data
            currentUser.isSubscribed = true;
            currentUser.credits = 950;
            currentUser.subscriptionEnd = subscriptionData.endDate;
            
            localStorage.setItem('user', JSON.stringify(currentUser));
            updateUIForLoggedInUser(currentUser);
            
            hideModal('subscriptionModal');
            
            // Show success message
            alert('Subscription successful! Your account has been credited with 950 credits.');
        })
        .catch(error => {
            alert('Payment failed: ' + error);
        })
        .finally(() => {
            // Reset button state
            submitButton.textContent = 'Subscribe Now';
            submitButton.disabled = false;
        });
}

// Simulated API functions
function processSubscription(cardNumber, cardExpiry, cardCVC) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulate successful payment
            const now = new Date();
            const nextMonth = new Date(now.setMonth(now.getMonth() + 1));
            
            resolve({
                success: true,
                subscriptionId: 'sub_' + Math.random().toString(36).substr(2, 9),
                startDate: new Date().toISOString().split('T')[0],
                endDate: nextMonth.toISOString().split('T')[0]
            });
        }, 2000);
    });
}

// Card input formatting functions
function formatCardNumber(e) {
    const input = e.target;
    let value = input.value.replace(/\D/g, '');
    
    if (value.length > 16) {
        value = value.substr(0, 16);
    }
    
    // Format with spaces after every 4 digits
    let formattedValue = '';
    for (let i = 0; i < value.length; i++) {
        if (i > 0 && i % 4 === 0) {
            formattedValue += ' ';
        }
        formattedValue += value[i];
    }
    
    input.value = formattedValue;
}

function formatCardExpiry(e) {
    const input = e.target;
    let value = input.value.replace(/\D/g, '');
    
    if (value.length > 4) {
        value = value.substr(0, 4);
    }
    
    if (value.length > 2) {
        input.value = value.substr(0, 2) + '/' + value.substr(2);
    } else {
        input.value = value;
    }
}

function formatCardCVC(e) {
    const input = e.target;
    let value = input.value.replace(/\D/g, '');
    
    if (value.length > 4) {
        value = value.substr(0, 4);
    }
    
    input.value = value;
}
