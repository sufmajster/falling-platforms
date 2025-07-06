import { PLAYER_CONFIG } from './config.js';
import { applyGravity, applyHorizontalMovement, applyVerticalMovement } from './physics.js';

// Player object
export const player = {
    x: PLAYER_CONFIG.startX,
    y: PLAYER_CONFIG.startY,
    width: PLAYER_CONFIG.width,
    height: PLAYER_CONFIG.height,
    velocityX: 0,
    velocityY: 0,
    speed: PLAYER_CONFIG.speed
};

// Reset player to initial position
export function resetPlayer() {
    player.x = PLAYER_CONFIG.startX;
    player.y = PLAYER_CONFIG.startY;
    player.velocityX = 0;
    player.velocityY = 0;
}

// Get player horizontal velocity based on input
export function getPlayerHorizontalVelocity(keys) {
    let velocityX = 0;
    
    if (keys['ArrowLeft']) {
        velocityX = -player.speed;
    }
    if (keys['ArrowRight']) {
        velocityX = player.speed;
    }
    
    return velocityX;
}

// Update player position
export function updatePlayer(keys, gravity, parachuteActive, gameWidth) {
    // Calculate horizontal movement
    const horizontalVelocity = getPlayerHorizontalVelocity(keys);
    
    applyGravity(player, gravity, parachuteActive);
    applyHorizontalMovement(player, horizontalVelocity, gameWidth);
    applyVerticalMovement(player);
} 