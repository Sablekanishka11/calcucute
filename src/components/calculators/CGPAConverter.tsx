import { useState } from "react";
import { ArrowRightLeft, Info } from "lucide-react";

const CGPAConverter = () => {
  const [inputValue, setInputValue] = useState("");
  const [conversionType, setConversionType] = useState<"cgpaToPercent" | "percentToCgpa" | "cgpaTo4">("cgpaToPercent");
  const [result, setResult] = useState<{ value: number; formula: string } | null>(null);

  const conversions = [
    { id: "cgpaToPercent", label: "CGPA → %", inputLabel: "CGPA (10 scale)", max: 10 },
    { id: "percentToCgpa", label: "% → CGPA", inputLabel: "Percentage (%)", max: 100 },
    { id: "cgpaTo4", label: "CGPA → 4.0", inputLabel: "CGPA (10 scale)", max: 10 },
  ] as const;

  const convert = () => {
    const value = parseFloat(inputValue);
    if (isNaN(value)) return;

    let resultValue: number;
    let formula: string;

    switch (conversionType) {
      case "cgpaToPercent":
        resultValue = (value - 0.75) * 10;
        formula = "Percentage = (CGPA - 0.75) × 10";
        break;
      case "percentToCgpa":
        resultValue = value / 10 + 0.75;
        formula = "CGPA = (Percentage ÷ 10) + 0.75";
        break;
      case "cgpaTo4":
        resultValue = (value / 10) * 4;
        formula = "4.0 GPA = (CGPA ÷ 10) × 4";
        break;
      default:
        return;
    }

    setResult({ value: Math.max(0, resultValue), formula });
  };

  const currentConversion = conversions.find((c) => c.id === conversionType)!;

  return (
    <div className="animate-scale-in space-y-3 sm:space-y-4">
      <p className="text-center text-muted-foreground text-xs sm:text-sm">
        Convert between grading systems! 🌍
      </p>

      <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center">
        {conversions.map((conv) => (
          <button
            key={conv.id}
            onClick={() => {
              setConversionType(conv.id);
              setResult(null);
              setInputValue("");
            }}
            className={`tab-pill text-[10px] sm:text-xs ${
              conversionType === conv.id ? "tab-active" : "tab-inactive"
            }`}
          >
            {conv.label}
          </button>
        ))}
      </div>

      <div>
        <label className="block text-xs sm:text-sm font-semibold text-foreground mb-1">
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
        className="w-full py-2.5 sm:py-3 rounded-xl font-semibold transition-all duration-300 btn-bounce disabled:opacity-50"
        style={{ background: "var(--gradient-primary)" }}
      >
        <span className="text-primary-foreground flex items-center justify-center gap-2 text-sm sm:text-base">
          <ArrowRightLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          Convert
        </span>
      </button>

      {result && (
        <div className="result-display animate-slide-up">
          <div className="text-center mb-2 sm:mb-3">
            <div className="text-2xl sm:text-3xl font-bold text-gradient">
              {result.value.toFixed(2)}
            </div>
            <div className="text-[10px] sm:text-xs text-muted-foreground mt-1">
              {conversionType === "cgpaToPercent"
                ? "Percentage"
                : conversionType === "percentToCgpa"
                ? "CGPA (10 scale)"
                : "GPA (4.0 scale)"}
            </div>
          </div>
          <div className="bg-muted/50 rounded-lg p-2 sm:p-3 flex items-start gap-2">
            <Info className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary mt-0.5 flex-shrink-0" />
            <div className="text-[10px] sm:text-xs text-muted-foreground">
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
