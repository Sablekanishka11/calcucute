import { useState } from "react";
import { Award, Target } from "lucide-react";

const MarksCalculator = () => {
  const [total, setTotal] = useState("");
  const [obtained, setObtained] = useState("");
  const [result, setResult] = useState<{ percentage: number; grade: string; emoji: string } | null>(null);

  const calculateResult = () => {
    const totalMarks = parseFloat(total);
    const obtainedMarks = parseFloat(obtained);

    if (isNaN(totalMarks) || isNaN(obtainedMarks) || totalMarks <= 0) return;

    const percentage = (obtainedMarks / totalMarks) * 100;
    let grade: string;
    let emoji: string;

    if (percentage >= 90) {
      grade = "A+";
      emoji = "🌟";
    } else if (percentage >= 80) {
      grade = "A";
      emoji = "✨";
    } else if (percentage >= 70) {
      grade = "B";
      emoji = "🎯";
    } else if (percentage >= 60) {
      grade = "C";
      emoji = "👍";
    } else if (percentage >= 50) {
      grade = "D";
      emoji = "📚";
    } else {
      grade = "F";
      emoji = "💪";
    }

    setResult({ percentage, grade, emoji });
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "A+":
      case "A":
        return "text-mint";
      case "B":
        return "text-sky";
      case "C":
        return "text-lemon";
      case "D":
        return "text-peach";
      default:
        return "text-coral";
    }
  };

  return (
    <div className="animate-scale-in space-y-3 sm:space-y-4">
      <p className="text-center text-muted-foreground text-xs sm:text-sm">
        Check your score! 📝
      </p>

      <div className="space-y-2 sm:space-y-3">
        <div>
          <label className="block text-xs sm:text-sm font-semibold text-foreground mb-1">
            Total Marks
          </label>
          <div className="relative">
            <Target className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
            <input
              type="number"
              value={total}
              onChange={(e) => setTotal(e.target.value)}
              placeholder="e.g., 100"
              className="input-cute pl-9 sm:pl-10"
              min="1"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-semibold text-foreground mb-1">
            Marks Obtained
          </label>
          <div className="relative">
            <Award className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
            <input
              type="number"
              value={obtained}
              onChange={(e) => setObtained(e.target.value)}
              placeholder="e.g., 85"
              className="input-cute pl-9 sm:pl-10"
              min="0"
            />
          </div>
        </div>
      </div>

      <button
        onClick={calculateResult}
        disabled={!total || !obtained}
        className="w-full py-2.5 sm:py-3 rounded-xl font-semibold transition-all duration-300 btn-bounce disabled:opacity-50"
        style={{ background: "var(--gradient-secondary)" }}
      >
        <span className="text-secondary-foreground flex items-center justify-center gap-2 text-sm sm:text-base">
          <Award className="w-4 h-4 sm:w-5 sm:h-5" />
          Calculate Grade
        </span>
      </button>

      {result && (
        <div className="result-display animate-slide-up text-center">
          <div className="text-3xl sm:text-4xl mb-2">{result.emoji}</div>
          <div className="flex justify-center gap-4 sm:gap-6 mb-2 sm:mb-3">
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-primary">
                {result.percentage.toFixed(1)}%
              </div>
              <div className="text-[10px] sm:text-xs text-muted-foreground">Percentage</div>
            </div>
            <div>
              <div className={`text-2xl sm:text-3xl font-bold ${getGradeColor(result.grade)}`}>
                {result.grade}
              </div>
              <div className="text-[10px] sm:text-xs text-muted-foreground">Grade</div>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-foreground">
            {result.grade === "F" 
              ? "Keep trying! You've got this! 💪" 
              : result.percentage >= 80 
                ? "Amazing work! Keep it up! 🎉" 
                : "Good effort! Room to grow! 📈"}
          </p>
        </div>
      )}
    </div>
  );
};

export default MarksCalculator;
