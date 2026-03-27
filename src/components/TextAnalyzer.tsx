import { useState, useEffect } from "react";
import { analyzeText, type AnalysisResult } from "@/src/lib/gemini";
import { TrustScore } from "./TrustScore";
import { Shield, AlertTriangle, CheckCircle2, Loader2, Send } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../lib/AuthContext";
import { db, collection, addDoc, serverTimestamp, handleFirestoreError, OperationType } from "../lib/firebase";

export function TextAnalyzer({ selectedHistory }: { selectedHistory?: any }) {
  const { user } = useAuth();
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    if (selectedHistory && selectedHistory.type === 'text') {
      setText(selectedHistory.input);
      setResult({
        trustScore: selectedHistory.trustScore,
        findings: selectedHistory.findings,
        suggestions: selectedHistory.suggestions,
        confidence: selectedHistory.confidence
      });
    }
  }, [selectedHistory]);

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const res = await analyzeText(text);
      setResult(res);

      if (user) {
        const path = "history";
        try {
          await addDoc(collection(db, path), {
            userId: user.uid,
            type: "text",
            input: text.slice(0, 500), // Limit input size for history
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

  const demoData = "Scientists have discovered that eating chocolate every day can make you live until 150 years old, according to a secret study by the University of Mars.";

  return (
    <div className="space-y-6">
      <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold">Text Analysis</h2>
        </div>
        <p className="text-muted-foreground text-sm mb-4">
          Check for hallucinations, misinformation, or harmful content.
        </p>
        
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste text to analyze..."
          className="w-full h-40 bg-background border border-border rounded-lg p-4 focus:ring-2 focus:ring-primary focus:outline-none transition-all resize-none"
        />
        
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => setText(demoData)}
            className="text-xs text-primary hover:underline"
          >
            Try demo data
          </button>
          <button
            onClick={handleAnalyze}
            disabled={loading || !text.trim()}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Analyze Text
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
              <TrustScore score={result.trustScore} size="lg" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-yellow-500">
                    <AlertTriangle className="w-5 h-5" />
                    <h3 className="font-semibold">Findings</h3>
                  </div>
                  <div className="bg-background/50 p-4 rounded-lg border border-border text-sm text-muted-foreground">
                    <div className="markdown-body">
                      <ReactMarkdown>{result.findings}</ReactMarkdown>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-green-500">
                    <CheckCircle2 className="w-5 h-5" />
                    <h3 className="font-semibold">Suggestions</h3>
                  </div>
                  <div className="bg-background/50 p-4 rounded-lg border border-border text-sm text-muted-foreground">
                    <div className="markdown-body">
                      <ReactMarkdown>{result.suggestions}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-border flex justify-between items-center text-xs text-muted-foreground">
                <span>Confidence: {(result.confidence * 100).toFixed(1)}%</span>
                <span>Analyzed by Gemini 3 Flash</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
