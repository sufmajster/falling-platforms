// Assets management module
export const assets = {
    playerImage: null,
    playerWithParachuteImage: null,
    platformImage: null,
    lavaImage: null,
    parachuteImage: null,
    loaded: false
};

// Load all game assets
export function loadAssets() {
    return new Promise((resolve, reject) => {
        const imagesToLoad = [
            { key: 'playerImage', src: 'graphics/player.png' },
            { key: 'playerWithParachuteImage', src: 'graphics/player-with-parachute.png' },
            { key: 'platformImage', src: 'graphics/ground-floor.png' },
            { key: 'lavaImage', src: 'graphics/lava-floor.png' },
            { key: 'parachuteImage', src: 'graphics/parachute.png' }
        ];

        let loadedCount = 0;
        const totalImages = imagesToLoad.length;

        imagesToLoad.forEach(({ key, src }) => {
            const img = new Image();
            img.onload = () => {
                loadedCount++;
                if (loadedCount === totalImages) {
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
    });
}

// Get player image based on parachute state
export function getPlayerImage(parachuteActive) {
    return parachuteActive ? assets.playerWithParachuteImage : assets.playerImage;
}

// Get platform image based on type
export function getPlatformImage(type) {
    return type === 'lava' ? assets.lavaImage : assets.platformImage;
} 