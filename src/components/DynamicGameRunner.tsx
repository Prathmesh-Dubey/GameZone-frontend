import React, { useState, useEffect, useMemo, useRef, memo } from "react";
import * as LucideReact from "lucide-react";
import * as Motion from "motion/react";
import * as Babel from "@babel/standalone";

interface DynamicGameRunnerProps {
  jsCode: string;
  onScoreSubmit: (score: number) => void;
  gameId?: string;
  userId?: string;
  gameTitle?: string;
}

const DynamicGameRunner = memo(function DynamicGameRunner({
  jsCode,
  onScoreSubmit,
  gameId,
  userId,
  gameTitle,
}: DynamicGameRunnerProps) {

  const [error, setError] = useState<string | null>(null);
  const [compiledCode, setCompiledCode] = useState<string | null>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [scale, setScale] = useState(1);
  const [scaledDimensions, setScaledDimensions] = useState<{ width: number; height: number } | null>(null);
  const isUpdatingScale = useRef(false);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  // Handle browser fullscreen state
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Step 1: Transpile
  useEffect(() => {
    if (!jsCode) {
      setCompiledCode(null);
      setError("No source code provided.");
      return;
    }

    try {
      setError(null);
      const result = Babel.transform(jsCode, {
        presets: [
          ["env", { modules: "commonjs", targets: { esmodules: false }, useBuiltIns: false }],
          ["react", { runtime: "classic" }],
          "typescript",
        ],
        filename: "game.tsx",
      });
      setCompiledCode(result.code);
    } catch (err: any) {
      console.error("Transpilation error:", err);
      setError(`Transpilation failed: ${err.message}`);
      setCompiledCode(null);
    }
  }, [jsCode]);

  // Step 2: Evaluate
  const ComponentToRender = useMemo(() => {
    if (!compiledCode) return null;

    try {
      if (typeof window !== "undefined") {
        (window as any).CANVAS_WIDTH = (window as any).CANVAS_WIDTH ?? 800;
        (window as any).CANVAS_HEIGHT = (window as any).CANVAS_HEIGHT ?? 600;
        (window as any).WIDTH = (window as any).WIDTH ?? 800;
        (window as any).HEIGHT = (window as any).HEIGHT ?? 600;
      }
      if (typeof globalThis !== "undefined") {
        (globalThis as any).CANVAS_WIDTH = (globalThis as any).CANVAS_WIDTH ?? 800;
        (globalThis as any).CANVAS_HEIGHT = (globalThis as any).CANVAS_HEIGHT ?? 600;
        (globalThis as any).WIDTH = (globalThis as any).WIDTH ?? 800;
        (globalThis as any).HEIGHT = (globalThis as any).HEIGHT ?? 600;
      }

      const exports: any = {};
      const module = { exports };

      const requireMock = (pkgName: string) => {
        if (pkgName === "react" || pkgName.startsWith("react/")) {
          return React;
        }
        if (pkgName === "lucide-react") {
          return LucideReact;
        }
        if (pkgName === "motion" || pkgName === "motion/react" || pkgName === "framer-motion") {
          return Motion;
        }
        throw new Error(`Package "${pkgName}" is not available in the Game Zone Sandbox.`);
      };

      const runner = new Function("exports", "module", "require", "React", compiledCode);
      runner(exports, module, requireMock, React);

      const ExecutedComponent = module.exports.default || module.exports.Game || Object.values(module.exports)[0];

      if (!ExecutedComponent || typeof ExecutedComponent !== "function") {
        throw new Error("No valid React component exported as default or named export.");
      }

      return ExecutedComponent;
    } catch (err: any) {
      console.error("Evaluation Error in Game Sandbox:", err);
      setError(err.message || "Unknown error during evaluation");
      return null;
    }
  }, [compiledCode]);

  // Auto-scale with debounce to prevent rapid re-renders
  useEffect(() => {
    if (!ComponentToRender || !containerRef.current || !contentRef.current) return;

    const updateScale = () => {
      if (isUpdatingScale.current) return;
      isUpdatingScale.current = true;

      try {
        if (!containerRef.current || !contentRef.current) return;

        const containerWidth = containerRef.current.clientWidth;
        const containerHeight = containerRef.current.clientHeight;

        const prevTransform = contentRef.current.style.transform;
        contentRef.current.style.transform = "scale(1)";

        const contentWidth = contentRef.current.scrollWidth || contentRef.current.offsetWidth;
        const contentHeight = contentRef.current.scrollHeight || contentRef.current.offsetHeight;

        contentRef.current.style.transform = prevTransform;

        if (contentWidth === 0 || contentHeight === 0 || containerWidth === 0 || containerHeight === 0) return;

        const paddingFactor = 0.98;
        const scaleX = (containerWidth * paddingFactor) / contentWidth;
        const scaleY = (containerHeight * paddingFactor) / contentHeight;

        const fitScale = Math.min(scaleX, scaleY);
        const newScale = Math.max(0.2, fitScale);

        setScale(prev => {
          if (Math.abs(prev - newScale) < 0.005) return prev;
          return newScale;
        });
        const newWidth = Math.floor(contentWidth * newScale);
        const newHeight = Math.floor(contentHeight * newScale);

        setScaledDimensions(prev => {
          if (prev && Math.abs(prev.width - newWidth) < 2 && Math.abs(prev.height - newHeight) < 2) return prev;
          return { width: newWidth, height: newHeight };
        });
      } finally {
        isUpdatingScale.current = false;
      }
    };

    const debouncedUpdate = () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
      debounceTimeout.current = setTimeout(updateScale, 50);
    };

    const resizeObserver = new ResizeObserver(() => debouncedUpdate());
    if (containerRef.current) resizeObserver.observe(containerRef.current);
    if (contentRef.current) resizeObserver.observe(contentRef.current);

    window.addEventListener("resize", debouncedUpdate);

    const t1 = setTimeout(updateScale, 30);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", debouncedUpdate);
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
      clearTimeout(t1);
    };
  }, [ComponentToRender, isFullscreen]);

  // Render
  if (error) {
    return (
      <div className="bg-red-950/40 border border-red-500/30 rounded-2xl p-6 text-center max-w-xl mx-auto shadow-xl">
        <LucideReact.AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4 animate-bounce" />
        <h3 className="text-lg font-bold text-red-400">Sandbox Execution Failed</h3>
        <p className="text-xs text-gray-400 mt-2 font-mono bg-black/50 p-3 rounded-lg overflow-x-auto text-left whitespace-pre-wrap">
          {error}
        </p>
        <button
          onClick={() => setError(null)}
          className="mt-4 px-4 py-2 bg-red-800 hover:bg-red-700 text-white rounded-lg text-xs font-semibold transition"
        >
          Dismiss & Retry
        </button>
      </div>
    );
  }

  if (!ComponentToRender) {
    return (
      <div className="text-center p-12 text-gray-400 font-mono text-xs">
        <LucideReact.Cpu className="w-8 h-8 text-blue-500 mx-auto mb-2 animate-spin" />
        Preparing dynamic gaming sandbox...
      </div>
    );
  }

  try {
    return (
      <div
        ref={containerRef}
        className={`group relative flex items-center justify-center overflow-hidden transition-all ${isFullscreen
          ? "fixed inset-0 w-screen h-screen bg-[#020205] z-[9999]"
          : "w-full h-full flex-1"
          }`}
      >
        {gameTitle && (
          <div className="absolute top-3 left-3 z-50 bg-black/60 backdrop-blur-md border border-white/10 rounded-xl px-3 py-1.5 shadow-lg opacity-0 group-hover:opacity-100 transition-all">
            <span className="text-xs font-bold text-white/90">{gameTitle}</span>
          </div>
        )}

        <div
          style={{
            width: scaledDimensions ? `${scaledDimensions.width}px` : "auto",
            height: scaledDimensions ? `${scaledDimensions.height}px` : "auto",
            maxWidth: "100%",
            maxHeight: "100%",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
          className="shrink-0"
        >
          <div
            ref={contentRef}
            style={{
              transform: `scale(${scale})`,
              transformOrigin: "center center",
              transition: "transform 0.15s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
            className="flex items-center justify-center shrink-0"
          >
            <ComponentToRender
              onScoreSubmit={onScoreSubmit}
              gameId={gameId}
              userId={userId}
            />
          </div>
        </div>

        <button
          onClick={() => {
            if (!document.fullscreenElement && containerRef.current) {
              containerRef.current.requestFullscreen().catch(console.error);
            } else if (document.exitFullscreen) {
              document.exitFullscreen().catch(console.error);
            }
          }}
          className={`absolute top-4 ${isFullscreen ? "right-4" : "right-16"} p-2 bg-black/50 hover:bg-black/70 backdrop-blur-md rounded-xl text-white/80 hover:text-white transition-all z-[100] border border-white/10 shadow-lg`}
          title={isFullscreen ? "Exit Fullscreen" : "Maximize"}
        >
          {isFullscreen ? (
            <LucideReact.Minimize className="w-5 h-5" />
          ) : (
            <LucideReact.Maximize className="w-5 h-5" />
          )}
        </button>
      </div>
    );
  } catch (renderError: any) {
    return (
      <div className="bg-red-950/40 border border-red-500/30 rounded-2xl p-6 text-center max-w-xl mx-auto shadow-xl">
        <LucideReact.Flame className="w-12 h-12 text-orange-500 mx-auto mb-4 animate-pulse" />
        <h3 className="text-lg font-bold text-red-400">Runtime Crash</h3>
        <p className="text-xs text-gray-400 mt-2 font-mono bg-black/50 p-3 rounded-lg text-left">
          {renderError.message || "An exception occurred inside the game component."}
        </p>
      </div>
    );
  }
});

export default DynamicGameRunner;
