import { useState } from "react";
import { Calendar, Cake } from "lucide-react";
import { useCalculationHistory } from "@/hooks/useCalculationHistory";
import { useAuth } from "@/contexts/AuthContext";

const AgeCalculator = () => {
  const [dob, setDob] = useState("");
  const [age, setAge] = useState<{ years: number; months: number; days: number } | null>(null);
  
  const { user } = useAuth();
  const { saveCalculation } = useCalculationHistory();

  const calculateAge = () => {
    if (!dob) return;

    const birthDate = new Date(dob);
    const today = new Date();

    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    if (days < 0) {
      months--;
      const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += lastMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    setAge({ years, months, days });
    
    // Save to history if logged in
    if (user) {
      saveCalculation(
        "age",
        { dob },
        `${years} years, ${months} months, ${days} days`
      );
    }
  };

  return (
    <div className="animate-scale-in space-y-4">
      <p className="text-center text-muted-foreground text-sm">
        Discover your exact age! 🎂
      </p>

      <div className="space-y-3">
        <label className="block text-sm font-semibold text-foreground">
          When were you born?
        </label>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="input-cute pl-10"
            max={new Date().toISOString().split("T")[0]}
          />
        </div>
      </div>

      <button
        onClick={calculateAge}
        disabled={!dob}
        className="w-full py-3 rounded-xl font-semibold transition-all duration-300 btn-bounce disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ background: "var(--gradient-primary)" }}
      >
        <span className="text-primary-foreground flex items-center justify-center gap-2">
          <Cake className="w-5 h-5" />
          Calculate My Age
        </span>
      </button>

      {age && (
        <div className="result-display animate-slide-up">
          <p className="text-center text-sm text-muted-foreground mb-3">You are</p>
          <div className="flex justify-center gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{age.years}</div>
              <div className="text-xs text-muted-foreground">Years</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent-foreground">{age.months}</div>
              <div className="text-xs text-muted-foreground">Months</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary-foreground">{age.days}</div>
              <div className="text-xs text-muted-foreground">Days</div>
            </div>
          </div>
          <p className="text-center text-sm text-foreground mt-3">
            🎉 That's {age.years * 365 + age.months * 30 + age.days} days of awesomeness!
          </p>
        </div>
      )}
    </div>
  );
};

export default AgeCalculator;
