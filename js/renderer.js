import { COLORS, GAME_WIDTH, GAME_HEIGHT, GRAVITY, PARACHUTE_DURATION } from './config.js';
import { getPlayerImage, getPlatformImage, assets } from './assets.js';

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
    drawPlatforms(platforms, cameraY) {
        platforms.forEach(platform => {
            const image = getPlatformImage(platform.type);
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
    drawPlayer(player, cameraY, parachuteActive) {
        const image = getPlayerImage(parachuteActive);
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

    // Draw HUD
    drawHUD(gameState) {
        this.ctx.fillStyle = COLORS.white;
        this.ctx.font = '20px Arial';
        this.ctx.fillText(`Score: ${gameState.score}`, 10, 30);
        
        // Debug info
        const currentGravity = gameState.parachuteActive ? GRAVITY / 2 : GRAVITY;
        this.ctx.fillText(`Gravity: ${currentGravity.toFixed(2)}`, 10, 60);
        this.ctx.fillText(`Parachute: ${gameState.parachuteActive ? 'ON' : 'OFF'}`, 10, 90);
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

    // Draw parachute timer bar
    drawParachuteTimer(parachuteTimer) {
        const barWidth = 300;
        const barHeight = 15;
        const barX = (GAME_WIDTH - barWidth) / 2;
        const barY = 20;
        
        // Calculate timer percentage
        const timerPercentage = parachuteTimer / PARACHUTE_DURATION;
        const currentBarWidth = barWidth * timerPercentage;
        
        if (currentBarWidth > 0) {
            this.ctx.fillStyle = COLORS.parachuteBar;
            const radius = Math.min(8, currentBarWidth / 2, barHeight / 2);
            
            this.ctx.beginPath();
            this.ctx.moveTo(barX + radius, barY);
            this.ctx.lineTo(barX + currentBarWidth - radius, barY);
            this.ctx.arc(barX + currentBarWidth - radius, barY + radius, radius, -Math.PI/2, 0);
            this.ctx.lineTo(barX + currentBarWidth, barY + barHeight - radius);
            this.ctx.arc(barX + currentBarWidth - radius, barY + barHeight - radius, radius, 0, Math.PI/2);
            this.ctx.lineTo(barX + radius, barY + barHeight);
            this.ctx.arc(barX + radius, barY + barHeight - radius, radius, Math.PI/2, Math.PI);
            this.ctx.lineTo(barX, barY + radius);
            this.ctx.arc(barX + radius, barY + radius, radius, Math.PI, -Math.PI/2);
            this.ctx.closePath();
            this.ctx.fill();
        }
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
    render(gameState, player, platforms, parachutes, getHealthColor) {
        this.clear();
        
        if (gameState.state === 'playing') {
            this.drawPlatforms(platforms, gameState.cameraY);
            this.drawPlayer(player, gameState.cameraY, gameState.parachuteActive);
            this.drawParachutes(parachutes, gameState.cameraY);
            this.drawHUD(gameState);
            this.drawHealthBar(gameState.health, getHealthColor);
            
            if (gameState.parachuteActive) {
                this.drawParachuteTimer(gameState.parachuteTimer);
            }
        } else if (gameState.state === 'gameOver') {
            this.drawGameOver(gameState.score);
        }
    }
} 