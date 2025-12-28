import { useState } from "react";
import { ArrowRightLeft, Info } from "lucide-react";
import { useCalculationHistory } from "@/hooks/useCalculationHistory";
import { useAuth } from "@/contexts/AuthContext";

const CGPAConverter = () => {
  const [inputValue, setInputValue] = useState("");
  const [conversionType, setConversionType] = useState<"cgpaToPercent" | "percentToCgpa" | "cgpaTo4">("cgpaToPercent");
  const [result, setResult] = useState<{ value: number; formula: string } | null>(null);
  
  const { user } = useAuth();
  const { saveCalculation } = useCalculationHistory();

  const conversions = [
    { id: "cgpaToPercent", label: "CGPA → Percentage", inputLabel: "CGPA (10 scale)", max: 10 },
    { id: "percentToCgpa", label: "Percentage → CGPA", inputLabel: "Percentage (%)", max: 100 },
    { id: "cgpaTo4", label: "CGPA → 4.0 GPA", inputLabel: "CGPA (10 scale)", max: 10 },
  ] as const;

  const convert = () => {
    const value = parseFloat(inputValue);
    if (isNaN(value)) return;

    let resultValue: number;
    let formula: string;
    let resultLabel: string;

    switch (conversionType) {
      case "cgpaToPercent":
        resultValue = (value - 0.75) * 10;
        formula = "Percentage = (CGPA - 0.75) × 10";
        resultLabel = `${value} CGPA = ${Math.max(0, resultValue).toFixed(2)}%`;
        break;
      case "percentToCgpa":
        resultValue = value / 10 + 0.75;
        formula = "CGPA = (Percentage ÷ 10) + 0.75";
        resultLabel = `${value}% = ${Math.max(0, resultValue).toFixed(2)} CGPA`;
        break;
      case "cgpaTo4":
        resultValue = (value / 10) * 4;
        formula = "4.0 GPA = (CGPA ÷ 10) × 4";
        resultLabel = `${value} CGPA = ${Math.max(0, resultValue).toFixed(2)} GPA (4.0)`;
        break;
      default:
        return;
    }

    setResult({ value: Math.max(0, resultValue), formula });
    
    // Save to history if logged in
    if (user) {
      saveCalculation(
        "convert",
        { input: value, type: conversionType },
        resultLabel
      );
    }
  };

  const currentConversion = conversions.find((c) => c.id === conversionType)!;

  return (
    <div className="animate-scale-in space-y-4">
      <p className="text-center text-muted-foreground text-sm">
        Convert between grading systems! 🌍
      </p>

      <div className="flex flex-wrap gap-2 justify-center">
        {conversions.map((conv) => (
          <button
            key={conv.id}
            onClick={() => {
              setConversionType(conv.id);
              setResult(null);
              setInputValue("");
            }}
            className={`tab-pill text-xs ${
              conversionType === conv.id ? "tab-active" : "tab-inactive"
            }`}
          >
            {conv.label}
          </button>
        ))}
      </div>

      <div>
        <label className="block text-sm font-semibold text-foreground mb-1">
          {currentConversion.inputLabel}
        </label>
        <input
          type="number"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={`Enter value (max: ${currentConversion.max})`}
          className="input-cute"
          min="0"
          max={currentConversion.max}
          step="0.01"
        />
      </div>

      <button
        onClick={convert}
        disabled={!inputValue}
        className="w-full py-3 rounded-xl font-semibold transition-all duration-300 btn-bounce disabled:opacity-50"
        style={{ background: "var(--gradient-primary)" }}
      >
        <span className="text-primary-foreground flex items-center justify-center gap-2">
          <ArrowRightLeft className="w-5 h-5" />
          Convert
        </span>
      </button>

      {result && (
        <div className="result-display animate-slide-up">
          <div className="text-center mb-3">
            <div className="text-3xl font-bold text-gradient">
              {result.value.toFixed(2)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {conversionType === "cgpaToPercent"
                ? "Percentage"
                : conversionType === "percentToCgpa"
                ? "CGPA (10 scale)"
                : "GPA (4.0 scale)"}
            </div>
          </div>
          <div className="bg-muted/50 rounded-lg p-3 flex items-start gap-2">
            <Info className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
            <div className="text-xs text-muted-foreground">
              <span className="font-semibold">Formula used:</span>
              <br />
              {result.formula}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CGPAConverter;
