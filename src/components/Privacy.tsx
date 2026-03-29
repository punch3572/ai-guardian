import { Shield, Lock, Eye, Database } from "lucide-react";
import { motion } from "motion/react";

export function Privacy() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card p-8 rounded-2xl border border-border shadow-sm max-w-4xl mx-auto"
    >
      <div className="flex items-center gap-3 mb-8">
        <Shield className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold">Privacy Policy</h1>
      </div>

      <div className="space-y-8 text-muted-foreground leading-relaxed">
        <section>
          <div className="flex items-center gap-2 mb-3 text-foreground">
            <Eye className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">Data Collection</h2>
          </div>
          <p>
            AI Guardian collects the content you submit for analysis—including text, images, and source code. 
            This data is processed in real-time to provide safety scores and trust assessments.
          </p>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-3 text-foreground">
            <Database className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">Data Storage</h2>
          </div>
          <p>
            If you are signed in, your analysis history is securely stored in our cloud database (Firebase Firestore). 
            This allows you to access your previous reports across devices. Unauthenticated users' data is processed 
            volatily and not persisted.
          </p>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-3 text-foreground">
            <Lock className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">AI Processing</h2>
          </div>
          <p>
            We use Google Gemini models to perform deep content analysis. Your data is sent to these models 
            via encrypted channels. We do not use your personal submissions to train our base models without 
            explicit consent.
          </p>
        </section>

        <section className="pt-6 border-t border-border">
          <p className="text-sm italic">
            Last updated: March 29, 2026. For privacy inquiries, contact privacy@aiguardian.io
          </p>
        </section>
      </div>
    </motion.div>
  );
}
