import { useState, useEffect, useCallback } from "react";
import { Delete } from "lucide-react";

const BasicCalculator = () => {
  const [display, setDisplay] = useState("0");
  const [equation, setEquation] = useState("");
  const [shouldReset, setShouldReset] = useState(false);

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
      const result = eval(sanitized);
      setDisplay(String(parseFloat(result.toFixed(8))));
      setEquation("");
      setShouldReset(true);
    } catch {
      setDisplay("Error");
      setShouldReset(true);
    }
  }, [equation, display]);

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
