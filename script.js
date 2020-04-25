const canvas = document.querySelector('#mycanvas')
const ctx = canvas.getContext('2d')

let ch = 800
let cw = 800
let gridn = 50

canvas.width = cw
canvas.height = ch

let dx = cw / gridn
let dy = ch / gridn

function makeGrid(size){
    let grid = []
    for (let n = 0; n < size; n++) {
        let row = []
        for (let m = 0; m < size; m++) {
            row.push(false)
        }
        grid.push(row)
    }
    return grid
}


function drawGrid(grid){
    ctx.fillStyle = 'white'
    ctx.fillRect(0,0,cw,ch)
    
    grid.forEach((row, x)=>{
        row.forEach((cell, y)=>{
            if (cell) {
                let c = countAround(grid,x,y)
                if (c === 0) ctx.fillStyle = 'red'
                if (c === 1) ctx.fillStyle = 'orange'
                if (c === 2) ctx.fillStyle = 'green'
                if (c === 3) ctx.fillStyle = 'blue'
                if (c === 4) ctx.fillStyle = 'purple'
                if (c > 4) ctx.fillStyle = 'black'
                
                ctx.fillRect(x * dx, y * dy, dx - 2, dy - 2)
            } else {
                ctx.fillStyle = 'rgb(230,230,230)'
                ctx.fillRect(x * dx, y * dy, dx - 2, dy - 2)
            }
        })
    })
}

function countAround(grid, x, y){
    let count = 0
    if (x > 0 && grid[x - 1][y]) count++
    if (x < gridn -1 && grid[x + 1][y]) count++
    if (y > 0 && grid[x][y - 1]) count++
    if (y < gridn - 1 && grid[x][y + 1]) count++

    if (x > 0 && grid[x - 1][y - 1]) count++
    if (x > 0 && grid[x - 1][y + 1])count++
    if (x < gridn - 1 && grid[x + 1][y - 1])count++
    if (x < gridn - 1 && grid[x + 1][y + 1])count++

    return count
}

function unknown(grid) {
    let nextGrid = grid.map((row,x)=>{
        row = grid[x].map((cell,y)=>{
            let count = countAround(grid, x, y)
            if (cell){
                //if a live cell has 2 or 3 neighbours
                if (count < 2 || count > 3) return false
                else return true
            } else {
                //if a dead cell has 3 neighbours
                if (count === 3){
                    return true
                } else return false
            }
        })
        return row
    })
    return nextGrid
}

let lifeGrid = makeGrid(gridn)


drawGrid(lifeGrid)
let play = false
let $btn = document.querySelector('button')
let game
$btn.addEventListener('click', ()=>{
    if (!play){
        $btn.textContent = 'PAUSE'
        play = true
        game = setInterval(() => {
            lifeGrid = unknown(lifeGrid)
            drawGrid(lifeGrid)
        }, 120);
    } else {
        $btn.textContent = 'PLAY'
        play = false
        clearInterval(game)
    }
})



canvas.addEventListener('click',(e)=>{
    let posX = Math.floor(e.offsetX / dx)
    let posY = Math.floor(e.offsetY / dy)

    if (lifeGrid[posX][posY]) lifeGrid[posX][posY] = false
    else lifeGrid[posX][posY] = true

    drawGrid(lifeGrid)
})