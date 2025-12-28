import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { User, LogOut, History, LogIn } from "lucide-react";
import HistoryPanel from "./HistoryPanel";

const UserMenu = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    setShowMenu(false);
  };

  if (!user) {
    return (
      <button
        onClick={() => navigate("/auth")}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-all duration-300 btn-bounce"
      >
        <LogIn className="w-4 h-4" />
        <span className="text-sm font-semibold hidden sm:inline">Login</span>
      </button>
    );
  }

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-all duration-300"
        >
          <User className="w-4 h-4" />
          <span className="text-sm font-semibold hidden sm:inline truncate max-w-[100px]">
            {user.email?.split("@")[0]}
          </span>
        </button>

        {showMenu && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowMenu(false)}
            />
            <div className="absolute right-0 top-full mt-2 bg-card border border-border rounded-xl shadow-soft p-2 min-w-[160px] z-50 animate-scale-in">
              <button
                onClick={() => {
                  setShowHistory(true);
                  setShowMenu(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-foreground hover:bg-muted transition-colors"
              >
                <History className="w-4 h-4" />
                History
              </button>
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </>
        )}
      </div>

      <HistoryPanel isOpen={showHistory} onClose={() => setShowHistory(false)} />
    </>
  );
};

export default UserMenu;
