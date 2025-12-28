import { useState } from "react";
import { GraduationCap, Plus, Trash2 } from "lucide-react";
import { useCalculationHistory } from "@/hooks/useCalculationHistory";
import { useAuth } from "@/contexts/AuthContext";

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
  
  const { user } = useAuth();
  const { saveCalculation } = useCalculationHistory();

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
    
    // Save to history if logged in
    if (user) {
      saveCalculation(
        "cgpa",
        { subjects: subjects.map(s => ({ credits: s.credits, grade: s.grade })) },
        `GPA: ${gpa.toFixed(2)}`
      );
    }
  };

  return (
    <div className="animate-scale-in space-y-4">
      <p className="text-center text-muted-foreground text-sm">
        Calculate your CGPA/SGPA! 🎓
      </p>

      <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
        {subjects.map((subject, idx) => (
          <div key={subject.id} className="flex gap-2 items-center animate-slide-up">
            <span className="text-xs text-muted-foreground w-6">#{idx + 1}</span>
            <input
              type="number"
              placeholder="Credits"
              value={subject.credits}
              onChange={(e) => updateSubject(subject.id, "credits", e.target.value)}
              className="input-cute flex-1 py-2 text-sm"
              min="1"
            />
            <select
              value={subject.grade}
              onChange={(e) => updateSubject(subject.id, "grade", e.target.value)}
              className="input-cute flex-1 py-2 text-sm"
            >
              {Object.keys(gradePoints).map((grade) => (
                <option key={grade} value={grade}>
                  {grade} ({gradePoints[grade]})
                </option>
              ))}
            </select>
            <button
              onClick={() => removeSubject(subject.id)}
              className="p-2 text-muted-foreground hover:text-destructive transition-colors"
              disabled={subjects.length === 1}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={addSubject}
        className="w-full py-2 rounded-xl border-2 border-dashed border-border text-muted-foreground hover:border-primary hover:text-primary transition-all duration-300 flex items-center justify-center gap-2"
      >
        <Plus className="w-4 h-4" />
        Add Subject
      </button>

      <button
        onClick={calculateCGPA}
        className="w-full py-3 rounded-xl font-semibold transition-all duration-300 btn-bounce"
        style={{ background: "var(--gradient-accent)" }}
      >
        <span className="text-accent-foreground flex items-center justify-center gap-2">
          <GraduationCap className="w-5 h-5" />
          Calculate GPA
        </span>
      </button>

      {result !== null && (
        <div className="result-display animate-slide-up text-center">
          <p className="text-sm text-muted-foreground mb-2">Your GPA is</p>
          <div className="text-4xl font-bold text-gradient mb-2">
            {result.toFixed(2)}
          </div>
          <p className="text-sm text-foreground">
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
