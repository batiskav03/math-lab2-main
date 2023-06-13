let test
$.getJSON("io.json", function(fileData) {
    test = [...fileData]
})
let diff_interval = [0,1]
let h = 0.1
let eps = 0.01
let x0 = diff_interval[0]
let y0 = 1
let main_func = f2

function factorial(x) {
    let ans = 1
    for (let i = 1; i <= x; i++) ans *= i
    return ans
}

function f1(x, y) {
    let diff = (x, y) => y + Math.sin(x)
    let real = (x) => {
        let tempResult = -Math.sin(diff_interval[0]) / 2 - Math.cos(diff_interval[0]) / 2
        let mult = Math.exp(diff_interval[0])
        let c = (y0 - tempResult) / mult

        return -Math.sin(x) / 2 - Math.cos(x) / 2 + c * Math.exp(x)
    }
    return [diff, real]
}

function f2(x,y) {
    function c(x) {
        let c = (y0 - (Math.pow(diff_interval[0], 2) / 2 - diff_interval[0] / 2 + 1 / 4)) / Math.exp(-2 * diff_interval[0])
        return c / Math.exp(2 * x)  + Math.pow(x, 2) / 2 - x / 2 + 1 / 4
    
    }
    function func(x, y) {
        return Math.pow(x, 2) - 2 * y
    }
        
    return [func, c]
}


function f3(x, y) {
    let diff = (x, y) => x * y / 2
    let real = (x) => {
        let c = y0 / Math.exp(Math.pow(diff_interval[0], 2) / 4)
        return c * Math.exp(Math.pow(x, 2) / 4)
    }
    return [diff, real]
}

function modificated_ayler(func, x0, y0) {
    let y_0 = y0
    let tmp_h = h
    ans_table = [[x0,y0]]
    for (let x = diff_interval[0] + tmp_h ; x <= diff_interval[1]; x+=tmp_h) {
        y_0 = y_0 + (tmp_h/2) * (func(x, y_0) + func(x+tmp_h, y_0 + tmp_h * func(x, y_0)))
        ans_table.push([x, y_0])
    }
    


    return ans_table
}

function runge_kutta_cycle(func, x0, y0, height = h) {
    let k1 = height * func(x0, y0)
    let k2 = height * func(x0 + height/2, y0 + k1/2)
    let k3 = height * func(x0 + height/2, y0 + k2/2)
    let k4 = height * func(x0 + height, y0 + k3)
    return y0 + (1/6) *(k1 + 2*k2 + 2*k3 + k4)
    
}


function runge_kutta(func, x0, y0) {
    let y_0 = y0
    let tmp_h = h
    let runge_rule = false 
    let ans_table = [[x0,y_0]]
   
    // while (!runge_rule) {
    //     y_0 = y0
    //     ans_table = [[x0,y_0]]
        for (let x = x0 + tmp_h ; x <= diff_interval[1]; x+=tmp_h) {
            let k1 = tmp_h * func(x, y_0)
            let k2 = tmp_h * func(x + tmp_h/2, y_0 + k1/2)
            let k3 = tmp_h * func(x + tmp_h/2, y_0 + k2/2)
            let k4 = tmp_h * func(x + tmp_h, y_0 + k3)
            y_0 += (1/6) * (k1 + 2*k2 + 2*k3 + k4)
            // y_0 = runge_kutta_cycle(func, x, y_0, tmp_h)
            ans_table.push([x, y_0])
        }
    //     let func_2h = ans_table[3][1]
    //     tmp_h /= 2
    //     y_0 = y0
    //     let tmp_table = [[x0,y_0]]
    //     for (let x = x0 + tmp_h ; x <= diff_interval[1]; x+=tmp_h) {
    //         let k1 = tmp_h * func(x0, y_0)
    //         let k2 = tmp_h * func(x0 + tmp_h/2, y0 + k1/2)
    //         let k3 = tmp_h * func(x0 + tmp_h/2, y0 + k2/2)
    //         let k4 = tmp_h * func(x0 + tmp_h, y0 + k3)
    //         y_0 += (1/6) * (k1 + 2*k2 + 2*k3 + k4)
    //         // y_0 = runge_kutta_cycle(func, x, y_0, tmp_h)
    //         tmp_table.push([x, y_0])
    //     }
    //     let func_h = tmp_table[6][1]

    //     if ((func_2h - func_h)/(Math.pow(2,2) - 1) <= eps) {
    //         runge_rule = true
    //     } 
    // }
    
    
    
    return ans_table
}

function calculate_deltas(func, ans_table, height = h) {
    let tmp_x0 = x0
    if (ans_table.length < 2) {
        let y0 = ans_table[0][1]
        for (let i = 0; i < 3; i++) {
            tmp_x0+=height
            let k1 = height * func(tmp_x0, y0)
            let k2 = height * func(tmp_x0 + height/2, y0 + k1/2)
            let k3 = height * func(tmp_x0 + height/2, y0 + k2/2)
            let k4 = height * func(tmp_x0 + height, y0 + k3)
            y0 += (1/6) * (k1 + 2*k2 + 2*k3 + k4)
            // y0 = runge_kutta_cycle(func, tmp_x0, y0, height)
            ans_table.push([tmp_x0,y0])
            
        }
    }

    let deltas = solve_delta_table(ans_table)

    
    return [deltas, ans_table]
}

function adams(func, real_func, x0, y0) {
    let tmp_h = h
    let ans_table
    let rule = false
    while (!rule) {
        let result = calculate_deltas(func, [[x0, y0]], tmp_h)
        let deltas = result[0]
        ans_table = runge_kutta(func, x0, y0).slice(0,4)

        for (let x = x0 + 4*tmp_h; x <= diff_interval[1]; x+=tmp_h) {
            let y_prev = ans_table[ans_table.length - 1][1]
            let yi = y_prev + tmp_h * func(x, y_prev) + Math.pow(tmp_h, 2) / 2 * deltas[1][0] +
                        5 / 12 * Math.pow(tmp_h, 3) * deltas[2][0] + 3 / 8 * Math.pow(tmp_h, 4) * deltas[3][0]
            ans_table.push([x, yi])
            deltas = solve_delta_table(ans_table.slice(-4))
            if (Math.abs(real_func(x) - yi) < eps) {
                rule = true
            }
        }

        tmp_h /= 2
        
    }
    


    return ans_table
    
    
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



document.getElementById("sub").addEventListener("click" , (e) => {
    e.preventDefault()
    startAll(main_func)

})
document.getElementById("accuracy").addEventListener("change", (e) => {
    
    eps = parseFloat(e.target.value)
    console.log(eps)
})
document.getElementById("1_func").addEventListener("click", (e) => main_func = f1)
document.getElementById("2_func").addEventListener("click", (e) => main_func = f2)
document.getElementById("3_func").addEventListener("click", (e) => main_func = f3)
document.getElementById("a0").addEventListener("change", (e) => {
    x0 = parseInt(e.target.value)
    diff_interval[0] = x0
})
document.getElementById("y0").addEventListener("change", (e) => y0 = parseFloat(e.target.value))
document.getElementById("b0").addEventListener("change", (e) => diff_interval[1] = parseInt(e.target.value))
document.getElementById("h").addEventListener("change", (e) => h = parseFloat(e.target.value))

function startAll(main_func) {
    graph()
    console.clear()
    console.warn("Adams: ")
    console.table(adams(main_func()[0], main_func()[1], x0, y0))
    console.warn("Modificated Ayler: ")
    console.table(modificated_ayler(main_func()[0], x0, y0))
    console.warn("Runge-Kutta:")
    console.table(runge_kutta(main_func()[0], x0, y0))
    render_graph_by_table(runge_kutta(main_func()[0], x0, y0), "blue")
    render_graph_by_table(adams(main_func()[0], main_func()[1], x0, y0))
    render_graph_by_table(modificated_ayler(main_func()[0], x0, y0), "green")
    render_graph(main_func()[1], "black", 0.1 , -10, 10)
}








const canvas = document.querySelector("canvas")
const WIDTH = 600
const HEIGHT = 600
const DPI_WIDTH = WIDTH * 2
const DPI_HEIGHT = HEIGHT * 2
const MULTIPLY = 200

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
    ctx.lineWidth = 2
    for (let x = x1; x < x2; x+=step) {
        if (Math.abs(func(x)) > 1000000) continue
        ctx.lineTo(x * MULTIPLY + DPI_WIDTH/2, DPI_HEIGHT/2 - (func(x) * MULTIPLY))
    }
    ctx.stroke()
    ctx.closePath()
}

function render_graph_by_table(dots, color = "red") {
    const ctx = canvas.getContext("2d")
    ctx.beginPath()
    ctx.strokeStyle = color
    ctx.lineWidth = 2
    dots.forEach((dot) => ctx.lineTo(dot[0] * MULTIPLY + DPI_WIDTH / 2, DPI_HEIGHT / 2 - (dot[1] * MULTIPLY) ))
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
    
    ctx.font = " bold 10pt Courier"
    for (let i = 50; i < DPI_HEIGHT; i += 50) {
        ctx.moveTo(DPI_WIDTH/2 - 12, i)
        ctx.lineTo(DPI_WIDTH/2 + 12, i)
        ctx.fillText(epsRound((50*12/MULTIPLY) - i/MULTIPLY), DPI_WIDTH/2, i)
    }

    for (let i = 50; i < DPI_WIDTH; i += 50) {
        ctx.moveTo(i, DPI_HEIGHT/2 - 12)
        ctx.lineTo(i, DPI_HEIGHT/2 + 12)
        ctx.fillText(-epsRound((50*12/MULTIPLY) - i/MULTIPLY), i , DPI_HEIGHT/2)
    }
    ctx.stroke()
}

function epsRound(val) {
    let multiplier = 1 / 0.001
    return Math.round(val * multiplier) / multiplier
}
