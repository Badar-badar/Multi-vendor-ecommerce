import { Check, MapPin, Truck, FileText, CreditCard, CheckCircle2 } from 'lucide-react';

const STEPS = [
  { id: 1, label: 'Delivery', icon: MapPin },
  { id: 2, label: 'Shipping', icon: Truck },
  { id: 3, label: 'Review', icon: FileText },
  { id: 4, label: 'Payment', icon: CreditCard },
  { id: 5, label: 'Confirmed', icon: CheckCircle2 },
];

export const CheckoutStepsHeader = ({ currentStep, onStepClick }) => {
  return (
    <div className="mb-10">
      {/* Desktop Step Stepper */}
      <nav aria-label="Checkout Progress" className="hidden sm:block">
        <ol className="flex items-center justify-between w-full max-w-3xl mx-auto relative">
          {/* Background Connecting Line */}
          <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 h-0.5 bg-border -z-0" />
          <div
            className="absolute top-1/2 left-0 -translate-y-1/2 h-0.5 bg-accent transition-all duration-500 -z-0"
            style={{
              width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%`,
            }}
          />

          {STEPS.map((step) => {
            const isCompleted = step.id < currentStep;
            const isCurrent = step.id === currentStep;
            const isClickable = isCompleted && currentStep < 5;
            const Icon = step.icon;

            return (
              <li key={step.id} className="relative z-10 flex flex-col items-center">
                <button
                  type="button"
                  disabled={!isClickable}
                  onClick={() => isClickable && onStepClick(step.id)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isCompleted
                      ? 'bg-accent text-white shadow-xs cursor-pointer hover:bg-accent-hover'
                      : isCurrent
                      ? 'bg-primary text-white ring-4 ring-primary/15 shadow-sm'
                      : 'bg-surface text-text-subtle border border-border cursor-not-allowed'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4 stroke-[2.5]" /> : <Icon className="w-4 h-4" />}
                </button>

                <span
                  className={`mt-2 text-xs font-semibold whitespace-nowrap transition-colors ${
                    isCurrent
                      ? 'text-text-main font-bold'
                      : isCompleted
                      ? 'text-text-main'
                      : 'text-text-subtle'
                  }`}
                >
                  {step.label}
                </span>
              </li>
            );
          })}
        </ol>
      </nav>

      {/* Mobile Step Indicator */}
      <div className="sm:hidden flex items-center justify-between p-3.5 bg-surface rounded-2xl border border-border shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
            {currentStep}
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-accent font-bold block">
              Step {currentStep} of {STEPS.length}
            </span>
            <span className="text-xs font-serif font-bold text-text-main">
              {STEPS.find((s) => s.id === currentStep)?.label}
            </span>
          </div>
        </div>

        {/* Progress percent */}
        <div className="text-right">
          <span className="text-xs font-bold text-text-main">
            {Math.round((currentStep / STEPS.length) * 100)}%
          </span>
          <span className="text-[10px] text-text-muted block">Completed</span>
        </div>
      </div>
    </div>
  );
};

export default CheckoutStepsHeader;
