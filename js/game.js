'use-strict';
var gBoard;
var gLevel;
var gGame;
var gFlagMineCount;
var gCurrAvatar;
var gDiff = 1;
var gTimer;
var gInterval;
const AVATARS = {
  BOMB: '💣',
  FLAG: '🚩',
  EMPTY: '',
  HEART: '<img src="/img/heart-icon_34407.ico" alt="" />',
  NORMAL: '😀',
  LOSE: '🤯',
  COOL: '😎',
};
function initGame() {
  switch (gDiff) {
    case 1:
      gLevel = {
        SIZE: 4,
        MINES: 2,
        LivesCnt: 2,
      };
      break;
    case 2:
      gLevel = {
        SIZE: 8,
        MINES: 12,
        LivesCnt: 3,
      };
      break;
    case 3:
      gLevel = {
        SIZE: 12,
        MINES: 30,
        LivesCnt: 4,
      };
      break;
    case 4:
      gLevel = {
        SIZE: 20,
        MINES: 100,
        LivesCnt: 8,
      };
      break;

    default:
      break;
  }
  gGame = {
    isOn: true,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    isMines: false,
  };
  gBoard = buildBoard(gLevel.SIZE, gLevel.SIZE);
  console.log(gBoard);
  renderBoard(gBoard);
  renderLives(gLevel.LivesCnt);
  setAvatar('normal');
  gTimer = 0;
  clearInterval(gInterval);
}
function iniateInterval() {
  gInterval = setInterval(timer, 10);
}
function timer() {
  var elTimer = document.querySelector('.timer');
  elTimer.innerText = gTimer.toFixed(3);
  gTimer = gTimer + 0.01;
}

function setMinesNegsCount(board, yIdx, xIdx) {
  for (var i = yIdx - 1; i <= yIdx + 1; i++) {
    if (i < 0 || i >= board.length) continue;
    for (var j = xIdx - 1; j <= xIdx + 1; j++) {
      if (j < 0 || (i === yIdx && j === xIdx) || j >= board[0].length) continue;
      board[i][j].minesAroundCount++;
    }
  }
}

function cellMarked(elCell, i, j) {
  var cell = gBoard[i][j];
  if (!gGame.isOn || cell.isShown) return;
  cell.isMarked = !cell.isMarked;
  var cellValue = cell.isMarked ? AVATARS.FLAG : AVATARS.EMPTY;

  elCell.classList.toggle('clickable');
  elCell.innerHTML = cellValue;
  gGame.markedCount += cell.isMarked ? 1 : -1;
  checkGameOver(gBoard);
}
function addMines(board, mineCnt, yIdx, xIdx) {
  for (var i = 0; i < mineCnt; i++) {
    var rndY = getRandomIntegerInclusive(0, board.length - 1);
    var rndX = getRandomIntegerInclusive(0, board[0].length - 1);
    var cell = board[rndY][rndX];
    if ((rndY === yIdx && rndX === xIdx) || cell.isMine) {
      i--;
      continue;
    }
    cell.isMine = true;
    setMinesNegsCount(board, rndY, rndX);
  }
  iniateInterval();
}

function cellClicked(elCell, i, j) {
  var cell = gBoard[i][j];
  if (!gGame.isOn || cell.isShown || cell.isMarked) return;
  if (!gGame.isMines) {
    addMines(gBoard, gLevel.MINES, i, j);
    gGame.isMines = true;
  }
  cell.isShown = true;
  var cellValue = cell.isMine
    ? AVATARS.BOMB
    : cell.minesAroundCount > 0
    ? cell.minesAroundCount
    : AVATARS.EMPTY;
  elCell.innerHTML = cellValue;
  elCell.classList.remove('clickable');
  elCell.classList.add('clicked', 'val-' + cell.minesAroundCount);
  cellValue === AVATARS.EMPTY ? expandShown(gBoard, i, j) : gGame.shownCount;
  var liveCnt = checkGameOver(gBoard);
  if (cell.isMine) {
    renderLives(liveCnt);
    setTimeout(function () {
      setAvatar('normal');
    }, 1000);
    setAvatar('lose');
  }
}
function checkGameOver(board) {
  var liveCnt = gLevel.LivesCnt;
  gFlagMineCount = 0;
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[0].length; j++) {
      currCell = board[i][j];
      if (currCell === undefined) return;
      if (currCell.isShown && currCell.isMine) {
        if (liveCnt <= 1) {
          alert('You Lost');
          setAvatar('lose');
          gGame.isOn = false;
          liveCnt--;
        } else {
          liveCnt--;
        }
      }
      if (currCell.isMarked && currCell.isMine) gFlagMineCount++;
    }
  }
  if (gFlagMineCount === gLevel.MINES) {
    setTimeout(function () {
      alert('You Won');
      setAvatar('cool');
      gGame.isOn = false;
    }, 300);
  }
  return liveCnt;
}

function expandShown(board, yIdx, xIdx) {
  for (var i = yIdx - 1; i <= yIdx + 1; i++) {
    if (i < 0 || i >= board.length) continue;
    for (var j = xIdx - 1; j <= xIdx + 1; j++) {
      var cell = board[i][j];
      if (
        j < 0 ||
        (i === yIdx && j === xIdx) ||
        j >= board[0].length ||
        cell.isMine
      )
        continue;
      var elCell = document.querySelector(`.cell-${i}-${j}`);
      cellClicked(elCell, i, j);
    }
  }
}

function setAvatar(avatarKind) {
  var elAvatar = document.querySelector('.smiley');
  switch (avatarKind) {
    case 'normal':
      elAvatar.innerHTML = AVATARS.NORMAL;
      gCurrAvatar = AVATARS.NORMAL;
      break;
    case 'lose':
      elAvatar.innerHTML = AVATARS.LOSE;
      gCurrAvatar = AVATARS.LOSE;
      break;
    case 'cool':
      elAvatar.innerHTML = AVATARS.COOL;
      gCurrAvatar = AVATARS.COOL;
      break;

    default:
      break;
  }
}

function changeDiff(diff) {
  gDiff = diff;
  initGame();
}
