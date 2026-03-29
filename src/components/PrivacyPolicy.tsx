import { Shield, Lock, Eye, Server, Globe } from "lucide-react";

export function PrivacyPolicy() {
  return (
    <div className="bg-card p-8 rounded-2xl border border-border shadow-sm max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Shield className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold">Privacy Policy</h1>
      </div>

      <div className="space-y-8 text-muted-foreground">
        <section>
          <div className="flex items-center gap-2 mb-3 text-foreground">
            <Eye className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">Data Collection</h2>
          </div>
          <p className="leading-relaxed">
            AI Guardian collects information that you provide directly to us when you use our services. This includes text, images, and code snippets submitted for analysis. We also collect authentication data through Google Sign-In to manage your personal analysis history.
          </p>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-3 text-foreground">
            <Server className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">How We Use Your Data</h2>
          </div>
          <ul className="list-disc pl-5 space-y-2">
            <li>To provide, maintain, and improve our AI analysis services.</li>
            <li>To process your requests and provide analysis results (Trust Scores, findings, etc.).</li>
            <li>To save your analysis history in your private account if you are signed in.</li>
            <li>We do not sell your personal data or the content you submit for analysis to third parties.</li>
          </ul>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-3 text-foreground">
            <Lock className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">Data Security</h2>
          </div>
          <p className="leading-relaxed">
            We use industry-standard security measures to protect your data. Raw images submitted for analysis are processed and not stored permanently unless specifically saved to your history. Authentication and database services are provided by Google Firebase, ensuring enterprise-grade security.
          </p>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-3 text-foreground">
            <Globe className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">Third-Party Services</h2>
          </div>
          <p className="leading-relaxed">
            Our analysis is powered by Google Gemini AI models. By using our service, you acknowledge that your submitted content is processed by these models in accordance with Google's privacy standards for AI services.
          </p>
        </section>

        <footer className="pt-8 border-t border-border text-sm italic">
          Last updated: March 29, 2026. For questions, please contact privacy@aiguardian.platform.
        </footer>
      </div>
    </div>
  );
}
