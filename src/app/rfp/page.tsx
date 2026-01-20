"use client";

import Image from "next/image";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { useMemo, useState } from "react";
import { Info } from "lucide-react";
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
      "Share contact details and generate an RFP tailored to your operation.",
  },
];

const retailerTooltip =
  "DIF = Destroy in Field | ZVR = Zero Value Return | RTV = Return to Vendor";

const programDefinitions = {
  DIF: "Destroy in Field. The retailer destroys the product on-site instead of shipping it back, usually for a financial credit.",
  ZVR: "Zero Value Return. Items are returned to the retailer but deemed to have no recovery value; they are typically recycled or disposed of by the retailer.",
  RTV: "Return to Vendor. Items are shipped back to the brand's facility or 3PL for grading and potential recovery.",
};

// Format number with commas for display
const formatNumberWithCommas = (value: string): string => {
  // Remove all non-digit characters
  const numbers = value.replace(/\D/g, "");
  if (numbers === "") return "";
  // Add commas
  return numbers.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const initialValues: RfpFormValues = {
  returnsPerYear: "",
  seasonality: "Mostly flat",
  sellsIntoRetailers: "",
  retailerProgram: "",
  currentReturnsHandling: "",
  returnsHandling: "",
  countries: "",
  warrantyProgram: "",
  warrantyInterest: "",
  subscriptionProgram: "",
  subscriptionInterest: "",
  salesSplitDtc: 50,
  interestedChannels: [],
  channelRestrictions: "",
  brandedDtc: "",
  brandedManagement: "",
  tradeIn: "",
  valuePriority: "",
  opportunityFeeling: "",
  excessInventoryChannel: "",
  excessInventoryNational: "",
  excessInventoryRegional: "",
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
  const showExcessInventoryNational =
    formValues.excessInventoryChannel === "Off-Priced Retailers (National)";
  const showExcessInventoryRegional =
    formValues.excessInventoryChannel === "Off-Priced Retailers (Regional)";

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
        "excessInventoryChannel",
        "combineStrategy",
      ],
      lead: [],
    };

    const dynamicRequired: (keyof RfpFormValues)[] = [];
    if (showRetailProgram) dynamicRequired.push("retailerProgram");
    if (showWarrantyInterest) dynamicRequired.push("warrantyInterest");
    if (showSubscriptionInterest) dynamicRequired.push("subscriptionInterest");
    if (showBrandedFollowUp) dynamicRequired.push("brandedManagement");
    if (
      formValues.excessInventoryChannel === "Off-Priced Retailers (National)"
    ) {
      dynamicRequired.push("excessInventoryNational");
    }
    if (
      formValues.excessInventoryChannel === "Off-Priced Retailers (Regional)"
    ) {
      dynamicRequired.push("excessInventoryRegional");
    }

    const requiredFields =
      currentStep.id === "general" || currentStep.id === "recommerce" || currentStep.id === "value"
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

  const handleStartOver = () => {
    setFormValues(initialValues);
    setStepIndex(0);
  };

  const handleStepClick = (idx: number) => {
    // Allow clicking any step for free navigation
    setStepIndex(idx);
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
                width={180}
                height={77}
                priority
              />
              <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-orange-200/90">
                Recommerce strategy
              </span>
            </div>
          </div>

          <h1 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
            Build your Reverse Logistics RFP
          </h1>
          <p className="mt-3 max-w-3xl text-sm text-slate-200/80 sm:text-base">
            Capture the operational reality of your returns, align on
            recommerce strategy, and translate insights into a decision-ready framework for peak season and enterprise leadership.
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
            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all"
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
            </div>

            {currentStep.id === "general" && (
              <div className="space-y-4">
                <Field
                  label="How many returns do you get per year?"
                  helper="Approximate annualized return count."
                >
                  <input
                    type="text"
                    inputMode="numeric"
                    className="input"
                    value={formValues.returnsPerYear}
                    onChange={(e) =>
                      updateField("returnsPerYear", formatNumberWithCommas(e.target.value))
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
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-white">
                        If Yes, what program do you run?
                      </p>
                      <div className="group relative">
                        <Info className="h-4 w-4 text-slate-400 cursor-help" />
                        <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block z-50 w-64">
                          <div className="bg-slate-800 border border-slate-600 rounded-lg p-3 shadow-lg">
                            <div className="text-xs text-slate-100 space-y-2">
                              <div>
                                <span className="font-semibold text-white">DIF:</span>{" "}
                                {programDefinitions.DIF}
                              </div>
                              <div>
                                <span className="font-semibold text-white">ZVR:</span>{" "}
                                {programDefinitions.ZVR}
                              </div>
                              <div>
                                <span className="font-semibold text-white">RTV:</span>{" "}
                                {programDefinitions.RTV}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <select
                      className="input"
                      value={formValues.retailerProgram}
                      onChange={(e) =>
                        updateField("retailerProgram", e.target.value)
                      }
                    >
                      <option value="">Select a program</option>
                      <option value="DIF">DIF - Destroy in Field</option>
                      <option value="ZVR">ZVR - Zero Value Return</option>
                      <option value="RTV">RTV - Return to Vendor</option>
                    </select>
                  </div>
                )}

                <Field label="For returns that are sent back to you (e.g., DTC or RTV), what is your current process for handling them?">
                  <textarea
                    className="input min-h-[96px]"
                    placeholder="e.g., We receive them at our main warehouse, but we struggle to grade and restock them quickly..."
                    value={formValues.currentReturnsHandling}
                    onChange={(e) =>
                      updateField("currentReturnsHandling", e.target.value)
                    }
                  />
                </Field>

                <Field label="If you're receiving your returns back, what do you do with them?">
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
                      className="flex-1 accent-blue-500"
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
                        className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-slate-900/40 px-3 py-3 text-sm text-slate-100 transition hover:border-blue-500/60"
                      >
                        <input
                          type="checkbox"
                          className="accent-blue-500"
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

                <Field label="Do you have any channel restrictions?">
                  <input
                    type="text"
                    className="input"
                    placeholder="e.g., Amazon, eBay, TJX, etc."
                    value={formValues.channelRestrictions}
                    onChange={(e) =>
                      updateField("channelRestrictions", e.target.value)
                    }
                  />
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

                <Field label="Where do you currently sell your excess inventory?">
                  <div className="flex gap-3">
                    {[
                      "Off-Priced Retailers (National)",
                      "Off-Priced Retailers (Regional)",
                    ].map((option) => (
                      <RadioChip
                        key={option}
                        active={formValues.excessInventoryChannel === option}
                        label={option}
                        onClick={() =>
                          updateField("excessInventoryChannel", option)
                        }
                      />
                    ))}
                  </div>
                </Field>

                {showExcessInventoryNational && (
                  <Field label='Which ones? (e.g., TJX, Ross, etc.)'>
                    <input
                      type="text"
                      className="input"
                      value={formValues.excessInventoryNational}
                      onChange={(e) =>
                        updateField("excessInventoryNational", e.target.value)
                      }
                    />
                  </Field>
                )}

                {showExcessInventoryRegional && (
                  <Field label="Which ones? (e.g., Ollie's, Gabe's, etc.)">
                    <input
                      type="text"
                      className="input"
                      value={formValues.excessInventoryRegional}
                      onChange={(e) =>
                        updateField("excessInventoryRegional", e.target.value)
                      }
                    />
                  </Field>
                )}

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
                      placeholder="Email"
                      value={formValues.email}
                      onChange={(e) => updateField("email", e.target.value)}
                    />
                  </div>
                </Field>

                <div className="rounded-xl border border-white/10 bg-slate-900/40 p-4 text-sm text-slate-200">
                  <p className="text-base font-bold text-white">
                    Reverse Logistics Strategic RFP
                  </p>
                  <ul className="mt-4 space-y-3 text-slate-100">
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5 text-blue-400">✓</span>
                      <span>Operational Baseline Audit: A detailed synthesis of your annual returns volume, seasonality trends, and current retail program footprint (DIF/ZVR/RTV).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5 text-blue-400">✓</span>
                      <span>Recommerce Channel Roadmap: A strategic mapping of your interest in DTC, Trade-In, and Off-Price channels against your specific brand restrictions.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5 text-blue-400">✓</span>
                      <span>Opportunity & Value Assessment: A gap analysis of your current returns handling versus your stated priorities (Environmental, Financial, and Customer Loyalty).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-0.5 text-blue-400">✓</span>
                      <span>Decision-Ready Framework: A professional assessment formatted for executive stakeholders to align on peak season strategy and recommerce maturity.</span>
                    </li>
                  </ul>
                </div>

                <div className="flex flex-wrap items-center gap-3 rounded-xl border border-blue-500/30 bg-blue-500/10 p-4 text-sm text-blue-50">
                  <span className="rounded-full bg-blue-500/25 px-3 py-1 text-xs uppercase tracking-wide text-blue-50">
                    Export ready
                  </span>
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

              <div className="flex gap-3 items-center">
                {currentStep.id === "lead" && (
                  <PDFDownloadLink
                    document={<RfpPdf data={formValues} />}
                    fileName={
                      formValues.name.trim()
                        ? `${formValues.name.trim().replace(/\s+/g, "-")}-RFP.pdf`
                        : "RFP.pdf"
                    }
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
                <button
                  onClick={handleStartOver}
                  className="btn ghost text-xs"
                >
                  Start Over
                </button>
              </div>
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
                    onClick={() => handleStepClick(idx)}
                    className={`rounded-xl border px-3 py-3 transition cursor-pointer ${
                      isActive
                        ? "border-blue-500/80 bg-blue-500/10 text-white shadow-[0_0_8px_rgba(37,99,235,0.4)]"
                        : "border-white/10 bg-slate-900/40 text-slate-200 hover:border-blue-500/40 hover:bg-slate-900/60"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{step.title}</span>
                      {isDone && (
                        <span className="text-xs text-blue-300">Saved</span>
                      )}
                    </div>
                    <p className="text-xs text-slate-300">{step.blurb}</p>
                  </li>
                );
              })}
            </ul>

            <div className="rounded-xl border border-blue-500/30 bg-blue-500/15 p-4">
              <div className="flex items-start gap-2">
                <span className="text-lg">💡</span>
                <div>
                  <p className="text-sm font-semibold text-white">Pro Tip</p>
                  <p className="mt-2 text-xs text-slate-200">
                    {currentStep.id === "general" &&
                      "Understanding your baseline logistics operations—volume patterns, seasonality, and existing programs—is crucial for building a successful Reverse Logistics RFP. This foundation helps potential partners tailor solutions to your specific operational context."}
                    {currentStep.id === "recommerce" &&
                      "Effective recommerce strategy requires clear channel diversification and ownership models. Defining your channel preferences and restrictions upfront enables partners to propose solutions that align with your business goals and operational constraints."}
                    {currentStep.id === "value" &&
                      "Identifying value drivers and opportunity gaps reveals where optimization can have the greatest impact. Clear articulation of priorities helps partners design programs that maximize value recovery while addressing your specific constraints."}
                    {currentStep.id === "lead" &&
                      "This RFP document captures your complete reverse logistics context. Share it with potential partners to accelerate conversations and ensure proposals address your specific operational needs from day one."}
                  </p>
                </div>
              </div>
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
          ? "border-blue-500 bg-blue-500/20 text-white shadow-[0_0_0_1px_rgba(37,99,235,0.3)]"
          : "border-white/10 bg-slate-900/40 text-slate-200 hover:border-blue-400/50"
      }`}
    >
      {label}
    </button>
  );
}
