import { Shield, CheckCircle, AlertTriangle, Scale, UserCheck } from "lucide-react";

export function TermsOfService() {
  return (
    <div className="bg-card p-8 rounded-2xl border border-border shadow-sm max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Scale className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold">Terms of Service</h1>
      </div>

      <div className="space-y-8 text-muted-foreground">
        <section>
          <div className="flex items-center gap-2 mb-3 text-foreground">
            <CheckCircle className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">Acceptance of Terms</h2>
          </div>
          <p className="leading-relaxed">
            By accessing or using the AI Guardian platform, you agree to be bound by these Terms of Service. If you do not agree to all of these terms, do not use our services.
          </p>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-3 text-foreground">
            <UserCheck className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">User Responsibilities</h2>
          </div>
          <ul className="list-disc pl-5 space-y-2">
            <li>You must be at least 13 years old to use this service.</li>
            <li>You are responsible for all content you submit for analysis.</li>
            <li>You must not use the service to analyze illegal, harmful, or prohibited content.</li>
            <li>You must not attempt to reverse-engineer or disrupt the AI models or platform.</li>
          </ul>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-3 text-foreground">
            <AlertTriangle className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">AI Limitations & Disclaimers</h2>
          </div>
          <p className="leading-relaxed">
            AI Guardian uses advanced AI models (Google Gemini) to provide analysis. You acknowledge that:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-2">
            <li>AI analysis results are probabilistic and may contain errors or hallucinations.</li>
            <li>Trust Scores and findings are for informational purposes only and not legally binding.</li>
            <li>We do not guarantee 100% accuracy in detecting deepfakes or AI-generated content.</li>
            <li>The service is provided "as is" without any warranties.</li>
          </ul>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-3 text-foreground">
            <Shield className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">Intellectual Property</h2>
          </div>
          <p className="leading-relaxed">
            AI Guardian and its original content, features, and functionality are owned by the platform. You retain ownership of the content you submit, but grant us a license to process it for analysis.
          </p>
        </section>

        <footer className="pt-8 border-t border-border text-sm italic">
          Last updated: March 29, 2026. For questions, please contact legal@aiguardian.platform.
        </footer>
      </div>
    </div>
  );
}
