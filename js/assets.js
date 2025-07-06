import { AUDIO_CONFIG } from './config.js';

// Assets management module
export const assets = {
    playerImage: null,
    playerWithParachuteImage: null,
    playerWithBackpackImage: null,
    platformImage: null,
    lavaImage: null,
    iceImage: null,
    parachuteImage: null,
    icePickupImage: null,
    bombPickupImage: null,
    explosionSound: null,
    parachuteSound: null,
    iceSound: null,
    damageSound: null,
    loaded: false
};

// Load all game assets
export function loadAssets() {
    return new Promise((resolve, reject) => {
        const imagesToLoad = [
            { key: 'playerImage', src: 'img/player.png' },
            { key: 'playerWithParachuteImage', src: 'img/player-with-parachute.png' },
            { key: 'playerWithBackpackImage', src: 'img/player-with-backpack.png' },
            { key: 'platformImage', src: 'img/ground-floor.png' },
            { key: 'lavaImage', src: 'img/lava-floor.png' },
            { key: 'iceImage', src: 'img/ice-floor.png' },
            { key: 'parachuteImage', src: 'img/parachute.png' },
            { key: 'icePickupImage', src: 'img/ice-pickup.png' },
            { key: 'bombPickupImage', src: 'img/bomb-pickup.png' }
        ];

        const audioToLoad = [
            { key: 'explosionSound', src: 'sound/explosion.mp3' },
            { key: 'parachuteSound', src: 'sound/parachute.mp3' },
            { key: 'iceSound', src: 'sound/ice.mp3' },
            { key: 'damageSound', src: 'sound/damage.mp3' }
        ];

        let loadedCount = 0;
        const totalAssets = imagesToLoad.length + audioToLoad.length;

        // Load images
        imagesToLoad.forEach(({ key, src }) => {
            const img = new Image();
            img.onload = () => {
                loadedCount++;
                if (loadedCount === totalAssets) {
                    assets.loaded = true;
                    resolve();
                }
            };
            img.onerror = () => {
                reject(new Error(`Failed to load image: ${src}`));
            };
            img.src = src;
            assets[key] = img;
        });

        // Load audio
        audioToLoad.forEach(({ key, src }) => {
            const audio = new Audio();
            audio.oncanplaythrough = () => {
                loadedCount++;
                if (loadedCount === totalAssets) {
                    assets.loaded = true;
                    resolve();
                }
            };
            audio.onerror = () => {
                reject(new Error(`Failed to load audio: ${src}`));
            };
            audio.preload = 'auto';
            audio.loop = key !== 'explosionSound' && key !== 'damageSound'; // Don't loop one-time sounds
            audio.src = src;
            assets[key] = audio;
        });
    });
}

// Audio management variables
let currentAudioPriority = 0;
let currentAudio = null;
let damageAudio = null; // Separate audio management for damage sound

// Helper function to calculate final volume
function getFinalVolume(soundType) {
    const soundConfig = AUDIO_CONFIG.sounds[soundType];
    if (!soundConfig || !soundConfig.enabled) return 0;
    
    return soundConfig.volume * AUDIO_CONFIG.masterVolume;
}

// Helper function to check if sound is enabled
function isSoundEnabled(soundType) {
    const soundConfig = AUDIO_CONFIG.sounds[soundType];
    return soundConfig && soundConfig.enabled;
}

// Play explosion sound effect (one-time sound)
export function playExplosionSound() {
    if (!isSoundEnabled('explosion') || !assets.explosionSound) return;
    
    // Clone the audio to allow multiple simultaneous plays
    const audio = assets.explosionSound.cloneNode();
    audio.volume = getFinalVolume('explosion');
    audio.play().catch(error => {
        console.warn('Could not play explosion sound:', error);
    });
}

// Start damage sound (continuous loop)
export function startDamageSound() {
    if (!isSoundEnabled('damage') || !assets.damageSound) return;
    
    // Don't restart if already playing
    if (damageAudio && !damageAudio.paused) return;
    
    damageAudio = assets.damageSound;
    damageAudio.volume = getFinalVolume('damage');
    damageAudio.loop = true;
    damageAudio.currentTime = 0; // Start from beginning
    
    damageAudio.play().catch(error => {
        console.warn('Could not play damage sound:', error);
    });
}

// Stop damage sound
export function stopDamageSound() {
    if (damageAudio && !damageAudio.paused) {
        damageAudio.pause();
        damageAudio.currentTime = 0;
    }
    damageAudio = null;
}

// Play specific sound with configuration
function playSound(soundType, audioAsset) {
    if (!isSoundEnabled(soundType) || !audioAsset) return false;
    
    const soundConfig = AUDIO_CONFIG.sounds[soundType];
    audioAsset.volume = getFinalVolume(soundType);
    audioAsset.loop = soundConfig.loop || false;
    
    audioAsset.play().catch(error => {
        console.warn(`Could not play ${soundType} sound:`, error);
    });
    
    return true;
}

// Update audio based on active power-ups with priority system
export function updatePowerUpAudio(gameState) {
    let highestPriority = 0;
    let targetSoundType = null;
    let targetAudio = null;

    // Check which power-ups are active and find highest priority
    // Note: Bomb doesn't have continuous audio, only explosion when breaking platforms
    if (gameState.parachuteActive && AUDIO_CONFIG.priorities.parachute > highestPriority) {
        highestPriority = AUDIO_CONFIG.priorities.parachute;
        targetSoundType = 'parachute';
        targetAudio = assets.parachuteSound;
    }
    
    if (gameState.iceActive && AUDIO_CONFIG.priorities.ice > highestPriority) {
        highestPriority = AUDIO_CONFIG.priorities.ice;
        targetSoundType = 'ice';
        targetAudio = assets.iceSound;
    }

    // If priority changed, switch audio
    if (highestPriority !== currentAudioPriority) {
        // Stop current audio
        if (currentAudio && !currentAudio.paused) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
        }

        // Start new audio if any
        if (targetAudio && targetSoundType && highestPriority > 0) {
            const success = playSound(targetSoundType, targetAudio);
            if (success) {
                currentAudio = targetAudio;
                currentAudioPriority = highestPriority;
            }
        } else {
            currentAudio = null;
            currentAudioPriority = 0;
        }
    }
}

// Stop all power-up audio
export function stopPowerUpAudio() {
    if (currentAudio && !currentAudio.paused) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }
    currentAudio = null;
    currentAudioPriority = 0;
    
    // Also stop damage sound
    stopDamageSound();
}

// Get player image based on parachute and bomb states
export function getPlayerImage(parachuteActive, bombActive) {
    if (bombActive) {
        return assets.playerWithBackpackImage;
    }
    return parachuteActive ? assets.playerWithParachuteImage : assets.playerImage;
}

// Get platform image based on type and frozen state
export function getPlatformImage(type, isFrozen = false) {
    if (type === 'lava') {
        return isFrozen ? assets.iceImage : assets.lavaImage;
    }
    return assets.platformImage;
} 