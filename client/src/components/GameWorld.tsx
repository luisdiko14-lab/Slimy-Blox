import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCreateLog } from "@/hooks/use-logs";

// --- Game Constants ---
const PLAYER_SIZE = 40;
const MOVEMENT_SPEED_BASE = 5;
const MAP_WIDTH = 2000;
const MAP_HEIGHT = 2000;

// --- Types ---
export type Rank = "Guest" | "Player" | "Moderator" | "Admin" | "SuperAdmin" | "Owner";

interface Position {
  x: number;
  y: number;
}

interface Entity {
  id: string;
  type: "player" | "npc";
  pos: Position;
  color: string;
  name: string;
  rank?: Rank;
  effects?: string[]; // 'god', 'fly'
}

const RANKS: Record<Rank, number> = {
  Guest: 0,
  Player: 1,
  Moderator: 2,
  Admin: 3,
  SuperAdmin: 4,
  Owner: 5,
};

const RANK_COLORS: Record<Rank, string> = {
  Guest: "#888",
  Player: "#fff",
  Moderator: "#0ff",
  Admin: "#f0f",
  SuperAdmin: "#ff0",
  Owner: "#f00", // Red glow for owner
};

// --- Helper Functions ---
function generateNPCs(count: number): Entity[] {
  return Array.from({ length: count }).map((_, i) => ({
    id: `npc-${i}-${Date.now()}`,
    type: "npc",
    pos: {
      x: Math.random() * (MAP_WIDTH - 100) + 50,
      y: Math.random() * (MAP_HEIGHT - 100) + 50,
    },
    color: `hsl(${Math.random() * 360}, 70%, 50%)`,
    name: `NPC_${Math.floor(Math.random() * 1000)}`,
  }));
}

export function GameWorld() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [player, setPlayer] = useState<Entity>({
    id: "hero",
    type: "player",
    pos: { x: MAP_WIDTH / 2, y: MAP_HEIGHT / 2 },
    color: "#0f0",
    name: "Player",
    rank: "Guest",
    effects: [],
  });

  const [npcs, setNpcs] = useState<Entity[]>(() => generateNPCs(10));
  const [playerSize, setPlayerSize] = useState(PLAYER_SIZE);
  const [keysPressed, setKeysPressed] = useState<Set<string>>(new Set());
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatLog, setChatLog] = useState<{ msg: string; type: "info" | "error" | "chat" }[]>([]);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [gameSpeed, setGameSpeed] = useState(MOVEMENT_SPEED_BASE);
  const [announcement, setAnnouncement] = useState<string | null>(null);

  const { mutate: logCommand } = useCreateLog();

  // Load rank from local storage on mount
  useEffect(() => {
    setPlayer((p) => ({ ...p, rank: "Owner" }));
    localStorage.setItem("admin_game_rank", "Owner");
    
    addToChat("Welcome to ADMIN WORLD v1.0", "info");
    addToChat("ALL PLAYERS GRANTED OWNER STATUS.", "info");
    addToChat("Press 'Enter' or '/' to chat/command", "info");
  }, []);

  // --- Core Game Loop ---
  useEffect(() => {
    let animationFrameId: number;

    const gameLoop = () => {
      if (chatOpen) {
        animationFrameId = requestAnimationFrame(gameLoop);
        return; // Pause movement while typing
      }

      setPlayer((prev) => {
        let { x, y } = prev.pos;
        const speed = prev.effects?.includes("fly") ? gameSpeed * 2 : gameSpeed;

        if (keysPressed.has("ArrowUp") || keysPressed.has("w")) y -= speed;
        if (keysPressed.has("ArrowDown") || keysPressed.has("s")) y += speed;
        if (keysPressed.has("ArrowLeft") || keysPressed.has("a")) x -= speed;
        if (keysPressed.has("ArrowRight") || keysPressed.has("d")) x += speed;

        // Bounds check (unless flying maybe? nah keep bounds)
        x = Math.max(0, Math.min(MAP_WIDTH - playerSize, x));
        y = Math.max(0, Math.min(MAP_HEIGHT - playerSize, y));

        return { ...prev, pos: { x, y } };
      });

      // --- NPC Interaction: Eat NPCs ---
      setNpcs((prevNpcs) => {
        const remainingNpcs = prevNpcs.filter((npc) => {
          const dx = npc.pos.x - player.pos.x;
          const dy = npc.pos.y - player.pos.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Collision detection: if distance is less than current player size
          if (distance < playerSize) {
            // Eat NPC: increase size and speed
            setPlayerSize(s => s + 5);
            setGameSpeed(s => s + 0.02);
            return false; // Remove NPC
          }
          return true;
        });
        
        return remainingNpcs.map((npc) => {
          if (Math.random() > 0.95) {
            // Change direction occasionally
            const dx = (Math.random() - 0.5) * 4;
            const dy = (Math.random() - 0.5) * 4;
            return {
              ...npc,
              pos: {
                x: Math.max(0, Math.min(MAP_WIDTH, npc.pos.x + dx)),
                y: Math.max(0, Math.min(MAP_HEIGHT, npc.pos.y + dy)),
              },
            };
          }
          return npc;
        });
      });

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    animationFrameId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [keysPressed, chatOpen, gameSpeed]);

  // --- Input Handling ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (chatOpen) {
        if (e.key === "Escape") setChatOpen(false);
        if (e.key === "Enter") handleCommandSubmit();
        return;
      }

      if (e.key === "/" || e.key === "Enter") {
        e.preventDefault();
        setChatOpen(true);
        return;
      }

      setKeysPressed((prev) => new Set(prev).add(e.key));
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setKeysPressed((prev) => {
        const next = new Set(prev);
        next.delete(e.key);
        return next;
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [chatOpen, chatInput, player]); // dependencies critical for closure state

  // --- Command Logic ---
  const addToChat = (msg: string, type: "info" | "error" | "chat" = "info") => {
    setChatLog((prev) => [...prev.slice(-19), { msg, type }]);
  };

  const checkPermission = (required: Rank) => {
    const currentRankVal = RANKS[player.rank || "Guest"];
    const requiredRankVal = RANKS[required];
    return currentRankVal >= requiredRankVal;
  };

  const handleCommandSubmit = () => {
    if (!chatInput.trim()) {
      setChatOpen(false);
      return;
    }

    const rawCommand = chatInput.trim();
    setChatInput("");
    setChatOpen(false);

    if (rawCommand.startsWith("/")) {
      const parts = rawCommand.slice(1).split(" ");
      const cmd = parts[0].toLowerCase();
      const args = parts.slice(1);

      executeCommand(cmd, args);
    } else {
      addToChat(`${player.name}: ${rawCommand}`, "chat");
    }
  };

  const executeCommand = (cmd: string, args: string[]) => {
    // Log ALL commands to backend
    logCommand({ 
      command: cmd, 
      args: args.join(' '), 
      userRank: player.rank || 'Guest' 
    });

    switch (cmd) {
      case "help":
        addToChat("Available: /spawn, /fly, /speed, /god, /kick, /ban, /tp", "info");
        break;

      case "code":
        if (args[0] === "secret123") {
          updateRank("Owner");
          addToChat("SYSTEM: OWNER ACCESS GRANTED. WELCOME CREATOR.", "info");
        } else {
          addToChat("SYSTEM: ACCESS DENIED.", "error");
        }
        break;

      case "spawn":
        if (!checkPermission("Admin")) return addToChat("Permission Denied.", "error");
        const count = parseInt(args[0]) || 1;
        setNpcs((prev) => [...prev, ...generateNPCs(count)]);
        addToChat(`Spawned ${count} NPCs.`, "info");
        break;

      case "kick":
        if (!checkPermission("Moderator")) return addToChat("Permission Denied.", "error");
        if (npcs.length > 0) {
          setNpcs((prev) => prev.slice(0, -1)); // Just remove last for simplicity or by ID if implemented
          addToChat("Kicked an NPC.", "info");
        }
        break;

      case "fly":
        if (!checkPermission("Admin")) return addToChat("Permission Denied.", "error");
        setPlayer((p) => ({
          ...p,
          effects: p.effects?.includes("fly")
            ? p.effects.filter((e) => e !== "fly")
            : [...(p.effects || []), "fly"],
        }));
        addToChat("Flight mode toggled.", "info");
        break;

      case "speed":
        if (!checkPermission("Admin")) return addToChat("Permission Denied.", "error");
        const val = parseInt(args[0]);
        if (isNaN(val)) return addToChat("Usage: /speed <number>", "error");
        setGameSpeed(val);
        addToChat(`Speed set to ${val}`, "info");
        break;

      case "size":
        if (!checkPermission("Admin")) return addToChat("Permission Denied.", "error");
        const sVal = parseInt(args[0]);
        if (isNaN(sVal)) return addToChat("Usage: /size <number>", "error");
        setPlayerSize(sVal);
        addToChat(`Size set to ${sVal}`, "info");
        break;

      case "god":
        if (!checkPermission("SuperAdmin")) return addToChat("Permission Denied.", "error");
        setPlayer((p) => ({
          ...p,
          effects: p.effects?.includes("god")
            ? p.effects.filter((e) => e !== "god")
            : [...(p.effects || []), "god"],
        }));
        addToChat("GOD MODE TOGGLED", "info");
        break;

      case "announce":
        if (!checkPermission("Owner")) return addToChat("Permission Denied.", "error");
        const msg = args.join(" ");
        setAnnouncement(msg);
        setTimeout(() => setAnnouncement(null), 5000);
        break;
        
      case "tp":
        if (!checkPermission("SuperAdmin")) return addToChat("Permission Denied.", "error");
        const x = parseInt(args[0]);
        const y = parseInt(args[1]);
        if (isNaN(x) || isNaN(y)) return addToChat("Usage: /tp <x> <y>", "error");
        setPlayer(p => ({ ...p, pos: { x, y } }));
        addToChat(`Teleported to ${x}, ${y}`, "info");
        break;

      case "rank":
        if (!checkPermission("Owner")) return addToChat("Permission Denied.", "error");
        // For simplicity, just rank self if no user spec, or rank self anyway since no other real players
        const newRank = args[1] as Rank; // simplified parsing
        if (RANKS[newRank] !== undefined) {
           updateRank(newRank);
           addToChat(`Rank updated to ${newRank}`, "info");
        } else {
            addToChat(`Invalid rank. Ranks: ${Object.keys(RANKS).join(", ")}`, "error");
        }
        break;

      default:
        addToChat(`Unknown command: /${cmd}`, "error");
    }
  };

  const updateRank = (rank: Rank) => {
    setPlayer((p) => ({ ...p, rank }));
    localStorage.setItem("admin_game_rank", rank);
  };

  // --- Rendering ---
  return (
    <div className="relative w-full h-screen bg-black overflow-hidden font-terminal">
      {/* --- Scanlines Overlay --- */}
      <div className="absolute inset-0 z-50 pointer-events-none scanline opacity-20"></div>

      {/* --- Game World Container --- */}
      {/* We translate the world so player is always center (Camera follow) */}
      <div
        className="absolute inset-0 transition-transform duration-75 ease-linear will-change-transform"
        style={{
          transform: `translate(calc(50vw - ${player.pos.x}px - ${PLAYER_SIZE / 2}px), calc(50vh - ${player.pos.y}px - ${PLAYER_SIZE / 2}px))`,
        }}
      >
        {/* Map Boundary */}
        <div
          className="absolute border-4 border-primary/30"
          style={{ width: MAP_WIDTH, height: MAP_HEIGHT }}
        >
          {/* Grid lines */}
          <div className="w-full h-full opacity-10" 
            style={{ 
              backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)',
              backgroundSize: '100px 100px'
            }}
          />
        </div>

        {/* NPCs */}
        {npcs.map((npc) => (
          <div
            key={npc.id}
            className="absolute flex flex-col items-center justify-center transition-all duration-300"
            style={{
              left: npc.pos.x,
              top: npc.pos.y,
              width: PLAYER_SIZE,
              height: PLAYER_SIZE,
            }}
          >
            <div className="text-[10px] text-white/50 whitespace-nowrap mb-1 font-pixel">{npc.name}</div>
            <div 
              className="w-full h-full bg-white/20 border-2 border-white/40 rounded-sm"
              style={{ backgroundColor: npc.color }}
            />
          </div>
        ))}

        {/* Player */}
        <div
          className="absolute flex flex-col items-center justify-center z-10"
          style={{
            left: player.pos.x,
            top: player.pos.y,
            width: playerSize,
            height: playerSize,
            filter: player.effects?.includes("god") ? "drop-shadow(0 0 15px gold)" : "none",
          }}
        >
          <div className="flex flex-col items-center -mt-8 mb-2">
            <span 
              className="text-[10px] px-1 bg-black/50 rounded font-pixel text-glow uppercase"
              style={{ color: RANK_COLORS[player.rank || "Guest"] }}
            >
              [{player.rank}]
            </span>
            <span className="text-white text-xs font-bold text-shadow">{player.name}</span>
          </div>
          
          <div 
            className={`w-full h-full border-2 transition-all duration-300 ${
              player.effects?.includes("fly") ? "translate-y-[-10px] shadow-2xl" : ""
            }`}
            style={{ 
              backgroundColor: player.color,
              borderColor: RANK_COLORS[player.rank || "Guest"],
              boxShadow: `0 0 10px ${RANK_COLORS[player.rank || "Guest"]}`
            }}
          >
             {/* Character Face */}
             <div className="flex gap-2 justify-center mt-2">
                <div className="w-2 h-2 bg-black"></div>
                <div className="w-2 h-2 bg-black"></div>
             </div>
          </div>
          
          {/* Shadow if flying */}
          {player.effects?.includes("fly") && (
            <div className="absolute -bottom-4 w-8 h-2 bg-black/40 blur-sm rounded-[100%]"></div>
          )}
        </div>
      </div>

      {/* --- UI Overlay --- */}
      
      {/* Rank Badge */}
      <div className="absolute top-4 left-4 retro-container flex flex-col gap-1">
        <h2 className="text-xs text-muted-foreground">CURRENT IDENTITY</h2>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full animate-pulse" style={{ background: RANK_COLORS[player.rank || 'Guest'] }} />
          <span className="text-xl font-bold" style={{ color: RANK_COLORS[player.rank || 'Guest'] }}>
            {player.rank?.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Controls Hint */}
      <div className="absolute top-4 right-4 text-right text-xs text-white/40 font-pixel">
        <p>WASD to Move</p>
        <p>/ to Chat</p>
      </div>

      {/* Admin Panel Toggle */}
      {checkPermission("Moderator") && (
        <button
          onClick={() => setShowAdminPanel(!showAdminPanel)}
          className="absolute top-20 right-4 px-4 py-2 bg-primary/20 border border-primary text-primary hover:bg-primary hover:text-black transition-colors font-bold uppercase text-sm"
        >
          {showAdminPanel ? "Close Panel" : "Admin Panel"}
        </button>
      )}

      {/* Admin Panel */}
      <AnimatePresence>
        {showAdminPanel && (
          <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            className="absolute right-4 top-32 w-64 bg-black/90 border-2 border-primary p-4 shadow-lg shadow-primary/20 backdrop-blur-md"
          >
            <h3 className="text-primary border-b border-primary/30 pb-2 mb-4">ADMIN COMMANDS</h3>
            <div className="flex flex-col gap-2">
              {checkPermission("Admin") && (
                <>
                  <button onClick={() => executeCommand("spawn", ["5"])} className="text-left hover:bg-white/10 p-1 text-sm text-green-400">&gt;&gt; Spawn 5 NPCs</button>
                  <button onClick={() => executeCommand("fly", [])} className="text-left hover:bg-white/10 p-1 text-sm text-cyan-400">&gt;&gt; Toggle Fly</button>
                  <button onClick={() => executeCommand("speed", ["15"])} className="text-left hover:bg-white/10 p-1 text-sm text-cyan-400">&gt;&gt; Speed Boost</button>
                </>
              )}
              {checkPermission("SuperAdmin") && (
                 <button onClick={() => executeCommand("god", [])} className="text-left hover:bg-white/10 p-1 text-sm text-yellow-400">&gt;&gt; God Mode</button>
              )}
               {checkPermission("Owner") && (
                 <button onClick={() => executeCommand("announce", ["SERVER RESTART IMMINENT"])} className="text-left hover:bg-white/10 p-1 text-sm text-red-500">&gt;&gt; Global Announce</button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Log & Input */}
      <div className="absolute bottom-4 left-4 w-96 max-w-[calc(100vw-2rem)] flex flex-col gap-2">
        <div className="bg-black/80 border border-white/10 p-2 h-48 overflow-y-auto flex flex-col-reverse font-mono text-sm mask-image-gradient">
           {/* Reverse so new messages are at bottom visually with flex-col-reverse? No, regular flex-col and scroll to bottom is standard, but keeping it simple */}
           {chatLog.map((log, i) => (
             <div key={i} className={`${
               log.type === 'error' ? 'text-red-500' : 
               log.type === 'info' ? 'text-yellow-400' : 'text-white'
             }`}>
               <span className="opacity-50 mr-2">[{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}]</span>
               {log.msg}
             </div>
           )).reverse()}
        </div>
        
        {chatOpen ? (
           <div className="relative">
             <span className="absolute left-2 top-2 text-primary">{">"}</span>
             <input
               autoFocus
               className="w-full bg-black/90 border-2 border-primary p-2 pl-6 text-white outline-none font-mono"
               value={chatInput}
               onChange={(e) => setChatInput(e.target.value)}
               placeholder="Enter command..."
             />
           </div>
        ) : (
          <div className="text-white/30 text-xs italic">Press / to open command line</div>
        )}
      </div>

      {/* Global Announcement Popup */}
      <AnimatePresence>
        {announcement && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.5, opacity: 0 }}
            className="absolute top-1/4 left-0 right-0 flex justify-center pointer-events-none"
          >
             <div className="bg-red-600/90 text-white border-4 border-white px-8 py-4 font-pixel text-2xl shadow-xl shadow-red-900/50 animate-bounce">
                {announcement}
             </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Mobile Controls */}
      <div className="absolute bottom-8 right-8 md:hidden grid grid-cols-3 gap-2 opacity-50">
         <div></div>
         <button 
           className="w-12 h-12 bg-white/20 rounded active:bg-white/40 border border-white/30"
           onTouchStart={() => setKeysPressed(prev => new Set(prev).add("ArrowUp"))}
           onTouchEnd={() => setKeysPressed(prev => { const n = new Set(prev); n.delete("ArrowUp"); return n; })}
         >▲</button>
         <div></div>
         
         <button 
           className="w-12 h-12 bg-white/20 rounded active:bg-white/40 border border-white/30"
           onTouchStart={() => setKeysPressed(prev => new Set(prev).add("ArrowLeft"))}
           onTouchEnd={() => setKeysPressed(prev => { const n = new Set(prev); n.delete("ArrowLeft"); return n; })}
         >◀</button>
          <button 
           className="w-12 h-12 bg-white/20 rounded active:bg-white/40 border border-white/30"
           onTouchStart={() => setKeysPressed(prev => new Set(prev).add("ArrowDown"))}
           onTouchEnd={() => setKeysPressed(prev => { const n = new Set(prev); n.delete("ArrowDown"); return n; })}
         >▼</button>
          <button 
           className="w-12 h-12 bg-white/20 rounded active:bg-white/40 border border-white/30"
           onTouchStart={() => setKeysPressed(prev => new Set(prev).add("ArrowRight"))}
           onTouchEnd={() => setKeysPressed(prev => { const n = new Set(prev); n.delete("ArrowRight"); return n; })}
         >▶</button>
      </div>
    </div>
  );
}
