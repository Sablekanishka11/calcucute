const Mascot = () => {
  return (
    <div className="relative animate-float">
      <svg
        width="80"
        height="80"
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-lg"
      >
        {/* Calculator body */}
        <rect
          x="10"
          y="15"
          width="60"
          height="55"
          rx="10"
          className="fill-primary"
        />
        
        {/* Screen */}
        <rect
          x="16"
          y="21"
          width="48"
          height="16"
          rx="4"
          className="fill-mint opacity-80"
        />
        
        {/* Cute eyes */}
        <circle cx="28" cy="45" r="6" className="fill-card" />
        <circle cx="52" cy="45" r="6" className="fill-card" />
        <circle cx="30" cy="44" r="2.5" className="fill-foreground" />
        <circle cx="54" cy="44" r="2.5" className="fill-foreground" />
        
        {/* Blush */}
        <ellipse cx="20" cy="50" rx="4" ry="2" className="fill-coral opacity-60" />
        <ellipse cx="60" cy="50" rx="4" ry="2" className="fill-coral opacity-60" />
        
        {/* Cute smile */}
        <path
          d="M35 55 Q40 60 45 55"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="stroke-foreground"
          fill="none"
        />
        
        {/* Sparkles */}
        <circle cx="68" cy="12" r="3" className="fill-lemon animate-pulse-glow" />
        <circle cx="75" cy="20" r="2" className="fill-lemon animate-pulse-glow" style={{ animationDelay: "0.5s" }} />
        <circle cx="5" cy="25" r="2" className="fill-lavender animate-pulse-glow" style={{ animationDelay: "1s" }} />
      </svg>
    </div>
  );
};

export default Mascot;
