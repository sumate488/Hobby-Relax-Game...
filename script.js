let score = 0;
let combo = 0;
let level = 1;
let timeLeft = 45;
let gameRunning = false;
let timer;

const gameArea = document.getElementById("gameArea");
const scoreText = document.getElementById("score");
const comboText = document.getElementById("combo");
const levelText = document.getElementById("level");
const timeText = document.getElementById("time");
const message = document.getElementById("message");
const restartBtn = document.getElementById("restartBtn");

let doubleScore = false;
let slowMotion = false;

/* START */
startGame();

function startGame() {
    reset();
    gameRunning = true;

    timer = setInterval(() => {
        timeLeft--;
        timeText.innerText = timeLeft;
        if (timeLeft === 0) endGame();
    }, 1000);

    spawnLoop();
}

/* SPAWN LOOP */
function spawnLoop() {
    if (!gameRunning) return;

    spawnTarget();

    if (Math.random() < 0.15) spawnPowerUp();

    setTimeout(spawnLoop, getSpawnRate());
}

/* TARGET */
function spawnTarget() {
    const target = document.createElement("div");
    target.className = "target";

    const size = Math.max(60 - level * 5, 30);
    target.style.width = size + "px";
    target.style.height = size + "px";

    const x = Math.random() * (gameArea.clientWidth - size);
    const y = Math.random() * (gameArea.clientHeight - size);

    target.style.left = x + "px";
    target.style.top = y + "px";

    gameArea.appendChild(target);

    target.addEventListener("click", (e) => {
        e.stopPropagation();

        const rect = target.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;

        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const distance = Math.sqrt(dx * dx + dy * dy);

        const headshot = distance < rect.width * 0.18;

        combo++;
        let points = headshot ? 50 : 20;
        if (doubleScore) points *= 2;

        score += points * combo;

        scoreText.innerText = score;
        comboText.innerText = combo;

        if (combo % 6 === 0) {
            level++;
            levelText.innerText = level;
        }

        target.remove();
    });

    setTimeout(() => {
        if (target.parentNode) {
            target.remove();
            combo = 0;
            comboText.innerText = combo;
        }
    }, getTargetLife());
}

/* POWER UPS */
function spawnPowerUp() {
    const power = document.createElement("div");
    power.className = "target power";
    power.style.width = "40px";
    power.style.height = "40px";

    power.style.left = Math.random() * (gameArea.clientWidth - 40) + "px";
    power.style.top = Math.random() * (gameArea.clientHeight - 40) + "px";

    gameArea.appendChild(power);

    power.addEventListener("click", (e) => {
        e.stopPropagation();

        if (Math.random() < 0.5) activateDoubleScore();
        else activateSlowMotion();

        power.remove();
    });

    setTimeout(() => power.remove(), 3000);
}

function activateDoubleScore() {
    doubleScore = true;
    message.innerText = "⚡ DOUBLE SCORE!";
    setTimeout(() => {
        doubleScore = false;
        message.innerText = "";
    }, 5000);
}

function activateSlowMotion() {
    slowMotion = true;
    message.innerText = "🐢 SLOW MOTION!";
    setTimeout(() => {
        slowMotion = false;
        message.innerText = "";
    }, 5000);
}

/* HELPERS */
function getSpawnRate() {
    return slowMotion ? 1200 : Math.max(800 - level * 80, 300);
}

function getTargetLife() {
    return slowMotion ? 2000 : Math.max(1500 - level * 100, 600);
}

/* MISS */
gameArea.addEventListener("click", () => {
    if (!gameRunning) return;
    combo = 0;
    comboText.innerText = combo;
});

/* END */
function endGame() {
    gameRunning = false;
    clearInterval(timer);
    message.innerText = "💀 GAME OVER";
}

/* RESET */
function reset() {
    score = 0;
    combo = 0;
    level = 1;
    timeLeft = 45;
    doubleScore = false;
    slowMotion = false;

    scoreText.innerText = 0;
    comboText.innerText = 0;
    levelText.innerText = 1;
    timeText.innerText = 45;
    message.innerText = "";

    gameArea.innerHTML = "";
}

/* RESTART */
restartBtn.addEventListener("click", () => {
    clearInterval(timer);
    startGame();
});
