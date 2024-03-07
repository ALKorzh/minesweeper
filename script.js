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

function giveRandomNumber(endPosition) {
  return Math.floor(Math.random() * endPosition)
}
function createBomb(FIELD_SIZE) {
  const NUMBER_OF_BOMBS = Math.round(FIELD_SIZE / 4)

  const bombPositions = new Set()
  for (let i = 0; NUMBER_OF_BOMBS > bombPositions.size; i++) {
    console.log(i)
    bombPositions.add(giveRandomNumber(FIELD_SIZE ** 2))
  }
  return bombPositions
}

console.log(createBomb(6))
