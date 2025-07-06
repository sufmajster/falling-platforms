import { COLORS, GAME_WIDTH, GAME_HEIGHT, GRAVITY, PARACHUTE_CONFIG, ICE_CONFIG, BOMB_CONFIG } from './config.js';
import { getPlayerImage, getPlatformImage, assets } from './assets.js';
import { drawParticles } from './particles.js';

// Renderer class
export class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
    }

    // Clear canvas
    clear() {
        this.ctx.fillStyle = COLORS.background;
        this.ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    }

    // Draw platforms
    drawPlatforms(platforms, cameraY, isLavaFrozen) {
        platforms.forEach(platform => {
            const image = getPlatformImage(platform.type, isLavaFrozen);
            this.ctx.drawImage(
                image, 
                platform.x, 
                platform.y - cameraY, 
                platform.width, 
                platform.height
            );
        });
    }

    // Draw player
    drawPlayer(player, cameraY, parachuteActive, bombActive) {
        const image = getPlayerImage(parachuteActive, bombActive);
        this.ctx.drawImage(
            image, 
            player.x, 
            player.y - cameraY, 
            player.width, 
            player.height
        );
    }

    // Draw parachutes
    drawParachutes(parachutes, cameraY) {
        parachutes.forEach(parachute => {
            if (!parachute.collected) {
                this.ctx.drawImage(
                    assets.parachuteImage, 
                    parachute.x, 
                    parachute.y - cameraY, 
                    parachute.width, 
                    parachute.height
                );
            }
        });
    }

    // Draw ice pickups
    drawIcePickups(icePickups, cameraY) {
        icePickups.forEach(icePickup => {
            if (!icePickup.collected) {
                this.ctx.drawImage(
                    assets.icePickupImage, 
                    icePickup.x, 
                    icePickup.y - cameraY, 
                    icePickup.width, 
                    icePickup.height
                );
            }
        });
    }

    // Draw bomb pickups
    drawBombPickups(bombPickups, cameraY) {
        bombPickups.forEach(bombPickup => {
            if (!bombPickup.collected) {
                this.ctx.drawImage(
                    assets.bombPickupImage, 
                    bombPickup.x, 
                    bombPickup.y - cameraY, 
                    bombPickup.width, 
                    bombPickup.height
                );
            }
        });
    }

    // Draw HUD
    drawHUD(gameState) {
        this.ctx.fillStyle = COLORS.white;
        this.ctx.font = '20px Arial';
        this.ctx.fillText(`Score: ${gameState.score}`, 10, 30);
        
        // Debug info
        let currentGravity = GRAVITY;
        if (gameState.bombActive) {
            currentGravity = GRAVITY * 3;
        } else if (gameState.parachuteActive) {
            currentGravity = GRAVITY / 2;
        }
        
        this.ctx.fillText(`Gravity: ${currentGravity.toFixed(2)}`, 10, 60);
        this.ctx.fillText(`Parachute: ${gameState.parachuteActive ? 'ON' : 'OFF'}`, 10, 90);
        this.ctx.fillText(`Ice: ${gameState.iceActive ? 'ON' : 'OFF'}`, 10, 120);
        this.ctx.fillText(`Bomb: ${gameState.bombActive ? 'ON' : 'OFF'}`, 10, 150);
    }

    // Draw health bar
    drawHealthBar(health, getHealthColor) {
        const barWidth = 200;
        const barHeight = 20;
        const barX = GAME_WIDTH - barWidth - 10;
        const barY = 20;
        
        // Health bar fill
        this.ctx.fillStyle = getHealthColor();
        this.ctx.fillRect(barX, barY, (health / 100) * barWidth, barHeight);
        
        // Health bar border
        this.ctx.strokeStyle = COLORS.white;
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(barX, barY, barWidth, barHeight);
    }

    // Draw rounded timer bar
    drawTimerBar(x, y, width, height, currentWidth, color) {
        if (currentWidth > 0) {
            this.ctx.fillStyle = color;
            const radius = Math.min(8, currentWidth / 2, height / 2);
            
            this.ctx.beginPath();
            this.ctx.moveTo(x + radius, y);
            this.ctx.lineTo(x + currentWidth - radius, y);
            this.ctx.arc(x + currentWidth - radius, y + radius, radius, -Math.PI/2, 0);
            this.ctx.lineTo(x + currentWidth, y + height - radius);
            this.ctx.arc(x + currentWidth - radius, y + height - radius, radius, 0, Math.PI/2);
            this.ctx.lineTo(x + radius, y + height);
            this.ctx.arc(x + radius, y + height - radius, radius, Math.PI/2, Math.PI);
            this.ctx.lineTo(x, y + radius);
            this.ctx.arc(x + radius, y + radius, radius, Math.PI, -Math.PI/2);
            this.ctx.closePath();
            this.ctx.fill();
        }
    }

    // Draw all power-up timers dynamically
    drawPowerUpTimers(gameState) {
        const barWidth = 300;
        const barHeight = 15;
        const barX = (GAME_WIDTH - barWidth) / 2;
        const barSpacing = 20; // Space between bars
        let currentY = 20; // Starting position

        // Create array of active timers with their activation order
        const activeTimers = [];
        
        if (gameState.parachuteActive) {
            activeTimers.push({
                type: 'parachute',
                percentage: gameState.parachuteTimer / PARACHUTE_CONFIG.duration,
                color: COLORS.parachuteBar,
                activationTime: gameState.parachuteActivationTime || 0
            });
        }
        
        if (gameState.iceActive) {
            activeTimers.push({
                type: 'ice',
                percentage: gameState.iceTimer / ICE_CONFIG.duration,
                color: COLORS.iceBar,
                activationTime: gameState.iceActivationTime || 0
            });
        }
        
        if (gameState.bombActive) {
            activeTimers.push({
                type: 'bomb',
                percentage: gameState.bombTimer / BOMB_CONFIG.duration,
                color: COLORS.bombBar,
                activationTime: gameState.bombActivationTime || 0
            });
        }

        // Sort by activation time (earliest first = top)
        activeTimers.sort((a, b) => a.activationTime - b.activationTime);

        // Draw timers in order
        activeTimers.forEach(timer => {
            const currentBarWidth = barWidth * timer.percentage;
            this.drawTimerBar(barX, currentY, barWidth, barHeight, currentBarWidth, timer.color);
            currentY += barSpacing;
        });
    }

    // Draw game over screen
    drawGameOver(score) {
        // Semi-transparent overlay
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
        
        // Game over text
        this.ctx.fillStyle = 'red';
        this.ctx.font = '48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('GAME OVER', GAME_WIDTH / 2, GAME_HEIGHT / 2 - 50);
        
        // Score text
        this.ctx.fillStyle = COLORS.white;
        this.ctx.font = '24px Arial';
        this.ctx.fillText(`Your Score: ${score}`, GAME_WIDTH / 2, GAME_HEIGHT / 2 + 20);
        
        // Restart instruction
        this.ctx.font = '20px Arial';
        this.ctx.fillText('Press SPACE to Play Again', GAME_WIDTH / 2, GAME_HEIGHT / 2 + 80);
        
        // Reset text alignment
        this.ctx.textAlign = 'start';
    }

    // Main render method
    render(gameState, player, platforms, parachutes, icePickups, bombPickups, getHealthColor, isLavaFrozen) {
        this.clear();
        
        if (gameState.state === 'playing') {
            this.drawPlatforms(platforms, gameState.cameraY, isLavaFrozen);
            this.drawPlayer(player, gameState.cameraY, gameState.parachuteActive, gameState.bombActive);
            this.drawParachutes(parachutes, gameState.cameraY);
            this.drawIcePickups(icePickups, gameState.cameraY);
            this.drawBombPickups(bombPickups, gameState.cameraY);
            
            // Draw particles
            drawParticles(this.ctx, gameState.cameraY);
            
            this.drawHUD(gameState);
            this.drawHealthBar(gameState.health, getHealthColor);
            this.drawPowerUpTimers(gameState);
        } else if (gameState.state === 'gameOver') {
            this.drawGameOver(gameState.score);
        }
    }
} 