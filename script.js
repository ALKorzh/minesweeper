const set = document.querySelector(".set-field-button")
const field = document.querySelector(".field")
const input = document.querySelector(".input-size")
const flagDiv = document.querySelector(".flag")
const colorsOfNum = [
  "blue",
  "green",
  "red",
  "rgb(10, 31, 154)",
  "brown",
  "rgb(48,213,200)",
  "black",
  "white",
]

let matrix = []
let fieldSize
let numberOfBombs
let flagsCount = 0
let gameOver = false
let cells

function createMatrix(fieldSize) {
  matrix = Array.from(
    { length: fieldSize },
    (el) => (el = Array.from({ length: fieldSize }, (i) => (i = 0)))
  )
}

function addBombsToMatrix(fieldSize) {
  const numberOfBombs = Math.round(fieldSize ** 2 / 4)

  const bombPositionsSet = new Set()
  for (let i = 0; numberOfBombs > bombPositionsSet.size; i++) {
    bombPositionsSet.add(giveRandomNumber(fieldSize ** 2))
  }
  const bombPositionsArr = Array.from(bombPositionsSet).toSorted((a, b) => {
    return a - b
  })

  for (let i = 0; i < fieldSize; i++) {
    for (let j = 0; j < fieldSize; j++) {
      if (bombPositionsArr.includes(fieldSize * i + j)) {
        matrix[i][j] = 1
      }
    }
  }
}

function createGameMatrix(matrix, fieldSize) {
  let dx = [-1, 0, 1, -1, 1, -1, 0, 1]
  let dy = [-1, -1, -1, 0, 0, 1, 1, 1]

  let gameMatrix = Array.from({ length: fieldSize }, () =>
    Array(fieldSize).fill(0)
  )

  for (let i = 0; i < fieldSize; i++) {
    for (let j = 0; j < fieldSize; j++) {
      if (matrix[i][j] == 1) {
        gameMatrix[i][j] = -1
        continue
      }
      for (let k = 0; k < 8; k++) {
        let ni = i + dx[k]
        let nj = j + dy[k]
        if (
          ni >= 0 &&
          ni < fieldSize &&
          nj >= 0 &&
          nj < fieldSize &&
          matrix[ni][nj] == 1
        ) {
          gameMatrix[i][j]++
        }
      }
    }
  }
  return gameMatrix
}

function initializeVisited(fieldSize) {
  let visited = Array.from({ length: fieldSize }, () =>
    Array(fieldSize).fill(false)
  )
  return visited
}

function openZeros(matrix, x, y, visited) {
  let dx = [-1, 0, 1, -1, 1, -1, 0, 1]
  let dy = [-1, -1, -1, 0, 0, 1, 1, 1]

  visited[x][y] = true

  for (let i = 0; i < 8; i++) {
    let nx = x + dx[i]
    let ny = y + dy[i]

    if (
      nx >= 0 &&
      nx < matrix.length &&
      ny >= 0 &&
      ny < matrix[0].length &&
      !visited[nx][ny]
    ) {
      if (matrix[nx][ny] === 0) {
        openZeros(matrix, nx, ny, visited)
      } else if (matrix[nx][ny] > 0) {
        visited[nx][ny] = true
      }
    }
  }
}

function giveRandomNumber(endPosition) {
  return Math.floor(Math.random() * endPosition)
}
function updateFlags(flagsCount, numberOfBombs) {
  flagDiv.innerHTML = `🚩 ${numberOfBombs - flagsCount}`
}
function render(fieldSize) {
  flagDiv.innerHTML = `🚩 ${numberOfBombs - flagsCount}`

  field.innerHTML = ""
  createMatrix(fieldSize)
  addBombsToMatrix(fieldSize)

  for (let i = 0; i < fieldSize ** 2; i++) {
    field.innerHTML += `<div class='cell'></div>`
  }
  field.style.gridTemplateColumns = `repeat(${fieldSize}, 1fr)`

  cells = document.querySelectorAll(".cell")
  document.querySelectorAll(".cell").forEach((cell) => {
    cell.style.width = `calc(1.2*((25vw - (${fieldSize} + 1)*1vw) / ${fieldSize}))`
    cell.style.height = `calc(1.2*((25vw - (${fieldSize} + 1)*1vw) / ${fieldSize}))`
  })
}

function leftClick(element, index) {
  if (gameOver) {
    body.style.backgroundColor = "red"
    return
  }
  if (checkWin()) {
    //showWinMessage()
    return
  }

  let x = Math.floor(index / fieldSize)
  let y = index % fieldSize
  if (gameMatrix[x][y] === 0 && !visited[x][y]) {
    openZeros(gameMatrix, x, y, visited)
  }
  visited[x][y] = true
  console.log(visited)
  console.log(checkWin())

  element.style.backgroundColor = "rgb(82, 80, 80)"
  for (let i = 0; i < visited.length; i++) {
    for (let j = 0; j < visited[i].length; j++) {
      if (visited[i][j] == true) {
        cells[i * fieldSize + j].style.backgroundColor = "rgb(82, 80, 80)"
      }
      if (
        gameMatrix[i][j] !== 0 &&
        visited[i][j] == true &&
        cells[i * fieldSize + j].innerHTML === ""
      ) {
        cells[i * fieldSize + j].innerHTML += `<p>${gameMatrix[i][j]}</p>`
        colorsOfNum.forEach((color, indexOfColor) => {
          if (gameMatrix[i][j] - 1 == indexOfColor) {
            cells[
              i * fieldSize + j
            ].style.color = `${colorsOfNum[indexOfColor]}`
          }
        })
      }
      // blow up segment
      if (gameMatrix[i][j] == -1 && visited[i][j] == true) {
        for (let l = 0; l < fieldSize; l++) {
          for (let k = 0; k < fieldSize; k++) {
            if (gameMatrix[l][k] == -1) {
              gameOver = true
              cells[l * fieldSize + k].innerHTML = "<p>💣</p>"
              cells[l * fieldSize + k].style.backgroundColor = "rgb(82, 80, 80)"
            }
          }
        }
      }
    }
  }
}

function checkWin() {
  for (let i = 0; i < fieldSize; i++) {
    for (let j = 0; j < fieldSize; j++) {
      if (gameMatrix[i][j] === -1 && !cells[i * fieldSize + j].flagVisible) {
        return false
      }
      if (gameMatrix[i][j] !== -1 && !visited[i][j]) {
        return false
      }
    }
  }
  return true
}

function rightClick(event) {
  event.preventDefault()
  if (gameOver) {
    return
  }
  if (checkWin()) {
    //showWinMessage()
    return
  }
  if (!this.flagVisible) {
    if (flagsCount < numberOfBombs) {
      this.innerHTML = "<p>🚩</p>"
      this.flagVisible = true
      flagsCount++
      console.log(flagsCount)
    }
  } else {
    this.innerHTML = ""
    this.flagVisible = false
    flagsCount--
    console.log(flagsCount)
  }
  updateFlags(flagsCount, numberOfBombs)
}

function start() {
  fieldSize = +input.value
  numberOfBombs = Math.round(fieldSize ** 2 / 4)

  render(fieldSize)
  visited = initializeVisited(fieldSize)
  gameMatrix = createGameMatrix(matrix, fieldSize)
  console.log(gameMatrix)

  cells.forEach((element, index) => {
    element.addEventListener("click", () => leftClick(element, index))
  })

  cells.forEach((cell) => {
    cell.flagVisible = false
    cell.addEventListener("contextmenu", rightClick)
  })
  input.disabled = true
  set.disabled = true

  set.removeEventListener("click", start)
}
set.addEventListener("click", start)
