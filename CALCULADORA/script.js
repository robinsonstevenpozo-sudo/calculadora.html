// Clase para gestionar todas las operaciones de la calculadora
class Calculator {
    constructor(previousOperandTextElement, currentOperandTextElement) {
        this.previousOperandTextElement = previousOperandTextElement;
        this.currentOperandTextElement = currentOperandTextElement;
        this.clear(); // Inicializar la calculadora
    }

    // Funcionalidad: Borrar todo (C)
    clear() {
        this.currentOperand = '';
        this.previousOperand = '';
        this.operation = undefined;
        this.updateDisplay();
    }

    // Funcionalidad: Borrar último carácter (DEL)
    delete() {
        // Elimina el último dígito o el punto decimal
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
        this.updateDisplay();
    }

    // Manejo de eventos: Agregar números y punto decimal
    appendNumber(number) {
        // Evita agregar múltiples puntos decimales
        if (number === '.' && this.currentOperand.includes('.')) return;
        this.currentOperand = this.currentOperand.toString() + number.toString();
        this.updateDisplay();
    }

    // Manejo de eventos: Seleccionar operación
    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        
        // Si ya hay una operación anterior, la calcula antes de continuar
        if (this.previousOperand !== '') {
            this.compute();
        }

        this.operation = operation;
        this.previousOperand = this.currentOperand; // Mueve el número actual a la línea de operación
        this.currentOperand = ''; // Limpia el número actual para el siguiente input
        this.updateDisplay();
    }

    // Funcionalidad: Realizar la operación aritmética
    compute() {
        let result;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);

        // Si no hay números válidos, no hace nada
        if (isNaN(prev) || isNaN(current)) return;

        // Operaciones aritméticas básicas (suma, resta, multiplicación, división)
        switch (this.operation) {
            case '+':
                result = prev + current;
                break;
            case '-':
                result = prev - current;
                break;
            case '×':
                result = prev * current;
                break;
            case '÷':
                if (current === 0) {
                    result = 'Error: División por cero';
                } else {
                    result = prev / current;
                }
                break;
            default:
                return;
        }

        this.currentOperand = result;
        this.operation = undefined;
        this.previousOperand = '';
        this.updateDisplay();
    }

    // Formatea los números con comas para la interfaz
    getDisplayNumber(number) {
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        let integerDisplay;

        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            // Formato de número internacional (separador de miles)
            integerDisplay = integerDigits.toLocaleString('es', { maximumFractionDigits: 0 });
        }

        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    // Actualiza el texto en la pantalla (Output)
    updateDisplay() {
        this.currentOperandTextElement.innerText = 
            this.getDisplayNumber(this.currentOperand);
        
        if (this.operation != null) {
            this.previousOperandTextElement.innerText = 
                `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
        } else {
            this.previousOperandTextElement.innerText = '';
        }
    }
}

// -----------------------------------------------------
// 1. Seleccionar todos los botones del DOM
// -----------------------------------------------------

const numberButtons = document.querySelectorAll('[data-number]');
const operationButtons = document.querySelectorAll('[data-operation]');
const equalsButton = document.querySelector('[data-equals]');
const deleteButton = document.querySelector('[data-delete]');
const allClearButton = document.querySelector('[data-clear]');
const previousOperandTextElement = document.querySelector('[data-previous-operand]');
const currentOperandTextElement = document.querySelector('[data-current-operand]');

// -----------------------------------------------------
// 2. Inicializar la calculadora
// -----------------------------------------------------

const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);

// -----------------------------------------------------
// 3. Manejo de Eventos (click)
// -----------------------------------------------------

// Números
numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendNumber(button.innerText);
    });
});

// Operaciones
operationButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.chooseOperation(button.innerText);
    });
});

// Botón de Igual (=)
equalsButton.addEventListener('click', () => {
    calculator.compute();
});

// Botón de Borrar Todo (C)
allClearButton.addEventListener('click', () => {
    calculator.clear();
});

// Botón de Borrar Último Carácter (DEL)
deleteButton.addEventListener('click', () => {
    calculator.delete();
});

// Manejo de eventos con el teclado (Opcional, pero recomendado)
document.addEventListener('keydown', e => {
    // Si la pantalla ya muestra un error, no aceptar más input
    if (calculator.currentOperand.includes('Error')) return;

    // Números y punto
    if (
        (e.key >= '0' && e.key <= '9') || 
        e.key === '.'
    ) {
        calculator.appendNumber(e.key);
    }
    
    // Operaciones
    if (
        e.key === '+' || 
        e.key === '-' || 
        e.key === '*' || 
        e.key === '/'
    ) {
        // Mapear '*' y '/' a '×' y '÷' si su interfaz usa esos símbolos
        const keyMap = {'*': '×', '/': '÷'};
        const operationKey = keyMap[e.key] || e.key;
        calculator.chooseOperation(operationKey);
    }

    // Igual y Enter
    if (e.key === '=' || e.key === 'Enter') {
        e.preventDefault(); // Evita el comportamiento por defecto de Enter
        calculator.compute();
    }

    // Borrar Último Carácter (Backspace)
    if (e.key === 'Backspace') {
        calculator.delete();
    }

    // Borrar Todo (Escape)
    if (e.key === 'Escape') {
        calculator.clear();
    }
});