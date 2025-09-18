// Video generation related functions
let currentVideoData = null;

function generateVideo(title, prompt, model) {
    // Check if user has enough credits and usage allowance
    if (!validateUserCanGenerate(model)) {
        return;
    }
    
    // Show loading indicator
    document.getElementById('loadingIndicator').style.display = 'flex';
    document.getElementById('videoPlaceholder').style.display = 'none';
    
    // Simulate API call to Flow (in a real app, this would be a server request)
    simulateVideoGeneration(title, prompt, model)
        .then(videoData => {
            currentVideoData = videoData;
            
            // Update UI with generated video
            document.getElementById('videoPlayer').src = videoData.url;
            document.getElementById('videoPlayer').style.display = 'block';
            document.querySelector('.video-actions').style.display = 'flex';
            
            // Update usage count
            if (model === 'veo3fast') {
                currentUser.usage.fast += 1;
            } else {
                currentUser.usage.quality += 1;
            }
            
            // Deduct credits
            const creditCost = model === 'veo3fast' ? 50 : 200;
            currentUser.credits -= creditCost;
            
            // Update storage
            localStorage.setItem('user', JSON.stringify(currentUser));
            
            // Update UI
            updateUIForLoggedInUser(currentUser);
        })
        .catch(error => {
            alert('Video generation failed: ' + error);
        })
        .finally(() => {
            // Hide loading indicator
            document.getElementById('loadingIndicator').style.display = 'none';
        });
}

function validateUserCanGenerate(model) {
    if (!currentUser) {
        alert('Please login to generate videos.');
        return false;
    }
    
    if (!currentUser.isSubscribed) {
        alert('Please subscribe to generate videos.');
        showSubscriptionModal();
        return false;
    }
    
    // Check credits
    const creditCost = model === 'veo3fast' ? 50 : 200;
    if (currentUser.credits < creditCost) {
        alert(`Insufficient credits. This generation requires ${creditCost} credits, but you only have ${currentUser.credits}.`);
        return false;
    }
    
    // Check usage limits
    if (model === 'veo3fast' && currentUser.usage.fast >= 4) {
        alert('You have reached your weekly limit of 4 videos with Veo 3 Fast. Please try again next week.');
        return false;
    }
    
    if (model === 'veo3quality' && currentUser.usage.quality >= 1) {
        alert('You have reached your weekly limit of 1 video with Veo 3 Quality. Please try again next week.');
        return false;
    }
    
    return true;
}

// Simulated API functions
function simulateVideoGeneration(title, prompt, model) {
    return new Promise((resolve, reject) => {
        // Simulate API processing time
        const processingTime = model === 'veo3fast' ? 3000 : 6000;
        
        setTimeout(() => {
            // For demo purposes, return a sample video URL
            // In a real app, this would be the URL from Flow API
            const sampleVideos = [
                'https://samplelib.com/lib/preview/mp4/sample-5s.mp4',
                'https://samplelib.com/lib/preview/mp4/sample-10s.mp4',
                'https://samplelib.com/lib/preview/mp4/sample-15s.mp4'
            ];
            
            const randomVideo = sampleVideos[Math.floor(Math.random() * sampleVideos.length)];
            
            resolve({
                id: 'video_' + Math.random().toString(36).substr(2, 9),
                title: title,
                url: randomVideo,
                thumbnail: 'https://via.placeholder.com/640x360',
                createdAt: new Date().toISOString(),
                modelUsed: model,
                duration: model === 'veo3fast' ? '15s' : '30s',
                creditCost: model === 'veo3fast' ? 50 : 200
            });
        }, processingTime);
    });
}
