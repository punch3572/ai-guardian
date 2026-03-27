import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { TextAnalyzer } from "./components/TextAnalyzer";
import { ImageAnalyzer } from "./components/ImageAnalyzer";
import { CodeAnalyzer } from "./components/CodeAnalyzer";
import { History } from "./components/History";
import { Shield, FileText, Image as ImageIcon, Code2, Info, Github, LogIn, LogOut, User as UserIcon } from "lucide-react";
import { cn } from "./lib/utils";
import { useAuth } from "./lib/AuthContext";

type Tab = "text" | "image" | "code";

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("text");
  const [selectedHistory, setSelectedHistory] = useState<any>(null);
  const { user, login, logout, loading } = useAuth();

  const tabs = [
    { id: "text", label: "Text Analysis", icon: FileText },
    { id: "image", label: "Image Analysis", icon: ImageIcon },
    { id: "code", label: "Code Debugger", icon: Code2 },
  ];

  const handleHistorySelect = (item: any) => {
    setActiveTab(item.type);
    setSelectedHistory(item);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">AI Guardian</h1>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            <nav className="flex items-center gap-1 bg-secondary/50 p-1 rounded-lg">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as Tab)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all",
                    activeTab === tab.id 
                      ? "bg-card text-foreground shadow-sm" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {loading ? (
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            ) : user ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-xs font-bold truncate max-w-[100px]">{user.displayName}</span>
                  <button onClick={logout} className="text-[10px] text-muted-foreground hover:text-destructive flex items-center gap-1">
                    <LogOut className="w-2 h-2" /> Sign Out
                  </button>
                </div>
                {user.photoURL ? (
                  <img src={user.photoURL} alt="Avatar" className="w-8 h-8 rounded-full border border-border" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center border border-border">
                    <UserIcon className="w-4 h-4 text-muted-foreground" />
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={login}
                className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-1.5 rounded-lg text-sm font-medium hover:opacity-90 transition-all"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </button>
            )}
            <div className="h-4 w-[1px] bg-border mx-1" />
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">System Online</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Multimodal Trust & Safety</h2>
          <p className="text-muted-foreground">
            Analyze digital content for authenticity, accuracy, and security using advanced AI models.
          </p>
        </div>

        {/* Mobile Tabs */}
        <div className="md:hidden flex overflow-x-auto gap-2 mb-6 pb-2 no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={cn(
                "flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-all",
                activeTab === tab.id 
                  ? "bg-primary/10 border-primary text-primary" 
                  : "bg-card border-border text-muted-foreground"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Analysis Area */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === "text" && <TextAnalyzer selectedHistory={selectedHistory} />}
                {activeTab === "image" && <ImageAnalyzer selectedHistory={selectedHistory} />}
                {activeTab === "code" && <CodeAnalyzer selectedHistory={selectedHistory} />}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Sidebar Info */}
          <div className="lg:col-span-4 space-y-6">
            {user && (
              <div className="bg-card p-6 rounded-xl border border-border">
                <History onSelect={handleHistorySelect} />
              </div>
            )}

            <div className="bg-card p-6 rounded-xl border border-border">
              <div className="flex items-center gap-2 mb-4">
                <Info className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">How it works</h3>
              </div>
              <ul className="space-y-4 text-sm text-muted-foreground">
                <li className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center text-[10px] font-bold shrink-0">1</div>
                  <p>Input your content (text, image, or code) into the corresponding module.</p>
                </li>
                <li className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center text-[10px] font-bold shrink-0">2</div>
                  <p>Our AI Guardian analyzes the content for specific safety and trust markers.</p>
                </li>
                <li className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center text-[10px] font-bold shrink-0">3</div>
                  <p>Review the Trust Score and detailed findings to verify authenticity.</p>
                </li>
              </ul>
            </div>

            {!user && (
              <div className="bg-primary/5 p-6 rounded-xl border border-primary/20">
                <h3 className="font-semibold mb-2 text-primary">Save your history</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Sign in with Google to save your analysis history and access it from any device.
                </p>
                <button
                  onClick={login}
                  className="mt-4 w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-all"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In Now
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 mt-12 bg-card/30">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Shield className="w-4 h-4" />
            <span className="text-sm">© 2026 AI Guardian Platform</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">Documentation</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
