import React, { useState, useRef } from "react";
import { DiffEditor } from "@monaco-editor/react";
import {
  GitCompare,
  RotateCcw,
  Copy,
  Check,
  ArrowLeftRight,
  Split,
  FileText,
  Upload,
  Trash2,
  SlidersHorizontal,
  Play,
} from "lucide-react";

const SAMPLE_ORIGINAL = `{
  "service": "EIS_PAYMENT_GATEWAY",
  "version": "1.0.0",
  "timeout": 3000,
  "retryCount": 3,
  "endpoints": {
    "auth": "/v1/auth",
    "payment": "/v1/charge"
  },
  "debug": false
}`;

const SAMPLE_MODIFIED = `{
  "service": "EIS_PAYMENT_GATEWAY",
  "version": "1.1.0",
  "timeout": 5000,
  "retryCount": 3,
  "endpoints": {
    "auth": "/v1/auth",
    "payment": "/v2/process-charge",
    "refund": "/v2/refund"
  },
  "debug": true
}`;

export const TextDiffViewer: React.FC = () => {
  // Input Textarea States
  const [originalInput, setOriginalInput] = useState<string>(SAMPLE_ORIGINAL);
  const [modifiedInput, setModifiedInput] = useState<string>(SAMPLE_MODIFIED);

  // Active Diff Engine States
  const [diffOriginal, setDiffOriginal] = useState<string>(SAMPLE_ORIGINAL);
  const [diffModified, setDiffModified] = useState<string>(SAMPLE_MODIFIED);

  const [language, setLanguage] = useState<string>("json");
  const [isInline, setIsInline] = useState<boolean>(false);
  const [showInputs, setShowInputs] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  const originalFileRef = useRef<HTMLInputElement | null>(null);
  const modifiedFileRef = useRef<HTMLInputElement | null>(null);

  // Apply Changes from textareas to Diff Viewer
  const handleCompare = () => {
    setDiffOriginal(originalInput);
    setDiffModified(modifiedInput);
  };

  // Swap both Textareas and Diff models
  const handleSwap = () => {
    setOriginalInput(modifiedInput);
    setModifiedInput(originalInput);
    setDiffOriginal(modifiedInput);
    setDiffModified(originalInput);
  };

  // Reset to default sample
  const handleReset = () => {
    setOriginalInput(SAMPLE_ORIGINAL);
    setModifiedInput(SAMPLE_MODIFIED);
    setDiffOriginal(SAMPLE_ORIGINAL);
    setDiffModified(SAMPLE_MODIFIED);
  };

  // File Upload Handlers
  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (val: string) => void,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setter(text);
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  // Copy Modified Text
  const handleCopyModified = () => {
    navigator.clipboard.writeText(modifiedInput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col flex-1 h-full w-full min-h-0 p-6 space-y-4 bg-[#030712] text-slate-200 overflow-y-auto font-sans">
      {/* Top Banner Card */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-[#0B1120] border border-slate-800/80 shadow-md shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-400">
            <GitCompare className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-2">
              Text & Code Diff Compare
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20">
                MONACO ENGINE
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Paste or upload text into both inputs below, then inspect
              line-by-line diffs.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Language Selector */}
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="px-2.5 py-1.5 text-xs font-medium bg-[#151E32] text-slate-200 border border-slate-700 rounded-lg outline-none cursor-pointer hover:border-slate-600 transition"
          >
            <option value="json">JSON</option>
            <option value="yaml">YAML</option>
            <option value="plaintext">Plain Text</option>
            <option value="xml">XML</option>
            <option value="javascript">JavaScript</option>
            <option value="java">Java / ESQL</option>
          </select>

          {/* Toggle Raw Input Boxes */}
          <button
            onClick={() => setShowInputs(!showInputs)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition cursor-pointer active:scale-95 ${
              showInputs
                ? "bg-teal-500/10 border-teal-500/40 text-teal-300"
                : "bg-[#151E32] hover:bg-[#1E2B47] border-slate-700 text-slate-200"
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-teal-400" />
            {showInputs ? "Hide Inputs" : "Show Inputs"}
          </button>

          {/* Toggle Split vs Inline View */}
          <button
            onClick={() => setIsInline(!isInline)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition cursor-pointer active:scale-95 ${
              isInline
                ? "bg-teal-500/10 border-teal-500/40 text-teal-300"
                : "bg-[#151E32] hover:bg-[#1E2B47] border-slate-700 text-slate-200"
            }`}
          >
            <Split className="w-3.5 h-3.5 text-teal-400" />
            {isInline ? "Unified View" : "Side-by-Side"}
          </button>

          {/* Swap Sides */}
          <button
            onClick={handleSwap}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-[#151E32] hover:bg-[#1E2B47] active:scale-95 rounded-lg border border-slate-700 transition cursor-pointer"
          >
            <ArrowLeftRight className="w-3.5 h-3.5 text-sky-400" />
            Swap
          </button>

          {/* Reset */}
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-[#151E32] hover:bg-[#1E2B47] active:scale-95 rounded-lg border border-slate-700 transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            Reset
          </button>

          {/* Compare Button */}
          <button
            onClick={handleCompare}
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-[#0D9488] hover:bg-[#0F766E] active:scale-95 rounded-lg shadow-sm transition cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            Run Compare
          </button>
        </div>
      </div>

      {/* Dedicated Dual Textarea Input Panel */}
      {showInputs && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 shrink-0">
          {/* Left Textarea: Base / Original */}
          <div className="flex flex-col rounded-xl bg-[#0B1120] border border-slate-800/80 shadow-md overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 bg-[#0F172A]/70 text-xs font-semibold text-slate-300">
              <div className="flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-rose-400" />
                <span>ORIGINAL TEXT INPUT</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  ref={originalFileRef}
                  onChange={(e) => handleFileUpload(e, setOriginalInput)}
                  className="hidden"
                />
                <button
                  onClick={() => originalFileRef.current?.click()}
                  className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition cursor-pointer"
                  title="Upload original file"
                >
                  <Upload className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setOriginalInput("")}
                  className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition cursor-pointer"
                  title="Clear original text"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <textarea
              value={originalInput}
              onChange={(e) => setOriginalInput(e.target.value)}
              placeholder="Paste original / base code or text here..."
              rows={6}
              className="w-full p-3 bg-[#090D16] text-slate-200 font-mono text-xs resize-y outline-none focus:ring-1 focus:ring-teal-500/40"
            />
          </div>

          {/* Right Textarea: Modified / Target */}
          <div className="flex flex-col rounded-xl bg-[#0B1120] border border-slate-800/80 shadow-md overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 bg-[#0F172A]/70 text-xs font-semibold text-slate-300">
              <div className="flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-emerald-400" />
                <span>MODIFIED TEXT INPUT</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  ref={modifiedFileRef}
                  onChange={(e) => handleFileUpload(e, setModifiedInput)}
                  className="hidden"
                />
                <button
                  onClick={() => modifiedFileRef.current?.click()}
                  className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition cursor-pointer"
                  title="Upload modified file"
                >
                  <Upload className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setModifiedInput("")}
                  className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition cursor-pointer"
                  title="Clear modified text"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <textarea
              value={modifiedInput}
              onChange={(e) => setModifiedInput(e.target.value)}
              placeholder="Paste modified / changed code or text here..."
              rows={6}
              className="w-full p-3 bg-[#090D16] text-slate-200 font-mono text-xs resize-y outline-none focus:ring-1 focus:ring-teal-500/40"
            />
          </div>
        </div>
      )}

      {/* Diff Result Card */}
      <div className="flex flex-col rounded-xl bg-[#0B1120] border border-slate-800/80 shadow-md overflow-hidden shrink-0">
        {/* Pane Subheader */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 bg-[#0F172A]/70 text-xs font-semibold text-slate-300 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            <span>DIFFERENCE ENGINE PREVIEW</span>
          </div>

          <button
            onClick={handleCopyModified}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-white bg-[#151E32] hover:bg-[#1E2B47] rounded border border-slate-700 transition cursor-pointer"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-slate-400" />
            )}
            {copied ? "Copied" : "Copy Modified"}
          </button>
        </div>

        {/* Monaco Diff Viewer - Explicit Height prevents 0px collapse */}
        <div className="w-full h-[520px] bg-[#090D16]">
          <DiffEditor
            height="520px"
            language={language}
            original={diffOriginal}
            modified={diffModified}
            theme="vs-dark"
            options={{
              renderSideBySide: !isInline,
              readOnly: true,
              fontSize: 13,
              scrollBeyondLastLine: false,
              automaticLayout: true,
              diffWordWrap: "on",
              ignoreTrimWhitespace: false,
              padding: { top: 12, bottom: 12 },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default TextDiffViewer;
