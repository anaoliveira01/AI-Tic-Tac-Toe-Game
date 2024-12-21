const boardElement = document.getElementById("board");
const xWinsElement = document.getElementById("xWins");
const oWinsElement = document.getElementById("oWins");

let board = Array(9).fill(null);
let currentPlayer = "X";
let xWins = 0;
let oWins = 0;

// Initialize board
function renderBoard() {
  boardElement.innerHTML = "";
  board.forEach((cell, index) => {
    const cellElement = document.createElement("div");
    cellElement.classList.add("cell");
    cellElement.textContent = cell || "";
    cellElement.addEventListener("click", () => makeMove(index));
    boardElement.appendChild(cellElement);
  });
}

function makeMove(index) {
  if (board[index] || checkWinner()) return;
  board[index] = currentPlayer;
  renderBoard();

  if (checkWinner()) {
    alert(`${currentPlayer} wins!`);
    updateWins(currentPlayer);
    resetBoard();
    return;
  }

  if (board.every(cell => cell)) {
    alert("It's a draw!");
    resetBoard();
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";

  if (currentPlayer === "O") {
    const bestMove = findBestMove();
    board[bestMove] = "O";
    currentPlayer = "X";
    renderBoard();
    if (checkWinner()) {
      alert(`O wins!`);
      updateWins("O");
      resetBoard();
    }
  }
}

function checkWinner() {
  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  for (const combo of winningCombinations) {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}

function updateWins(winner) {
  if (winner === "X") {
    xWins++;
    xWinsElement.textContent = xWins;
  } else if (winner === "O") {
    oWins++;
    oWinsElement.textContent = oWins;
  }
}

function resetBoard() {
  board = Array(9).fill(null);
  renderBoard();
}

// Minimax Algorithm
function minimax(newBoard, isMaximizing) {
  const winner = checkWinner();
  if (winner === "O") return 10;
  if (winner === "X") return -10;
  if (newBoard.every(cell => cell)) return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    newBoard.forEach((cell, index) => {
      if (!cell) {
        newBoard[index] = "O";
        const score = minimax(newBoard, false);
        newBoard[index] = null;
        bestScore = Math.max(score, bestScore);
      }
    });
    return bestScore;
  } else {
    let bestScore = Infinity;
    newBoard.forEach((cell, index) => {
      if (!cell) {
        newBoard[index] = "X";
        const score = minimax(newBoard, true);
        newBoard[index] = null;
        bestScore = Math.min(score, bestScore);
      }
    });
    return bestScore;
  }
}

function findBestMove() {
  let bestScore = -Infinity;
  let move;
  board.forEach((cell, index) => {
    if (!cell) {
      board[index] = "O";
      const score = minimax(board, false);
      board[index] = null;
      if (score > bestScore) {
        bestScore = score;
        move = index;
      }
    }
  });
  return move;
}

renderBoard();

