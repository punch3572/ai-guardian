import { useState, useEffect } from "react";
import { analyzeCode, type AnalysisResult } from "@/src/lib/gemini";
import { TrustScore } from "./TrustScore";
import { Code2, Bug, Lightbulb, Loader2, Play, Terminal } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "motion/react";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-python";
import "prismjs/components/prism-css";
import { useAuth } from "../lib/AuthContext";
import { db, collection, addDoc, serverTimestamp, handleFirestoreError, OperationType } from "../lib/firebase";

export function CodeAnalyzer({ selectedHistory }: { selectedHistory?: any }) {
  const { user } = useAuth();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    Prism.highlightAll();
  }, [code, result]);

  useEffect(() => {
    if (selectedHistory && selectedHistory.type === 'code') {
      setCode(selectedHistory.input);
      setResult({
        trustScore: selectedHistory.trustScore,
        findings: selectedHistory.findings,
        suggestions: selectedHistory.suggestions,
        confidence: selectedHistory.confidence
      });
    }
  }, [selectedHistory]);

  const handleAnalyze = async () => {
    if (!code.trim()) return;
    setLoading(true);
    try {
      const res = await analyzeCode(code);
      setResult(res);

      if (user) {
        const path = "history";
        try {
          await addDoc(collection(db, path), {
            userId: user.uid,
            type: "code",
            input: code.slice(0, 1000), // Limit input size for history
            trustScore: res.trustScore,
            findings: res.findings,
            suggestions: res.suggestions,
            confidence: res.confidence,
            timestamp: serverTimestamp(),
          });
        } catch (error) {
          handleFirestoreError(error, OperationType.WRITE, path);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const demoCode = `function calculateTotal(items) {
  let total = 0;
  for (var i = 0; i <= items.length; i++) {
    total += items[i].price;
  }
  return total;
}`;

  return (
    <div className="space-y-6">
      <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Code2 className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold">Code Debugger</h2>
        </div>
        <p className="text-muted-foreground text-sm mb-4">
          Detect bugs, security vulnerabilities, and logic errors in your code.
        </p>
        
        <div className="relative group">
          <div className="absolute top-3 right-3 z-10 flex gap-2">
             <button
              onClick={() => setCode(demoCode)}
              className="text-xs bg-secondary hover:bg-secondary/80 text-muted-foreground px-2 py-1 rounded border border-border transition-colors"
            >
              Demo JS
            </button>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Paste your code here..."
            className="w-full h-64 bg-background font-mono text-sm border border-border rounded-lg p-4 focus:ring-2 focus:ring-primary focus:outline-none transition-all resize-none"
            spellCheck={false}
          />
        </div>
        
        <div className="flex justify-end mt-4">
          <button
            onClick={handleAnalyze}
            disabled={loading || !code.trim()}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            Debug Code
          </button>
        </div>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
              <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between mb-8 pb-6 border-b border-border">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Terminal className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Analysis Report</h3>
                    <p className="text-xs text-muted-foreground">Confidence: {(result.confidence * 100).toFixed(1)}%</p>
                  </div>
                </div>
                <div className="w-full md:w-64">
                  <TrustScore score={result.trustScore} label="Code Health" />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-red-500">
                    <Bug className="w-5 h-5" />
                    <h3 className="font-semibold">Issues Detected</h3>
                  </div>
                  <div className="bg-background/50 p-4 rounded-lg border border-border text-sm text-muted-foreground">
                    <div className="markdown-body">
                      <ReactMarkdown>{result.findings}</ReactMarkdown>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-primary">
                    <Lightbulb className="w-5 h-5" />
                    <h3 className="font-semibold">Suggested Fixes</h3>
                  </div>
                  <div className="bg-background/50 p-4 rounded-lg border border-border text-sm text-muted-foreground">
                    <div className="markdown-body">
                      <ReactMarkdown>{result.suggestions}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
