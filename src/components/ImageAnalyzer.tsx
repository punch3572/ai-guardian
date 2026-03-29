import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { analyzeImage, type AnalysisResult } from "@/src/lib/gemini";
import { TrustScore } from "./TrustScore";
import { Image as ImageIcon, AlertCircle, CheckCircle2, Loader2, Upload, ScanSearch } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../lib/AuthContext";
import { db, collection, addDoc, serverTimestamp, handleFirestoreError, OperationType } from "../lib/firebase";

export function ImageAnalyzer({ selectedHistory }: { selectedHistory?: any }) {
  const { user } = useAuth();
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    if (selectedHistory && selectedHistory.type === 'image') {
      setImage(null); // We don't store the full image in Firestore for now
      setResult({
        trustScore: selectedHistory.trustScore,
        isAI: selectedHistory.isAI,
        findings: selectedHistory.findings,
        suggestions: selectedHistory.suggestions,
        confidence: selectedHistory.confidence
      });
    }
  }, [selectedHistory]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false
  });

  const handleAnalyze = async () => {
    if (!image) return;
    setLoading(true);
    try {
      // Get mime type from base64 string
      const mimeType = image.match(/data:(.*);base64/)?.[1] || "image/jpeg";
      const res = await analyzeImage(image, mimeType);
      setResult(res);

      if (user) {
        const path = "history";
        try {
          await addDoc(collection(db, path), {
            userId: user.uid,
            type: "image",
            input: "Image Analysis", // We don't store the full image in Firestore for now
            trustScore: res.trustScore,
            isAI: res.isAI || false,
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

  return (
    <div className="space-y-6">
      <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">Image Analysis</h2>
          </div>
        </div>
        <p className="text-muted-foreground text-sm mb-6">
          Detect deepfakes, AI generation, and suspicious artifacts.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                isDragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
              }`}
            >
              <input {...getInputProps()} />
              {image ? (
                <div className="relative aspect-video rounded-lg overflow-hidden bg-background">
                  <img src={image} alt="Preview" className="w-full h-full object-contain" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
                    <p className="text-white text-sm font-medium">Click to change image</p>
                  </div>
                </div>
              ) : (
                <div className="py-12 space-y-4">
                  <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mx-auto">
                    <Upload className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Drag & drop or click to upload</p>
                    <p className="text-xs text-muted-foreground mt-1">Supports JPG, PNG, WebP</p>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleAnalyze}
              disabled={loading || !image}
              className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ScanSearch className="w-4 h-4" />}
              Analyze Authenticity
            </button>
          </div>

          <div className="flex flex-col justify-center">
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="p-4 rounded-lg bg-secondary/50 border border-border">
                    <TrustScore score={result.trustScore} label="Authenticity Score" />
                    <div className="mt-4 flex items-center gap-2">
                      {result.isAI ? (
                        <div className="flex items-center gap-2 text-red-500 text-sm font-bold">
                          <AlertCircle className="w-4 h-4" />
                          <span>Likely AI Generated</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-green-500 text-sm font-bold">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Likely Authentic</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Analysis Findings</h3>
                    <div className="text-sm text-muted-foreground bg-background p-4 rounded-lg border border-border">
                      <div className="markdown-body">
                        <ReactMarkdown>{result.findings}</ReactMarkdown>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Recommendations</h3>
                    <div className="text-sm text-muted-foreground bg-background p-4 rounded-lg border border-border">
                      <div className="markdown-body">
                        <ReactMarkdown>{result.suggestions}</ReactMarkdown>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12 space-y-4 border border-border rounded-xl bg-secondary/20"
                >
                  <ImageIcon className="w-12 h-12 text-muted-foreground/30 mx-auto" />
                  <p className="text-muted-foreground text-sm">Upload an image to see the analysis results here.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
