import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function Landing() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      setLocation("/game");
    }
  }, [isAuthenticated, isLoading, setLocation]);

  const handleGuest = () => {
    localStorage.setItem("game_guest_mode", "true");
    setLocation("/game");
  };

  const handleLogin = () => {
    localStorage.removeItem("game_guest_mode");
    window.location.href = "/api/login";
  };

  if (isLoading) return null;

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 font-pixel relative overflow-hidden">
      {/* Scanlines Overlay */}
      <div className="absolute inset-0 z-50 pointer-events-none scanline opacity-20"></div>
      
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="z-10 text-center"
      >
        <h1 className="text-6xl md:text-8xl text-primary mb-8 text-glow animate-pulse">
          ADMIN WORLD
        </h1>
        
        <p className="text-primary/60 mb-12 max-w-md mx-auto leading-relaxed">
          WELCOME TO THE SIMULATION. ALL ENTRANTS GRANTED OWNER STATUS. 
          IDENTITY VERIFICATION OPTIONAL BUT RECOMMENDED.
        </p>

        <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
          <Button 
            onClick={handleLogin}
            className="w-64 h-16 text-xl bg-primary text-black hover:bg-primary/80 transition-all hover:scale-105 border-none rounded-none"
          >
            LOG IN
          </Button>
          
          <Button 
            onClick={handleGuest}
            variant="outline"
            className="w-64 h-16 text-xl border-2 border-primary/40 text-primary hover:bg-primary/10 transition-all hover:scale-105 rounded-none"
          >
            CONTINUE AS GUEST
          </Button>
        </div>

        <div className="mt-16 text-[10px] text-primary/30 uppercase tracking-[0.2em]">
          Connection secure // Protocol 7.4.1 // Replit.com/servers
        </div>
      </motion.div>

      {/* Background Decor */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" 
        style={{ 
          backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        } }
      />
    </div>
  );
}
