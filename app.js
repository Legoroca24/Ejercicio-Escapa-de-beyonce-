//Variables configurables
let playerSpeed = 35; //Velocidad del jugador
let beyonceSpeed = 2; //Velocidad de Beyoncé
let gameAreaSize = "medium"; //Tamaño del área
let musicTheme = "default"; //Tema musical

//Elementos del DOM
const configMenu = document.getElementById("config-menu");
const gameArea = document.getElementById("game-area");
const audio = document.querySelector("audio");
const startButton = document.getElementById("start-game");

//Variables del juego
let isPlaying = false; //El juego inicia pausado
let playerPosition = { x: 0, y: 0 }; //Posición inicial del jugador
let beyoncePosition = { x: 300, y: 300 }; //Posición inicial de Beyoncé

//Aplicar configuración al iniciar el juego
function applyConfig() {
    //Leer configuraciones del menú
    playerSpeed = parseInt(document.getElementById("player-speed").value, 10);
    beyonceSpeed = parseInt(document.getElementById("beyonce-speed").value, 10);
    gameAreaSize = document.getElementById("game-area-size").value;
    musicTheme = document.getElementById("music-theme").value;

    //Elección del area de juego
    switch (gameAreaSize) {
        case "small":
            gameArea.style.width = "400px";
            gameArea.style.height = "300px";
            break;
        case "medium":
            gameArea.style.width = "600px";
            gameArea.style.height = "400px";
            break;
        case "large":
            gameArea.style.width = "800px";
            gameArea.style.height = "600px";
            break;
    }

    //Elección de música
    switch (musicTheme) {
        case "default":
            audio.src = "single.m4a";
            break;
        case "fast":
            audio.src = "fast.mp3";
            break;
        case "lofi":
            audio.src = "lofi.mp3";
            break;
    }

    //Mostrar el área de juego y ocultar el menú
    configMenu.style.display = "none";
    gameArea.style.display = "block";

    startGame();
}

//Iniciar el juego
function startGame() {
    isPlaying = true; 
    audio.play(); //Reproducir música
    gameLoop(); //Comenzar bucle del juego
}

//Bucle principal del juego
function gameLoop() {
    if (isPlaying) {
        moveBeyonce(); //Movimiento de Beyoncé
        requestAnimationFrame(gameLoop); //Continuar el bucle
    }
}

//Movimiento automático de Beyoncé
function moveBeyonce() {
    if (beyoncePosition.x < playerPosition.x)
        beyoncePosition.x += beyonceSpeed;
    else if (beyoncePosition.x > playerPosition.x)
        beyoncePosition.x -= beyonceSpeed;

    if (beyoncePosition.y < playerPosition.y)
        beyoncePosition.y += beyonceSpeed;
    else if (beyoncePosition.y > playerPosition.y)
        beyoncePosition.y -= beyonceSpeed;

    updatePosition(); //Actualizar posiciones en pantalla
    detectCollision(); //Verificar colisiones
}

//Movimiento del jugador
function movePlayer(event) {
    if (!isPlaying) return; //No permite movimiento si no se esta jugando

    switch (event.key) {
        case "ArrowUp":
            if (playerPosition.y >= 25)
                playerPosition.y -= playerSpeed;
            break;
        case "ArrowDown":
            if (playerPosition.y < gameArea.clientHeight - 70)
                playerPosition.y += playerSpeed;
            break;
        case "ArrowLeft":
            if (playerPosition.x >= 25)
                playerPosition.x -= playerSpeed;
            break;
        case "ArrowRight":
            if (playerPosition.x < gameArea.clientWidth - 70)
                playerPosition.x += playerSpeed;
            break;
    }

    updatePosition(); //Actualizar posiciones en pantalla
}

//Actualizar posiciones visuales
function updatePosition() {
    document.getElementById("player").style.transform = `translate(${playerPosition.x}px, ${playerPosition.y}px)`;
    document.getElementById("beyonce").style.transform = `translate(${beyoncePosition.x}px, ${beyoncePosition.y}px)`;
}

//Detectar colisiones entre el jugador y Beyoncé
function detectCollision() {
    const deltaX = Math.abs(playerPosition.x - beyoncePosition.x);
    const deltaY = Math.abs(playerPosition.y - beyoncePosition.y);

    if (deltaX <= 50 && deltaY <= 50) {
        const giveThanks = confirm("Beyoncé te atrapó! Dale las gracias para salvar tu vida.");
        if (giveThanks) {
            //Reposicionar jugador en lugar aleatorio
            playerPosition.x = Math.floor(Math.random() * (gameArea.clientWidth - 70));
            playerPosition.y = Math.floor(Math.random() * (gameArea.clientHeight - 70));
        } else {
            alert("Perdiste :(");
            isPlaying = false; //Detener el juego
            audio.pause();
        }
    }
}

//Evento para iniciar el juego al hacer clic en el botón
startButton.addEventListener("click", applyConfig);

//Evento para movimiento del jugador
window.addEventListener("keydown", movePlayer);
