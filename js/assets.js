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
            { key: 'iceSound', src: 'sound/ice.mp3' }
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
            audio.loop = key !== 'explosionSound'; // Loop continuous sounds, not explosion
            audio.src = src;
            assets[key] = audio;
        });
    });
}

// Audio priority system
export const AUDIO_PRIORITIES = {
    ice: 1,
    parachute: 2,
    bomb: 3
};

let currentAudioPriority = 0;
let currentAudio = null;

// Play explosion sound effect (one-time sound)
export function playExplosionSound() {
    if (assets.explosionSound) {
        // Clone the audio to allow multiple simultaneous plays
        const audio = assets.explosionSound.cloneNode();
        audio.volume = 0.03;
        audio.play().catch(error => {
            console.warn('Could not play explosion sound:', error);
        });
    }
}

// Update audio based on active power-ups with priority system
export function updatePowerUpAudio(gameState) {
    let highestPriority = 0;
    let targetAudio = null;

    // Check which power-ups are active and find highest priority
    // Note: Bomb doesn't have continuous audio, only explosion when breaking platforms
    if (gameState.parachuteActive && AUDIO_PRIORITIES.parachute > highestPriority) {
        highestPriority = AUDIO_PRIORITIES.parachute;
        targetAudio = assets.parachuteSound;
    }
    
    if (gameState.iceActive && AUDIO_PRIORITIES.ice > highestPriority) {
        highestPriority = AUDIO_PRIORITIES.ice;
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
        if (targetAudio && highestPriority > 0) {
            currentAudio = targetAudio;
            currentAudioPriority = highestPriority;
            
            // Set volume and loop for continuous sounds
            currentAudio.volume = 0.4;
            currentAudio.loop = true;
            currentAudio.play().catch(error => {
                console.warn('Could not play power-up sound:', error);
            });
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