import { useState } from "react";
import { Calculator, Calendar, Award, GraduationCap, ArrowRightLeft, DollarSign } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import Mascot from "@/components/Mascot";
import BasicCalculator from "@/components/calculators/BasicCalculator";
import AgeCalculator from "@/components/calculators/AgeCalculator";
import MarksCalculator from "@/components/calculators/MarksCalculator";
import CGPACalculator from "@/components/calculators/CGPACalculator";
import CGPAConverter from "@/components/calculators/CGPAConverter";
import ExchangeCalculator from "@/components/calculators/ExchangeCalculator";

const tabs = [
  { id: "basic", label: "Basic", icon: Calculator, color: "bg-primary/20" },
  { id: "age", label: "Age", icon: Calendar, color: "bg-mint/30" },
  { id: "marks", label: "Marks", icon: Award, color: "bg-lemon/30" },
  { id: "cgpa", label: "CGPA", icon: GraduationCap, color: "bg-lavender/30" },
  { id: "convert", label: "Convert", icon: ArrowRightLeft, color: "bg-peach/30" },
  { id: "exchange", label: "Currency", icon: DollarSign, color: "bg-sky/30" },
];

const Index = () => {
  const [activeTab, setActiveTab] = useState("basic");

  const renderCalculator = () => {
    switch (activeTab) {
      case "basic":
        return <BasicCalculator />;
      case "age":
        return <AgeCalculator />;
      case "marks":
        return <MarksCalculator />;
      case "cgpa":
        return <CGPACalculator />;
      case "convert":
        return <CGPAConverter />;
      case "exchange":
        return <ExchangeCalculator />;
      default:
        return <BasicCalculator />;
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-60 h-60 bg-secondary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      </div>

      <div className="max-w-md mx-auto relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Mascot />
            <div>
              <h1 className="text-2xl font-bold text-foreground">CalcuCute</h1>
              <p className="text-xs text-muted-foreground">Your friendly calculator 💕</p>
            </div>
          </div>
          <ThemeToggle />
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 btn-bounce whitespace-nowrap ${
                  isActive
                    ? "bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-soft"
                    : `${tab.color} text-foreground hover:scale-105`
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Calculator Card */}
        <div className="card-cute p-6 min-h-[400px]">
          {renderCalculator()}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          Made with 💖 for calculations
        </p>
      </div>
    </div>
  );
};

export default Index;
