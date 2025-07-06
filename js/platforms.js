import { PLATFORM_CONFIG, GAME_WIDTH } from './config.js';

// Platforms array
export const platforms = [];
export let lowestPlatformY = 500;

// Generate a new platform
export function generatePlatform() {
    const isLava = Math.random() < PLATFORM_CONFIG.lavaChance;
    
    const platform = {
        x: Math.random() * (GAME_WIDTH - PLATFORM_CONFIG.width),
        y: lowestPlatformY,
        width: PLATFORM_CONFIG.width,
        height: PLATFORM_CONFIG.height,
        type: isLava ? 'lava' : 'normal',
        pierced: false // Flag to track if platform was pierced by bomb
    };
    
    platforms.push(platform);
    lowestPlatformY += PLATFORM_CONFIG.spacing;
    
    return platform;
}

// Initialize platforms
export function initializePlatforms(count = 10) {
    platforms.length = 0;
    lowestPlatformY = 500;
    
    for (let i = 0; i < count; i++) {
        generatePlatform();
    }
}

// Check if we need to generate more platforms
export function checkPlatformGeneration(playerY) {
    if (playerY > lowestPlatformY - 500) {
        return generatePlatform();
    }
    return null;
}

// Reset platforms
export function resetPlatforms() {
    platforms.length = 0;
    lowestPlatformY = 500;
    initializePlatforms();
}

// Reset all platform pierced flags (called when bomb effect ends)
export function resetPlatformPiercedFlags() {
    platforms.forEach(platform => {
        platform.pierced = false;
    });
}

// Get platforms within view
export function getPlatformsInView(cameraY, gameHeight) {
    const buffer = 200; // Extra buffer for smooth rendering
    return platforms.filter(platform => 
        platform.y > cameraY - buffer && 
        platform.y < cameraY + gameHeight + buffer
    );
} 