import { Link } from "wouter";
import { AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background text-foreground">
      <div className="retro-container max-w-md w-full text-center space-y-6 p-12">
        <div className="flex justify-center">
          <AlertTriangle className="h-24 w-24 text-destructive animate-pulse" />
        </div>
        
        <h1 className="text-4xl font-pixel text-destructive">404 ERROR</h1>
        
        <p className="text-xl font-terminal text-muted-foreground">
          THE SECTOR YOU ARE TRYING TO ACCESS DOES NOT EXIST IN THIS REALITY.
        </p>

        <div className="pt-8">
          <Link href="/" className="inline-block px-8 py-3 bg-primary text-primary-foreground font-pixel text-sm hover:scale-105 transition-transform box-glow">
            RETURN TO BASE
          </Link>
        </div>
      </div>
    </div>
  );
}
