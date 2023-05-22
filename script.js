// Вычислительная реализация
// 1 - Метод половинного деления
// 2 - Метод хорд
// 5 - Метод простых итераций 
// Программная реализация задачи
// нелинейное уравнение
// 1 - Метод половинного деления
// 4 - Метод секущих
// 5 - Метод простой итераций 
// система нелинейных уравнений
// 7 - Метод простой итерации

let ACCURACY = 0.01
const FIRST_N = 4
let interval_ogr = [1,2]
let table = [[1.2, 7.4], [2.9, 9.5], [4.1, 11.1], [5.5, 12.9], [6.7, 14.6], [7.8, 17.3], [9.2, 18.2], [10.3, 20.7]] // [x,y]
let table_1 = [[1.1 , 3.5], [ 2.3, 4.1], [3.7, 5.2], [4.5, 6.9], [5.4, 8.3], [6.8, 14.8], [7.5, 21.2]] // kv
let table_exp = [[1, 2.1], [2, 6.2], [3, 13.3], [4, 24.6], [5, 117.5]]
let test;
function middle_square_linear(table_func) {
    let table = JSON.parse(JSON.stringify(table_func));
    let SX = 0
    let SXX = 0
    let SY = 0
    let SXY = 0
    n = table.length
    for (let i = 0; i < n; i++) {
        SX += table[i][0]
        SXX += table[i][0] * table[i][0]
        SY += table[i][1] 
        SXY += table[i][0] * table[i][1]
    }
    let a = (SXY * n - SX * SY) / (SXX * n - SX * SX)
    let b = (SXX * SY - SX * SXY) / (SXX * n - SX * SX)
    let eps = []
    let S = 0

    for (let i = 0; i < n; i++) {
        let f_i = a*table[i][0] + b
        let eps_i = f_i - table[i][1]
        eps.push(f_i - table[i][1])
        S += eps_i * eps_i
        table[i].push(f_i, eps_i)  
    }
    let dev = Math.sqrt(S/n)
    console.warn("Линейная функция: fx = " + a + "*x + " + b)
    table.unshift(["x_i", "y_i", "phi(x_i)", "eps_i"])
    console.table(table)
    console.log("S = ", S, "; δ = ", dev)
    return [dev, (x) => a * x + b]
}

function middle_square_quad(table_func) {
    let table = JSON.parse(JSON.stringify(table_func));
    let SX = 0
    let SXX = 0
    let SXXX = 0
    let SXXXX = 0
    let SY = 0
    let SXY = 0
    let SXXY = 0
    n = table.length
    for (let i = 0; i < n; i++) {
        SX += table[i][0]
        SXX += table[i][0] * table[i][0]
        SY += table[i][1] 
        SXY += table[i][0] * table[i][1]
        SXXX += Math.pow(table[i][0], 3)
        SXXXX += Math.pow(table[i][0], 4)
        SXXY += Math.pow(table[i][0], 2) * table[i][1]
    }
    matrix = [[n, SX, SXX, SY], [SX, SXX, SXXX, SXY], [SXX, SXXX, SXXXX, SXXY]]
    let [a0, a1, a2] = gauss(matrix)

    let eps = []
    let S = 0
    for (let i = 0; i < n; i++) {
        let f_i = a2*table[i][0]*table[i][0] + a1*table[i][0] + a0
        let eps_i = f_i - table[i][1]
        eps.push(f_i - table[i][1])
        S += eps_i * eps_i
        table[i].push(f_i, eps_i)  
    }
    let dev = Math.sqrt(S/n)
    console.warn("Квадратная функция: fx = " + a2 + "*x^2 + " + a1 + "*x + " + a0)
    table.unshift(["x_i", "y_i", "phi(x_i)", "eps_i"])
    console.table(table)
    console.log("S = ", S, "; δ = ", dev)
    return [dev, (x) => a2*x*x + a1*x + a0]
    
}

function log_aprox(table_func) {
    let table = JSON.parse(JSON.stringify(table_func));
    let SX = 0
    let SXX = 0
    let SY = 0
    let SXY = 0
    let flag = 0
    n = table.length
    for (let i = 0; i < n; i++) {
        SX += Math.log(table[i][0])
        SXX += Math.log(table[i][0]) * Math.log(table[i][0])
        SY += table[i][1] 
        SXY += Math.log(table[i][0]) * table[i][1]
        if (table[i][0] < 0) flag = 1
    }
    if (flag) {
        console.error("Невозможна апроксимация степенной функцией")
        return
    } 

    matrix = [[SXX, SX, SXY], [SX, n, SY]]
    let [a, b] = gauss(matrix)
    let eps = []
    let S = 0
    for (let i = 0; i < n; i++) {
        let f_i = a*Math.log(table[i][0]) + b
        let eps_i = f_i - table[i][1]
        S += eps_i * eps_i
        eps.push(f_i - table[i][1])   
        table[i].push(f_i, eps_i)     
    }
    let dev = Math.sqrt(S/n)
    console.warn("Логарифмическая функция: fx = " + a + "ln(x) + " + b)
    table.unshift(["x_i", "y_i", "phi(x_i)", "eps_i"])
    console.table(table)
    console.log("S = ", S, "; δ = ", dev)

    return [dev, (x) => a*Math.log(x) + b]
}

function exp_aprox(table_func) {
    let table = JSON.parse(JSON.stringify(table_func));
    let SX = 0
    let SXX = 0
    let SY = 0
    let SXY = 0
    n = table.length
    let flag = 0
    for (let i = 0; i < n; i++) {
        SX += table[i][0]
        SXX += table[i][0] * table[i][0]
        SY += Math.log(table[i][1]) 
        SXY += table[i][0] * Math.log(table[i][1])
        if (table[i][1] < 0 || table[i][0] < 0) flag = 1
    }
    if (flag) {
        console.error("Невозможна апроксимация экспоненциальной функцией")
        return
    } 
    let a = ((SXY * n - SX * SY) / (SXX * n - SX * SX))
    let b = (SXX * SY - SX * SXY) / (SXX * n - SX * SX)
    
    let eps = []
    let S = 0
    for (let i = 0; i < n; i++) {
        let f_i = Math.exp(b)*Math.exp(a*table[i][0])
        let eps_i = f_i - table[i][1]
        table[i].push(f_i, eps_i)
        eps.push(f_i - table[i][1])
        S += eps_i * eps_i
    }
    
    
    let dev = Math.sqrt(S/n)
    console.warn("Экспоненциальная функция: fx = " + Math.exp(b) + "*e^(" + a + "*x)")
    table.unshift(["x_i", "y_i", "phi(x_i)", "eps_i"])
    console.table(table)
    console.log("S = ", S, "; δ = ", dev)
    return [dev, (x) => Math.exp(b) * Math.pow(Math.E,a)*x]
}


function power_aprox(table_func) {
    let table = JSON.parse(JSON.stringify(table_func));
    let SX = 0
    let SXX = 0
    let SY = 0
    let SXY = 0
    let flag = 0
    n = table.length
    for (let i = 0; i < n; i++) {
        SX += Math.log(table[i][0])
        SXX += Math.log(table[i][0]) * Math.log(table[i][0])
        SY += Math.log(table[i][1])
        SXY += Math.log(table[i][0]) * Math.log(table[i][1])
        if (table[i][1] < 0 || table[i][0] < 0) flag = 1
    }
    if (flag) {
        console.error("Невозможна апроксимация степенной функцией")
        return
    } 
    matrix = [[SXX, SX, SXY], [SX, n, SY]]
    let [a, b] = gauss(matrix)
    let eps = []
    let S = 0
    
    for (let i = 0; i < n; i++) {
        let f_i = Math.exp(b)*Math.pow(table[i][0], a) 
        let eps_i = f_i - table[i][1]
        eps.push(f_i - table[i][1])
        S += eps_i * eps_i
        table[i].push(f_i, eps_i) 
    }
    let dev = Math.sqrt(S/n)
    console.warn("Степенная функция: fx = "+ Math.exp(b) +"*x^" + a)
    table.unshift(["x_i", "y_i", "phi(x_i)", "eps_i"])
    console.table(table)
    console.log("S = ", S, "; δ = ", dev)
    
    return [dev, (x) => Math.exp(b)*Math.pow(x, a)]
    
    
    
}
 
function determinantTriangle( matrix) {
    let determinant = 1;
    for (let i = 0; i < matrix.length; i++) {
        determinant *= matrix[i][i];
        
    }
    return determinant;
}

function gauss(matrix) {
    for (let i = 0; i < matrix.length - 1; i++) {
        let max = i
        for (let m = i + 1; m < matrix.length; m++) {
            if (matrix[m][i] > matrix[max][i]) {
                max = m;
            }
        }
        if (max != i) {
            for (let j = 0; j <= matrix.length; j++) {
                let c = matrix[i][j];
                matrix[i][j] = matrix[max][j];
                matrix[max][j] = c;
            }
        }
        for (let k = i + 1; k < matrix.length; k++ ) {
            let multiplier = matrix[k][i] / matrix[i][i];
            for (let j = i; j <= matrix.length; j++) {
                matrix[k][j] -= multiplier * matrix[i][j];
            }
        }
        
    }

    if (!determinantTriangle(matrix)) {
        return [0]
    }
    let solutions = []
    for (let i = matrix.length - 1; i >= 0; i--) {
        let sum = 0;
        for (let j = i + 1; j < matrix.length; j++) {
            sum += matrix[i][j] * solutions[j];
        }
        solutions[i] = (matrix[i][matrix.length] - sum) / matrix[i][i];
    }
    console.log(solutions)
    return solutions
    
    
}

function cube_aprox(table_func) {
    let table = JSON.parse(JSON.stringify(table_func));
    let x_sum = 0
    let x_square = 0
    let x_cube = 0
    let x_fourth = 0
    let x_fifth = 0
    let x_sixth = 0
    let y_sum = 0
    let x_y = 0
    let x_square_y = 0
    let x_cube_y = 0
    let n = table.length
    for (let i = 0; i < n; i++) {
        x_sum += table[i][0]
        x_square += table[i][0] ** 2
        x_cube += table[i][0] ** 3
        x_fourth += table[i][0] ** 4
        x_fifth += table[i][0] ** 5
        x_sixth += table[i][0] ** 6
        y_sum += table[i][1]
        x_y += table[i][0] * table[i][1]
        x_square_y += table[i][0] ** 2 * table[i][1]
        x_cube_y += table[i][0] ** 3 * table[i][1]
    }
    matrix = [[n, x_sum, x_square, x_cube, y_sum], [x_sum, x_cube, x_fourth, x_fifth, x_y],
     [x_square, x_cube, x_fourth, x_fifth, x_square_y],
     [x_cube, x_fourth, x_fifth, x_sixth, x_cube_y]]

    let [a0, a1, a2, a3] = gauss(matrix)
    if (a0 == 0 && !a1 && !a2) {
        console.error("Апроксимация кубической функцией невозможна")
        return
    }
    let eps = []
    let S = 0
    for (let i = 0; i < n; i++) {
        let f_i = a3*table[i][0]*table[i][0]*table[i][0]  + a2*table[i][0]*table[i][0] + a1*table[i][0] + a0
        let eps_i = f_i - table[i][1]
        eps.push(f_i - table[i][1])
        S += eps_i * eps_i
        table[i].push(f_i, eps_i)  
    }
    let dev = Math.sqrt(S/n)
    console.warn("Кубическая функция: fx = "+ a3 + "*x^3 + " + a2 + "*x^2 + " + a1 + "*x + " + a0)
    table.unshift(["x_i", "y_i", "phi(x_i)", "eps_i"])
    console.table(table)
    console.log("S = ", S, "; δ = ", dev)
    return [dev, (x) => a3*x*x*x + a2*x*x + a1*x + a0]
}


// производная
function first_derivative(func, x, dx) {
    dx = dx || 0.00000001

    return (func(x + dx) - func(x))/dx
}










function startAll(test) {
    let arr = []
    arr.push(middle_square_linear(test))
    arr.push(power_aprox(test))
    arr.push(exp_aprox(test))
    arr.push(log_aprox(test))
    arr.push(middle_square_quad(test))
    arr.push(cube_aprox(table))
    arr.sort()
    let main_func = arr[0][1]
    console.warn(main_func)
    render_graph(main_func, "black")
    render_graph(arr[1][1], "red")
    render_graph(arr[2][1], "green")
    render_graph(arr[3][1], "blue")

    test.forEach((e) => drawDot(e[0],e[1]))


}


$.getJSON("io.json", function(fileData) {
    test = [...fileData]
    
})


// // ******************************************************** 

// document.getElementById("accuracy").addEventListener("change" ,(e) => {
//     ACCURACY = Number(e.target.value)
// })

// document.getElementById("a0").addEventListener("change", (e) => {
//     interval_ogr[0] = Number(e.target.value)
// })

// document.getElementById("b0").addEventListener("change", (e) => {
//     interval_ogr[1] = Number(e.target.value)
// })


document.getElementById("sub").addEventListener("click" , (e) => {
    e.preventDefault()
    startAll(test)
})


document.querySelectorAll(".func").forEach((element) => element.addEventListener("click", (e) => {
    
    switch(e.target.defaultValue) {
        case "1":
            main_F = F1
            break
        case "2":
            main_F = F2
            break
        case "3":
            main_F = F3
            break
        case "4":
            main_F = F4
            break

    }
    graph()
}))




const canvas = document.querySelector("canvas")
const WIDTH = 600
const HEIGHT = 600
const DPI_WIDTH = WIDTH * 2
const DPI_HEIGHT = HEIGHT * 2
const MULTIPLY = 40

function graph() {
    const ctx = canvas.getContext("2d")
    canvas.style.width = WIDTH + "px"
    canvas.style.height = HEIGHT + "px"
    canvas.width = DPI_WIDTH
    canvas.height = DPI_HEIGHT
    render_coordinates()
}
graph()


function render_unlinear_graph(system) {
    const ctx = canvas.getContext("2d")
    for (let i = 0; i <= system().length; i++) {
        i % 2 == 0 ? ctx.strokeStyle = "green" : ctx.strokeStyle = "blue"
    
        ctx.beginPath()
        ctx.lineWidth = 3
        
        for (let x = -20; x < 15; x+=0.0001) {       
            ctx.lineTo(x * MULTIPLY + DPI_WIDTH/2, DPI_HEIGHT/2 - (system(x)[i] * MULTIPLY))
        }
        ctx.stroke()
        ctx.closePath()
    }
    
    // ctx.beginPath()
    // ctx.strokeStyle = "blue"
    // ctx.lineWidth = 3
    // for (let x = -15; x < 10; x+=0.0001) {
    //     ctx.lineTo(x * MULTIPLY + DPI_WIDTH/2, DPI_HEIGHT/2 - (system(x)[0] * MULTIPLY))
    // }
    // ctx.stroke()
    // ctx.closePath()
}



function render_graph(func, color) {
    const ctx = canvas.getContext("2d")
    ctx.beginPath()
    ctx.strokeStyle = color
    ctx.lineWidth = 3
    for (let x = test[0][0]; x < DPI_WIDTH/2; x+=0.2) {
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
    let multiplier = 1 / 0.5
    return Math.round(val * multiplier) / multiplier
}

// console.error(1)
// gauss([[1,3,2,55,24], [23, 44, 25, 21, 128], [4, 2, 5, 1, 52], [42, 23, 34, 12, 77]])