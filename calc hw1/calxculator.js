const myvalue = document.querySelector("span")
function calc(){
    let a =document.expression.left.value;
    let b = document.expression.right.value;
    let o = document.expression.operation.value;
    a=parseFloat(a);
    b=parseFloat(b)

    let solution = 0;
    switch(o) {
        case "minus":
            solution = a-b;
            break;
        case "plus":
            solution = a+b;
            break;
        case "multiply":
            solution = a*b;
            break;
        case "division":
            solution = a/b;
            break;
        case "modulo":
            solution = a%b;
            break;
        case "rand":
            solution = Math.floor(Math.random() * a)+1;
            break;
        case "square root":
            solution = Math.sqrt(a);
            break;
        case "power":
            solution = a**b;
            break;
        default:
            solution = "error not a value expression"
            break;
    }
    myvalue.textContent = solution;
}
