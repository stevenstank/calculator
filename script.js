const Calculator = {};

Calculator.displayScreen = document.getElementById("display");
Calculator.firstValue = null;
Calculator.operator = null;
Calculator.waitingForSecond = false;
Calculator.resultShown = false;

Calculator.clearAll = function() {
  Calculator.firstValue = null;
  Calculator.operator = null;
  Calculator.waitingForSecond = false;
  Calculator.resultShown = false;
  Calculator.displayScreen.textContent = "0";
};

Calculator.inputDigit = function(digit) {
  if (Calculator.waitingForSecond) {
    Calculator.displayScreen.textContent = digit;
    Calculator.waitingForSecond = false;
    return;
  }

  if (Calculator.resultShown) {
    Calculator.displayScreen.textContent = digit;
    Calculator.resultShown = false;
    Calculator.firstValue = null;
    Calculator.operator = null;
    return;
  }

  if (Calculator.displayScreen.textContent === "0") {
    Calculator.displayScreen.textContent = digit;
  } else {
    Calculator.displayScreen.textContent += digit;
  }
};

Calculator.inputDecimal = function() {
  if (Calculator.resultShown) {
    Calculator.displayScreen.textContent = "0.";
    Calculator.resultShown = false;
    Calculator.firstValue = null;
    Calculator.operator = null;
    Calculator.waitingForSecond = false;
    return;
  }

  if (!Calculator.displayScreen.textContent.includes(".")) {
    Calculator.displayScreen.textContent += ".";
  }
};

Calculator.handleOperator = function(op) {
  const current = parseFloat(Calculator.displayScreen.textContent);

  if (Calculator.operator && Calculator.waitingForSecond) {
    Calculator.operator = op;
    return;
  }

  if (Calculator.firstValue === null) {
    Calculator.firstValue = current;
  } else if (Calculator.operator !== null) {
    const result = Calculator.calculate(Calculator.firstValue, current, Calculator.operator);
    Calculator.displayScreen.textContent = result;
    Calculator.firstValue = result;
    Calculator.resultShown = true;
  }

  Calculator.operator = op;
  Calculator.waitingForSecond = true;
};

Calculator.calculate = function(a, b, op) {
  if (op === "+") return a + b;
  if (op === "-") return a - b;
  if (op === "*") return a * b;
  if (op === "/") {
    if (b === 0) return "abe tum riddhi (bhondu) ho kya?";
    return a / b;
  }
  return b;
};

Calculator.pressEquals = function() {
  if (Calculator.operator === null || Calculator.firstValue === null) return;

  const current = parseFloat(Calculator.displayScreen.textContent);
  const result = Calculator.calculate(Calculator.firstValue, current, Calculator.operator);

  Calculator.displayScreen.textContent = result;
  Calculator.firstValue = result;
  Calculator.operator = null;
  Calculator.waitingForSecond = false;
  Calculator.resultShown = true;
};

Calculator.pressRoot = function() {
  const current = parseFloat(Calculator.displayScreen.textContent);
  if (current < 0) {
    Calculator.displayScreen.textContent = "abe tum riddhi (bhondu) ho kya?";
    return;
  }
  const result = Math.sqrt(current);
  Calculator.displayScreen.textContent = result;
  Calculator.firstValue = result;
  Calculator.resultShown = true;
};

Array.from(document.querySelectorAll(".btn")).forEach(btn => {
  btn.addEventListener("click", () => {
    const buttonValue = btn.textContent.trim();

    if (btn.classList.contains("clear")) {
      Calculator.clearAll();
      return;
    }

    if (btn.classList.contains("backspace")) {
      let text = Calculator.displayScreen.textContent;
      if (text.length <= 1) {
        Calculator.displayScreen.textContent = "0";
      } else {
        Calculator.displayScreen.textContent = text.slice(0, -1);
      }
      return;
    }

    if (btn.classList.contains("root")) {
      Calculator.pressRoot();
      return;
    }

    if (btn.classList.contains("operator")) {
      let realOperator = buttonValue;
      if (buttonValue === "×" || buttonValue === "x") realOperator = "*";
      if (buttonValue === "÷") realOperator = "/";
      if (buttonValue === "-") realOperator = "-";
      if (buttonValue === "+") realOperator = "+";
      Calculator.handleOperator(realOperator);
      return;
    }

    if (btn.classList.contains("equals")) {
      Calculator.pressEquals();
      return;
    }

    if (buttonValue === ".") {
      Calculator.inputDecimal();
      return;
    }

    if (buttonValue >= "0" && buttonValue <= "9") {
      Calculator.inputDigit(buttonValue);
    }
  });
});

Calculator.clearAll();
