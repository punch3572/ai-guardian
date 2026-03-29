import { useEffect, useState } from "react";
import { db, collection, query, where, orderBy, onSnapshot, handleFirestoreError, OperationType } from "../lib/firebase";
import { useAuth } from "../lib/AuthContext";
import { TrustScore } from "./TrustScore";
import { FileText, Image as ImageIcon, Code2, Clock, ChevronRight, Bot } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";

interface HistoryItem {
  id: string;
  type: "text" | "image" | "code";
  input: string;
  trustScore: number;
  findings: string;
  suggestions: string;
  confidence: number;
  timestamp: any;
}

export function History({ onSelect }: { onSelect: (item: HistoryItem) => void }) {
  const { user } = useAuth();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setHistory([]);
      setLoading(false);
      return;
    }

    const path = "history";
    const q = query(
      collection(db, path),
      where("userId", "==", user.uid),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as HistoryItem[];
        setHistory(items);
        setLoading(false);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, path);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [user]);

  if (!user) return null;

  const icons = {
    text: FileText,
    image: ImageIcon,
    code: Code2,
    detection: Bot,
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Clock className="w-4 h-4 text-primary" />
        <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Recent Activity</h3>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : history.length === 0 ? (
        <div className="text-center py-8 border border-dashed border-border rounded-xl bg-secondary/10">
          <p className="text-xs text-muted-foreground">No recent activity found.</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 no-scrollbar">
          <AnimatePresence>
            {history.map((item: any) => {
              const Icon = icons[item.type as keyof typeof icons] || FileText;
              return (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  onClick={() => onSelect(item)}
                  className="w-full text-left p-3 rounded-xl bg-card border border-border hover:border-primary/50 transition-all group"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-xs font-bold uppercase tracking-tighter text-muted-foreground">
                          {item.type === 'detection' ? 'Detection' : item.type}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {item.timestamp?.toDate().toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm font-medium truncate mb-2">
                        {item.type === 'image' ? 'Image Analysis' : item.type === 'detection' ? item.prediction : item.input}
                      </p>
                      {item.type === 'detection' ? (
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            "w-2 h-2 rounded-full",
                            item.prediction === "AI-generated" ? "bg-red-500" : "bg-green-500"
                          )} />
                          <span className="text-[10px] font-medium">{item.confidence}</span>
                        </div>
                      ) : (
                        <TrustScore score={item.trustScore} size="sm" />
                      )}
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground self-center opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
