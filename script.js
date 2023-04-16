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
let interval_ogr = [-15,15]
let first_apr = 3
let interval_un_apr = [3,3]
// производная
function first_derivative(func, x, dx) {
    dx = dx || 0.00000001

    return (func(x + dx) - func(x))/dx
}

function f1(x) {

    return 4.45*Math.pow(x,3) + 7.81*Math.pow(x,2) - 9.62*x - 8.17
}

function f2(x) {

    return Math.log(x)
}

function f3(x) {

    return x*x + 3.22 * x - 1.11
}

function f4(x) {

    return Math.sin(x/2) * 3.14 + Math.cos(x)
}

function f5(x) {
    // v 22
    return Math.pow(x,3) - 3.78*Math.pow(x,2) + 1.25*x + 3.49
}

function sys1() {
    const system = (x,y) => [
        0.1 * Math.pow(x,2) + x + 0.2 * Math.pow(y , 2) - 0.3,
        0.2 * Math.pow(x, 2) + y + 0.1 * x * y - 0.7
    ]
    function phi(x, y) {
        return [
            0.3 - 0.1*x*x - 0.2*y*y,
            0.7 - 0.2*x*x - 0.1*x*y
        ]
    }
    const graph = (x) => [Math.sqrt((0.3-0.1*(x**2) - x)/0.2) , (0.7 - 0.2*x*x)/(1 + 0.1*x), -Math.sqrt((0.3-0.1*(x**2) - x)/0.2)]
    return [system, phi, graph]
}

function sys2() {
    const system = (x,y) => [
        x ** 2 + y ** 2 - 1,
        Math.exp(x) - y - 1 
    ]
    function phi(x, y) {
        return [
            Math.sqrt(1 - y ** 2),
            Math.exp(x) - 1
        ]
    }
    const graph = (x) => [-Math.sqrt(1 - x ** 2), Math.exp(x) - 1, Math.sqrt(1 - x ** 2)]
    return [system, phi, graph]
}

function sys3() {
    const system = (x,y) => [
        x ** 2 + y ** 2 - 4,
        3 * x*x -y
    ]
    function phi(x, y) {
        return [
            Math.sqrt(4 - y**2),
            3 * x * x
        ]
    }
    const graph = (x) => [Math.sqrt(4 - x ** 2), 3 * x * x, -Math.sqrt(4 - x ** 2)]
    return [system, phi, graph]
}


let main_system = sys1
let main_func = f1


function find_roots_from_table(func) {
    let roots_array = []
    
    for (let x = interval_ogr[0]; x < interval_ogr[1]; x+=0.2) {
        roots_array.push(x)
    }
    let intervals = []
    for (let i = 1; i < roots_array.length; i++) {
        if (func(roots_array[i]) * func(roots_array[i - 1]) < 0) {
            intervals.push([roots_array[i - 1], roots_array[i]])
        }
    }
    
    return intervals

}

// Метод половинного деления
function half_division(table, func) {
    let intervals = table.slice()
    let count_iteration = 0
    let count_every_root_it = []
    for (let i = 0; i < intervals.length; i++) {
        while (Math.abs(func((intervals[i][0] + intervals[i][1])/2)) > ACCURACY) {
            let a_0 = intervals[i][0]
            let b_0 = intervals[i][1]
            let x_0 = (a_0 + b_0) / 2
            let fx_0 = func(x_0)
            if (func(a_0) * fx_0 < 0) {
                x_0 > a_0 ? intervals[i] = [a_0, x_0] : intervals[i] = [x_0, a_0]
            } else if (func(b_0) * fx_0 < 0) {
                x_0 > b_0 ? intervals[i] = [b_0, x_0] : intervals[i] = [x_0, b_0]
            } 
            count_iteration++
        }
        count_every_root_it.push(count_iteration)
        count_iteration = 0
    }
    let ans = roots_from_interval(intervals)
    let ans_func = ans.map((element) => func(element))
    
    return [ans, ans_func, count_every_root_it] 
}

function roots_from_interval(table) {
    let intervals = table.slice()
    for (let i = 0; i < intervals.length; i++) {
        intervals[i] = (intervals[i][0] + intervals[i][1])/2 
    }

    return intervals
}

// Метод секущих
function secant(table, func) {
    let intervals = table.slice()
    let ans = []
    let count_iteration = 0
    let count_every_root_it = []
    for (let i = 0; i < intervals.length; i++) {
        let roots = [intervals[i][1], first_apr]
        let x = roots[0]
        let j = 1
        while (Math.abs(func(x)) > ACCURACY) {
            x = roots[j] - ((roots[j] - roots[j - 1])/(func(roots[j]) - func(roots[j - 1]))) * func(roots[j])
            roots.push(x)
            j++
            count_iteration++
        }
        ans.push(x)
        count_every_root_it.push(count_iteration)
        count_iteration = 0
    }
    let ans_func = ans.map((element) => func(element))

    return [ans, ans_func, count_every_root_it] 
}

// Метод простой итерации
function simple_iteration(table, func) {
    let count_iteration = 0
    let count_every_root_it = []
    function phi(x) {
        return x + (-1 / first_derivative(func, x)) * func(x)
    }
    let ans = []
    
    let intervals = table.slice()
    for (let i = 0; i < intervals.length; i++) {
        let roots = [intervals[i][1]]
        roots.push(phi(roots[0]))
        let n = 1
        while (Math.abs(roots[n] - roots[n-1]) > ACCURACY) {
            roots.push(phi(roots[n]))
            n++
            count_iteration++
        }
        count_every_root_it.push(count_iteration)
        count_iteration = 0
        ans.push(roots[n])
    }

    let ans_func = ans.map((element) => func(element))
   

    return [ans, ans_func, count_every_root_it] 
}

// Метод простой итерации 
function unlinear_system_simple_iteration(system, phi, appr) {
    let delta1 = 1
    let delta2 = 1
    let x = appr[0]
    let y = appr[1]
    let it_count = 0;
    let bool = isConvergent(system, appr);
    if (true) {
        console.log("Последовательность сходиться")
        while (Math.abs(delta1) > ACCURACY && Math.abs(delta2) > ACCURACY) {
            const [newX, newY] = phi(x, y)
            delta1 = x - newX
            delta2 = y - newY
            x = newX
            y = newY
            it_count++;
        }
        console.log("J = " + bool[1] + " < 0")
        console.log("Количество итераций: " + it_count)
        return [x,y]
    } else {
        console.log("J = " + bool[1] + " > 0")
        return ["Последовательность", "не сходиться"]
    }
    
    
}
//проверка на сходимость
function isConvergent(system, initialGuess) {
    const [x0, y0] = initialGuess
    const dfdx = (system(x0 + 0.00001, y0)[1] - system(x0, y0)[1]) / 0.00001
    const dfdy = (system(x0, y0 + 0.00001)[1] - system(x0, y0)[1]) / 0.00001
    const dgydx = (system(x0 + 0.00001, y0)[0] - system(x0, y0)[0]) / 0.00001
    const dgydy = (system(x0, y0 + 0.00001)[0] - system(x0, y0)[0]) / 0.00001
    const J = dfdx * dgydy - dfdy * dgydx
    return [Math.abs(J) < 1, Math.abs(J) ]
  }



function beauty_ans(arr) {
    console.log("Корни уравнения: ")
    console.log(arr[0])
    console.log("Значение функции в этих точках: ")
    console.log(arr[1])
    console.log("Количество итераций, потребовавщихся для каждого корня: ")
    for (let i = 0; i < arr[2].length; i++) {
       console.log("x_" + i +" --> " + arr[2][i] + " итерации")
    }
    console.log(arr[2])

}



function startAll(func) {
    console.clear()
    console.log("-------------------------***--------------------------")
    let table = find_roots_from_table(func)
    console.warn("Метод половинного деления:")
    let half = half_division(table, func)
    beauty_ans(half)
    let _secant_ = secant(table, func)
    console.warn("Метод секущих:")
    beauty_ans(_secant_)
    let _simple_ = simple_iteration(table, func)
    console.warn("Метод простых итераций:")
    beauty_ans(_simple_)
    console.log("-------------------------***--------------------------")

}

function startUnlinear(func) {
    console.clear()
    console.log("-------------------------***--------------------------")
    console.log(unlinear_system_simple_iteration(func()[0],func()[1], [interval_un_apr[0],interval_un_apr[1]]))
    console.log("-------------------------***--------------------------")
}


// ******************************************************** 

document.getElementById("accuracy").addEventListener("change" ,(e) => {
    ACCURACY = Number(e.target.value)
})
document.getElementById("x1").addEventListener("change", (e) => {
    first_apr = Number(e.target.value)
})

document.getElementById("a0").addEventListener("change", (e) => {
    interval_ogr[0] = Number(e.target.value)
})

document.getElementById("b0").addEventListener("change", (e) => {
    interval_ogr[1] = Number(e.target.value)
})
document.getElementById("x0_un").addEventListener("change", (e) => {
    interval_un_apr[0] = Number(e.target.value)
})
document.getElementById("x1_un").addEventListener("change", (e) => {
    interval_un_apr[1] = Number(e.target.value)
})

document.getElementById("sub").addEventListener("click" , (e) => {
    e.preventDefault()
    startAll(main_func)
})
document.getElementById("sub2").addEventListener("click" , (e) => {
    e.preventDefault()
    startUnlinear(main_system)
})

document.querySelectorAll(".func").forEach((element) => element.addEventListener("click", (e) => {
    
    switch(e.target.defaultValue) {
        case "1":
            main_func = f1
            break
        case "2":
            main_func = f2
            break
        case "3":
            main_func = f3
            break
        case "4":
            main_func = f4
            break
        case "5":
            main_func = f5
            break
    }
    graph()
}))
document.querySelectorAll(".un").forEach((element) => element.addEventListener("click", (e) => {
    
    switch(e.target.defaultValue) {
        case "1":
            main_system = sys1
            break
        case "2":
            main_system = sys2
            break
        case "3":
            main_system = sys3
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
    render_graph(main_func)
    render_unlinear_graph(main_system()[2])
    
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



function render_graph(func) {
    const ctx = canvas.getContext("2d")
    ctx.beginPath()
    ctx.strokeStyle = "red"
    ctx.lineWidth = 3
    for (let x = -DPI_WIDTH/2; x < DPI_WIDTH/2; x+=0.2) {
        ctx.lineTo(x * MULTIPLY + DPI_WIDTH/2, DPI_HEIGHT/2 - (func(x) * MULTIPLY))
    }
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
        ctx.fillText(Math.round((50*12/MULTIPLY) - i/MULTIPLY), DPI_WIDTH/2, i)
    }

    for (let i = 50; i < DPI_WIDTH; i += 50) {
        ctx.moveTo(i, DPI_HEIGHT/2 - 12)
        ctx.lineTo(i, DPI_HEIGHT/2 + 12)
        ctx.fillText(-Math.round((50*12/MULTIPLY) - i/MULTIPLY), i , DPI_HEIGHT/2)
    }
    ctx.stroke()
}