/**
 * Feature toggling and format options for VeoCreator
 * Implements support for vertical format and HD resolution
 */

document.addEventListener('DOMContentLoaded', function() {
    // Check if the client config includes the new features
    const hasVerticalFormat = clientConfig.features && clientConfig.features.verticalFormat;
    const hasHDOutput = clientConfig.features && clientConfig.features.hdOutput;
    
    // Only add UI elements if the features are enabled in config
    if (hasVerticalFormat || hasHDOutput) {
        addFormatOptionsToUI();
    }
});

/**
 * Adds format options UI to the video creation panel
 */
function addFormatOptionsToUI() {
    const modelSection = document.querySelector('.model-selection');
    
    if (!modelSection) return;
    
    // Create format options section
    const formatSection = document.createElement('div');
    formatSection.className = 'format-section';
    formatSection.innerHTML = `
        <h3>Output Options:</h3>
        <div class="format-options">
            <!-- Aspect Ratio Options -->
            <div class="format-option-group">
                <h4>Aspect Ratio</h4>
                <div class="toggle-options">
                    <label class="toggle-option">
                        <input type="radio" name="aspectRatio" value="landscape" checked>
                        <span>Landscape (16:9)</span>
                    </label>
                    <label class="toggle-option">
                        <input type="radio" name="aspectRatio" value="vertical">
                        <span>Vertical (9:16)</span>
                        <span class="option-tag">NEW</span>
                    </label>
                    <label class="toggle-option">
                        <input type="radio" name="aspectRatio" value="square">
                        <span>Square (1:1)</span>
                    </label>
                </div>
            </div>

            <!-- Resolution Options -->
            <div class="format-option-group">
                <h4>Resolution</h4>
                <div class="toggle-options">
                    <label class="toggle-option">
                        <input type="radio" name="resolution" value="standard" checked>
                        <span>Standard (720p)</span>
                    </label>
                    <label class="toggle-option">
                        <input type="radio" name="resolution" value="hd">
                        <span>HD (1080p)</span>
                        <span class="option-tag">NEW</span>
                    </label>
                </div>
            </div>
        </div>
    `;
    
    // Add the format section after model selection
    modelSection.parentNode.insertBefore(formatSection, modelSection.nextSibling);
    
    // Add CSS for the new elements
    addFormatSectionStyles();
    
    // Update cost calculation based on format selection
    const formatOptions = document.querySelectorAll('input[name="aspectRatio"], input[name="resolution"]');
    formatOptions.forEach(option => {
        option.addEventListener('change', updateGenerationCost);
    });
}

/**
 * Updates the generation cost based on selected model and format options
 */
function updateGenerationCost() {
    const selectedModel = document.querySelector('input[name="model"]:checked').value;
    const isHD = document.querySelector('input[name="resolution"]:checked').value === 'hd';
    
    // Get base cost from client config
    let baseCost = selectedModel === 'veo3-fast' ? 
        clientConfig.limits.fastVideoCost : 
        clientConfig.limits.qualityVideoCost;
    
    // Add HD premium if applicable (10% extra)
    const finalCost = isHD ? Math.round(baseCost * 1.1) : baseCost;
    
    // Update the cost display
    const genCostElement = document.getElementById('genCost');
    if (genCostElement) {
        genCostElement.textContent = finalCost;
    }
}

/**
 * Adds CSS styles for the format options
 */
function addFormatSectionStyles() {
    if (document.getElementById('format-options-styles')) return;
    
    const styleSheet = document.createElement('style');
    styleSheet.id = 'format-options-styles';
    styleSheet.textContent = `
        .format-section {
            margin-top: 20px;
            border-top: 1px solid var(--border-color);
            padding-top: 20px;
        }
        
        .format-options {
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
            margin-top: 15px;
        }
        
        .format-option-group {
            flex: 1;
            min-width: 200px;
        }
        
        .format-option-group h4 {
            margin-bottom: 10px;
            font-size: 14px;
            color: var(--text-dark);
        }
        
        .toggle-options {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        
        .toggle-option {
            display: flex;
            align-items: center;
            cursor: pointer;
            padding: 8px 12px;
            background-color: var(--bg-white);
            border-radius: var(--border-radius-sm);
            border: 1px solid var(--border-color);
            transition: all 0.2s ease;
        }
        
        .toggle-option:hover {
            border-color: var(--primary-color);
            background-color: rgba(110, 68, 255, 0.05);
        }
        
        .toggle-option input {
            margin-right: 10px;
        }
        
        .toggle-option input:checked + span {
            color: var(--primary-color);
            font-weight: 600;
        }
        
        .option-tag {
            background-color: var(--secondary-color);
            color: white;
            padding: 2px 6px;
            border-radius: 10px;
            font-size: 10px;
            font-weight: 600;
            margin-left: 8px;
        }
    `;
    
    document.head.appendChild(styleSheet);
}