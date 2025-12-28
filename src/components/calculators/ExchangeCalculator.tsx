import { useState, useEffect } from "react";
import { ArrowRightLeft, RefreshCw, Loader2 } from "lucide-react";
import { useCalculationHistory } from "@/hooks/useCalculationHistory";
import { useAuth } from "@/contexts/AuthContext";

interface Rates {
  [key: string]: number;
}

const currencies = [
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "INR", name: "Indian Rupee", symbol: "₹" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
  { code: "CHF", name: "Swiss Franc", symbol: "Fr" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$" },
];

const ExchangeCalculator = () => {
  const [amount, setAmount] = useState("1");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("INR");
  const [rates, setRates] = useState<Rates | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  
  const { user } = useAuth();
  const { saveCalculation } = useCalculationHistory();

  const fetchRates = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.exchangerate-api.com/v4/latest/${fromCurrency}`
      );
      const data = await response.json();
      setRates(data.rates);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (error) {
      console.error("Failed to fetch rates:", error);
      // Fallback rates if API fails
      setRates({
        USD: 1,
        EUR: 0.85,
        GBP: 0.73,
        INR: 83.5,
        JPY: 149.5,
        AUD: 1.53,
        CAD: 1.36,
        CHF: 0.88,
        CNY: 7.24,
        SGD: 1.34,
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRates();
  }, [fromCurrency]);

  useEffect(() => {
    if (rates && amount) {
      const amountNum = parseFloat(amount);
      if (!isNaN(amountNum)) {
        const convertedResult = amountNum * (rates[toCurrency] || 1);
        setResult(convertedResult);
      }
    }
  }, [amount, toCurrency, rates]);

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const getCurrencySymbol = (code: string) => {
    return currencies.find((c) => c.code === code)?.symbol || code;
  };

  const handleConvert = () => {
    if (result !== null && user) {
      saveCalculation(
        "exchange",
        { amount: parseFloat(amount), from: fromCurrency, to: toCurrency },
        `${getCurrencySymbol(fromCurrency)}${parseFloat(amount).toLocaleString()} = ${getCurrencySymbol(toCurrency)}${result.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
      );
    }
  };

  return (
    <div className="animate-scale-in space-y-4">
      <p className="text-center text-muted-foreground text-sm">
        Convert currencies in real-time! 💱
      </p>

      <div className="space-y-3">
        <div>
          <label className="block text-sm font-semibold text-foreground mb-1">
            Amount
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="input-cute"
            min="0"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex-1">
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              From
            </label>
            <select
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              className="input-cute py-2 text-sm"
            >
              {currencies.map((curr) => (
                <option key={curr.code} value={curr.code}>
                  {curr.symbol} {curr.code}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={swapCurrencies}
            className="mt-5 p-2 rounded-full bg-muted hover:bg-accent transition-all duration-300 btn-bounce"
          >
            <ArrowRightLeft className="w-4 h-4 text-foreground" />
          </button>

          <div className="flex-1">
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              To
            </label>
            <select
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              className="input-cute py-2 text-sm"
            >
              {currencies.map((curr) => (
                <option key={curr.code} value={curr.code}>
                  {curr.symbol} {curr.code}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {result !== null && (
        <div className="result-display animate-slide-up text-center" onClick={handleConvert}>
          <div className="text-sm text-muted-foreground mb-1">
            {getCurrencySymbol(fromCurrency)} {parseFloat(amount).toLocaleString()} =
          </div>
          <div className="text-3xl font-bold text-gradient">
            {getCurrencySymbol(toCurrency)} {result.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </div>
          {rates && (
            <div className="text-xs text-muted-foreground mt-2">
              1 {fromCurrency} = {rates[toCurrency]?.toFixed(4)} {toCurrency}
            </div>
          )}
          {user && (
            <p className="text-xs text-primary mt-2 cursor-pointer hover:underline" onClick={handleConvert}>
              Tap to save to history
            </p>
          )}
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {lastUpdated && `Updated: ${lastUpdated}`}
        </span>
        <button
          onClick={fetchRates}
          disabled={loading}
          className="flex items-center gap-1 hover:text-primary transition-colors"
        >
          {loading ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <RefreshCw className="w-3 h-3" />
          )}
          Refresh
        </button>
      </div>
    </div>
  );
};

export default ExchangeCalculator;
