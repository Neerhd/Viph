"use client";

import { useState } from "react";
import { StepConnect } from "./StepConnect";
import { StepTag } from "./StepTag";
import { StepEmbed } from "./StepEmbed";

const STEPS = ["Connect your store", "Tag your products", "Get your embed code"];

export default function OnboardingPage() {
  const [step, setStep] = useState(0);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">Setup</h1>
        <p className="text-stone-500 text-sm mt-1">Three steps to get your scent quiz live.</p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-0 mb-10">
        {STEPS.map((label, i) => (
          <div key={i} className="flex items-center">
            <button
              onClick={() => i < step && setStep(i)}
              className={`flex items-center gap-2 text-sm transition ${
                i === step
                  ? "text-stone-900 font-medium"
                  : i < step
                  ? "text-stone-500 hover:text-stone-900 cursor-pointer"
                  : "text-stone-300 cursor-default"
              }`}
            >
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium border ${
                  i === step
                    ? "border-stone-900 bg-stone-900 text-white"
                    : i < step
                    ? "border-stone-400 bg-stone-400 text-white"
                    : "border-stone-200 text-stone-300"
                }`}
              >
                {i < step ? "✓" : i + 1}
              </span>
              {label}
            </button>
            {i < STEPS.length - 1 && (
              <div className={`w-8 h-px mx-3 ${i < step ? "bg-stone-400" : "bg-stone-200"}`} />
            )}
          </div>
        ))}
      </div>

      {step === 0 && <StepConnect onComplete={() => setStep(1)} />}
      {step === 1 && <StepTag onComplete={() => setStep(2)} />}
      {step === 2 && <StepEmbed />}
    </div>
  );
}
