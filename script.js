let test
$.getJSON("io.json", function(fileData) {
    test = [...fileData]
})

function factorial(x) {
    let ans = 1
    for (let i = 1; i <= x; i++) ans *= i
    return ans
}

function lagrange(x, table_func = test) {
    let table = JSON.parse(JSON.stringify(table_func))
    let sum = 0
    for (let i = 0; i < table.length; i++) {
        let tmp = 1
        for (let j = 0; j < table.length; j++) {
            if (i == j) continue
            tmp *= (x - table[j][0])/(table[i][0] - table[j][0])
            
        }
        
        sum += tmp * table[i][1]
    }
    return sum
}


function solve_delta_table(table_func) {
    let table = JSON.parse(JSON.stringify(table_func))
    let delta_y_table = [[]]
    for (let i = 0; i < table.length; i++) {
        delta_y_table[0].push(table[i][1])   
    }

    
    for (let i = 0; i < delta_y_table[0].length - 1; i++) {
        let tmp_arr = []
        for (let j = 1; j < delta_y_table[i].length; j++) {
            tmp_arr.push(delta_y_table[i][j] - delta_y_table[i][j - 1])
        }
        delta_y_table.push(tmp_arr)
    }
    return delta_y_table
}

function newtone(x, table_func = test) {
    let table = JSON.parse(JSON.stringify(table_func))
    let h = table[1][0] - table[0][0]
    let index = findIndex(x)
    for (let i = 2; i < table.length; i++ ) {
        if (epsRound(table[i][0] - table[i - 1][0]) != h) {
            console.log(epsRound(table[i][0] - table[i - 1][0]))
            console.log("Метод Ньютона не применим")
            return
        }
    }
    
    let delta_y_table = solve_delta_table(table)
   
    let t = (x - table[index][0])/h
    let ans = 0
    if (index <= table.length / 2 ) {
        for (let i = 0; i < delta_y_table.length - index; i++) {
            let multiply = 1
            for (let j = 0; j < i; j++) {
                multiply *= t - j
            }
            ans += delta_y_table[i][index] * multiply / factorial(i)
 
        }
    } else {
        let limit = index

        for (let i = 0; i < limit; i++) {
            let multiply = 1
            for (let j = 0; j < i; j++) {
                multiply *= t - j
            }
            ans += delta_y_table[i][index] * multiply / factorial(i)
            index -= 1
        }
    }

    return ans
}

function findIndex(x, table = test) {
    let left = 0 
    let right = table.length - 1

    while (right - left > 1) {
        let middle = Math.trunc((right + left) / 2)
        if (x < table[middle][0]) {
            right = middle
        } else {
            left = middle
        }
    }

    if (Math.abs(table[left][0] - x) > Math.abs(table[right][0] - x)) {
        return right
    } 
    return left
}

document.getElementById("sub").addEventListener("click" , (e) => {
    e.preventDefault()
    startAll(test)

})

function startAll(test) {
    console.table(solve_delta_table(test))
    render_graph(newtone, "black", 0.01, -10, 10)

    test.forEach((e) => drawDot(e[0],e[1]))


}








const canvas = document.querySelector("canvas")
const WIDTH = 600
const HEIGHT = 600
const DPI_WIDTH = WIDTH * 2
const DPI_HEIGHT = HEIGHT * 2
const MULTIPLY = 50

function graph() {
    const ctx = canvas.getContext("2d")
    canvas.style.width = WIDTH + "px"
    canvas.style.height = HEIGHT + "px"
    canvas.width = DPI_WIDTH
    canvas.height = DPI_HEIGHT
    render_coordinates()
}
graph()


function render_graph(func, color, step = 0.2, x1 = -50, x2 = 50) {
    const ctx = canvas.getContext("2d")
    ctx.beginPath()
    ctx.strokeStyle = color
    ctx.lineWidth = 3
    for (let x = x1; x < x2; x+=step) {
        ctx.lineTo(x * MULTIPLY + DPI_WIDTH/2, DPI_HEIGHT/2 - (func(x) * MULTIPLY))
    }
    ctx.stroke()
    ctx.closePath()
}

function drawDot(x, y, color = "blue", size = 5) {
    let ctx = canvas.getContext("2d")
    ctx.beginPath()
    ctx.strokeStyle = color
    ctx.arc(x * MULTIPLY + DPI_WIDTH / 2, DPI_HEIGHT / 2 - y * MULTIPLY, size, 0 * Math.PI, 2 * Math.PI)
    ctx.stroke()
    ctx.closePath()
}

function render_coordinates() {
    const ctx = canvas.getContext("2d")
    ctx.moveTo(DPI_WIDTH, DPI_HEIGHT/2)
    ctx.lineTo(DPI_WIDTH - 30, DPI_HEIGHT/2 - 10)
    ctx.moveTo(DPI_WIDTH, DPI_HEIGHT/2)
    ctx.lineTo(DPI_WIDTH - 30, DPI_HEIGHT/2 + 10)
    ctx.moveTo(DPI_WIDTH/2, 0)
    ctx.lineTo(DPI_WIDTH/2 + 10, 30)
    ctx.moveTo(DPI_WIDTH/2, 0)
    ctx.lineTo(DPI_WIDTH/2 - 10, 30)
    ctx.moveTo(DPI_WIDTH/2, 0)
    ctx.lineTo(DPI_WIDTH/2, DPI_HEIGHT)
    ctx.moveTo(0, DPI_HEIGHT/2)
    ctx.lineTo(DPI_WIDTH, DPI_HEIGHT/2)
    
    ctx.font = " bold 15pt Courier"
    for (let i = 50; i < DPI_HEIGHT; i += 50) {
        ctx.moveTo(DPI_WIDTH/2 - 12, i)
        ctx.lineTo(DPI_WIDTH/2 + 12, i)
        ctx.fillText(epsRound((50*12/MULTIPLY) - i/MULTIPLY), DPI_WIDTH/2, i)
    }

    for (let i = 50; i < DPI_WIDTH; i += 50) {
        ctx.moveTo(i, DPI_HEIGHT/2 - 12)
        ctx.lineTo(i, DPI_HEIGHT/2 + 12)
        ctx.fillText(-Math.round((50*12/MULTIPLY) - i/MULTIPLY), i , DPI_HEIGHT/2)
    }
    ctx.stroke()
}

function epsRound(val) {
    let multiplier = 1 / 0.001
    return Math.round(val * multiplier) / multiplier
}
