// Sélection des éléments HTML
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const progressBar = document.getElementById('oxygenBar'); // Rename to progressBar
const gameOverMessage = document.getElementById('game-over');
const restartButton = document.getElementById('restart-button');

// Dimensions du canvas
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

// Variables du jeu
let phytoY = canvasHeight / 2; // Position verticale du phytoplancton
let phytoX = 100; // Position horizontale fixe du phytoplancton
let velocity = 0; // Vitesse verticale
let gravity = 0.3; // Gravité douce
let lift = -7.5; // Force de remontée douce
let maxVelocity = 5; // Vitesse maximale pour limiter les excès
let damping = 0.9; // Facteur d'amortissement
let obstacles = []; // Liste des obstacles
let frameCount = 0; // Compteur de frames pour générer des obstacles
let score = 0; // Score du joueur
let levelProgress = 0; // Progression du niveau (nombre d'obstacles passés)
let isGameOver = false;
let isStarted = false; // Nouveau flag pour indiquer si le jeu a commencé

// Écouteur d'événement pour le contrôle du phytoplancton
document.addEventListener('keydown', () => {
    if (!isGameOver) {
        if (!isStarted) {
            isStarted = true; // Démarre le jeu au premier input
        }
        velocity += lift; // Applique une force de remontée
    }
});

// Load the heatwave image
const heatwaveImage = new Image();
heatwaveImage.src = './images/respiration/heatwave.png'; // Path to the heatwave image

// Ensure the image is loaded before using it
let heatwaveImageLoaded = false;
heatwaveImage.onload = () => {
    heatwaveImageLoaded = true;
    console.log('Heatwave image loaded.');
};

// Fonction pour redémarrer le jeu
function restartGame() {
    restartButton.disabled = true;

    // Réinitialise les variables du jeu
    phytoY = canvasHeight / 2;
    velocity = 0;
    obstacles = [];
    frameCount = 0;
    score = 0;
    levelProgress = 0;
    isGameOver = false;
    isStarted = false;

    // Cache le message de fin de jeu et montre le bouton de redémarrage
    gameOverMessage.style.display = 'none';
    restartButton.style.display = 'inline-block';

    // Relance la boucle du jeu
    gameLoop();

    setTimeout(() => {
        restartButton.disabled = false;
    }, 500); // Attends 500ms avant de réactiver
}

// Fonction pour générer des obstacles avec un design global warming
function generateObstacle() {
    const gapHeight = Math.random() * (canvasHeight / 2) + 100; // Plus grand espace
    const gapPosition = Math.random() * (canvasHeight - gapHeight);

    obstacles.push({
        x: canvasWidth,
        width: 60, // Width of the obstacle
        top: gapPosition,
        bottom: gapPosition + gapHeight,
        type: 'heatwave', // Type is now always heatwave
    });
}

// Fonction pour dessiner un obstacle
function drawObstacle(obstacle) {
    if (heatwaveImageLoaded) {
        // Draw the top part of the obstacle
        ctx.drawImage(
            heatwaveImage,
            obstacle.x,
            0,
            obstacle.width,
            obstacle.top
        );

        // Draw the bottom part of the obstacle
        ctx.drawImage(
            heatwaveImage,
            obstacle.x,
            obstacle.bottom,
            obstacle.width,
            canvasHeight - obstacle.bottom
        );
    } else {
        // Fallback for solid colors
        ctx.fillStyle = 'red';
        ctx.fillRect(obstacle.x, 0, obstacle.width, obstacle.top);
        ctx.fillRect(obstacle.x, obstacle.bottom, obstacle.width, canvasHeight - obstacle.bottom);
    }
}

// Fonction pour dessiner l'arrière-plan océanique
function drawBackground() {
    const oceanGradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);
    oceanGradient.addColorStop(0, '#80e0d7'); // Bleu clair pour la surface de l'eau
    oceanGradient.addColorStop(1, '#1e3a5f'); // Bleu foncé pour les profondeurs marines

    ctx.fillStyle = oceanGradient;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
}

// Fonction pour vérifier les collisions
function checkCollision() {
    for (let obstacle of obstacles) {
        if (
            phytoX + 15 > obstacle.x &&
            phytoX - 15 < obstacle.x + obstacle.width &&
            (phytoY - 15 < obstacle.top || phytoY + 15 > obstacle.bottom)
        ) {
            isGameOver = true; // Empêche les collisions multiples
            return true;
        }
    }

    if (phytoY - 15 <= 0 || phytoY + 15 >= canvasHeight) {
        isGameOver = true; // Collision avec le haut ou le bas du canvas
        return true;
    }

    return false;
}

// Mise à jour principale du jeu
function updateGame() {
    if (isGameOver) return;

    if (isStarted) {
        velocity += gravity;
        velocity *= damping;
        velocity = Math.max(-maxVelocity, Math.min(maxVelocity, velocity));
        phytoY += velocity;
    }

    if (!isStarted) {
        phytoY = canvasHeight / 2;
    }

    frameCount++;
    if (isStarted && frameCount % 150 === 0) {
        generateObstacle();
    }

    for (let i = obstacles.length - 1; i >= 0; i--) {
        obstacles[i].x -= 2;

        if (obstacles[i].x + obstacles[i].width < 0) {
            obstacles.splice(i, 1);
            score++;
            levelProgress++;
            progressBar.style.width = `${(levelProgress / 15) * 100}%`;

            if (levelProgress >= 15) {
                isGameOver = true;
                gameOverMessage.style.display = 'block';
                gameOverMessage.innerText = 'Félicitations : Vous avez gagné !';
                restartButton.style.display = 'inline-block';
                return;
            }
        }
    }

    if (checkCollision()) {
        isGameOver = true;
        gameOverMessage.style.display = 'block';
        restartButton.style.display = 'inline-block';
        return;
    }
}

// Load the image for the circle texture
const phytoImage = new Image();
phytoImage.src = './images/respiration/plant.jpg'; // Path to your image

let circlePattern;

phytoImage.onload = () => {
    circlePattern = ctx.createPattern(phytoImage, 'no-repeat');
};

// Fonction d'affichage/dessin sur le canvas
function drawGame() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    drawBackground();

    const circleRadius = 30;
    const diameter = circleRadius * 2;

    if (circlePattern) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(phytoX, phytoY, circleRadius, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(phytoImage, phytoX - circleRadius, phytoY - circleRadius, diameter, diameter);
        ctx.restore();
    } else {
        ctx.fillStyle = 'green';
        ctx.beginPath();
        ctx.arc(phytoX, phytoY, circleRadius, 0, Math.PI * 2);
        ctx.fill();
    }

    for (let obstacle of obstacles) {
        drawObstacle(obstacle);
    }
}

// Boucle principale du jeu
function gameLoop() {
    if (isGameOver) return;

    updateGame();
    drawGame();

    scoreDisplay.innerText = `Obstacles franchis : ${levelProgress}`;
    progressBar.style.width = `${(levelProgress / 15) * 100}%`;

    requestAnimationFrame(gameLoop);
}

gameLoop();

document.getElementById('start-button').addEventListener('click', function () {
    this.style.display = 'none';
    gameLoop();
});
