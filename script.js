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
// производная
function first_derivative(func, x, dx) {
    dx = dx || 0.00000001

    return (func(x + dx) - func(x))/dx
}

function f1(x) {

    return Math.pow(x,3) - 9*x - 8
}

function f2(x) {

    return Math.log(x)
}

function f3(x) {

    return x*x + 3.22 * x - 1.11
}

function f4(x) {

    return x * x
}


function F1(x) {
   return x**4/4 - (9/2) * (x ** 2) - 8 * x
}

function F2(x) {
    return x*Math.log(x) - x
}
 
function F3(x) {
    return (x**3)/3 + (3.22/2) * (x**2) - 1.11*x
}

function F4(x) {
    return x**3/3
}


let main_func = f1
let main_F = f1



// Метод прямоугольников
function square_method(func, interval, total_iterations) {
    function right(func, interval, total_iterations) {
        let R = 1
        let final_sum
        while (true) {
            let step = (interval[1] - interval[0])/total_iterations
            let sum_1 = 0
            let i = 0
            let x_i = interval[0] + step
            while (i < total_iterations) {
                sum_1 += func(x_i)
                x_i += step
                i++
            }
            sum_1 = sum_1 * step
            
            i = 0
            step = (interval[1] - interval[0])/(total_iterations * 2)
            let sum_2 = 0
            x_i = interval[0] + step
            while (i < total_iterations * 2) {
                sum_2 += func(x_i)
                x_i += step
                i++
            }
            sum_2 = sum_2 * step
            R = Math.abs(sum_1 - sum_2)
            if (R <= ACCURACY) {
                final_sum = sum_2
                total_iterations *= 2
                break
            }
            total_iterations *= 2
        }
        
        
        return [final_sum, total_iterations]
    }

    function left(func, interval, total_iterations) {
        let R = 1
        let final_sum
        while (true) {
            let step = (interval[1] - interval[0])/total_iterations
            let sum_1 = 0
            let i = 0
            let x_i = interval[0]
            while (i < total_iterations) {
                sum_1 += func(x_i)
                x_i += step
                i++
            }
            sum_1 = sum_1 * step
            
            i = 0
            step = (interval[1] - interval[0])/(total_iterations * 2)
            let sum_2 = 0
            x_i = interval[0]
            while (i < total_iterations * 2) {
                sum_2 += func(x_i)
                x_i += step
                i++
            }
            sum_2 = sum_2 * step
            R = Math.abs(sum_1 - sum_2)
            total_iterations *= 2
            if (R <= ACCURACY) {
                final_sum = sum_2
                break
            }
        }
        
        
        return [final_sum, total_iterations]
    }

    function middle(func, interval, total_iterations) {    
        let R = 1
        let final_sum
        while (true) {
            let step = (interval[1] - interval[0])/total_iterations
            let sum_1 = 0
            let i = 0
            let x_prev = interval[0]
            let x_i = x_prev + step
            while (i < total_iterations) {
                let x_mid = (x_i + x_prev) / 2
                sum_1 += func(x_mid)
                x_prev = x_i
                x_i += step
                i++
            }
            sum_1 = sum_1 * step
            i = 0
            step = (interval[1] - interval[0])/(total_iterations * 2)
            let sum_2 = 0
            x_prev = interval[0]
            x_i = x_prev + step
            while (i < total_iterations * 2) {
                let x_mid = (x_i + x_prev) / 2
                sum_2 += func(x_mid)
                x_prev = x_i
                x_i += step
                i++
            }
            sum_2 = sum_2 * step
            R = Math.abs(sum_1 - sum_2)
            total_iterations *= 2
            if (R <= ACCURACY) {
                final_sum = sum_2
                break
            } 
        }
        
        
        return [final_sum, total_iterations]
    }
    
    
    console.warn("Метод прямоугольников (Правый):")
    console.log("Значение интеграла: " + right(main_func, interval_ogr, 4)[0]
                + "\t Число разбиения: " + right(main_func, interval_ogr, 4)[1])
                console.log(main_F(interval_ogr[1]) - main_F(interval_ogr[0]))
    console.log("--------")
    console.warn("Метод прямоугольник (Серединный):")
    console.log("Значение интеграла: " + middle(main_func, interval_ogr, 4)[0]
                + "\t Число разбиения: " + middle(main_func, interval_ogr, 4)[1])
    console.log("--------")
    console.warn("Метод прямоугольник (Левый):")
    console.log("Значение интеграла: " + left(main_func, interval_ogr, 4)[0]
                + "\t Число разбиения: " + left(main_func, interval_ogr, 4)[1])
    console.log("--------")

}

// Метод трапеций
function trapeze_method(func, interval, total_iterations) {
    let R = 1
    let final_sum
    while (true) {
        let step = (interval[1] - interval[0])/total_iterations
        let sum_1 = 0
        let i = 0
        let x_i = interval[0] + step
        while (i < total_iterations - 1) {
            sum_1 += func(x_i)
            x_i += step
            i++
        }
        sum_1 = step * (sum_1 + (func(interval[0]) + func(interval[1]))/2)
        
        i = 0
        step = (interval[1] - interval[0])/(total_iterations * 2)
        let sum_2 = 0
        x_i = interval[0] + step
        while (i < total_iterations * 2) {
            sum_2 += func(x_i)
            x_i += step
            i++
        }
        sum_2 = step * (sum_2 + (func(interval[0]) + func(interval[1]))/2)
        R = Math.abs(sum_1 - sum_2)
        total_iterations *= 2
        if (R <= ACCURACY) {
            final_sum = sum_2
            break
        }
    }

    return [final_sum, total_iterations]
}

function simpson_method(func, interval, total_iterations) {
    let R = 1
    let final_sum
    while (true) {
        let step = (interval[1] - interval[0])/total_iterations
        let sum_1
        let even_sum = 0
        let odd_sum = 0
        let i = 1
        let x_i = interval[0]
        while (i < total_iterations) {
            if (i % 2 == 0) {
                odd_sum += func(x_i)
            } else {
                even_sum += func(x_i)
            }
            x_i += step
            i++
        }
        sum_1 = (step/3) * (func(interval[0]) + 2 * odd_sum + 4 * even_sum + func(x_i))

        even_sum = 0
        odd_sum = 0
        i = 0
        step = (interval[1] - interval[0])/(total_iterations * 2)
        let sum_2 = 0
        x_i = interval[0]
        while (i < total_iterations * 2) {
            if (i % 2 == 0) {
                odd_sum += func(x_i)
            } else {
                even_sum += func(x_i)
            }
            x_i += step
            i++
        }
        sum_2 = (step/3) * (func(interval[0]) + 2 * odd_sum + 4 * even_sum + func(x_i))
        R = Math.abs(sum_1 - sum_2)
        total_iterations *= 2
        if (R <= ACCURACY) {
            final_sum = sum_2
            break
        }
    }
    
    return [final_sum, total_iterations]
}








function startAll(func) {
    console.clear()
    square_method(func, interval_ogr, FIRST_N)
    console.warn("Трапеция:")
    console.log("Значение интеграла: " + trapeze_method(func, interval_ogr, FIRST_N)[0]
                + "\t Число разбиения: " + trapeze_method(func, interval_ogr, FIRST_N)[1])
    console.log("--------")
    console.warn("Симпсон:")
    console.log("Значение интеграла: " + simpson_method(func, interval_ogr, FIRST_N)[0]
                + "\t Число разбиения: " + simpson_method(func, interval_ogr, FIRST_N)[1])

}




// // ******************************************************** 

document.getElementById("accuracy").addEventListener("change" ,(e) => {
    ACCURACY = Number(e.target.value)
})

document.getElementById("a0").addEventListener("change", (e) => {
    interval_ogr[0] = Number(e.target.value)
})

document.getElementById("b0").addEventListener("change", (e) => {
    interval_ogr[1] = Number(e.target.value)
})


document.getElementById("sub").addEventListener("click" , (e) => {
    e.preventDefault()
    startAll(main_func)
})


document.querySelectorAll(".func").forEach((element) => element.addEventListener("click", (e) => {
    
    switch(e.target.defaultValue) {
        case "1":
            main_func = f1
            main_F = F1
            break
        case "2":
            main_func = f2
            main_F = F2
            break
        case "3":
            main_func = f3
            main_F = F3
            break
        case "4":
            main_func = f4
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
    render_graph(main_func)    
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