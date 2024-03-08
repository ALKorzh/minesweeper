const FIELD_SIZE = 6
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

function initializeVisited(FIELD_SIZE) {
  let visited = Array.from({ length: FIELD_SIZE }, () =>
    Array(FIELD_SIZE).fill(false)
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

function openCell() {}

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

  document.querySelectorAll(".cell").forEach((cell) => {
    cell.style.width = `calc(1.2*((25vw - (${FIELD_SIZE} + 1)*1vw) / ${FIELD_SIZE}))`
    cell.style.height = `calc(1.2*((25vw - (${FIELD_SIZE} + 1)*1vw) / ${FIELD_SIZE}))`
  })
}
render(FIELD_SIZE)

let visited = initializeVisited(FIELD_SIZE)
let gameMatrix = createGameMatrix(matrix, FIELD_SIZE)
console.log(gameMatrix)

const cells = document.querySelectorAll(".cell")
cells.forEach((element, index) => {
  element.addEventListener("click", () => {
    let x = Math.floor(index / FIELD_SIZE)
    let y = index % FIELD_SIZE
    if (gameMatrix[x][y] === 0 && !visited[x][y]) {
      openZeros(gameMatrix, x, y, visited)
    }
    visited[x][y] = true
    console.log(visited)

    element.style.backgroundColor = "rgb(82, 80, 80)"
    for (let i = 0; i < visited.length; i++) {
      for (let j = 0; j < visited[i].length; j++) {
        if (visited[i][j] == true) {
          cells[i * FIELD_SIZE + j].style.backgroundColor = "rgb(82, 80, 80)"
        }
        if (
          gameMatrix[i][j] !== 0 &&
          visited[i][j] == true &&
          cells[i * FIELD_SIZE + j].innerHTML === ""
        ) {
          cells[i * FIELD_SIZE + j].innerHTML += `<p>${gameMatrix[i][j]}</p>`
        }
        // blow up segment
        if (gameMatrix[i][j] == -1 && visited[i][j] == true) {
          for (let l = 0; l < FIELD_SIZE; l++) {
            for (let k = 0; k < FIELD_SIZE; k++) {
              if (gameMatrix[l][k] == -1) {
                cells[l * FIELD_SIZE + k].innerHTML = "<p>&#128163;</p>"
              }
            }
          }
        }
      }
    }
  })
})
