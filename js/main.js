import { GAME_WIDTH, GAME_HEIGHT, GRAVITY, FLOOR_HEIGHT, PARACHUTE_CONFIG, ICE_CONFIG } from './config.js';
import { loadAssets } from './assets.js';
import { gameState, resetGameState, updateCamera, updateScore, handleLavaDamage, getHealthColor, activateParachute, updateParachuteTimer, setLavaState, activateIce, updateIceTimer, isLavaFrozen, updateGlobalTime } from './gameState.js';
import { player, resetPlayer, updatePlayer } from './player.js';
import { platforms, resetPlatforms, checkPlatformGeneration, generatePlatform } from './platforms.js';
import { parachutes, icePickups, resetParachutes, resetIcePickups, generateParachute, generateIcePickup, checkParachuteCollection, checkIceCollection, cleanupParachutes, cleanupIcePickups } from './powerups.js';
import { initializeInput, keys } from './input.js';
import { checkCollision, handlePlatformCollision } from './physics.js';
import { Renderer } from './renderer.js';

// Game class
class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.renderer = new Renderer(this.canvas);
        this.isRunning = false;
        this.init();
    }

    async init() {
        try {
            await loadAssets();
            
            this.setupGame();
            this.start();
        } catch (error) {
            console.error('Failed to initialize game:', error);
        }
    }

    setupGame() {
        // Initialize input with restart callback
        initializeInput(() => {
            if (gameState.state === 'gameOver') {
                this.restartGame();
            }
        });

        // Initialize game objects
        resetPlatforms();
        resetParachutes();
        resetIcePickups();
        
        // Generate initial power-ups on platforms
        platforms.forEach(platform => {
            generateParachute(platform);
            generateIcePickup(platform);
        });
    }

    restartGame() {
        resetGameState();
        resetPlayer();
        resetPlatforms();
        resetParachutes();
        resetIcePickups();
        
        // Generate initial power-ups
        platforms.forEach(platform => {
            generateParachute(platform);
            generateIcePickup(platform);
        });
    }

    update() {
        if (gameState.state !== 'playing') return;

        // Update global game time
        updateGlobalTime();

        // Update player movement
        updatePlayer(keys, GRAVITY, gameState.parachuteActive, GAME_WIDTH);

        // Update parachute timer
        updateParachuteTimer();
        
        // Update ice timer
        updateIceTimer();

        // Update score based on depth
        updateScore(player.y, FLOOR_HEIGHT);

        // Handle platform collisions
        let onLava = false;
        platforms.forEach(platform => {
            if (checkCollision(player, platform)) {
                const isOnLava = handlePlatformCollision(player, platform);
                if (isOnLava) {
                    onLava = true;
                }
            }
        });

        // Set lava state and handle damage
        setLavaState(onLava);
        handleLavaDamage();

        // Update camera position
        updateCamera(player.y, GAME_HEIGHT);

        // Generate new platforms if needed
        const newPlatform = checkPlatformGeneration(player.y);
        if (newPlatform) {
            generateParachute(newPlatform);
            generateIcePickup(newPlatform);
        }

        // Check parachute collection
        const parachuteCollected = checkParachuteCollection(player, checkCollision);
        if (parachuteCollected) {
            activateParachute(PARACHUTE_CONFIG.duration);
        }

        // Check ice collection
        const iceCollected = checkIceCollection(player, checkCollision);
        if (iceCollected) {
            activateIce(ICE_CONFIG.duration);
        }

        // Clean up collected power-ups
        cleanupParachutes();
        cleanupIcePickups();
    }

    render() {
        this.renderer.render(
            gameState,
            player,
            platforms,
            parachutes,
            icePickups,
            getHealthColor,
            isLavaFrozen()
        );
    }

    gameLoop() {
        if (!this.isRunning) return;

        this.update();
        this.render();
        requestAnimationFrame(() => this.gameLoop());
    }

    start() {
        this.isRunning = true;
        this.gameLoop();
    }

    stop() {
        this.isRunning = false;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Game();
}); 