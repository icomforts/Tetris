document.addEventListener("DOMContentLoaded", () => {
  const GRID_WIDTH = 10;
  const GRID_HEIGHT = 20;
  const GRID_SIZE = GRID_WIDTH * GRID_HEIGHT;

  const grid = createGrid();
  let squares = Array.from(grid.querySelectorAll("div"));
  const scoreDisplay = document.querySelector("#score");
  const scoreDisplay2 = document.querySelector("#scoreend");

  const startBtn = document.querySelector("#startButton");
  const modalBtn = document.querySelector(".modalbtnStart");
  const modal = document.querySelector(".modalStart");
  const modalBtne = document.querySelector(".modalbtnEnd");
  const modale = document.querySelector(".modalBgEnd");
  const easy = document.querySelector(".easy");
  const normal = document.querySelector(".normal");
  const hard = document.querySelector(".hard");

  const width = 10;
  var speed = 600;
  let nextRandom = 0;
  let timerId;
  let score = 0;
  const colors = [
    "url(http://www.aniakubow.com/Tetris/images/peach_block.png)",
    "url(http://www.aniakubow.com/Tetris/images/blue_block.png)",
    "url(http://www.aniakubow.com/Tetris/images/purple_block.png)",
    "url(http://www.aniakubow.com/Tetris/images/yellow_block.png)",
    "url(http://www.aniakubow.com/Tetris/images/pink_block.png)",
  ];

  easy.addEventListener("click", () => {
    speed = 600;
  });
  normal.addEventListener("click", () => {
    speed = 300;
  });
  hard.addEventListener("click", () => {
    speed = 100;
  });

  //////////////////場地
  function createGrid() {
    // the main grid
    let grid = document.querySelector(".grid");
    for (let i = 0; i < GRID_SIZE; i++) {
      let gridElement = document.createElement("div");
      grid.appendChild(gridElement);
    }

    // set base of grid
    for (let i = 0; i < GRID_WIDTH; i++) {
      let gridElement = document.createElement("div");
      gridElement.setAttribute("class", "block3");
      grid.appendChild(gridElement);
    }

    let previousGrid = document.querySelector(".mini-grid");
    // Since 16 is the max grid size in which all the Tetrominoes
    // can fit in we create one here
    for (let i = 0; i < 16; i++) {
      let gridElement = document.createElement("div");
      previousGrid.appendChild(gridElement);
    }
    return grid;
  }

  ///////////////////////////////方塊
  modalBtn.addEventListener("click", () => {
    modal.classList.add("modalhide");
  });

  const lTetromino = [
    [1, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1, 2],
    [GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2 + 2],
    [1, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1, GRID_WIDTH * 2],
    [GRID_WIDTH, GRID_WIDTH * 2, GRID_WIDTH * 2 + 1, GRID_WIDTH * 2 + 2],
  ];

  const zTetromino = [
    [0, GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1],
    [GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2, GRID_WIDTH * 2 + 1],
    [0, GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1],
    [GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2, GRID_WIDTH * 2 + 1],
  ];

  const tTetromino = [
    [1, GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2],
    [1, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2 + 1],
    [GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH * 2 + 1],
    [1, GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1],
  ];

  const oTetromino = [
    [0, 1, GRID_WIDTH, GRID_WIDTH + 1],
    [0, 1, GRID_WIDTH, GRID_WIDTH + 1],
    [0, 1, GRID_WIDTH, GRID_WIDTH + 1],
    [0, 1, GRID_WIDTH, GRID_WIDTH + 1],
  ];

  const iTetromino = [
    [1, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1, GRID_WIDTH * 3 + 1],
    [GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH + 3],
    [1, GRID_WIDTH + 1, GRID_WIDTH * 2 + 1, GRID_WIDTH * 3 + 1],
    [GRID_WIDTH, GRID_WIDTH + 1, GRID_WIDTH + 2, GRID_WIDTH + 3],
  ];

  const allTetrominoes = [
    lTetromino,
    zTetromino,
    tTetromino,
    oTetromino,
    iTetromino,
  ];

  let currentPosition = 4;
  let currentRotation = 0;

  //////隨機方塊第一次出現的旋轉
  let random = Math.floor(Math.random() * allTetrominoes.length);
  let current = allTetrominoes[random][currentRotation];
  console.log(current);

  ///////畫方塊
  function draw() {
    current.forEach((index) => {
      squares[currentPosition + index].classList.add("block");
      squares[currentPosition + index].style.backgroundImage = colors[random];
    });
  }

  function undraw() {
    current.forEach((index) => {
      squares[currentPosition + index].classList.remove("block");
      squares[currentPosition + index].style.backgroundImage = "none";
    });
  }

  //   timerId = setInterval(moveDown, 500);
  //////////////////移動方塊呼叫
  function control(e) {
    if (e.keyCode === 37) {
      moveLeft();
    } else if (e.keyCode === 67) {
      rotate();
    } else if (e.keyCode === 39) {
      moveRight();
    } else if (e.keyCode === 40) {
      moveDown();
    }
  }
  document.addEventListener("keydown", control);

  ////////方塊下降

  function moveDown() {
    undraw();
    currentPosition = currentPosition += width;
    draw();
    freeze();
  }

  /////方塊到底部
  function freeze() {
    if (
      current.some(
        (index) =>
          squares[currentPosition + index + width].classList.contains(
            "block3"
          ) ||
          squares[currentPosition + index + width].classList.contains("block2")
      )
    ) {
      // make it block2
      current.forEach((index) =>
        squares[index + currentPosition].classList.add("block2")
      );
      // start a new tetromino falling
      random = nextRandom;
      nextRandom = Math.floor(Math.random() * allTetrominoes.length);
      current = allTetrominoes[random][currentRotation];
      currentPosition = 4;
      draw();
      displayShape();
      addScore();
      gameOver(score);
    }
  }

  freeze();
  ///////////左右移動
  function moveLeft() {
    undraw();
    const isAtLeftEdge = current.some(
      (index) => (currentPosition + index) % width === 0
    );
    if (!isAtLeftEdge) currentPosition -= 1;
    if (
      current.some((index) =>
        squares[currentPosition + index].classList.contains("block2")
      )
    ) {
      currentPosition += 1;
    }
    draw();
  }

  function moveRight() {
    undraw();
    const isAtRightEdge = current.some(
      (index) => (currentPosition + index) % width === width - 1
    );
    if (!isAtRightEdge) currentPosition += 1;
    if (
      current.some((index) =>
        squares[currentPosition + index].classList.contains("block2")
      )
    ) {
      currentPosition -= 1;
    }
    draw();
  }
  ////////////////旋轉方塊
  function rotate() {
    undraw();
    currentRotation++;
    if (currentRotation === current.length) {
      currentRotation = 0;
    }
    current = allTetrominoes[random][currentRotation];
    draw();
  }

  //////下個方塊
  const displaySquares = document.querySelectorAll(".mini-grid div");
  const displayWidth = 4;
  let displayIndex = 0;

  const nextTetrominoes = [
    [1, displayWidth + 1, displayWidth * 2 + 1, 2],
    [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1],
    [1, displayWidth, displayWidth + 1, displayWidth + 2],
    [0, 1, displayWidth, displayWidth + 1],
    [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1],
  ];

  function displayShape() {
    displaySquares.forEach((square) => {
      square.classList.remove("block");
      square.style.backgroundImage = "none";
    });
    nextTetrominoes[nextRandom].forEach((index) => {
      displaySquares[displayIndex + index].classList.add("block");
      displaySquares[displayIndex + index].style.backgroundImage =
        colors[nextRandom];
    });
  }

  startBtn.addEventListener("click", () => {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    } else {
      draw();
      timerId = setInterval(moveDown, speed);
      nextRandom = Math.floor(Math.random() * allTetrominoes.length);
      displayShape();
    }
  });

  function addScore() {
    for (
      currentIndex = 0;
      currentIndex < GRID_SIZE;
      currentIndex += GRID_WIDTH
    ) {
      const row = [
        currentIndex,
        currentIndex + 1,
        currentIndex + 2,
        currentIndex + 3,
        currentIndex + 4,
        currentIndex + 5,
        currentIndex + 6,
        currentIndex + 7,
        currentIndex + 8,
        currentIndex + 9,
      ];
      if (row.every((index) => squares[index].classList.contains("block2"))) {
        score += 10;

        scoreDisplay.innerHTML = score;

        row.forEach((index) => {
          squares[index].style.backgroundImage = "none";
          squares[index].classList.remove("block2") ||
            squares[index].classList.remove("block");
        });
        //splice array
        const squaresRemoved = squares.splice(currentIndex, width);
        squares = squaresRemoved.concat(squares);
        squares.forEach((cell) => grid.appendChild(cell));
      }
    }
    return score;
  }

  function gameOver(score) {
    if (
      current.some((index) =>
        squares[currentPosition + index].classList.contains("block2")
      )
    ) {
      scoreDisplay2.innerHTML = score;
      clearInterval(timerId);
      restart();
    }
  }
  function restart() {
    modale.classList.add("modalshow");
    modalBtne.addEventListener("click", () => {
      modale.classList.remove("modalshow");
    });
    scoreDisplay.innerHTML = "0";
    score = 0;
    squares.forEach((index) => {
      console.log(index.classList.remove("block2"));
      console.log(index.classList.remove("block"));
      index.style.backgroundImage = "none";
    });

    // for (i = 200; i <= 209; i++) {
    //   squares[i].classList.add("taken");
    // }
    timerId = null;
  }
});
