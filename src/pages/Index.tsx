import { useState } from "react";
import { Calculator, Calendar, Award, GraduationCap, ArrowRightLeft, DollarSign } from "lucide-react";
import ThemeSelector from "@/components/ThemeSelector";
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
    <div className="min-h-screen bg-background p-3 sm:p-4 md:p-8 flex flex-col">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-24 sm:w-32 h-24 sm:h-32 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 sm:bottom-20 right-5 sm:right-10 w-32 sm:w-40 h-32 sm:h-40 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-40 sm:w-60 h-40 sm:h-60 bg-secondary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      </div>

      <div className="w-full max-w-md mx-auto relative flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <Mascot />
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">CalcuCute</h1>
              <p className="text-[10px] sm:text-xs text-muted-foreground">Your friendly calculator 💕</p>
            </div>
          </div>
          <ThemeSelector />
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1.5 sm:gap-2 mb-3 sm:mb-4 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 btn-bounce whitespace-nowrap flex-shrink-0 ${
                  isActive
                    ? "bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-soft"
                    : `${tab.color} text-foreground hover:scale-105`
                }`}
              >
                <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden xs:inline sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Calculator Card */}
        <div className="card-cute p-4 sm:p-6 min-h-[350px] sm:min-h-[400px] flex-1">
          {renderCalculator()}
        </div>

        {/* Footer */}
        <footer className="text-center text-[10px] sm:text-xs text-muted-foreground mt-4 sm:mt-6 py-3 sm:py-4 border-t border-border/50">
          <p>© 2025 | Designed with ❤ by Kanishka</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
