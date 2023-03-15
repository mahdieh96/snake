const canvas = document.querySelector("#canvas");
const playGround = canvas.getContext("2d");
const scoreValue = document.querySelector("#score");
const pauseBtn = document.querySelector("#pauseBtn");
const startBtn = document.querySelector("#startBtn");

const playGroundColor = "#ffb3b3";
const snakeColor = " #ff3333";
const dx = 10;
const dy = 10;
const LEFT_KEY = 37;
const RIGHT_KEY = 39;
const UP_KEY = 38;
const DOWN_KEY = 40;
let direction;
let appleX;
let appleY;
let snake = [
  { x: 20, y: 0 },
  { x: 10, y: 0 },
  { x: 0, y: 0 },
];
let restart;
let tail;
let flag;
let score;
let pause;
let isGameOver;

startBtn.addEventListener("click", () =>
  startBtn.textContent == "restart" && !isGameOver
    ? (restart = true)
    : startGame()
);
pauseBtn.addEventListener("click", () => {
  pause = !pause;
});
document.addEventListener("keydown", changeDirection);

function random(min, max) {
  return Math.floor((Math.random() * (max - min) + min) / 10) * 10;
}
function loose() {
  isGameOver = true;
}
function startGame() {
  isGameOver = false;
  pause = false;
  startBtn.textContent = "restart";
  direction = "right";
  score = 0;

  snake = [
    { x: 20, y: 0 },
    { x: 10, y: 0 },
    { x: 0, y: 0 },
  ];
  flag = true;
  restart = false;
  tail = snake[snake.length - 1];
  const promise = new Promise((resolve) => {
    const interval = setInterval(() => {
      if (!pause) {
        if (restart) {
          clearInterval(interval);
          resolve("restart");
        }
        drawPlayGround();
        drawSnake();
        eatApple();
        showScore();
        moveSnake();
        if (flag) {
          makeApple();
          flag = !flag;
        }
        drawApple();
        if (hitPlayGround() || hitSelf()) {
          clearInterval(interval);
          resolve("gameOver");
          //loose();
          //resolve("loose");
        }
      }
    }, 300);
  });

  promise.then((value) => (value == "restart" ? startGame() : loose()));
}

function makeApple() {
  appleX = random(0, canvas.width);
  appleY = random(0, canvas.width);

  if (
    snake.find((p) => {
      p.x == appleX && p.y == appleY;
    })
  ) {
    makeApple();
  } else {
    drawApple();
  }
}

function drawApple() {
  playGround.fillStyle = "#00ff00";
  playGround.fillRect(appleX, appleY, 10, 10);
}

function changeDirection(e) {
  if (e.keyCode === LEFT_KEY) {
    direction = "left";
  } else if (e.keyCode === DOWN_KEY) {
    direction = "down";
  } else if (e.keyCode === UP_KEY) {
    direction = "up";
  } else if (e.keyCode === RIGHT_KEY) {
    direction = "right";
  }
}

function hitPlayGround() {
  let head = snake[0];
  if (head.x === 200) return true;
  else if (head.x === -10) return true;
  else if (head.y === -10) return true;
  else if (head.y === 200) return true;
  else return false;
}

function hitSelf() {
  let head = snake[0];
  for (let i = 1; i < snake.length; i++) {
    if (head.x == snake[i].x && head.y == snake[i].y) return true;
  }
}

function drawPlayGround() {
  playGround.fillStyle = playGroundColor;
  playGround.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
  snake.forEach((part) => {
    playGround.fillStyle = snakeColor;
    playGround.fillRect(part.x, part.y, 10, 10);
  });
  playGround.fillStyle = "#ff8080";
  playGround.fillRect(snake[0].x, snake[0].y, 10, 10);
}

function moveSnake() {
  tail = snake.pop();
  if (direction === "right")
    snake.unshift({ x: snake[0].x + dx, y: snake[0].y });
  else if (direction === "down") {
    snake.unshift({ x: snake[0].x, y: snake[0].y + dy });
  } else if (direction === "up") {
    snake.unshift({ x: snake[0].x, y: snake[0].y - dy });
  } else if (direction === "left") {
    snake.unshift({ x: snake[0].x - dx, y: snake[0].y });
  }
}

function showScore() {
  scoreValue.innerHTML = score + "";
}

function eatApple() {
  if (snake[0].x == appleX && snake[0].y == appleY) {
    score++;

    makeApple();
    snake.push(tail);
  }
}
