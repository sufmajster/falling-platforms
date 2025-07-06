import { HEALTH_THRESHOLDS, COLORS, LAVA_CONFIG } from './config.js';

// Game state variables
export let gameState = {
    cameraY: 0,
    score: 0,
    currentFloor: 0,
    health: 100,
    lavaTimer: 0,
    onLava: false,
    state: 'playing', // 'playing', 'gameOver'
    parachuteActive: false,
    parachuteTimer: 0
};

// Reset game state
export function resetGameState() {
    gameState.cameraY = 0;
    gameState.score = 0;
    gameState.currentFloor = 0;
    gameState.health = 100;
    gameState.lavaTimer = 0;
    gameState.onLava = false;
    gameState.state = 'playing';
    gameState.parachuteActive = false;
    gameState.parachuteTimer = 0;
}

// Update camera position
export function updateCamera(playerY, gameHeight) {
    gameState.cameraY = playerY - gameHeight / 2;
}

// Update score based on floor
export function updateScore(playerY, floorHeight) {
    const newFloor = Math.floor(playerY / floorHeight);
    if (newFloor > gameState.currentFloor) {
        gameState.score += (newFloor - gameState.currentFloor);
        gameState.currentFloor = newFloor;
    }
}

// Handle lava damage
export function handleLavaDamage() {
    if (gameState.onLava) {
        gameState.lavaTimer++;
        if (gameState.lavaTimer >= LAVA_CONFIG.damageInterval) {
            gameState.health = Math.max(0, gameState.health - LAVA_CONFIG.damage);
            gameState.lavaTimer = 0;
        }
    } else {
        gameState.lavaTimer = 0;
    }
    
    if (gameState.health <= 0) {
        gameState.state = 'gameOver';
    }
}

// Get health color based on current health
export function getHealthColor() {
    if (gameState.health > HEALTH_THRESHOLDS.green) {
        return COLORS.healthGreen;
    } else if (gameState.health > HEALTH_THRESHOLDS.yellow) {
        return COLORS.healthYellow;
    } else if (gameState.health > HEALTH_THRESHOLDS.orange) {
        return COLORS.healthOrange;
    } else {
        return COLORS.healthRed;
    }
}

// Handle parachute activation
export function activateParachute(duration) {
    gameState.parachuteActive = true;
    gameState.parachuteTimer = duration;
}

// Update parachute timer
export function updateParachuteTimer() {
    if (gameState.parachuteActive) {
        gameState.parachuteTimer--;
        if (gameState.parachuteTimer <= 0) {
            gameState.parachuteActive = false;
        }
    }
}

// Set lava state
export function setLavaState(onLava) {
    gameState.onLava = onLava;
} 