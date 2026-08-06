import React, { useState, useEffect } from "react";
import {
  Cpu,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Code,
  FileText,
  ArrowRight,
  Calculator,
  Gamepad2,
} from "lucide-react";
import { Game } from "../api/api";
import { useGame, useSimulator } from '../hooks';
import { useCreateGame, useUpdateGame, useCreateSimulator, useUpdateSimulator } from '../hooks';

const STATISTICS_CALCULATOR_TEMPLATE = `import React, { useState } from 'react';
import { Calculator, BarChart2, Plus, Trash2, RefreshCw, Zap } from 'lucide-react';

export default function StatisticsCalculator({ onScoreSubmit }) {
  const [inputVal, setInputVal] = useState("");
  const [numbers, setNumbers] = useState([12, 45, 23, 67, 89, 34, 56, 78, 90, 11]);

  const addNumber = () => {
    const parsed = parseFloat(inputVal);
    if (!isNaN(parsed)) {
      setNumbers(prev => [...prev, parsed]);
      setInputVal("");
    }
  };

  const parseBulk = () => {
    const items = inputVal
      .split(/[\\s,]+/)
      .map(n => parseFloat(n.trim()))
      .filter(n => !isNaN(n));
    if (items.length > 0) {
      setNumbers(prev => [...prev, ...items]);
      setInputVal("");
    }
  };

  const removeNumber = (index) => {
    setNumbers(prev => prev.filter((_, i) => i !== index));
  };

  const clearAll = () => setNumbers([]);

  const count = numbers.length;
  const sorted = [...numbers].sort((a, b) => a - b);
  const sum = numbers.reduce((acc, curr) => acc + curr, 0);
  const mean = count > 0 ? sum / count : 0;
  
  const median = count === 0 ? 0 : (
    count % 2 !== 0
      ? sorted[Math.floor(count / 2)]
      : (sorted[count / 2 - 1] + sorted[count / 2]) / 2
  );

  const min = count > 0 ? Math.min(...numbers) : 0;
  const max = count > 0 ? Math.max(...numbers) : 0;
  const range = max - min;

  const variance = count > 0 
    ? numbers.reduce((acc, n) => acc + Math.pow(n - mean, 2), 0) / count
    : 0;
  const stdDev = Math.sqrt(variance);

  const handleExportResult = () => {
    if (onScoreSubmit && count > 0) {
      onScoreSubmit(Math.round(mean));
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-2xl border border-slate-800 font-sans">
      <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
            <Calculator className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight text-white">Statistics Calculator</h2>
            <p className="text-xs text-slate-400 font-mono">Real-time Data Stream & Metrics Simulator</p>
          </div>
        </div>
        <button
          onClick={clearAll}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Clear Data
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="Enter numbers (e.g. 42 or 10, 20, 30)..."
          onKeyDown={(e) => { if (e.key === 'Enter') parseBulk(); }}
          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 font-mono"
        />
        <button
          onClick={addNumber}
          className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition"
        >
          <Plus className="w-4 h-4" /> Add Single
        </button>
        <button
          onClick={parseBulk}
          className="px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition"
        >
          <Zap className="w-4 h-4" /> Add Bulk
        </button>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-slate-400 font-mono uppercase tracking-wider">Sample Dataset ({count} items)</span>
        </div>
        <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto p-3 bg-slate-950/60 rounded-2xl border border-slate-800/80">
          {numbers.map((num, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1.5 bg-slate-800 text-slate-200 border border-slate-700 px-3 py-1 rounded-lg text-xs font-mono group hover:border-red-500/50 transition"
            >
              {num}
              <button
                onClick={() => removeNumber(idx)}
                className="text-slate-500 hover:text-red-400 transition"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </span>
          ))}
          {numbers.length === 0 && (
            <span className="text-xs text-slate-500 font-mono p-2">No numbers entered. Type above to add dataset.</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80">
          <p className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Mean (Average)</p>
          <p className="text-xl font-bold text-indigo-400 mt-1 font-mono">{mean.toFixed(2)}</p>
        </div>
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80">
          <p className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Median</p>
          <p className="text-xl font-bold text-purple-400 mt-1 font-mono">{median.toFixed(2)}</p>
        </div>
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80">
          <p className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Std Deviation</p>
          <p className="text-xl font-bold text-pink-400 mt-1 font-mono">{stdDev.toFixed(2)}</p>
        </div>
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80">
          <p className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Sum Total</p>
          <p className="text-xl font-bold text-emerald-400 mt-1 font-mono">{sum.toFixed(2)}</p>
        </div>
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80">
          <p className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Min Value</p>
          <p className="text-xl font-bold text-cyan-400 mt-1 font-mono">{min}</p>
        </div>
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80">
          <p className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Max Value</p>
          <p className="text-xl font-bold text-amber-400 mt-1 font-mono">{max}</p>
        </div>
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80">
          <p className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Range</p>
          <p className="text-xl font-bold text-blue-400 mt-1 font-mono">{range}</p>
        </div>
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80">
          <p className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Variance</p>
          <p className="text-xl font-bold text-violet-400 mt-1 font-mono">{variance.toFixed(2)}</p>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-slate-800">
        <button
          onClick={handleExportResult}
          disabled={count === 0}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-extrabold text-xs shadow-lg disabled:opacity-50 transition flex items-center gap-2"
        >
          <BarChart2 className="w-4 h-4" /> Save Score Metric ({Math.round(mean)})
        </button>
      </div>
    </div>
  );
}`;

const GAME_TEMPLATE = `import React, { useState, useEffect } from 'react';
import { Gamepad2, Trophy, RefreshCw } from 'lucide-react';

export default function CustomGame({ onScoreSubmit }) {
  const [score, setScore] = useState(0);
  const [active, setActive] = useState(true);

  return (
    <div className="p-8 bg-slate-900 text-white rounded-3xl text-center max-w-md mx-auto border border-slate-800 shadow-2xl">
      <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <Gamepad2 className="w-8 h-8 text-white" />
      </div>
      <h2 className="text-xl font-black mb-2">Custom Arcade Game</h2>
      <p className="text-xs text-slate-400 mb-6 font-mono">Score: <span className="text-blue-400 font-bold">{score}</span></p>
      
      <div className="flex gap-3 justify-center mb-6">
        <button
          onClick={() => setScore(prev => prev + 10)}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg transition"
        >
          Tap to Score (+10)
        </button>
        <button
          onClick={() => setScore(0)}
          className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-xl transition"
        >
          Reset
        </button>
      </div>

      <button
        onClick={() => onScoreSubmit && onScoreSubmit(score)}
        className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-xs rounded-xl shadow-lg transition"
      >
        Submit Final Score ({score})
      </button>
    </div>
  );
}`;

interface CreatorViewProps {
  onGameCreated: (game: Game) => void;
  editGameId?: string | null;
  onEditComplete?: () => void;
  mode?: "game" | "simulator";
}

export default function CreatorView({
  onGameCreated,
  editGameId,
  onEditComplete,
  mode = "game",
}: CreatorViewProps) {
  const isSimulator = mode === "simulator";

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(isSimulator ? "Simulator" : "Arcade");
  const [thumbnail, setThumbnail] = useState("");
  const [code, setCode] = useState("");
  const [typeState, setTypeState] = useState<string>(isSimulator ? "simulator" : "game");
  const [compiling, setCompiling] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; msg: string } | null>(
    null
  );

  const { data: simData, isError: isSimError } = useSimulator(mode === "simulator" ? editGameId || null : null);
  const { data: gameData, isError: isGameError } = useGame(mode !== "simulator" ? editGameId || null : null);

  const createGame = useCreateGame();
  const updateGame = useUpdateGame();
  const createSimulator = useCreateSimulator();
  const updateSimulator = useUpdateSimulator();

  // Sync mode changes when props change
  useEffect(() => {
    if (!editGameId) {
      if (mode === "simulator") {
        setTitle("");
        setDescription("");
        setCategory("Simulator");
        setThumbnail("");
        setCode("");
        setTypeState("simulator");
      } else {
        setTitle("");
        setDescription("");
        setCategory("Arcade");
        setThumbnail("");
        setCode("");
        setTypeState("game");
      }
    }
  }, [mode, editGameId]);

  // Load game or simulator when editing
  useEffect(() => {
    if (editGameId) {
      if (mode === "simulator" && simData) {
        setTitle(simData.title);
        setDescription(simData.description || "");
        setCategory(simData.category || "Simulator");
        setThumbnail(simData.thumbnail || "");
        setCode(simData.simulatorCode || simData.gameCode || "");
        setTypeState("simulator");
        setStatus(null);
      } else if (mode !== "simulator" && gameData) {
        setTitle(gameData.title);
        setDescription(gameData.description || "");
        setCategory(gameData.category || (gameData.type === "simulator" ? "Simulator" : "Arcade"));
        setThumbnail(gameData.thumbnail || "");
        setCode(gameData.gameCode || "");
        setTypeState(gameData.type || "game");
        setStatus(null);
      }
      if (isSimError || isGameError) {
        setStatus({
          type: "error",
          msg: "Could not load data for editing.",
        });
      }
    }
  }, [editGameId, mode, simData, gameData, isSimError, isGameError]);

  const handleCompileAndAdd = async () => {
    if (!title.trim() || !category.trim()) {
      setStatus({
        type: "error",
        msg: "Title and Category are required parameters.",
      });
      return;
    }

    if (!code.trim()) {
      setStatus({
        type: "error",
        msg: "Source code cannot be empty. Please provide valid React component code.",
      });
      return;
    }

    setCompiling(true);
    setStatus(null);

    try {
      let result: any;
      if (typeState === "simulator") {
        const simPayload = {
          title: title.trim(),
          description: description.trim() || null,
          category: category.trim(),
          thumbnail: thumbnail.trim() || null,
          active: true,
          simulatorCode: code,
          gameCode: code,
          isDynamic: true,
          type: "simulator",
        };
        if (editGameId) {
          result = await updateSimulator.mutateAsync({ id: editGameId, data: simPayload });
        } else {
          result = await createSimulator.mutateAsync(simPayload);
        }
      } else {
        const gamePayload = {
          title: title.trim(),
          description: description.trim() || null,
          category: category.trim(),
          thumbnail: thumbnail.trim() || null,
          active: true,
          gameCode: code,
          isDynamic: true,
          type: "game",
        };
        if (editGameId) {
          result = await updateGame.mutateAsync({ id: editGameId, data: gamePayload });
        } else {
          result = await createGame.mutateAsync(gamePayload);
        }
      }

      setStatus({
        type: "success",
        msg: `Successfully ${editGameId ? "updated" : "compiled"} "${title}"! Added to ${typeState === "simulator" ? "Simulators" : "Arcade"}.`,
      });

      onGameCreated(result);
      if (editGameId && onEditComplete) onEditComplete();
    } catch (err: any) {
      console.error(err);
      setStatus({
        type: "error",
        msg: err.message || "An unexpected error occurred during compilation.",
      });
    } finally {
      setCompiling(false);
    }
  };

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-12 lg:gap-8 max-w-7xl w-full mx-auto h-full animate-fade-in bg-white dark:bg-slate-900 lg:bg-transparent lg:dark:bg-transparent border border-slate-200 dark:border-slate-800 lg:border-none rounded-2xl lg:rounded-none shadow-md lg:shadow-none overflow-y-auto lg:overflow-visible">
      {/* Left side – Form and Info */}
      <div className="lg:col-span-5 flex flex-col gap-6 p-5 md:p-6 lg:p-0 lg:overflow-y-auto lg:pr-2 lg:scrollbar-none border-b border-slate-200 dark:border-slate-800 lg:border-none shrink-0">
        <div className="lg:bg-white lg:dark:bg-slate-900 lg:border lg:border-slate-200 lg:dark:border-slate-800 lg:rounded-2xl lg:p-5 md:lg:p-6 lg:shadow-md flex flex-col gap-6">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              {typeState === "simulator" ? (
                <Calculator className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              ) : (
                <Code className="w-5 h-5 text-blue-600 dark:text-blue-500" />
              )}
              {typeState === "simulator" ? "Simulator TSX Studio" : "Single-File TSX Sandbox"}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {editGameId
                ? `Editing existing ${typeState} – modify code and save changes.`
                : `Write or paste single-file React component code exporting a default ${typeState}.`}
            </p>
          </div>

          {/* Entity Type Selector Toggle */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-slate-500 dark:text-slate-400 font-mono uppercase font-bold tracking-wider">
              Target Entity Type
            </label>
            <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setTypeState("game");
                  if (!editGameId) {
                    setTitle("");
                    setDescription("");
                    setCategory("Arcade");
                    setThumbnail("");
                    setCode("");
                  }
                }}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all ${typeState === "game"
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                  }`}
              >
                <Gamepad2 className="w-4 h-4" /> Game
              </button>

              <button
                type="button"
                onClick={() => {
                  setTypeState("simulator");
                  if (!editGameId) {
                    setTitle("");
                    setDescription("");
                    setCategory("Simulator");
                    setThumbnail("");
                    setCode("");
                  }
                }}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all ${typeState === "simulator"
                  ? "bg-purple-600 text-white shadow-md"
                  : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                  }`}
              >
                <Calculator className="w-4 h-4" /> Simulator
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-slate-500 dark:text-slate-400 font-mono">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-blue-500 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none transition-all"
              placeholder="e.g. Statistics Calculator"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-slate-500 dark:text-slate-400 font-mono">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-blue-500 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none transition-all font-semibold"
            >
              {typeState === "simulator" ? (
                <>
                  <option value="Simulator" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Simulator</option>
                  <option value="Math" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Math</option>
                  <option value="Analytics" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Analytics</option>
                  <option value="Physics" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Physics</option>
                  <option value="Utility" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Utility</option>
                  <option value="Chemistry" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Chemistry</option>
                </>
              ) : (
                <>
                  <option value="Arcade" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Arcade</option>
                  <option value="Casual" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Casual</option>
                  <option value="Strategy" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Strategy</option>
                  <option value="Action" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Action</option>
                  <option value="Puzzle" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Puzzle</option>
                </>
              )}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-slate-500 dark:text-slate-400 font-mono">Short Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-blue-500 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none transition-all"
              placeholder="Details about features and functions..."
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-slate-500 dark:text-slate-400 font-mono">Thumbnail Cover Image URL</label>
            <input
              type="text"
              value={thumbnail}
              onChange={(e) => setThumbnail(e.target.value)}
              className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-blue-500 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none transition-all"
            />
          </div>
        </div>
      </div>

      {/* Right side – Code Editor */}
      <div className="lg:col-span-7 p-5 md:p-6 lg:p-0 flex flex-col gap-6 lg:h-full shrink-0 min-h-[500px] lg:min-h-0">
        <div className="lg:bg-white lg:dark:bg-slate-900 lg:border lg:border-slate-200 lg:dark:border-slate-800 lg:rounded-2xl lg:p-5 md:lg:p-6 lg:shadow-md flex flex-col gap-6 h-full flex-1 min-h-[400px]">
          <div className="flex flex-col gap-1.5 flex-1 h-full min-h-[300px]">
            <div className="flex justify-between items-center bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 border-b-0 px-4 py-2.5 rounded-t-xl text-xs text-slate-500 dark:text-slate-400 font-mono">
              <div className="flex items-center gap-1.5">
                <FileText className={`w-3.5 h-3.5 ${typeState === "simulator" ? "text-purple-600" : "text-blue-600"}`} />
                <span>
                  {title.toLowerCase().replace(/\s+/g, "-") || "custom-module"}.tsx
                </span>
              </div>
              <span className={`text-[10px] uppercase font-semibold ${typeState === "simulator" ? "text-purple-600" : "text-blue-600"}`}>
                {editGameId ? "Editing" : "Ready to compile"}
              </span>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-full flex-1 p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-b-xl text-xs text-indigo-700 dark:text-indigo-400 font-mono focus:outline-none overflow-y-auto resize-none"
              spellCheck="false"
              placeholder="// Paste your React TSX component code here..."
            />
          </div>

          {/* Status + Button */}
          <div className="flex flex-col gap-4 mt-auto shrink-0">
            {status && (
              <div
                className={`p-4 rounded-xl flex gap-3 text-xs border ${status.type === "success"
                  ? "bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/30 text-green-700 dark:text-green-400"
                  : "bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-400"
                  }`}
              >
                {status.type === "success" ? (
                  <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                )}
                <span className="font-mono">{status.msg}</span>
              </div>
            )}

            <button
              type="button"
              onClick={handleCompileAndAdd}
              disabled={compiling}
              className={`w-full ${typeState === "simulator"
                ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500"
                : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500"
                } active:scale-[0.98] disabled:opacity-50 disabled:scale-100 disabled:pointer-events-none text-white font-extrabold text-xs py-3.5 rounded-xl transition shadow-sm flex items-center justify-center gap-2`}
            >
              {compiling ? (
                <>
                  <Cpu className="w-4 h-4 animate-spin" /> {editGameId ? "Saving..." : "Compiling TSX Sandbox..."}
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 animate-pulse" />{" "}
                  {editGameId
                    ? `Update ${typeState === "simulator" ? "Simulator" : "Game"}`
                    : `Compile & Add to ${typeState === "simulator" ? "Simulators" : "Arcade"}`}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
