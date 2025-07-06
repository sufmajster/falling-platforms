import { PARACHUTE_CONFIG, PLATFORM_CONFIG, ICE_CONFIG } from './config.js';

// Power-ups arrays
export const parachutes = [];
export const icePickups = [];

// Generate parachute on platform
export function generateParachute(platform) {
    // Only generate on normal platforms
    if (platform.type !== 'normal') return null;
    
    // Check random chance
    if (Math.random() < PARACHUTE_CONFIG.chance) {
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

// Generate ice pickup on platform
export function generateIcePickup(platform) {
    // Only generate on normal platforms
    if (platform.type !== 'normal') return null;
    
    // Check random chance
    if (Math.random() < ICE_CONFIG.chance) {
        const icePickup = {
            x: platform.x + Math.random() * (platform.width - ICE_CONFIG.width),
            y: platform.y - ICE_CONFIG.yOffset,
            width: ICE_CONFIG.width,
            height: ICE_CONFIG.height,
            collected: false
        };
        
        icePickups.push(icePickup);
        return icePickup;
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

// Check ice pickup collection
export function checkIceCollection(player, checkCollision) {
    let collected = false;
    
    icePickups.forEach(icePickup => {
        if (!icePickup.collected && checkCollision(player, icePickup)) {
            icePickup.collected = true;
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

// Clean up collected ice pickups
export function cleanupIcePickups() {
    for (let i = icePickups.length - 1; i >= 0; i--) {
        if (icePickups[i].collected) {
            icePickups.splice(i, 1);
        }
    }
}

// Reset parachutes
export function resetParachutes() {
    parachutes.length = 0;
}

// Reset ice pickups
export function resetIcePickups() {
    icePickups.length = 0;
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

// Get ice pickups within view
export function getIcePickupsInView(cameraY, gameHeight) {
    const buffer = 200;
    return icePickups.filter(icePickup => 
        !icePickup.collected &&
        icePickup.y > cameraY - buffer && 
        icePickup.y < cameraY + gameHeight + buffer
    );
} 