import { COLLISION_MARGIN } from './config.js';

// Check collision between two objects
export function checkCollision(obj1, obj2) {
    return (
        obj1.x < obj2.x + obj2.width - COLLISION_MARGIN &&
        obj1.x + obj1.width > obj2.x + COLLISION_MARGIN && 
        obj1.y < obj2.y + obj2.height &&
        obj1.y + obj1.height > obj2.y
    );
}

// Check if player is landing on platform (from above)
export function isLandingOnPlatform(player, platform) {
    return player.velocityY > 0 && 
           player.y + player.height - player.velocityY <= platform.y;
}

// Apply gravity to player
export function applyGravity(player, gravity, parachuteActive, bombActive, bombMultiplier) {
    let finalGravity = gravity;
    
    if (bombActive) {
        finalGravity = gravity * bombMultiplier;
    } else if (parachuteActive) {
        finalGravity = gravity / 2;
    }
    
    player.velocityY = finalGravity;
}

// Apply horizontal movement
export function applyHorizontalMovement(player, velocityX, gameWidth) {
    player.x += velocityX;
    
    // Keep player within screen bounds
    if (player.x < 0) {
        player.x = 0;
    }
    if (player.x + player.width > gameWidth) {
        player.x = gameWidth - player.width;
    }
}

// Apply vertical movement
export function applyVerticalMovement(player) {
    player.y += player.velocityY;
}

// Handle platform collision
export function handlePlatformCollision(player, platform, bombActive) {
    // If bomb is active, player pierces through platforms
    if (bombActive) {
        return platform.type === 'lava'; // Still return lava state for visual effects
    }
    
    if (isLandingOnPlatform(player, platform)) {
        player.y = platform.y - player.height;
        player.velocityY = 0;
        return platform.type === 'lava';
    }
    return false;
}

// Check if platform should be pierced by bomb
export function shouldPiercePlatform(bombActive) {
    return bombActive;
} 