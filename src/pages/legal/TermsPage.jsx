import { Sparkles, FileText, ShieldCheck, Scale, Award } from 'lucide-react';

export const TermsPage = () => {
  return (
    <div className="min-h-screen bg-background text-text-main pb-24 space-y-16">
      {/* Hero Header */}
      <section className="relative bg-slate-950 text-white py-20 sm:py-28 border-b border-border/80 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=2000&auto=format&fit=crop"
            alt="Patron Governance & Terms of Service"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/80 to-slate-950" />
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 relative z-10">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-accent-light text-xs font-semibold uppercase tracking-widest backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-accent" /> Legal Governance Charter
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight">
            Terms of Service & Atelier Compact
          </h1>
          <p className="text-xs sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed font-light">
            Governing your relationship as a patron, collector, or accredited artisan within the Zareen marketplace ecosystem.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-surface rounded-3xl border border-border p-8 sm:p-12 space-y-8 text-sm text-text-muted leading-relaxed shadow-subtle">
          <div className="flex items-center justify-between pb-6 border-b border-border text-xs">
            <span className="font-semibold text-text-main">Effective Date: Autumn 2026 Edition</span>
            <span className="text-accent font-bold">Version 2.4 (Sovereign Guild Charter)</span>
          </div>

          <div className="space-y-3">
            <h3 className="font-serif font-bold text-xl text-text-main flex items-center gap-2">
              <Scale className="w-5 h-5 text-accent" /> 1. Acceptance of Terms
            </h3>
            <p>
              By accessing the Zareen platform, creating a patron or atelier profile, or executing an acquisition, you acknowledge that you have read, understood, and agreed to be legally bound by these Terms of Service. If you do not agree with any provision herein, you must refrain from utilizing the platform.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-serif font-bold text-xl text-text-main flex items-center gap-2">
              <Award className="w-5 h-5 text-accent" /> 2. Direct Atelier Contract & Platform Role
            </h3>
            <p>
              Zareen operates as a sovereign, curated digital guild and marketplace. All purchases constitute a direct commercial transaction between the collector (Patron) and the sovereign independent workshop (Atelier). Zareen acts as the escrow guarantor, quality hallmarker, and dispute mediator.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-serif font-bold text-xl text-text-main flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-accent" /> 3. Multi-Sig Escrow & Fund Disbursement
            </h3>
            <p>
              Patron payments are held in segregated, multi-sig escrow accounts. Atelier funds are released only upon successful recipient signature verification and expiration of the 14-day statutory examination window. In cases of disputed provenance or transit loss, full funds remain locked in escrow until formal conciliation concludes.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-serif font-bold text-xl text-text-main flex items-center gap-2">
              <FileText className="w-5 h-5 text-accent" /> 4. Intellectual Property & Bespoke Patterns
            </h3>
            <p>
              All designs, horological complication blueprints, jewelry molds, and artisan trademarks hosted on the platform remain the exclusive intellectual property of the originating master maker. Unauthorized commercial reproduction or copying is strictly prohibited under international copyright conventions.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-serif font-bold text-xl text-text-main">
              5. Governing Jurisdiction & Commercial Arbitration
            </h3>
            <p>
              These Terms shall be governed by and construed in accordance with the substantive laws of Switzerland. Any dispute, controversy, or claim arising out of or in connection with this contract shall be submitted to mediation in accordance with the Swiss Rules of Commercial Mediation of the Swiss Chambers’ Arbitration Institution.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TermsPage;
