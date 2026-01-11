import { useState } from "react";
import { GraduationCap, Plus, Trash2 } from "lucide-react";

interface Subject {
  id: number;
  credits: string;
  grade: string;
}

const gradePoints: Record<string, number> = {
  "A+": 4.0,
  "A": 4.0,
  "A-": 3.7,
  "B+": 3.3,
  "B": 3.0,
  "B-": 2.7,
  "C+": 2.3,
  "C": 2.0,
  "C-": 1.7,
  "D+": 1.3,
  "D": 1.0,
  "F": 0.0,
};

const CGPACalculator = () => {
  const [subjects, setSubjects] = useState<Subject[]>([
    { id: 1, credits: "", grade: "A" },
    { id: 2, credits: "", grade: "A" },
    { id: 3, credits: "", grade: "A" },
  ]);
  const [result, setResult] = useState<number | null>(null);

  const addSubject = () => {
    setSubjects([...subjects, { id: Date.now(), credits: "", grade: "A" }]);
  };

  const removeSubject = (id: number) => {
    if (subjects.length > 1) {
      setSubjects(subjects.filter((s) => s.id !== id));
    }
  };

  const updateSubject = (id: number, field: "credits" | "grade", value: string) => {
    setSubjects(subjects.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  const calculateCGPA = () => {
    let totalCredits = 0;
    let totalPoints = 0;

    subjects.forEach((subject) => {
      const credits = parseFloat(subject.credits) || 0;
      const points = gradePoints[subject.grade] || 0;
      totalCredits += credits;
      totalPoints += credits * points;
    });

    if (totalCredits === 0) return;

    const gpa = totalPoints / totalCredits;
    setResult(gpa);
  };

  return (
    <div className="animate-scale-in space-y-3 sm:space-y-4">
      <p className="text-center text-muted-foreground text-xs sm:text-sm">
        Calculate your CGPA/SGPA! 🎓
      </p>

      <div className="space-y-2 max-h-40 sm:max-h-48 overflow-y-auto pr-2">
        {subjects.map((subject, idx) => (
          <div key={subject.id} className="flex gap-1.5 sm:gap-2 items-center animate-slide-up">
            <span className="text-[10px] sm:text-xs text-muted-foreground w-5 sm:w-6">#{idx + 1}</span>
            <input
              type="number"
              placeholder="Credits"
              value={subject.credits}
              onChange={(e) => updateSubject(subject.id, "credits", e.target.value)}
              className="input-cute flex-1 py-1.5 sm:py-2 text-xs sm:text-sm"
              min="1"
            />
            <select
              value={subject.grade}
              onChange={(e) => updateSubject(subject.id, "grade", e.target.value)}
              className="input-cute flex-1 py-1.5 sm:py-2 text-xs sm:text-sm"
            >
              {Object.keys(gradePoints).map((grade) => (
                <option key={grade} value={grade}>
                  {grade} ({gradePoints[grade]})
                </option>
              ))}
            </select>
            <button
              onClick={() => removeSubject(subject.id)}
              className="p-1.5 sm:p-2 text-muted-foreground hover:text-destructive transition-colors"
              disabled={subjects.length === 1}
            >
              <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={addSubject}
        className="w-full py-1.5 sm:py-2 rounded-xl border-2 border-dashed border-border text-muted-foreground hover:border-primary hover:text-primary transition-all duration-300 flex items-center justify-center gap-2 text-xs sm:text-sm"
      >
        <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        Add Subject
      </button>

      <button
        onClick={calculateCGPA}
        className="w-full py-2.5 sm:py-3 rounded-xl font-semibold transition-all duration-300 btn-bounce"
        style={{ background: "var(--gradient-accent)" }}
      >
        <span className="text-accent-foreground flex items-center justify-center gap-2 text-sm sm:text-base">
          <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5" />
          Calculate GPA
        </span>
      </button>

      {result !== null && (
        <div className="result-display animate-slide-up text-center">
          <p className="text-xs sm:text-sm text-muted-foreground mb-2">Your GPA is</p>
          <div className="text-3xl sm:text-4xl font-bold text-gradient mb-2">
            {result.toFixed(2)}
          </div>
          <p className="text-xs sm:text-sm text-foreground">
            {result >= 3.5
              ? "Outstanding! You're a star! ⭐"
              : result >= 3.0
              ? "Great job! Keep going! 🌟"
              : result >= 2.5
              ? "Good work! Room for improvement! 📚"
              : "Keep pushing! You can do it! 💪"}
          </p>
        </div>
      )}
    </div>
  );
};

export default CGPACalculator;
