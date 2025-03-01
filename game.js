const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;


const player = {
    x: canvas.width / 2,
    y: canvas.height - 50,
    width: 50,
    height: 50,
    speed: 5,
    color: 'white'
};


const bullets = [];
const bulletSpeed = 7;

const enemies = [];
const enemySpeed = 2;

let score = 0;

let lives = 3;
let missedEnemies = 0;
let gameIsOver = false;

function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.beginPath();
    ctx.moveTo(player.x, player.y);
    ctx.lineTo(player.x - 25, player.y + 25);
    ctx.lineTo(player.x + 25, player.y + 25);
    ctx.closePath();
    ctx.fill();
}


function drawBullets() {
    ctx.fillStyle = 'red';
    bullets.forEach(bullet => {
        ctx.fillRect(bullet.x - 2, bullet.y - 10, 4, 10);
    });
}


function drawEnemies() {
    ctx.fillStyle = 'green';
    enemies.forEach(enemy => {
        ctx.fillRect(enemy.x - 20, enemy.y - 20, 40, 40);
    });
}


function drawScore() {
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`Skor: ${score}`, 10, 30);
    ctx.fillText(`Kalan Can: ${lives}`, 10, 60);
    ctx.fillText(`Kaçırılan Düşman: ${missedEnemies}/5`, 10, 90);
}


function createEnemy() {
    if (Math.random() < 0.02) {
        enemies.push({
            x: Math.random() * canvas.width,
            y: 0
        });
    }
}


function checkCollisions() {
    enemies.forEach((enemy, index) => {
        const dx = player.x - enemy.x;
        const dy = player.y - enemy.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 40) {
            enemies.splice(index, 1);
            lives--;
            checkGameOver();
        }
    });

    for (let i = bullets.length - 1; i >= 0; i--) {
        for (let j = enemies.length - 1; j >= 0; j--) {
            const bullet = bullets[i];
            const enemy = enemies[j];
            
            if (bullet && enemy) {
                const dx = bullet.x - enemy.x;
                const dy = bullet.y - enemy.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 30) {
                    bullets.splice(i, 1);
                    enemies.splice(j, 1);
                    score += 10;
                }
            }
        }
    }
}

function checkGameOver() {
    if (lives <= 0 || missedEnemies >= 5) {
        gameIsOver = true;
        const gameOverDiv = document.getElementById('gameOver');
        const finalScoreText = document.getElementById('finalScore');
        gameOverDiv.style.display = 'block';
        finalScoreText.textContent = `Skorunuz: ${score}`;
    }
}

function resetGame() {
    lives = 3;
    score = 0;
    missedEnemies = 0;
    gameIsOver = false;
    enemies.length = 0;
    bullets.length = 0;
    player.x = canvas.width / 2;
    document.getElementById('gameOver').style.display = 'none';
}

function gameLoop() {
    if (!gameIsOver) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if (keys.ArrowLeft && player.x > 25) player.x -= player.speed;
        if (keys.ArrowRight && player.x < canvas.width - 25) player.x += player.speed;
        
        bullets.forEach((bullet, index) => {
            bullet.y -= bulletSpeed;
            if (bullet.y < 0) bullets.splice(index, 1);
        });
        
        enemies.forEach((enemy, index) => {
            enemy.y += enemySpeed;
            if (enemy.y > canvas.height) {
                enemies.splice(index, 1);
                missedEnemies++;
                checkGameOver();
            }
        });
        
        createEnemy();
        checkCollisions();
        
        drawPlayer();
        drawBullets();
        drawEnemies();
        drawScore();
    }
    
    requestAnimationFrame(gameLoop);
}

const keys = {};
document.addEventListener('keydown', e => keys[e.key] = true);
document.addEventListener('keydown', e => {
    if (e.key === ' ') {
        bullets.push({
            x: player.x,
            y: player.y
        });
    }
});
document.addEventListener('keyup', e => keys[e.key] = false);


document.getElementById('restartButton').addEventListener('click', resetGame);

gameLoop(); 