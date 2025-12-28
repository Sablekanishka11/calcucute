import { History, Trash2, X } from "lucide-react";
import { useCalculationHistory, CalculationEntry } from "@/hooks/useCalculationHistory";
import { format } from "date-fns";

interface HistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const getCalculatorLabel = (type: string) => {
  const labels: Record<string, string> = {
    basic: "Basic",
    age: "Age",
    marks: "Marks",
    cgpa: "CGPA",
    convert: "Converter",
    exchange: "Currency",
  };
  return labels[type] || type;
};

const getCalculatorEmoji = (type: string) => {
  const emojis: Record<string, string> = {
    basic: "🧮",
    age: "🎂",
    marks: "📝",
    cgpa: "🎓",
    convert: "🔄",
    exchange: "💱",
  };
  return emojis[type] || "📊";
};

const HistoryItem = ({
  entry,
  onDelete,
}: {
  entry: CalculationEntry;
  onDelete: (id: string) => void;
}) => {
  return (
    <div className="bg-muted/50 rounded-xl p-3 animate-slide-up group">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">{getCalculatorEmoji(entry.calculator_type)}</span>
            <span className="text-xs font-semibold text-primary">
              {getCalculatorLabel(entry.calculator_type)}
            </span>
          </div>
          <p className="text-sm font-medium text-foreground truncate">{entry.result}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {format(new Date(entry.created_at), "MMM d, h:mm a")}
          </p>
        </div>
        <button
          onClick={() => onDelete(entry.id)}
          className="opacity-0 group-hover:opacity-100 p-1.5 text-muted-foreground hover:text-destructive transition-all"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

const HistoryPanel = ({ isOpen, onClose }: HistoryPanelProps) => {
  const { history, loading, deleteCalculation, clearHistory } = useCalculationHistory();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative bg-card border border-border rounded-2xl shadow-soft w-full max-w-md max-h-[80vh] overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-primary" />
            <h2 className="font-bold text-foreground">Calculation History</h2>
          </div>
          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                onClick={clearHistory}
                className="text-xs text-muted-foreground hover:text-destructive transition-colors"
              >
                Clear All
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[60vh] space-y-2">
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading...
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-8">
              <History className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">No calculations yet!</p>
              <p className="text-xs text-muted-foreground mt-1">
                Your history will appear here 💕
              </p>
            </div>
          ) : (
            history.map((entry) => (
              <HistoryItem
                key={entry.id}
                entry={entry}
                onDelete={deleteCalculation}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryPanel;
