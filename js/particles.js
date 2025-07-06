// Particles system for visual effects
import { playExplosionSound } from './assets.js';

export const particles = [];

// Particle configuration
export const PARTICLE_CONFIG = {
    count: 25,         // Increased number of particles per burst
    lifespan: 90,      // Longer lasting particles
    speed: 6,          // Increased initial particle speed
    gravity: 0.08,     // Slightly less gravity for more floating effect
    colors: ['#8B4513', '#A0522D', '#CD853F', '#DEB887', '#F4A460'], // Brown/tan colors for debris
    flameColors: ['#FF0000', '#FF4500', '#FF6347', '#FF8C00', '#FFA500', '#FFD700', '#FFFF00'], // Fire colors
    sparkColors: ['#FFFFFF', '#FFFF00', '#FFA500', '#FF4500'] // Spark colors
};

// Create particle burst when player pierces platform
export function createPlatformBreakParticles(x, y, platformWidth, platformType) {
    const colors = getParticleColors(platformType);
    const flameColors = PARTICLE_CONFIG.flameColors;
    const sparkColors = PARTICLE_CONFIG.sparkColors;
    
    // Play explosion sound effect
    playExplosionSound();
    
    // Create main debris particles
    for (let i = 0; i < PARTICLE_CONFIG.count; i++) {
        const particle = {
            x: x + Math.random() * platformWidth,
            y: y + Math.random() * 15 - 7, // More vertical spread
            velocityX: (Math.random() - 0.5) * PARTICLE_CONFIG.speed * 3,
            velocityY: (Math.random() - 0.3) * PARTICLE_CONFIG.speed * 2, // More upward bias
            life: PARTICLE_CONFIG.lifespan + Math.random() * 30, // Varied lifespan
            maxLife: PARTICLE_CONFIG.lifespan,
            color: colors[Math.floor(Math.random() * colors.length)],
            size: Math.random() * 4 + 2, // Larger particles (2-6)
            type: 'debris',
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.2
        };
        
        particles.push(particle);
    }
    
    // Create flame particles (more for lava)
    const flameCount = platformType === 'lava' ? 20 : 10;
    for (let i = 0; i < flameCount; i++) {
        const particle = {
            x: x + Math.random() * platformWidth,
            y: y + Math.random() * 10 - 5,
            velocityX: (Math.random() - 0.5) * PARTICLE_CONFIG.speed * 1.5,
            velocityY: (Math.random() - 0.7) * PARTICLE_CONFIG.speed * 3, // Strong upward movement
            life: 40 + Math.random() * 20, // Shorter life for flames
            maxLife: 60,
            color: flameColors[Math.floor(Math.random() * flameColors.length)],
            size: Math.random() * 3 + 1,
            type: 'flame',
            flickerIntensity: Math.random() * 0.3 + 0.7
        };
        
        particles.push(particle);
    }
    
    // Create spark particles
    for (let i = 0; i < 15; i++) {
        const particle = {
            x: x + Math.random() * platformWidth,
            y: y + Math.random() * 8 - 4,
            velocityX: (Math.random() - 0.5) * PARTICLE_CONFIG.speed * 4,
            velocityY: (Math.random() - 0.4) * PARTICLE_CONFIG.speed * 4,
            life: 20 + Math.random() * 15, // Short life for sparks
            maxLife: 35,
            color: sparkColors[Math.floor(Math.random() * sparkColors.length)],
            size: Math.random() * 2 + 0.5,
            type: 'spark',
            brightness: Math.random() * 0.5 + 0.5
        };
        
        particles.push(particle);
    }
}

// Get particle colors based on platform type
function getParticleColors(platformType) {
    switch (platformType) {
        case 'lava':
            return ['#8B0000', '#A52A2A', '#CD853F', '#DEB887', '#F4A460']; // Darker debris for lava
        case 'normal':
        default:
            return PARTICLE_CONFIG.colors; // Brown/tan for normal platforms
    }
}

// Update all particles
export function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i];
        
        // Update position
        particle.x += particle.velocityX;
        particle.y += particle.velocityY;
        
        // Apply different physics based on particle type
        if (particle.type === 'flame') {
            // Flames float up and flicker
            particle.velocityY -= 0.05; // Upward force
            particle.velocityX *= 0.95; // Air resistance
            particle.velocityY *= 0.98;
            
            // Flicker effect
            particle.flickerIntensity += (Math.random() - 0.5) * 0.1;
            particle.flickerIntensity = Math.max(0.3, Math.min(1.0, particle.flickerIntensity));
        } else if (particle.type === 'spark') {
            // Sparks have more air resistance
            particle.velocityX *= 0.92;
            particle.velocityY *= 0.92;
            particle.velocityY += PARTICLE_CONFIG.gravity * 0.5; // Light gravity
        } else {
            // Debris particles have normal physics
            particle.velocityY += PARTICLE_CONFIG.gravity;
            particle.velocityX *= 0.98;
            particle.velocityY *= 0.98;
            
            // Rotation for debris
            if (particle.rotation !== undefined) {
                particle.rotation += particle.rotationSpeed;
            }
        }
        
        // Decrease life
        particle.life--;
        
        // Remove dead particles
        if (particle.life <= 0) {
            particles.splice(i, 1);
        }
    }
}

// Draw all particles
export function drawParticles(ctx, cameraY) {
    particles.forEach(particle => {
        const alpha = particle.life / particle.maxLife;
        
        ctx.save();
        
        if (particle.type === 'flame') {
            // Draw flames with glow effect
            ctx.globalAlpha = alpha * particle.flickerIntensity;
            ctx.shadowBlur = 10;
            ctx.shadowColor = particle.color;
            
            // Draw flame shape (teardrop-like)
            ctx.fillStyle = particle.color;
            ctx.beginPath();
            ctx.ellipse(
                particle.x,
                particle.y - cameraY,
                particle.size,
                particle.size * 1.5,
                0, 0, Math.PI * 2
            );
            ctx.fill();
        } else if (particle.type === 'spark') {
            // Draw sparks as bright dots with glow
            ctx.globalAlpha = alpha * particle.brightness;
            ctx.shadowBlur = 5;
            ctx.shadowColor = particle.color;
            ctx.fillStyle = particle.color;
            
            ctx.beginPath();
            ctx.arc(
                particle.x,
                particle.y - cameraY,
                particle.size,
                0, Math.PI * 2
            );
            ctx.fill();
        } else {
            // Draw debris with rotation
            ctx.globalAlpha = alpha;
            ctx.fillStyle = particle.color;
            ctx.translate(particle.x, particle.y - cameraY);
            
            if (particle.rotation !== undefined) {
                ctx.rotate(particle.rotation);
            }
            
            ctx.fillRect(
                -particle.size / 2,
                -particle.size / 2,
                particle.size,
                particle.size
            );
        }
        
        ctx.restore();
    });
}

// Clear all particles
export function clearParticles() {
    particles.length = 0;
}

// Get particles within view (for optimization)
export function getParticlesInView(cameraY, gameHeight) {
    const buffer = 100;
    return particles.filter(particle => 
        particle.y > cameraY - buffer && 
        particle.y < cameraY + gameHeight + buffer
    );
} 