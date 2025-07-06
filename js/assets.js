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
            { key: 'explosionSound', src: 'sound/explosion.mp3' }
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
            audio.src = src;
            assets[key] = audio;
        });
    });
}

// Play explosion sound effect
export function playExplosionSound() {
    if (assets.explosionSound) {
        // Clone the audio to allow multiple simultaneous plays
        const audio = assets.explosionSound.cloneNode();
        audio.volume = 0.3; // Adjust volume (0.0 to 1.0)
        audio.play().catch(error => {
            console.warn('Could not play explosion sound:', error);
        });
    }
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