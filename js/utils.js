//render mat
function renderBoard(board) {
  var strHTML = '';
  for (var i = 0; i < board.length; i++) {
    strHTML += '<tr>';
    for (var j = 0; j < board[0].length; j++) {
      var className = `cell clickable cell-${i}-${j}`;
      strHTML += `<td class="${className}" onclick="cellClicked(this, ${i}, ${j})"
           oncontextmenu="cellMarked(this, ${i}, ${j});return false"</td>`;
    }
    strHTML += '</tr>';
  }
  document.querySelector('.game-board > tbody').innerHTML = strHTML;
}
function renderLives(liveCnt) {
  var strHTML = '';
  for (var i = 0; i < liveCnt; i++) {
    strHTML += `<span class="live live-${i}"><img src="/img/heart-icon_34407.ico" alt="" /></span>`;
  }
  document.querySelector('.health-bar').innerHTML = strHTML;
}
function buildBoard(height, width) {
  var board = [];
  for (var i = 0; i < height; i++) {
    board[i] = [];
    for (var j = 0; j < width; j++) {
      board[i][j] = {
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false,
      };
    }
  }
  return board;
}

// render cell location such as: {i: 2, j: 7}
function renderCell(location, value) {
  // Select the elCell and set the value
  var elCell = document.querySelector(`.cell${location.i}-${location.j}`);
  elCell.innerHTML = value;
}

//return random color
function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// get empty cell
function getEmptyCell() {
  var emptyCells = getEmptyCells();
  var idx = getRandomIntInclusive(0, emptyCells.length - 1);
  var emptyCell = emptyCells[idx];
  return emptyCell;
}

// get empty cells
function getEmptyCells(board) {
  var emptyCells = [];
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[0].length; j++) {
      if (board[i][j]) continue;
      emptyCells.push({ i, j });
    }
  }
  return emptyCells;
}

// random number inclusive max
function getRandomIntegerInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
// random number NOT inclusive max
function getRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

// copy mat
function copyMat(mat) {
  var newMat = [];
  for (var i = 0; i < mat.length; i++) {
    newMat[i] = [];
    // newMat[i] = mat[i].slice();
    for (var j = 0; j < mat[0].length; j++) {
      newMat[i][j] = mat[i][j];
    }
  }
  return newMat;
}

// Neighbors loop

function getSelector(coord) {
  return '#cell-' + coord.i + '-' + coord.j;
}

function isEmptyCell(coord) {
  return gBoard[coord.i][coord.j] === '';
}

// timer
function startTimer() {
  renderTimer();
  gStartTime = Date.now();
  gTimerInterval = setInterval(function () {
    var msDiff = Date.now() - gStartTime;
    var secs = '' + parseInt((msDiff / 1000) % 60);
    if (secs.length === 1) secs = '0' + secs;

    var min = '' + parseInt(msDiff / 1000 / 60);
    if (min.length === 1) min = '0' + min;

    var strMsDiff = '' + msDiff;

    var miliSecs =
      strMsDiff.charAt(strMsDiff.length - 3) +
      strMsDiff.charAt(strMsDiff.length - 2);

    if (miliSecs.length === 1) miliSecs = '0' + miliSecs;
    console.log(miliSecs);

    var passedTime = `${min}:${secs}.${miliSecs}`;
    var elTimer = document.querySelector('.timer');
    elTimer.innerText = passedTime;
  }, 10);
}
