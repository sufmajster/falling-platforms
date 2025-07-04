const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const GAME_WIDTH = canvas.width;
const GAME_HEIGHT = canvas.height;

const COLORS = {
    background: '#000000',
    platform: '#00FFFF',
    player: '#FF6600'
};

const player = {
    x: 400,
    y: 100,
    width: 20,
    height: 20,
    velocityX: 0,
    velocityY: 0,
    speed: 5,
}

const platforms = [
    { x: 350, y: 150, width: 100, height: 20 },
    { x: 200, y: 250, width: 100, height: 20 },
    { x: 500, y: 350, width: 100, height: 20 },
    { x: 300, y: 450, width: 100, height: 20 },
    { x: 150, y: 550, width: 100, height: 20 }
];

const keys = {};

document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

function draw() {
    ctx.fillStyle = COLORS.background;
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    ctx.fillStyle = COLORS.platform;
    platforms.forEach(platform => {
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    });

    ctx.fillStyle = COLORS.player;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function update() {
    player.velocityX = 0;
    
    if (keys['ArrowLeft']) {
        player.velocityX = -player.speed;
    }
    if (keys['ArrowRight']) {
        player.velocityX = player.speed;
    }
    
    player.x += player.velocityX;
}

function gameLoop() {
    draw();
    update();
    requestAnimationFrame(gameLoop);
}

gameLoop();
