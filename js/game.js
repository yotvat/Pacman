'use strict'

const WALL = '🕹️'
const FOOD = '●'
const EMPTY = ' '
const SUPER_FOOD = '🌮'
const CHERRY = '🍒'
var eatGhostSound = new Audio('sound/eatGhost.wav')
var deadSound = new Audio('sound/dead.wav')

// Model
const gGame = {
    score: 0,
    isOn: false
}
var gBoard
const gFoodTotal = 60
var gfoodCount = 0
var gCherryInterval

function onInit() {
    closeModal()
    updateScore(0)
    gfoodCount = 0
    gBoard = buildBoard()
    createGhosts(gBoard)
    createPacman(gBoard)
    renderBoard(gBoard)
    gCherryInterval = setInterval(addCherry,15000)
    gGame.isOn = true
}

function buildBoard() {
    const size = 10
    const board = []

    for (var i = 0; i < size; i++) {
        board.push([])

        for (var j = 0; j < size; j++) {
            board[i][j] = FOOD

            if (i === 0 || i === size - 1 ||
                j === 0 || j === size - 1 ||
                (j === 3 && i > 4 && i < size - 2)) {
                board[i][j] = WALL
            }
        }
    }
    board[board.length - 2][1] = board[board.length - 2][board.length - 2] = board[1][1] = board[1][board.length - 2] = SUPER_FOOD
    return board
}

function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {

            const cell = board[i][j]
            const className = `cell cell-${i}-${j}`

            strHTML += `<td class="${className}">${cell}</td>`
        }
        strHTML += '</tr>'
    }
    const elContainer = document.querySelector('.board')
    elContainer.innerHTML = strHTML
}

function renderCell(location, value) {
    // location is an object - { i: 2, j: 7 }
    // Select the elCell and set the value
    const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
    elCell.innerHTML = value
}

function updateScore(diff) {
//update model and dom
    if (!diff) {
        gGame.score = 0
    } else {
        gGame.score += diff
    }
    document.querySelector('span.score').innerText = gGame.score
}

function gameOver() {
    deadSound.play()
    console.log('Game Over')
    openModal()
    clearInterval(gIntervalGhosts)
    renderCell(gPacman.location, '🪦')
    gGame.isOn = false
}

function checkIsVictory() {
    if (gfoodCount === gFoodTotal) return true
    else return false
}

function victoryDisplay() {
    var elVictory = document.querySelector('.victoriuos')
    elVictory.classList.toggle('hide')
}

function openModal() {
    const elModal = document.querySelector('.modal')
    elModal.style.display = 'block'
}

function closeModal() {
    const elModal = document.querySelector('.modal')
    elModal.style.display = 'none'
}

function addCherry() {
    var options = getEmptyOptions(gBoard)
    var randNumIdx = getRandomIntInclusive(0, options.length - 1)
    var randCell = options[randNumIdx]
    //model
    gBoard[randCell.i][randCell.j] = CHERRY

    //dom
    renderCell(randCell, CHERRY)
    renderBoard(gBoard)
}


