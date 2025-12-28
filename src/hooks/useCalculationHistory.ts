import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface CalculationEntry {
  id: string;
  calculator_type: string;
  input_data: Record<string, unknown>;
  result: string;
  created_at: string;
}

export const useCalculationHistory = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState<CalculationEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchHistory = async () => {
    if (!user) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from("calculation_history")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      console.error("Error fetching history:", error);
    } else {
      setHistory(data as CalculationEntry[]);
    }
    setLoading(false);
  };

  const saveCalculation = async (
    calculatorType: string,
    inputData: Record<string, unknown>,
    result: string
  ) => {
    if (!user) return;

    const { error } = await supabase.from("calculation_history").insert([
      {
        user_id: user.id,
        calculator_type: calculatorType,
        input_data: inputData as unknown as Record<string, unknown>,
        result,
      },
    ] as never);

    if (error) {
      console.error("Error saving calculation:", error);
    } else {
      fetchHistory();
    }
  };

  const deleteCalculation = async (id: string) => {
    if (!user) return;

    const { error } = await supabase
      .from("calculation_history")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Failed to delete");
    } else {
      setHistory((prev) => prev.filter((item) => item.id !== id));
      toast.success("Deleted!");
    }
  };

  const clearHistory = async () => {
    if (!user) return;

    const { error } = await supabase
      .from("calculation_history")
      .delete()
      .eq("user_id", user.id);

    if (error) {
      toast.error("Failed to clear history");
    } else {
      setHistory([]);
      toast.success("History cleared!");
    }
  };

  useEffect(() => {
    if (user) {
      fetchHistory();
    } else {
      setHistory([]);
    }
  }, [user]);

  return {
    history,
    loading,
    saveCalculation,
    deleteCalculation,
    clearHistory,
    refetch: fetchHistory,
  };
};
