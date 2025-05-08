// Game Constants
const COLS = 9;
const ROWS = 15;
const BASE_SPEED = 1000;

// DOM Elements
const boardElement = document.getElementById('board');
const gameOverOverlay = document.getElementById('gameOverOverlay');
const continueBtn = document.getElementById('continueBtn');
const messageOverlay = document.getElementById('messageOverlay');
const messageContinueBtn = document.getElementById('messageContinueBtn');

// Game Board
const board = [];

// Tetromino Shapes
const TETROMINOS = {
  I: {
    shape: [
      [0,0,0,0],
      [1,1,1,1],
      [0,0,0,0],
      [0,0,0,0]
    ],
    className: 'tetromino-I'
  },
  J: {
    shape: [
      [1,0,0],
      [1,1,1],
      [0,0,0]
    ],
    className: 'tetromino-J'
  },
  L: {
    shape: [
      [0,0,1],
      [1,1,1],
      [0,0,0]
    ],
    className: 'tetromino-L'
  },
  O: {
    shape: [
      [1,1],
      [1,1]
    ],
    className: 'tetromino-O'
  },
  S: {
    shape: [
      [0,1,1],
      [1,1,0],
      [0,0,0]
    ],
    className: 'tetromino-S'
  },
  T: {
    shape: [
      [0,1,0],
      [1,1,1],
      [0,0,0]
    ],
    className: 'tetromino-T'
  },
  Z: {
    shape: [
      [1,1,0],
      [0,1,1],
      [0,0,0]
    ],
    className: 'tetromino-Z'
  }
};

// Game State
let currentPiece = null;
let currentX = 0;
let currentY = 0;
let dropInterval = null;
let score = 0;
let level = 1;
let lines = 0;
let isRunning = false;
let isGameOver = false;

// Initialize Board
function createBoard() {
  boardElement.innerHTML = '';
  for (let r = 0; r < ROWS; r++) {
    board[r] = [];
    for (let c = 0; c < COLS; c++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.setAttribute('role', 'gridcell');
      boardElement.appendChild(cell);
      board[r][c] = cell;
    }
  }
}

// Game Functions
function getDropSpeed(level) {
  const level1Speed = BASE_SPEED * 0.7;
  if (level <= 1) return level1Speed;
  return level1Speed * Math.pow(0.6, level - 1);
}

function randomTetromino() {
  const keys = Object.keys(TETROMINOS);
  const randKey = keys[Math.floor(Math.random() * keys.length)];
  return JSON.parse(JSON.stringify(TETROMINOS[randKey]));
}

function rotateMatrix(matrix) {
  const N = matrix.length;
  const result = [];
  for (let i = 0; i < N; i++) {
    result[i] = [];
    for (let j = 0; j < N; j++) {
      result[i][j] = matrix[N - j - 1][i];
    }
  }
  return result;
}

function isValidPosition(shape, x, y) {
  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (shape[r][c]) {
        let newX = x + c;
        let newY = y + r;
        if (
          newX < 0 ||
          newX >= COLS ||
          newY >= ROWS ||
          (newY >= 0 && board[newY][newX].dataset.filled === 'true')
        ) {
          return false;
        }
      }
    }
  }
  return true;
}

function draw() {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      board[r][c].className = 'cell';
      if (board[r][c].dataset.filled === 'true') {
        board[r][c].classList.add(board[r][c].dataset.color);
        board[r][c].classList.add('filled');
      }
    }
  }

  if (currentPiece) {
    const shape = currentPiece.shape;
    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        if (shape[r][c]) {
          let drawX = currentX + c;
          let drawY = currentY + r;
          if (drawY >= 0) {
            board[drawY][drawX].classList.add(currentPiece.className);
            board[drawY][drawX].classList.add('filled');
          }
        }
      }
    }
  }
}

function fixPiece() {
  const shape = currentPiece.shape;
  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (shape[r][c]) {
        let fixX = currentX + c;
        let fixY = currentY + r;
        if (fixY >= 0) {
          board[fixY][fixX].dataset.filled = 'true';
          board[fixY][fixX].dataset.color = currentPiece.className;
        }
      }
    }
  }
}

function clearLines() {
  let linesCleared = 0;
  for (let r = ROWS - 1; r >= 0; r--) {
    let fullLine = true;
    for (let c = 0; c < COLS; c++) {
      if (board[r][c].dataset.filled !== 'true') {
        fullLine = false;
        break;
      }
    }

    if (fullLine) {
      linesCleared++;
      for (let c = 0; c < COLS; c++) {
        board[r][c].dataset.filled = '';
        board[r][c].dataset.color = '';
        board[r][c].className = 'cell';
      }

      for (let row = r - 1; row >= 0; row--) {
        for (let c = 0; c < COLS; c++) {
          board[row + 1][c].dataset.filled = board[row][c].dataset.filled;
          board[row + 1][c].dataset.color = board[row][c].dataset.color;
          board[row + 1][c].className = 'cell';
          if (board[row + 1][c].dataset.filled === 'true') {
            board[row + 1][c].classList.add(board[row + 1][c].dataset.color);
            board[row + 1][c].classList.add('filled');
          }
        }
      }

      for (let c = 0; c < COLS; c++) {
        board[0][c].dataset.filled = '';
        board[0][c].dataset.color = '';
        board[0][c].className = 'cell';
      }
      r++;
    }
  }

  if (linesCleared > 0) {
    lines += linesCleared;
    score += linesCleared * 100;
    level = Math.floor(lines / 10) + 1;
    document.getElementById('score').textContent = score;
    document.getElementById('lines').textContent = lines;
    document.getElementById('level').textContent = level;
    if (isRunning) {
      clearInterval(dropInterval);
      dropInterval = setInterval(drop, getDropSpeed(level));
    }
  }
}

function spawnPiece() {
  currentPiece = randomTetromino();
  currentX = Math.floor(COLS / 2) - Math.floor(currentPiece.shape[0].length / 2);
  currentY = -currentPiece.shape.length;
  if (!isValidPosition(currentPiece.shape, currentX, currentY + 1)) {
    gameOver();
  }
}

function drop() {
  if (!currentPiece) return;
  if (isValidPosition(currentPiece.shape, currentX, currentY + 1)) {
    currentY++;
  } else {
    fixPiece();
    clearLines();
    spawnPiece();
  }
  draw();
}

function moveLeft() {
  if (isRunning && currentPiece && isValidPosition(currentPiece.shape, currentX - 1, currentY)) {
    currentX--;
    draw();
  }
}

function moveRight() {
  if (isRunning && currentPiece && isValidPosition(currentPiece.shape, currentX + 1, currentY)) {
    currentX++;
    draw();
  }
}

function rotate() {
  if (isRunning && currentPiece) {
    const rotatedShape = rotateMatrix(currentPiece.shape);
    if (isValidPosition(rotatedShape, currentX, currentY)) {
      currentPiece.shape = rotatedShape;
      draw();
    }
  }
}

// Game Control Functions
function startGame() {
  hideGameOver();
  hideMessage();
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      board[r][c].dataset.filled = '';
      board[r][c].dataset.color = '';
      board[r][c].className = 'cell';
    }
  }
  score = 0;
  level = 1;
  lines = 0;
  document.getElementById('score').textContent = '0';
  document.getElementById('level').textContent = '1';
  document.getElementById('lines').textContent = '0';
  spawnPiece();
  draw();
  isRunning = true;
  isGameOver = false;
  clearInterval(dropInterval);
  dropInterval = setInterval(drop, getDropSpeed(level));
  updateStartPauseButton();
}

function pauseGame() {
  isRunning = false;
  clearInterval(dropInterval);
  updateStartPauseButton();
}

function resumeGame() {
  isRunning = true;
  dropInterval = setInterval(drop, getDropSpeed(level));
  updateStartPauseButton();
}

function updateStartPauseButton() {
  const btn = document.getElementById('startPauseBtn');
  btn.textContent = !isRunning && currentPiece === null && !isGameOver 
    ? 'START GAME' 
    : isRunning 
      ? 'PAUSE' 
      : 'LANJUTKAN';
  btn.className = 'btn-green';
}

// Game Over Functions
function gameOver() {
  isRunning = false;
  isGameOver = true;
  clearInterval(dropInterval);
  gameOverOverlay.style.display = 'flex';
  gameOverOverlay.style.opacity = '1';
  updateStartPauseButton();
}

function showGameOver() {
  gameOverOverlay.style.display = 'flex';
  gameOverOverlay.style.opacity = '1';
}

function hideGameOver() {
  gameOverOverlay.style.display = 'none';
}

// Message Functions
function showMessage() {
  messageOverlay.style.display = 'flex';
  messageOverlay.focus();
}

function hideMessage() {
  messageOverlay.style.display = 'none';
}

// Event Listeners
document.getElementById('leftBtn').addEventListener('click', moveLeft);
document.getElementById('rightBtn').addEventListener('click', moveRight);
document.getElementById('rotateBtn').addEventListener('click', rotate);

document.getElementById('startPauseBtn').addEventListener('click', () => {
  if (isGameOver) return;
  if (!isRunning && currentPiece === null) {
    startGame();
  } else if (isRunning) {
    pauseGame();
  } else {
    resumeGame();
  }
});



continueBtn.addEventListener('click', () => {
  if (isGameOver) {
    hideGameOver();
    showMessage();
  }
});

messageContinueBtn.addEventListener('click', () => {
  hideMessage();
  startGame();
});

// Keyboard Controls
window.addEventListener('keydown', (e) => {
  if (!isRunning || !currentPiece) return;
  
  switch (e.key) {
    case 'ArrowLeft': moveLeft(); break;
    case 'ArrowRight': moveRight(); break;
    case 'ArrowUp': rotate(); break;
    case 'ArrowDown': drop(); break;
  }
});

// Initialize Game
createBoard();