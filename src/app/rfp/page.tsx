"use client";

import Image from "next/image";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { useMemo, useState } from "react";
import { RfpPdf, type RfpFormValues } from "@/components/rfp-pdf";

type StepId = "general" | "recommerce" | "value" | "lead";

const steps: { id: StepId; title: string; blurb: string }[] = [
  {
    id: "general",
    title: "General Logistics",
    blurb:
      "Baseline reverse logistics context: volume, seasonality, retail presence, and programs in place.",
  },
  {
    id: "recommerce",
    title: "Recommerce Strategy",
    blurb:
      "Channel appetite, owned vs. outsourced approaches, and program interest.",
  },
  {
    id: "value",
    title: "Value & Opportunity",
    blurb:
      "What success looks like, current coverage of the opportunity, and constraints.",
  },
  {
    id: "lead",
    title: "Lead Capture & Export",
    blurb:
      "Share contact details and generate a consulting-grade Reverse Logistics RFP.",
  },
];

const retailerTooltip =
  "DIF = Destroy in Field | ZVR = Zero Value Return | RTV = Return to Vendor";

const initialValues: RfpFormValues = {
  returnsPerYear: "",
  seasonality: "Mostly flat",
  sellsIntoRetailers: "",
  retailerProgram: "",
  returnsHandling: "",
  countries: "",
  warrantyProgram: "",
  warrantyInterest: "",
  subscriptionProgram: "",
  subscriptionInterest: "",
  salesSplitDtc: 50,
  interestedChannels: [],
  brandedDtc: "",
  brandedManagement: "",
  tradeIn: "",
  valuePriority: "",
  opportunityFeeling: "",
  excessInventory: "",
  combineStrategy: "",
  name: "",
  email: "",
};

const channelOptions = [
  "Amazon",
  "Big Off-Price Retailers",
  "Regional Off-Price Retailers",
  "Other",
];

const valueOptions = [
  "Customer loyalty",
  "Subsidizing cost / driving revenue",
  "Environmental factors",
  "Testing new markets",
];

export default function RfpFormPage() {
  const [stepIndex, setStepIndex] = useState(0);
  const [formValues, setFormValues] = useState<RfpFormValues>(initialValues);

  const currentStep = steps[stepIndex];
  const progress = ((stepIndex + 1) / steps.length) * 100;

  const updateField = <K extends keyof RfpFormValues>(
    key: K,
    value: RfpFormValues[K],
  ) => setFormValues((prev) => ({ ...prev, [key]: value }));

  const toggleChannel = (option: string) => {
    setFormValues((prev) => {
      const exists = prev.interestedChannels.includes(option);
      return {
        ...prev,
        interestedChannels: exists
          ? prev.interestedChannels.filter((c) => c !== option)
          : [...prev.interestedChannels, option],
      };
    });
  };

  const showRetailProgram = formValues.sellsIntoRetailers === "Yes";
  const showWarrantyInterest = formValues.warrantyProgram === "No";
  const showSubscriptionInterest = formValues.subscriptionProgram === "No";
  const showBrandedFollowUp = formValues.brandedDtc === "Yes";

  const canGoNext = useMemo(() => {
    if (currentStep.id === "lead") return true;
    const baseRequired: Record<StepId, (keyof RfpFormValues)[]> = {
      general: [
        "returnsPerYear",
        "seasonality",
        "sellsIntoRetailers",
        "returnsHandling",
        "countries",
        "warrantyProgram",
        "subscriptionProgram",
      ],
      recommerce: ["salesSplitDtc", "brandedDtc", "tradeIn"],
      value: [
        "valuePriority",
        "opportunityFeeling",
        "excessInventory",
        "combineStrategy",
      ],
      lead: [],
    };

    const dynamicRequired: (keyof RfpFormValues)[] = [];
    if (showRetailProgram) dynamicRequired.push("retailerProgram");
    if (showWarrantyInterest) dynamicRequired.push("warrantyInterest");
    if (showSubscriptionInterest) dynamicRequired.push("subscriptionInterest");
    if (showBrandedFollowUp) dynamicRequired.push("brandedManagement");

    const requiredFields =
      currentStep.id === "general" || currentStep.id === "recommerce"
        ? [...baseRequired[currentStep.id], ...dynamicRequired]
        : baseRequired[currentStep.id];

    return requiredFields.every(
      (field) => formValues[field] !== "" && formValues[field] !== undefined,
    );
  }, [
    currentStep.id,
    formValues,
    showBrandedFollowUp,
    showRetailProgram,
    showSubscriptionInterest,
    showWarrantyInterest,
  ]);

  const onNext = () => {
    if (stepIndex < steps.length - 1) {
      setStepIndex((v) => v + 1);
    }
  };

  const onBack = () => {
    if (stepIndex > 0) setStepIndex((v) => v - 1);
  };

  const leadReady = formValues.name.trim() && formValues.email.trim();

  return (
    <div className="min-h-screen px-4 py-12 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 via-white/2 to-transparent p-8 shadow-lg backdrop-blur-lg">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Image
                src="/nok-logo.svg"
                alt="Nok Recommerce"
                width={140}
                height={60}
                priority
              />
              <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-orange-200/90">
                Recommerce strategy
              </span>
            </div>
            <p className="text-xs uppercase tracking-[0.35em] text-orange-200/90">
              Reverse Logistics RFP creation
            </p>
          </div>

          <h1 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
            Build your Reverse Logistics RFP
          </h1>
          <p className="mt-3 max-w-3xl text-sm text-slate-200/80 sm:text-base">
            Capture the operational reality of your returns, align on
            recommerce strategy, and export a consulting-grade brief. Optimized
            for peak season returns strategy and enterprise stakeholders.
          </p>
        </header>

        <div className="mb-4 flex items-center justify-between text-xs uppercase text-slate-200/80">
          <span>
            Step {stepIndex + 1} of {steps.length}
          </span>
          <span className="text-slate-300/80">{currentStep.title}</span>
        </div>
        <div className="mb-8 h-2 w-full overflow-hidden rounded-full bg-slate-800/80 ring-1 ring-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-sky-300 to-cyan-400 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="card-surface rounded-2xl p-6">
            <div className="mb-6 flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-100">
                  {currentStep.title}
                </p>
                <p className="text-sm text-slate-300/80">{currentStep.blurb}</p>
              </div>
              <span className="rounded-full bg-orange-400/15 px-3 py-1 text-xs text-orange-100 ring-1 ring-orange-300/40">
                Nok Recommerce
              </span>
            </div>

            {currentStep.id === "general" && (
              <div className="space-y-4">
                <Field
                  label="How many returns do you get per year?"
                  helper="Approximate annualized return count."
                >
                  <input
                    type="number"
                    min={0}
                    className="input"
                    value={formValues.returnsPerYear}
                    onChange={(e) =>
                      updateField("returnsPerYear", e.target.value)
                    }
                  />
                </Field>

                <Field label="How seasonal are your returns?">
                  <select
                    className="input"
                    value={formValues.seasonality}
                    onChange={(e) => updateField("seasonality", e.target.value)}
                  >
                    {[
                      "Mostly flat",
                      "Q1 Peak",
                      "Q2 Peak",
                      "Q3 Peak",
                      "Q4 Peak",
                    ].map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </Field>

                <Field label="Do you sell into retailers?">
                  <div className="flex gap-3">
                    {["Yes", "No"].map((option) => (
                      <RadioChip
                        key={option}
                        active={formValues.sellsIntoRetailers === option}
                        label={option}
                        onClick={() => updateField("sellsIntoRetailers", option)}
                      />
                    ))}
                  </div>
                </Field>

                {showRetailProgram && (
                  <Field
                    label="If Yes, what program do you run?"
                    helper={retailerTooltip}
                  >
                    <select
                      className="input"
                      value={formValues.retailerProgram}
                      onChange={(e) =>
                        updateField("retailerProgram", e.target.value)
                      }
                    >
                      <option value="">Select a program</option>
                      {["DIF", "ZVR", "RTV"].map((option) => (
                        <option key={option}>{option}</option>
                      ))}
                    </select>
                  </Field>
                )}

                <Field label="If you’re receiving your returns back, what do you do with them?">
                  <textarea
                    className="input min-h-[96px]"
                    value={formValues.returnsHandling}
                    onChange={(e) =>
                      updateField("returnsHandling", e.target.value)
                    }
                  />
                </Field>

                <Field label="What countries are you currently selling in?">
                  <textarea
                    className="input min-h-[80px]"
                    placeholder="e.g., US, Canada, UK, EU"
                    value={formValues.countries}
                    onChange={(e) => updateField("countries", e.target.value)}
                  />
                </Field>

                <Field label="Do you currently operate a warranty program?">
                  <div className="flex gap-3">
                    {["Yes", "No"].map((option) => (
                      <RadioChip
                        key={option}
                        active={formValues.warrantyProgram === option}
                        label={option}
                        onClick={() => updateField("warrantyProgram", option)}
                      />
                    ))}
                  </div>
                </Field>

                {showWarrantyInterest && (
                  <Field label="If No: Would you be interested in one?">
                    <div className="flex gap-3">
                      {["Yes", "No"].map((option) => (
                        <RadioChip
                          key={option}
                          active={formValues.warrantyInterest === option}
                          label={option}
                          onClick={() =>
                            updateField("warrantyInterest", option)
                          }
                        />
                      ))}
                    </div>
                  </Field>
                )}

                <Field label="Do you currently run a subscription program?">
                  <div className="flex gap-3">
                    {["Yes", "No"].map((option) => (
                      <RadioChip
                        key={option}
                        active={formValues.subscriptionProgram === option}
                        label={option}
                        onClick={() =>
                          updateField("subscriptionProgram", option)
                        }
                      />
                    ))}
                  </div>
                </Field>

                {showSubscriptionInterest && (
                  <Field label="If No: Would you be interested in one?">
                    <div className="flex gap-3">
                      {["Yes", "No"].map((option) => (
                        <RadioChip
                          key={option}
                          active={formValues.subscriptionInterest === option}
                          label={option}
                          onClick={() =>
                            updateField("subscriptionInterest", option)
                          }
                        />
                      ))}
                    </div>
                  </Field>
                )}
              </div>
            )}

            {currentStep.id === "recommerce" && (
              <div className="space-y-4">
                <Field label="What % of sales are DTC vs. retail?">
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={formValues.salesSplitDtc}
                      onChange={(e) =>
                        updateField("salesSplitDtc", Number(e.target.value))
                      }
                      className="flex-1 accent-sky-300"
                    />
                    <span className="w-24 text-right text-sm text-slate-200">
                      {formValues.salesSplitDtc}% DTC
                    </span>
                  </div>
                </Field>

                <Field label="What channels would you be interested in selling on?">
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {channelOptions.map((channel) => (
                      <label
                        key={channel}
                        className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-slate-900/40 px-3 py-3 text-sm text-slate-100 transition hover:border-sky-300/60"
                      >
                        <input
                          type="checkbox"
                          className="accent-sky-300"
                          checked={formValues.interestedChannels.includes(
                            channel,
                          )}
                          onChange={() => toggleChannel(channel)}
                        />
                        {channel}
                      </label>
                    ))}
                  </div>
                </Field>

                <Field label="Would you be interested in a branded second-hand DTC program?">
                  <div className="flex gap-3">
                    {["Yes", "No"].map((option) => (
                      <RadioChip
                        key={option}
                        active={formValues.brandedDtc === option}
                        label={option}
                        onClick={() => updateField("brandedDtc", option)}
                      />
                    ))}
                  </div>
                </Field>

                {showBrandedFollowUp && (
                  <Field label="If Yes: Would you want to manage it in-house or out-source it?">
                    <div className="flex gap-3">
                      {["In-house", "Out-source"].map((option) => (
                        <RadioChip
                          key={option}
                          active={formValues.brandedManagement === option}
                          label={option}
                          onClick={() =>
                            updateField("brandedManagement", option)
                          }
                        />
                      ))}
                    </div>
                  </Field>
                )}

                <Field label="Would you be interested in a Trade-In program?">
                  <div className="flex gap-3">
                    {["Yes", "No"].map((option) => (
                      <RadioChip
                        key={option}
                        active={formValues.tradeIn === option}
                        label={option}
                        onClick={() => updateField("tradeIn", option)}
                      />
                    ))}
                  </div>
                </Field>
              </div>
            )}

            {currentStep.id === "value" && (
              <div className="space-y-4">
                <Field label="What do you value most in returns?">
                  <select
                    className="input"
                    value={formValues.valuePriority}
                    onChange={(e) => updateField("valuePriority", e.target.value)}
                  >
                    <option value="">Select</option>
                    {valueOptions.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </Field>

                <Field label="Do you currently feel like you take advantage of the opportunity with returns?">
                  <div className="flex gap-3">
                    {["Yes", "No"].map((option) => (
                      <RadioChip
                        key={option}
                        active={formValues.opportunityFeeling === option}
                        label={option}
                        onClick={() =>
                          updateField("opportunityFeeling", option)
                        }
                      />
                    ))}
                  </div>
                </Field>

                <Field label="What do you currently do with your excess inventory?">
                  <textarea
                    className="input min-h-[96px]"
                    value={formValues.excessInventory}
                    onChange={(e) =>
                      updateField("excessInventory", e.target.value)
                    }
                  />
                </Field>

                <Field label="Would you be interested in combining your excess inventory strategy with returns to create a broad recommerce strategy?">
                  <div className="flex gap-3">
                    {["Yes", "No"].map((option) => (
                      <RadioChip
                        key={option}
                        active={formValues.combineStrategy === option}
                        label={option}
                        onClick={() => updateField("combineStrategy", option)}
                      />
                    ))}
                  </div>
                </Field>
              </div>
            )}

            {currentStep.id === "lead" && (
              <div className="space-y-4">
                <Field
                  label="Before we generate your PDF, who should receive it?"
                  helper="We’ll include these details in the footer for continuity."
                >
                  <div className="grid gap-3 sm:grid-cols-2">
                    <input
                      className="input"
                      placeholder="Full name"
                      value={formValues.name}
                      onChange={(e) => updateField("name", e.target.value)}
                    />
                    <input
                      className="input"
                      type="email"
                      placeholder="Work email"
                      value={formValues.email}
                      onChange={(e) => updateField("email", e.target.value)}
                    />
                  </div>
                </Field>

                <div className="rounded-xl border border-white/10 bg-slate-900/40 p-4 text-sm text-slate-200">
                  <p className="font-semibold text-white">
                    Reverse Logistics Strategic RFP
                  </p>
                  <p className="mt-1 text-slate-300">
                    Your answers will be formatted into a consulting-grade PDF
                    with Nok’s footer note and outreach expectation.
                  </p>
                  <ul className="mt-3 space-y-1 text-slate-200">
                    <li>• Summary by section</li>
                    <li>• Your contact details in the footer</li>
                    <li>• Ready for enterprise review</li>
                  </ul>
                </div>

                <div className="flex flex-wrap items-center gap-3 rounded-xl border border-sky-300/30 bg-sky-300/10 p-4 text-sm text-sky-50">
                  <span className="rounded-full bg-sky-300/25 px-3 py-1 text-xs uppercase tracking-wide text-sky-50">
                    Export ready
                  </span>
                  <p className="text-slate-100">
                    Provide Name + Email to enable the PDF download link.
                  </p>
                </div>
              </div>
            )}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex gap-3">
                <button
                  onClick={onBack}
                  disabled={stepIndex === 0}
                  className="btn ghost"
                >
                  Back
                </button>
                {currentStep.id !== "lead" && (
                  <button
                    onClick={onNext}
                    disabled={!canGoNext}
                    className="btn primary disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Next
                  </button>
                )}
              </div>

              {currentStep.id === "lead" && (
                <PDFDownloadLink
                  document={<RfpPdf data={formValues} />}
                  fileName="reverse-logistics-rfp.pdf"
                >
                  {({ loading }) => (
                    <button
                      className="btn primary w-full sm:w-auto disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={!leadReady || loading}
                    >
                      {loading ? "Preparing PDF..." : "Download PDF"}
                    </button>
                  )}
                </PDFDownloadLink>
              )}
            </div>
          </section>

          <aside className="card-surface flex flex-col gap-4 rounded-2xl p-6 text-sm text-slate-200">
            <div className="flex items-center justify-between">
              <p className="text-slate-100">Step overview</p>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs">
                Peak season ready
              </span>
            </div>
            <ul className="space-y-3">
              {steps.map((step, idx) => {
                const isActive = idx === stepIndex;
                const isDone = idx < stepIndex;
                return (
                  <li
                    key={step.id}
                    className={`rounded-xl border px-3 py-3 ${
                      isActive
                        ? "border-sky-300/60 bg-sky-300/10 text-white"
                        : "border-white/10 bg-slate-900/40 text-slate-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{step.title}</span>
                      {isDone && (
                        <span className="text-xs text-sky-200">Saved</span>
                      )}
                    </div>
                    <p className="text-xs text-slate-300">{step.blurb}</p>
                  </li>
                );
              })}
            </ul>

            <div className="rounded-xl border border-sky-300/30 bg-sky-300/10 p-4">
              <p className="text-sm font-semibold text-white">
                SEO spotlight
              </p>
              <p className="mt-2 text-xs text-slate-200">
                Optimized for “Reverse Logistics RFP creation” and “Peak Season
                Returns Strategy.” High-trust copy and structured fields help
                organic visitors convert.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  helper,
  children,
}: {
  label: string;
  helper?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <p className="text-sm font-semibold text-white">{label}</p>
        {helper ? (
          <span className="text-xs text-slate-300" title={helper}>
            ⓘ
          </span>
        ) : null}
      </div>
      {children}
    </div>
  );
}

function RadioChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-sm transition ${
        active
          ? "border-sky-300 bg-sky-300/20 text-white shadow-[0_0_0_1px_rgba(94,234,212,0.3)]"
          : "border-white/10 bg-slate-900/40 text-slate-200 hover:border-sky-200/50"
      }`}
    >
      {label}
    </button>
  );
}
