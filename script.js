const FIELD_SIZE = +document.querySelector(".input-size")
const restart = document.querySelector(".restart-button")
const start = document.querySelector(".start-button")
const field = document.querySelector(".field")

let matrix = []

function createMatrix(FIELD_SIZE) {
  matrix = Array.from(
    { length: FIELD_SIZE },
    (el) => (el = Array.from({ length: FIELD_SIZE }, (i) => (i = 0)))
  )
}

function addBombsToMatrix(FIELD_SIZE) {
  const NUMBER_OF_BOMBS = Math.round(FIELD_SIZE ** 2 / 4)

  const bombPositionsSet = new Set()
  for (let i = 0; NUMBER_OF_BOMBS > bombPositionsSet.size; i++) {
    bombPositionsSet.add(giveRandomNumber(FIELD_SIZE ** 2))
  }
  const bombPositionsArr = Array.from(bombPositionsSet).toSorted((a, b) => {
    return a - b
  })
  console.log(bombPositionsArr)

  for (let i = 0; i < FIELD_SIZE; i++) {
    for (let j = 0; j < FIELD_SIZE; j++) {
      if (bombPositionsArr.includes(FIELD_SIZE * i + j)) {
        matrix[i][j] = 1
      }
    }
  }
}

function createGameMatrix(matrix, FIELD_SIZE) {
  let dx = [-1, 0, 1, -1, 1, -1, 0, 1]
  let dy = [-1, -1, -1, 0, 0, 1, 1, 1]

  let gameMatrix = Array.from({ length: FIELD_SIZE }, () =>
    Array(FIELD_SIZE).fill(0)
  )

  for (let i = 0; i < FIELD_SIZE; i++) {
    for (let j = 0; j < FIELD_SIZE; j++) {
      if (matrix[i][j] == 1) {
        gameMatrix[i][j] = -1
        continue
      }
      for (let k = 0; k < 8; k++) {
        let ni = i + dx[k]
        let nj = j + dy[k]
        if (
          ni >= 0 &&
          ni < FIELD_SIZE &&
          nj >= 0 &&
          nj < FIELD_SIZE &&
          matrix[ni][nj] == 1
        ) {
          gameMatrix[i][j]++
        }
      }
    }
  }
  return gameMatrix
}

function giveRandomNumber(endPosition) {
  return Math.floor(Math.random() * endPosition)
}

function render(FIELD_SIZE) {
  createMatrix(FIELD_SIZE)
  addBombsToMatrix(FIELD_SIZE)

  for (let i = 0; i < FIELD_SIZE ** 2; i++) {
    field.innerHTML += `<div class='cell'></div>`
  }
  field.style.gridTemplateColumns = `repeat(${FIELD_SIZE}, 1fr)`
  const cell = document.querySelectorAll(".cell").forEach((cell) => {
    cell.addEventListener("click", updateCell)

    cell.style.width = `calc(1.2*((25vw - (${FIELD_SIZE} + 1)*1vw) / ${FIELD_SIZE}))`
    cell.style.height = `calc(1.2*((25vw - (${FIELD_SIZE} + 1)*1vw) / ${FIELD_SIZE}))`
  })
}
