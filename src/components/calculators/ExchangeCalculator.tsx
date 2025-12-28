import { useState, useEffect, useCallback } from "react";
import { RefreshCw, ArrowRightLeft, Radio, Info, AlertTriangle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCalculationHistory } from "@/hooks/useCalculationHistory";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Rates = Record<string, number>;

interface RateData {
  rates: Rates;
  source: string;
  lastUpdated: Date;
  base: string;
}

const currencies = [
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "KRW", name: "Korean Won", symbol: "₩" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "INR", name: "Indian Rupee", symbol: "₹" },
  { code: "HKD", name: "Hong Kong Dollar", symbol: "HK$" },
  { code: "TWD", name: "Taiwan Dollar", symbol: "NT$" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
  { code: "CHF", name: "Swiss Franc", symbol: "Fr" },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$" },
  { code: "MYR", name: "Malaysian Ringgit", symbol: "RM" },
  { code: "THB", name: "Thai Baht", symbol: "฿" },
  { code: "PHP", name: "Philippine Peso", symbol: "₱" },
  { code: "IDR", name: "Indonesian Rupiah", symbol: "Rp" },
  { code: "VND", name: "Vietnamese Dong", symbol: "₫" },
  { code: "AED", name: "UAE Dirham", symbol: "د.إ" },
  { code: "SAR", name: "Saudi Riyal", symbol: "﷼" },
];

// Auto-refresh every 1 hour (within 1-6 hour range as requested)
const AUTO_REFRESH_INTERVAL = 60 * 60 * 1000; // 1 hour
const CACHE_KEY = "exchange_rates_cache";
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes cache to avoid API abuse

interface CachedRates {
  data: RateData;
  cachedAt: number;
}

const ExchangeCalculator = () => {
  const [amount, setAmount] = useState("1");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("KRW");
  const [rateData, setRateData] = useState<RateData | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [isLive, setIsLive] = useState(false);
  const [isCached, setIsCached] = useState(false);
  
  const { user } = useAuth();
  const { saveCalculation } = useCalculationHistory();

  // Get cached rates if valid
  const getCachedRates = useCallback((base: string): RateData | null => {
    try {
      const cached = localStorage.getItem(`${CACHE_KEY}_${base}`);
      if (cached) {
        const parsedCache: CachedRates = JSON.parse(cached);
        const now = Date.now();
        if (now - parsedCache.cachedAt < CACHE_DURATION) {
          return {
            ...parsedCache.data,
            lastUpdated: new Date(parsedCache.data.lastUpdated)
          };
        }
      }
    } catch (e) {
      console.error("Cache read error:", e);
    }
    return null;
  }, []);

  // Save rates to cache
  const cacheRates = useCallback((data: RateData) => {
    try {
      const cacheEntry: CachedRates = {
        data: {
          ...data,
          lastUpdated: data.lastUpdated
        },
        cachedAt: Date.now()
      };
      localStorage.setItem(`${CACHE_KEY}_${data.base}`, JSON.stringify(cacheEntry));
    } catch (e) {
      console.error("Cache write error:", e);
    }
  }, []);

  const fetchRates = useCallback(async (forceRefresh = false) => {
    // Check cache first (unless force refresh)
    if (!forceRefresh) {
      const cached = getCachedRates(fromCurrency);
      if (cached) {
        setRateData(cached);
        setIsLive(true);
        setIsCached(true);
        return;
      }
    }

    setLoading(true);
    setIsCached(false);

    // Try Frankfurter API first (ECB-based, highly trusted)
    try {
      const response = await fetch(
        `https://api.frankfurter.app/latest?from=${fromCurrency}`
      );
      if (response.ok) {
        const data = await response.json();
        // Frankfurter uses base currency = 1, so we need to add it
        const rates = { ...data.rates, [fromCurrency]: 1 };
        const newRateData: RateData = {
          rates,
          source: "European Central Bank via Frankfurter API",
          lastUpdated: new Date(),
          base: fromCurrency
        };
        setRateData(newRateData);
        setIsLive(true);
        cacheRates(newRateData);
        setLoading(false);
        if (forceRefresh) {
          toast.success("Exchange rates refreshed successfully!");
        }
        return;
      }
    } catch (error) {
      console.warn("Frankfurter API failed, trying fallback:", error);
    }

    // Fallback to exchangerate-api.com
    try {
      const response = await fetch(
        `https://api.exchangerate-api.com/v4/latest/${fromCurrency}`
      );
      if (response.ok) {
        const data = await response.json();
        const newRateData: RateData = {
          rates: data.rates,
          source: "ExchangeRate-API (Open Exchange Rates)",
          lastUpdated: new Date(),
          base: fromCurrency
        };
        setRateData(newRateData);
        setIsLive(true);
        cacheRates(newRateData);
        setLoading(false);
        if (forceRefresh) {
          toast.success("Exchange rates refreshed successfully!");
        }
        return;
      }
    } catch (error) {
      console.error("ExchangeRate-API failed:", error);
    }

    // Both APIs failed - show error state
    setIsLive(false);
    setRateData(null);
    toast.error("Failed to fetch exchange rates. Please try again.");
    setLoading(false);
  }, [fromCurrency, getCachedRates, cacheRates]);

  // Fetch rates on currency change
  useEffect(() => {
    fetchRates();
  }, [fetchRates]);

  // Auto-refresh rates every hour
  useEffect(() => {
    const interval = setInterval(() => {
      fetchRates(true);
    }, AUTO_REFRESH_INTERVAL);
    
    return () => clearInterval(interval);
  }, [fetchRates]);

  // Calculate result when inputs change
  useEffect(() => {
    if (rateData?.rates && amount) {
      const amountNum = parseFloat(amount);
      if (!isNaN(amountNum)) {
        const rate = rateData.rates[toCurrency];
        if (rate) {
          const convertedResult = amountNum * rate;
          setResult(convertedResult);
        }
      }
    }
  }, [amount, toCurrency, rateData]);

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

  const getExchangeRate = () => {
    if (!rateData?.rates) return null;
    return rateData.rates[toCurrency];
  };

  const formatLastUpdated = () => {
    if (!rateData?.lastUpdated) return "Unknown";
    const date = new Date(rateData.lastUpdated);
    return date.toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short"
    });
  };

  return (
    <div className="animate-scale-in space-y-4">
      {/* Header with status */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        <p className="text-center text-muted-foreground text-sm">
          Convert currencies in real-time! 💱
        </p>
        {isLive && (
          <span className="flex items-center gap-1 text-xs text-mint">
            <Radio className="w-3 h-3 animate-pulse" />
            {isCached ? "CACHED" : "LIVE"}
          </span>
        )}
        {!isLive && !loading && (
          <span className="flex items-center gap-1 text-xs text-destructive">
            <AlertTriangle className="w-3 h-3" />
            OFFLINE
          </span>
        )}
      </div>

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
            className="mt-5 p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
            title="Swap currencies"
          >
            <ArrowRightLeft className="w-4 h-4 text-primary" />
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

      {/* Result display */}
      {loading ? (
        <div className="text-center py-4">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto text-primary" />
          <p className="text-sm text-muted-foreground mt-2">Fetching latest rates...</p>
        </div>
      ) : result !== null && rateData ? (
        <div className="text-center space-y-3">
          <div className="p-4 rounded-xl bg-gradient-to-r from-mint/20 to-lavender/20 border border-mint/30">
            <p className="text-2xl font-bold text-foreground">
              {getCurrencySymbol(fromCurrency)}{parseFloat(amount).toLocaleString()} = {getCurrencySymbol(toCurrency)}{result.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              1 {fromCurrency} = {getExchangeRate()?.toLocaleString(undefined, { maximumFractionDigits: 4 })} {toCurrency}
            </p>
          </div>

          {user && (
            <Button
              onClick={handleConvert}
              size="sm"
              className="text-xs"
            >
              Save to History
            </Button>
          )}
        </div>
      ) : !isLive ? (
        <div className="text-center py-4 text-destructive">
          <AlertTriangle className="w-6 h-6 mx-auto mb-2" />
          <p className="text-sm">Unable to fetch rates. Please refresh.</p>
        </div>
      ) : null}

      {/* Rate source and transparency info */}
      {rateData && (
        <div className="space-y-2 pt-2 border-t border-border/50">
          {/* Source and timestamp */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Info className="w-3 h-3" />
              <span>Source: {rateData.source}</span>
            </div>
            <span>Last updated: {formatLastUpdated()}</span>
          </div>

          {/* Refresh button */}
          <div className="flex justify-center">
            <Button
              onClick={() => fetchRates(true)}
              disabled={loading}
              variant="outline"
              size="sm"
              className="text-xs gap-1"
            >
              <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
              Refresh Rates
            </Button>
          </div>

          {/* Disclaimer */}
          <div className="bg-muted/50 rounded-lg p-3 text-xs text-muted-foreground">
            <p className="flex items-start gap-1">
              <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
              <span>
                Rates are mid-market reference rates sourced from central banks and financial data providers. 
                They may differ slightly from Google, banks, or money transfer services due to spreads and fees.
                Auto-refreshes hourly. Cached for 30 minutes to ensure reliable service.
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExchangeCalculator;
