const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const GAME_WIDTH = canvas.width;
const GAME_HEIGHT = canvas.height;
const GRAVITY = 0.3;
const FLOOR_HEIGHT = 100;
let cameraY = 0;
let score = 0;
let currentFloor = 0;
let health = 100;

const platforms = [];
let lowestPlatformY = 500;

const playerImage = new Image();
playerImage.src = 'graphics/player.png';

const platformImage = new Image();
platformImage.src = 'graphics/ground-floor.png';

const COLORS = {
    background: '#000000',
    platform: '#00FFFF',
    player: '#FF6600'
};

const player = {
    x: 400,
    y: 100,
    width: 60,
    height: 60,
    velocityX: 0,
    velocityY: 0,
    speed: 5,
}

for(let i = 0; i < 10; i++) {
    generatePlatform();
}

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
        ctx.drawImage(platformImage, platform.x, platform.y - cameraY, platform.width, platform.height);
    });

    ctx.fillStyle = COLORS.player;
    ctx.drawImage(playerImage, player.x, player.y - cameraY, player.width, player.height);

    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);    // Zielony pasek zdrowia w prawym górnym rogu
    ctx.fillStyle = 'green';
    ctx.fillRect(GAME_WIDTH - 210, 20, (health / 100) * 200, 20);
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.strokeRect(GAME_WIDTH - 210, 20, 200, 20);
}

function checkCollision(obj1, obj2) {
    return (
        obj1.x < obj2.x + obj2.width - 40 &&
        obj1.x + obj1.width > obj2.x + 40 && 
        obj1.y < obj2.y + obj2.height &&
        obj1.y + obj1.height > obj2.y
    );
}

function generatePlatform() {
    const platform = {
        x: Math.random() * (GAME_WIDTH - 100),
        y: lowestPlatformY,
        width: 200,
        height: 40, 
    }
    platforms.push(platform);
    lowestPlatformY += 100;
}

function update() {
    player.velocityX = 0;
  
    if (keys['ArrowLeft']) {
        player.velocityX = -player.speed;
    }
    if (keys['ArrowRight']) {
        player.velocityX = player.speed;
    }

    player.velocityY += GRAVITY;
    
    player.x += player.velocityX;

    if (player.x < 0) {
        player.x = 0;   
    }
    if (player.x + player.width > GAME_WIDTH) {
        player.x = GAME_WIDTH - player.width;
    }

    player.y += player.velocityY;

    let newFloor = Math.floor(player.y / FLOOR_HEIGHT);
    if (newFloor > currentFloor) {
        score += (newFloor - currentFloor);
        currentFloor = newFloor;
    }

    platforms.forEach(platform => {
        if(checkCollision(player, platform)) {
            if (player.velocityY > 0 && 
                player.y + player.height - player.velocityY <= platform.y) {
                // Gracz spada Z GÓRY na platformę (nie z boku)
                player.y = platform.y - player.height;
                player.velocityY = 0;
            }
        }
    })

    cameraY = player.y - GAME_HEIGHT / 2;

    if (player.y > lowestPlatformY - 500) {
        generatePlatform();
    }
}

function gameLoop() {
    draw();
    update();
    requestAnimationFrame(gameLoop);
}

gameLoop();
