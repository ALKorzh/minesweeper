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

function createBomb(FIELD_SIZE) {
  const NUMBER_OF_BOMBS = Math.round(FIELD_SIZE / 4)

  const bombPositions = new Set()
  for (let i = 0; NUMBER_OF_BOMBS > bombPositions.size; i++) {
    bombPositions.add(giveRandomNumber(FIELD_SIZE ** 2))
  }
  return Array.from(bombPositions).toSorted((a, b) => {
    return a - b
  })
}

function giveRandomNumber(endPosition) {
  return Math.floor(Math.random() * endPosition)
}

function render(FIELD_SIZE) {
  for (let i = 0; i < FIELD_SIZE ** 2; i++) {
    field.innerHTML += `<div class='cell'></div>`
  }
  field.style.gridTemplateColumns = `repeat(${FIELD_SIZE}, 1fr)`
  const cell = document.querySelectorAll(".cell").forEach((cell) => {
    cell.style.width = `calc(2*((25vw - (${FIELD_SIZE} + 1)*1vw) / ${FIELD_SIZE}))`
    cell.style.height = `calc(2*((25vw - (${FIELD_SIZE} + 1)*1vw) / ${FIELD_SIZE}))`
  })
}
render(10)
