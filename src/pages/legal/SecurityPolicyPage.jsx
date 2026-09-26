import { Sparkles, ShieldCheck, Lock, Key, Server, Cpu, CheckCircle2, ShieldAlert } from 'lucide-react';

export const SecurityPolicyPage = () => {
  const securityPillars = [
    {
      icon: Lock,
      title: 'TLS 1.3 & AES-256 Multi-Layer Encryption',
      description: 'All network transmissions use military-grade transport layer security with perfect forward secrecy.',
    },
    {
      icon: Server,
      title: 'Segregated Escrow Vaults',
      description: 'Patron funds are isolated from operational capital in independently audited multi-sig custodial bank reserves.',
    },
    {
      icon: Cpu,
      title: 'Automated Heuristic Sentinel',
      description: 'Continuous AI-driven anomaly monitoring flags credential stuffing, fraudulent transactions, and unauthorized access.',
    },
    {
      icon: Key,
      title: 'Hardware Token & 2FA Enforcement',
      description: 'Ateliers and marketplace administrators require physical security keys and biometric multi-factor authentication.',
    },
  ];

  return (
    <div className="min-h-screen bg-background text-text-main pb-24 space-y-16">
      {/* Hero Header */}
      <section className="relative bg-slate-950 text-white py-20 sm:py-28 border-b border-border/80 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2000&auto=format&fit=crop"
            alt="Cryptographic Platform Security"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/80 to-slate-950" />
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 relative z-10">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-accent-light text-xs font-semibold uppercase tracking-widest backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-accent" /> Institutional Trust
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight">
            Trust & Security Architecture
          </h1>
          <p className="text-xs sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed font-light">
            Engineered to safeguard high-value acquisitions, cryptographic provenance certificates, and private patron custody.
          </p>
        </div>
      </section>

      {/* 4 Security Pillars */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {securityPillars.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div key={idx} className="bg-surface rounded-3xl border border-border p-6 shadow-subtle space-y-3">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-serif font-bold text-base text-text-main">{p.title}</h3>
                <p className="text-xs text-text-muted leading-relaxed">{p.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Bug Bounty & Reporting */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-surface rounded-3xl border border-border p-8 sm:p-12 space-y-6 text-sm text-text-muted leading-relaxed shadow-subtle">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-text-main">
                Responsible Vulnerability Disclosure
              </h3>
              <p className="text-xs text-text-muted">
                Zareen maintains an active Bug Bounty program for accredited security researchers.
              </p>
            </div>
          </div>

          <p>
            If you discover a potential security defect or cryptographic flaw within our infrastructure, please report it immediately to our security response team at <code className="text-accent font-mono font-bold">security@zareen-luxury.com</code> using our PGP public key. We commit to a 48-hour preliminary triage and generous bounty awards.
          </p>
        </div>
      </section>
    </div>
  );
};

export default SecurityPolicyPage;
