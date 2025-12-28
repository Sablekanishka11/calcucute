import { useState, useEffect, useCallback } from "react";
import { Delete } from "lucide-react";
import { useCalculationHistory } from "@/hooks/useCalculationHistory";
import { useAuth } from "@/contexts/AuthContext";

// Safe math expression evaluator - replaces dangerous eval()
const safeEvaluate = (expression: string): number => {
  // Tokenize the expression
  const tokens: (number | string)[] = [];
  let currentNumber = "";
  
  for (let i = 0; i < expression.length; i++) {
    const char = expression[i];
    
    if (char === " ") continue;
    
    if (/[0-9.]/.test(char)) {
      currentNumber += char;
    } else if (["+", "-", "*", "/"].includes(char)) {
      if (currentNumber) {
        tokens.push(parseFloat(currentNumber));
        currentNumber = "";
      } else if (char === "-" && (tokens.length === 0 || typeof tokens[tokens.length - 1] === "string")) {
        // Handle negative numbers
        currentNumber = "-";
        continue;
      }
      tokens.push(char);
    }
  }
  
  if (currentNumber) {
    tokens.push(parseFloat(currentNumber));
  }
  
  // Validate tokens - must alternate between numbers and operators
  for (let i = 0; i < tokens.length; i++) {
    const isNumber = typeof tokens[i] === "number";
    const shouldBeNumber = i % 2 === 0;
    if (isNumber !== shouldBeNumber) {
      throw new Error("Invalid expression");
    }
  }
  
  // First pass: handle * and /
  let i = 0;
  while (i < tokens.length) {
    if (tokens[i] === "*" || tokens[i] === "/") {
      const left = tokens[i - 1] as number;
      const right = tokens[i + 1] as number;
      const result = tokens[i] === "*" ? left * right : left / right;
      tokens.splice(i - 1, 3, result);
      i--;
    }
    i++;
  }
  
  // Second pass: handle + and -
  i = 0;
  while (i < tokens.length) {
    if (tokens[i] === "+" || tokens[i] === "-") {
      const left = tokens[i - 1] as number;
      const right = tokens[i + 1] as number;
      const result = tokens[i] === "+" ? left + right : left - right;
      tokens.splice(i - 1, 3, result);
      i--;
    }
    i++;
  }
  
  if (tokens.length !== 1 || typeof tokens[0] !== "number") {
    throw new Error("Invalid expression");
  }
  
  return tokens[0];
};

const BasicCalculator = () => {
  const [display, setDisplay] = useState("0");
  const [equation, setEquation] = useState("");
  const [shouldReset, setShouldReset] = useState(false);
  
  const { user } = useAuth();
  const { saveCalculation } = useCalculationHistory();

  const handleNumber = useCallback((num: string) => {
    if (shouldReset) {
      setDisplay(num);
      setShouldReset(false);
    } else {
      setDisplay(display === "0" ? num : display + num);
    }
  }, [display, shouldReset]);

  const handleOperator = useCallback((op: string) => {
    setEquation(display + " " + op + " ");
    setShouldReset(true);
  }, [display]);

  const handleEquals = useCallback(() => {
    try {
      const fullEquation = equation + display;
      const sanitized = fullEquation.replace(/×/g, "*").replace(/÷/g, "/");
      const result = safeEvaluate(sanitized);
      const resultStr = String(parseFloat(result.toFixed(8)));
      setDisplay(resultStr);
      setEquation("");
      setShouldReset(true);
      
      // Save to history if logged in
      if (user) {
        saveCalculation("basic", { equation: fullEquation }, `${fullEquation} = ${resultStr}`);
      }
    } catch {
      setDisplay("Error");
      setShouldReset(true);
    }
  }, [equation, display, user, saveCalculation]);

  const handleClear = useCallback(() => {
    setDisplay("0");
    setEquation("");
    setShouldReset(false);
  }, []);

  const handleBackspace = useCallback(() => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay("0");
    }
  }, [display]);

  const handleDecimal = useCallback(() => {
    if (!display.includes(".")) {
      setDisplay(display + ".");
    }
  }, [display]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= "0" && e.key <= "9") handleNumber(e.key);
      else if (e.key === "+") handleOperator("+");
      else if (e.key === "-") handleOperator("-");
      else if (e.key === "*") handleOperator("×");
      else if (e.key === "/") handleOperator("÷");
      else if (e.key === "Enter" || e.key === "=") handleEquals();
      else if (e.key === "Backspace") handleBackspace();
      else if (e.key === "Escape") handleClear();
      else if (e.key === ".") handleDecimal();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNumber, handleOperator, handleEquals, handleBackspace, handleClear, handleDecimal]);

  const buttons = [
    { label: "C", type: "special", action: handleClear },
    { label: "⌫", type: "special", action: handleBackspace, icon: true },
    { label: "%", type: "special", action: () => setDisplay(String(parseFloat(display) / 100)) },
    { label: "÷", type: "operator", action: () => handleOperator("÷") },
    { label: "7", type: "number", action: () => handleNumber("7") },
    { label: "8", type: "number", action: () => handleNumber("8") },
    { label: "9", type: "number", action: () => handleNumber("9") },
    { label: "×", type: "operator", action: () => handleOperator("×") },
    { label: "4", type: "number", action: () => handleNumber("4") },
    { label: "5", type: "number", action: () => handleNumber("5") },
    { label: "6", type: "number", action: () => handleNumber("6") },
    { label: "-", type: "operator", action: () => handleOperator("-") },
    { label: "1", type: "number", action: () => handleNumber("1") },
    { label: "2", type: "number", action: () => handleNumber("2") },
    { label: "3", type: "number", action: () => handleNumber("3") },
    { label: "+", type: "operator", action: () => handleOperator("+") },
    { label: "0", type: "number", action: () => handleNumber("0"), wide: true },
    { label: ".", type: "number", action: handleDecimal },
    { label: "=", type: "operator", action: handleEquals },
  ];

  return (
    <div className="animate-scale-in">
      <p className="text-center text-muted-foreground mb-4 text-sm">
        Let's crunch some numbers! ✨
      </p>
      
      {/* Display */}
      <div className="bg-muted/50 rounded-2xl p-4 mb-4">
        <div className="text-right text-muted-foreground text-sm h-5 mb-1">
          {equation}
        </div>
        <div className="text-right text-3xl font-bold text-foreground break-all">
          {display}
        </div>
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-4 gap-2">
        {buttons.map((btn, idx) => (
          <button
            key={idx}
            onClick={btn.action}
            className={`calculator-btn ${
              btn.type === "number" ? "calc-number" :
              btn.type === "operator" ? "calc-operator" : "calc-special"
            } ${btn.wide ? "col-span-2" : ""}`}
          >
            {btn.icon ? <Delete className="w-5 h-5" /> : btn.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BasicCalculator;
