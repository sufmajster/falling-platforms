import { PARACHUTE_CONFIG, PLATFORM_CONFIG, ICE_CONFIG, BOMB_CONFIG } from './config.js';

// Power-ups arrays
export const parachutes = [];
export const icePickups = [];
export const bombPickups = [];

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

// Generate bomb pickup on platform
export function generateBombPickup(platform) {
    // Only generate on normal platforms
    if (platform.type !== 'normal') return null;
    
    // Check random chance
    if (Math.random() < BOMB_CONFIG.chance) {
        const bombPickup = {
            x: platform.x + Math.random() * (platform.width - BOMB_CONFIG.width),
            y: platform.y - BOMB_CONFIG.yOffset,
            width: BOMB_CONFIG.width,
            height: BOMB_CONFIG.height,
            collected: false
        };
        
        bombPickups.push(bombPickup);
        return bombPickup;
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

// Check bomb pickup collection
export function checkBombCollection(player, checkCollision) {
    let collected = false;
    
    bombPickups.forEach(bombPickup => {
        if (!bombPickup.collected && checkCollision(player, bombPickup)) {
            bombPickup.collected = true;
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

// Clean up collected bomb pickups
export function cleanupBombPickups() {
    for (let i = bombPickups.length - 1; i >= 0; i--) {
        if (bombPickups[i].collected) {
            bombPickups.splice(i, 1);
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

// Reset bomb pickups
export function resetBombPickups() {
    bombPickups.length = 0;
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

// Get bomb pickups within view
export function getBombPickupsInView(cameraY, gameHeight) {
    const buffer = 200;
    return bombPickups.filter(bombPickup => 
        !bombPickup.collected &&
        bombPickup.y > cameraY - buffer && 
        bombPickup.y < cameraY + gameHeight + buffer
    );
} 