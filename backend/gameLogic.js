// Game logic utilities

/**
 * Check if player won
 * @param {string[]} board - 9-element board array
 * @param {string} player - "X" or "O"
 * @returns {boolean}
 */
function checkWin(board, player) {
  const winPatterns = [
    // Rows
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    // Columns
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    // Diagonals
    [0, 4, 8],
    [2, 4, 6],
  ];

  return winPatterns.some((pattern) =>
    pattern.every((index) => board[index] === player)
  );
}

/**
 * Check if board is full (draw)
 * @param {string[]} board - 9-element board array
 * @returns {boolean}
 */
function checkDraw(board) {
  return board.every((cell) => cell !== "");
}

module.exports = {
  checkWin,
  checkDraw,
};
