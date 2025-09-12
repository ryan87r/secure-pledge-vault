import { Shield } from "lucide-react";

export const FHEBadge = () => {
  return (
    <div className="holographic-border rounded-lg p-3 glow-primary holographic-pulse">
      <div className="flex items-center gap-2">
        <div className="relative">
          <Shield className="h-5 w-5 text-primary" />
          <div className="absolute -inset-1 animate-ping opacity-20">
            <Shield className="h-5 w-5 text-primary" />
          </div>
        </div>
        <span className="text-sm font-bold holographic-text tracking-wide">
          FHE SECURED
        </span>
      </div>
      <div className="mt-1">
        <div className="h-0.5 w-full bg-gradient-to-r from-primary via-accent to-transparent opacity-60"></div>
      </div>
    </div>
  );
};
