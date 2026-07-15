let valueSolving = document.querySelector('#solving-value');
let valueAnswer = document.querySelector('#answer-value');
let decimalButton = document.querySelector('#btn-decimal');

let firstNumber = null;
let operatorSelected = null;
let currentInput = "0";
let startNewNumber = true;
let hasError = false;

valueSolving.textContent = "0";
valueAnswer.textContent = "";

const topButtons = document.querySelectorAll('.top-button');
const numberButtons = document.querySelectorAll('.number-button');
const operatorButtons = document.querySelectorAll('.op-button');

function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    if (b === 0) {
        return "error";
    }
    return a / b;
}

function operate(operatorSymbol, number1, number2) {
    let a = parseFloat(number1);
    let b = parseFloat(number2);

    if (operatorSymbol === "+") {
        return add(a, b);
    } else if (operatorSymbol === "-") {
        return subtract(a, b);
    } else if (operatorSymbol === "×") {
        return multiply(a, b);
    } else if (operatorSymbol === "÷") {
        return divide(a, b);
    }
}


function roundResult(number) {
    let rounded = parseFloat(number.toPrecision(10));
    return rounded.toString();
}


function updateDisplay() {
    if (operatorSelected !== null && firstNumber !== null) {
        if (startNewNumber === true) {
            valueSolving.textContent = firstNumber + " " + operatorSelected;
        } else {
            valueSolving.textContent = firstNumber + " " + operatorSelected + " " + currentInput;
        }
    } else {
        valueSolving.textContent = currentInput;
    }
}


function updateDecimalButton() {
    if (currentInput.includes(".")) {
        decimalButton.disabled = true;
    } else {
        decimalButton.disabled = false;
    }
}


function showDivideByZeroError() {
    valueSolving.textContent = "Nope.";
    valueAnswer.textContent = "Can't divide by 0";
    firstNumber = null;
    operatorSelected = null;
    currentInput = "0";
    startNewNumber = true;
    hasError = true;
}


function clearEverything() {
    firstNumber = null;
    operatorSelected = null;
    currentInput = "0";
    startNewNumber = true;
    hasError = false;
    valueAnswer.textContent = "";
    updateDisplay();
    updateDecimalButton();
}


numberButtons.forEach(function (button) {
    button.addEventListener('click', function (event) {
        if (hasError) {
            return;
        }

        let numberClicked = event.target.textContent;

        if (startNewNumber === true) {
            currentInput = numberClicked;
            startNewNumber = false;
        } else if (currentInput === "0") {
            currentInput = numberClicked;
        } else {
            currentInput = currentInput + numberClicked;
        }

        updateDisplay();
        updateDecimalButton();
    });
});


operatorButtons.forEach(function (button) {
    button.addEventListener('click', function (event) {
        if (hasError) {
            return;
        }

        let newOperator = event.target.textContent;

        if (firstNumber === null) {
            firstNumber = currentInput;
            operatorSelected = newOperator;

        } else if (startNewNumber === true) {
            operatorSelected = newOperator;

        } else {
            let secondNumber = currentInput;
            let result = operate(operatorSelected, firstNumber, secondNumber);

            if (result === "error") {
                showDivideByZeroError();
                return;
            }

            let roundedAnswer = roundResult(result);

            valueAnswer.textContent = roundedAnswer;

            firstNumber = roundedAnswer;
            operatorSelected = newOperator;
        }

        currentInput = "0";
        startNewNumber = true;
        updateDisplay();
        updateDecimalButton();
    });
});


topButtons.forEach(function (button) {
    button.addEventListener('click', function (event) {
        let buttonPressed = event.target.textContent;

        if (buttonPressed === "AC") {
            clearEverything();

        } else if (buttonPressed === "⌫") {
            if (hasError) {
                clearEverything();
                return;
            }

            if (firstNumber === null) {
                if (startNewNumber === true) {
                    return;
                }

                if (currentInput.length > 1) {
                    currentInput = currentInput.slice(0, -1);
                } else {
                    currentInput = "0";
                    startNewNumber = true;
                }

            } else if (startNewNumber === true) {
                currentInput = firstNumber;
                firstNumber = null;
                operatorSelected = null;
                startNewNumber = false;
                valueAnswer.textContent = "";

            } else {
                let trimmedInput = currentInput.slice(0, -1);

                if (trimmedInput.length === 0) {
                    currentInput = "0";
                    startNewNumber = true;
                } else {
                    currentInput = trimmedInput;
                }
            }

            updateDisplay();
            updateDecimalButton();

        } else if (buttonPressed === ".") {
            if (hasError) {
                return;
            }
            if (startNewNumber === true) {
                currentInput = "0.";
                startNewNumber = false;
            } else if (!currentInput.includes(".")) {
                currentInput = currentInput + ".";
            }

            updateDisplay();
            updateDecimalButton();

        } else if (buttonPressed === "=") {
            if (hasError) {
                return;
            }
            if (firstNumber === null || operatorSelected === null || startNewNumber === true) {
                return;
            }

            let secondNumber = currentInput;
            let result = operate(operatorSelected, firstNumber, secondNumber);

            if (result === "error") {
                showDivideByZeroError();
                return;
            }

            currentInput = roundResult(result);
            firstNumber = null;
            operatorSelected = null;
            startNewNumber = true;

            updateDisplay();
            updateDecimalButton();
        }
    });
});