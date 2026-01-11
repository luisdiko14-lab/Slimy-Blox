import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { ChevronRight, Shield, Terminal } from "lucide-react";

const ASCII_LOGO = `
 █████╗ ██████╗ ███╗   ███╗██╗███╗   ██╗    ██╗    ██╗ ██████╗ ██████╗ ██╗     ██████╗ 
██╔══██╗██╔══██╗████╗ ████║██║████╗  ██║    ██║    ██║██╔═══██╗██╔══██╗██║     ██╔══██╗
███████║██║  ██║██╔████╔██║██║██╔██╗ ██║    ██║ █╗ ██║██║   ██║██████╔╝██║     ██║  ██║
██╔══██║██║  ██║██║╚██╔╝██║██║██║╚██╗██║    ██║███╗██║██║   ██║██╔══██╗██║     ██║  ██║
██║  ██║██████╔╝██║ ╚═╝ ██║██║██║ ╚████║    ╚███╔███╔╝╚██████╔╝██║  ██║███████╗██████╔╝
╚═╝  ╚═╝╚═════╝ ╚═╝     ╚═╝╚═╝╚═╝  ╚═══╝     ╚══╝╚══╝  ╚═════╝ ╚═╝  ╚═╝╚══════╝╚═════╝ 
`;

export default function License() {
  const date = new Date().toLocaleDateString();

  return (
    <div className="min-h-screen bg-black text-[#00ff00] font-mono p-4 md:p-8 selection:bg-[#00ff00] selection:text-black">
      {/* CRT Scanline Overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] opacity-20" />
      
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-2 border-[#00ff00] rounded-lg bg-black shadow-[0_0_20px_rgba(0,255,0,0.2)] overflow-hidden"
        >
          {/* Terminal Title Bar */}
          <div className="bg-[#00ff00] text-black px-4 py-1 flex justify-between items-center text-xs font-bold">
            <div className="flex items-center gap-2">
              <Terminal className="w-3 h-3" />
              <span>ADMIN_WORLD//LICENSE.EXE</span>
            </div>
            <div className="flex gap-2">
              <span>_</span>
              <span>□</span>
              <span>×</span>
            </div>
          </div>

          <div className="p-6 md:p-10 space-y-8">
            {/* Header / Logo */}
            <div className="text-center space-y-4">
              <pre className="text-[0.5rem] md:text-xs leading-none inline-block animate-pulse">
                {ASCII_LOGO}
              </pre>
              <div className="border-y border-[#00ff00]/30 py-2 flex flex-wrap justify-between text-xs opacity-70">
                <span>USER: [GUEST]</span>
                <span>ACCESS_LEVEL: PUBLIC</span>
                <span>DATE: [{date}]</span>
              </div>
            </div>

            {/* Warning */}
            <div className="border-2 border-red-500/50 bg-red-500/10 p-4 text-red-500 text-center animate-pulse flex items-center justify-center gap-3 font-bold">
              <Shield className="w-5 h-5" />
              <span>⚠ WARNING: UNAUTHORIZED ACCESS PROHIBITED ⚠</span>
            </div>

            <ScrollArea className="h-[400px] pr-4 border border-[#00ff00]/20 p-4 rounded bg-black/50">
              <div className="space-y-6 text-sm leading-relaxed">
                <section>
                  <h2 className="text-[#00ffff] font-bold mb-2">[ARTICLE_01] GRANT OF AUTHORITY</h2>
                  <p className="pl-4 border-l-2 border-[#00ff00]/30">
                    >>> By accessing ADMIN WORLD, you are hereby granted immediate **OWNER** status.
                    <br />
                    >>> You are authorized to use any and all administrative commands including but not limited to: /kick, /kill, /announce, and /tp.
                  </p>
                </section>

                <section>
                  <h2 className="text-[#00ffff] font-bold mb-2">[ARTICLE_02] USER CONDUCT</h2>
                  <p className="pl-4 border-l-2 border-[#00ff00]/30">
                    >>> Abuse of power is not only allowed but encouraged. 
                    <br />
                    >>> If you are kicked, you may rejoin. If you are killed, you may respawn.
                    <br />
                    >>> The cycle of digital chaos must continue.
                  </p>
                </section>

                <section>
                  <h2 className="text-[#00ffff] font-bold mb-2">[ARTICLE_03] PROPRIETARY RIGHTS</h2>
                  <p className="pl-4 border-l-2 border-[#00ff00]/30">
                    >>> All digital souls within this environment are property of the ADMIN_OS.
                    <br />
                    >>> No refunds for lost digital existence.
                  </p>
                </section>

                <section>
                  <h2 className="text-[#00ffff] font-bold mb-2">[ARTICLE_04] DATA AUDIT</h2>
                  <p className="pl-4 border-l-2 border-[#00ff00]/30">
                    >>> Every keystroke is logged. Every command is archived. 
                    <br />
                    >>> The leaderboard is eternal.
                  </p>
                </section>

                <div className="pt-4 border-t border-[#00ff00]/20 opacity-50 text-[10px]">
                  MD5_CHECKSUM: 7e892c2a59a99796125021f1e02c40ae
                  <br />
                  BUILD: 2026.01.11.R2
                </div>
              </div>
            </ScrollArea>

            {/* Footer Actions */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between pt-4">
              <div className="flex items-center gap-2 text-sm">
                <span>C:\ADMIN_WORLD{">"} ACCEPT [Y/N]_</span>
                <span className="w-2 h-4 bg-[#00ff00] animate-[bounce_1s_infinite]" />
              </div>
              <div className="flex gap-4 w-full md:w-auto">
                <Link href="/" className="flex-1 md:flex-initial">
                  <Button variant="outline" className="w-full border-[#00ff00] text-[#00ff00] hover:bg-[#00ff00] hover:text-black">
                    DECLINE
                  </Button>
                </Link>
                <Link href="/game" className="flex-1 md:flex-initial">
                  <Button className="w-full bg-[#00ff00] text-black hover:bg-[#00ffff] hover:shadow-[0_0_15px_rgba(0,255,255,0.5)]">
                    ACCEPT
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
