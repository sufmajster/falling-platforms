// Input management
export const keys = {};

// Initialize input listeners
export function initializeInput(onRestart) {
    document.addEventListener('keydown', (e) => {
        keys[e.key] = true;
        
        // Handle game restart
        if (e.key === ' ' && onRestart) {
            onRestart();
        }
    });
    
    document.addEventListener('keyup', (e) => {
        keys[e.key] = false;
    });
}

// Check if key is pressed
export function isKeyPressed(key) {
    return keys[key] || false;
}

// Get movement input
export function getMovementInput() {
    return {
        left: isKeyPressed('ArrowLeft'),
        right: isKeyPressed('ArrowRight'),
        up: isKeyPressed('ArrowUp'),
        down: isKeyPressed('ArrowDown')
    };
} 