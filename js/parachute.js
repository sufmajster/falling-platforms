import { PARACHUTE_CONFIG, PLATFORM_CONFIG } from './config.js';

// Parachutes array
export const parachutes = [];

// Generate parachute on platform
export function generateParachute(platform) {
    // Only generate on normal platforms
    if (platform.type !== 'normal') return null;
    
    // Check random chance
    if (Math.random() < PLATFORM_CONFIG.parachuteChance) {
        const parachute = {
            x: platform.x + Math.random() * (platform.width - PARACHUTE_CONFIG.width),
            y: platform.y - PARACHUTE_CONFIG.yOffset,
            width: PARACHUTE_CONFIG.width,
            height: PARACHUTE_CONFIG.height,
            collected: false
        };
        
        parachutes.push(parachute);
        return parachute;
    }
    
    return null;
}

// Check parachute collection
export function checkParachuteCollection(player, checkCollision) {
    let collected = false;
    
    parachutes.forEach(parachute => {
        if (!parachute.collected && checkCollision(player, parachute)) {
            parachute.collected = true;
            collected = true;
        }
    });
    
    return collected;
}

// Clean up collected parachutes
export function cleanupParachutes() {
    for (let i = parachutes.length - 1; i >= 0; i--) {
        if (parachutes[i].collected) {
            parachutes.splice(i, 1);
        }
    }
}

// Reset parachutes
export function resetParachutes() {
    parachutes.length = 0;
}

// Get parachutes within view
export function getParachutesInView(cameraY, gameHeight) {
    const buffer = 200;
    return parachutes.filter(parachute => 
        !parachute.collected &&
        parachute.y > cameraY - buffer && 
        parachute.y < cameraY + gameHeight + buffer
    );
} 