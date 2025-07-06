// Game configuration constants
export const GAME_WIDTH = 800;
export const GAME_HEIGHT = 600;
export const GRAVITY = 6;
export const FLOOR_HEIGHT = 100;
export const PARACHUTE_DURATION = 300;

// Player configuration
export const PLAYER_CONFIG = {
    width: 60,
    height: 60,
    speed: 5,
    startX: 400,
    startY: 100
};

// Platform configuration
export const PLATFORM_CONFIG = {
    width: 200,
    height: 40,
    lavaChance: 0.3,
    parachuteChance: 0.2,
    spacing: 100
};

// Parachute configuration
export const PARACHUTE_CONFIG = {
    width: 40,
    height: 30,
    yOffset: 30
};

// Colors
export const COLORS = {
    background: '#000000',
    platform: '#00FFFF',
    healthGreen: 'green',
    healthYellow: 'yellow',
    healthOrange: 'orange',
    healthRed: 'red',
    white: 'white',
    parachuteBar: '#4A90E2'
};

// Health thresholds
export const HEALTH_THRESHOLDS = {
    green: 80,
    yellow: 60,
    orange: 30
};

// Lava damage
export const LAVA_CONFIG = {
    damageInterval: 6, // frames
    damage: 1
};

// Collision margins
export const COLLISION_MARGIN = 40; 