'use strict'

const PACMAN = '😀'
var gPacman
var gGhostEaten = []

function createPacman(board) {
    gPacman = {
        location: {
            i: 2,
            j: 2
        },
        isSuper: false
    }
    board[gPacman.location.i][gPacman.location.j] = PACMAN
}

function onMovePacman(ev) {
    if (!gGame.isOn) return
    //use getNextLocation(), nextCell
    const nextLocation = getNextLocation(ev.key)
    const nextCell = gBoard[nextLocation.i][nextLocation.j]

    if (nextCell === WALL) return
    if (nextCell === GHOST) {
        if (gPacman.isSuper) {
            eatGhostSound.play()
            var eatenGhost = deleteGhosts(nextLocation)
            console.log(gGhostEaten);
            gGhostEaten.push(eatenGhost[0])
            gfoodCount++
            updateScore(1)
            console.log(gGhosts);
        } else {
            gameOver()
            return
        }
    }

    if (nextCell === FOOD) {
        updateScore(1)
        gfoodCount++

    }
    if (nextCell === SUPER_FOOD) {
        if (gPacman.isSuper) return
        updateScore(1)
        gfoodCount++
        SuperMode()
    }
    if (nextCell === CHERRY) {
        updateScore(10)
    }
    // moving from current location:
    // update the model
    gBoard[gPacman.location.i][gPacman.location.j] = EMPTY
    var isVictory = checkIsVictory()
    if (isVictory === true) {
        gameOver()
        victoryDisplay()
    }
    // update the DOM
    renderCell(gPacman.location, EMPTY)

    // update the model
    gPacman.location = nextLocation
    gBoard[nextLocation.i][nextLocation.j] = PACMAN
    // update the DOM
    renderCell(nextLocation, PACMAN)
}

function deleteGhosts(location) {
    for (var i = 0; i < gGhosts.length; i++) {
        var ghost = gGhosts[i]
        if (ghost.location.i === location.i && ghost.location.j === location.j) {
            return gGhosts.splice(i, 1)
        }
    }
}

function getNextLocation(eventKeyboard) {
    const nextLocation = {
        i: gPacman.location.i,
        j: gPacman.location.j
    }
    switch (eventKeyboard) {
        case 'ArrowUp':
            nextLocation.i--
            break;
        case 'ArrowRight':
            nextLocation.j++
            break;
        case 'ArrowDown':
            nextLocation.i++
            break;
        case 'ArrowLeft':
            nextLocation.j--
            break;
    }
    return nextLocation
}

function SuperMode() {
    gPacman.isSuper = true
    var elGhost = document.querySelectorAll('td span')
    setTimeout(() => {
        gPacman.isSuper = false
        for (var i = 0; i < gGhosts.length; i++) {
            elGhost[i].style.backgroundColor = elGhost.color
        }
        gGhosts = [...gGhosts, ...gGhostEaten]
        gGhostEaten = []
    }, 5000)
}