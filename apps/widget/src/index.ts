import styles from "./styles.css";
import {
  STEPS, SCENT_OPTIONS, VIBE_OPTIONS, INTENSITY_OPTIONS, RECIPIENT_OPTIONS,
  stepTitle,
} from "./quiz";
import type { QuizAnswer, ScentFamily, Intensity, MatchResult, WidgetConfig } from "./types";

function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
}

function lightenColor(hex: string): string {
  // Return a very light tint of the accent color
  return hex + "18";
}

class ViphWidget {
  private config: WidgetConfig;
  private host: HTMLElement;
  private shadow: ShadowRoot;
  private trigger!: HTMLButtonElement;
  private panel!: HTMLDivElement;
  private isOpen = false;

  private currentStep = 0;
  private answers: Partial<QuizAnswer> = {};
  private selectedScents: ScentFamily[] = [];

  constructor(config: WidgetConfig) {
    this.config = config;
    this.host = document.createElement("div");
    this.host.setAttribute("id", "viph-root");
    this.shadow = this.host.attachShadow({ mode: "open" });
    document.body.appendChild(this.host);
    this.injectStyles();
    this.renderTrigger();
    this.renderPanel();
  }

  private injectStyles() {
    const style = document.createElement("style");
    style.textContent = (styles as string)
      .replace(/var\(--viph-accent-light,\s*#fdf3ec\)/g, lightenColor(this.config.accentColor))
      .replace(/var\(--viph-accent,\s*#c8956c\)/g, this.config.accentColor);
    this.shadow.appendChild(style);

    // Set CSS vars on the shadow host
    const varStyle = document.createElement("style");
    varStyle.textContent = `:host { --viph-accent: ${this.config.accentColor}; --viph-accent-light: ${lightenColor(this.config.accentColor)}; }`;
    this.shadow.appendChild(varStyle);
  }

  private renderTrigger() {
    this.trigger = document.createElement("button");
    this.trigger.className = `viph-trigger ${this.config.widgetPosition}`;
    this.trigger.innerHTML = `<span>✦</span> ${this.escapeHTML(this.config.buttonText)}`;
    this.trigger.addEventListener("click", () => this.togglePanel());
    this.shadow.appendChild(this.trigger);
  }

  private renderPanel() {
    this.panel = document.createElement("div");
    this.panel.className = `viph-panel ${this.config.widgetPosition}`;
    this.panel.style.display = "none";
    this.shadow.appendChild(this.panel);
    this.renderStep();
  }

  private togglePanel() {
    this.isOpen = !this.isOpen;
    this.panel.style.display = this.isOpen ? "flex" : "none";
  }

  private close() {
    this.isOpen = false;
    this.panel.style.display = "none";
  }

  private reset() {
    this.currentStep = 0;
    this.answers = {};
    this.selectedScents = [];
    this.renderStep();
  }

  private renderStep() {
    const step = STEPS[this.currentStep];
    const progress = ((this.currentStep) / STEPS.length) * 100;
    let canProceed = false;

    let bodyHTML = "";

    if (step.type === "scents") {
      canProceed = this.selectedScents.length > 0;
      bodyHTML = `
        <div class="viph-question">${stepTitle(step)}</div>
        <div class="viph-tiles">
          ${SCENT_OPTIONS.map(
            (s) => `<button class="viph-tile${this.selectedScents.includes(s) ? " selected" : ""}" data-scent="${s}">${s}</button>`
          ).join("")}
        </div>
        <div class="viph-hint">Pick as many as you like</div>
      `;
    } else if (step.type === "vibe") {
      canProceed = !!this.answers.vibe;
      bodyHTML = `
        <div class="viph-question">${stepTitle(step)}</div>
        <div class="viph-tiles">
          ${VIBE_OPTIONS.map(
            (v) => `<button class="viph-tile${this.answers.vibe === v.value ? " selected" : ""}" data-vibe="${v.value}">${v.label}</button>`
          ).join("")}
        </div>
      `;
    } else if (step.type === "intensity") {
      canProceed = !!this.answers.intensity;
      bodyHTML = `
        <div class="viph-question">${stepTitle(step)}</div>
        <div class="viph-slider-row">
          ${INTENSITY_OPTIONS.map(
            (i) => `
              <button class="viph-slider-option${this.answers.intensity === i.value ? " selected" : ""}" data-intensity="${i.value}">
                <div>${i.label}</div>
                <div style="font-size:10px;color:#a8a29e;margin-top:2px">${i.sub}</div>
              </button>`
          ).join("")}
        </div>
      `;
    } else if (step.type === "recipient") {
      canProceed = !!this.answers.recipient;
      bodyHTML = `
        <div class="viph-question">${stepTitle(step)}</div>
        <div class="viph-tiles">
          ${RECIPIENT_OPTIONS.map(
            (r) => `<button class="viph-tile${this.answers.recipient === r.value ? " selected" : ""}" data-recipient="${r.value}">
              <div style="font-size:20px;margin-bottom:4px">${r.emoji}</div>
              ${r.label}
            </button>`
          ).join("")}
        </div>
      `;
    }

    this.panel.innerHTML = `
      <div class="viph-header">
        <span class="viph-header-title">Find your scent</span>
        <button class="viph-close">✕</button>
      </div>
      <div class="viph-progress">
        <div class="viph-progress-fill" style="width:${progress}%"></div>
      </div>
      <div class="viph-body">${bodyHTML}</div>
      <div class="viph-footer">
        <button class="viph-next" ${!canProceed ? "disabled" : ""}>
          ${this.currentStep < STEPS.length - 1 ? "Next →" : "Find my match →"}
        </button>
      </div>
    `;

    this.panel.querySelector(".viph-close")!.addEventListener("click", () => this.close());

    // Event listeners per step
    if (step.type === "scents") {
      this.panel.querySelectorAll("[data-scent]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const scent = (btn as HTMLElement).dataset.scent as ScentFamily;
          if (this.selectedScents.includes(scent)) {
            this.selectedScents = this.selectedScents.filter((s) => s !== scent);
          } else {
            this.selectedScents.push(scent);
          }
          this.renderStep();
        });
      });
    }

    if (step.type === "vibe") {
      this.panel.querySelectorAll("[data-vibe]").forEach((btn) => {
        btn.addEventListener("click", () => {
          this.answers.vibe = (btn as HTMLElement).dataset.vibe as QuizAnswer["vibe"];
          this.renderStep();
        });
      });
    }

    if (step.type === "intensity") {
      this.panel.querySelectorAll("[data-intensity]").forEach((btn) => {
        btn.addEventListener("click", () => {
          this.answers.intensity = (btn as HTMLElement).dataset.intensity as Intensity;
          this.renderStep();
        });
      });
    }

    if (step.type === "recipient") {
      this.panel.querySelectorAll("[data-recipient]").forEach((btn) => {
        btn.addEventListener("click", () => {
          this.answers.recipient = (btn as HTMLElement).dataset.recipient as QuizAnswer["recipient"];
          this.renderStep();
        });
      });
    }

    const nextBtn = this.panel.querySelector(".viph-next") as HTMLButtonElement;
    if (nextBtn && !nextBtn.disabled) {
      nextBtn.addEventListener("click", () => {
        if (this.currentStep < STEPS.length - 1) {
          this.currentStep++;
          this.renderStep();
        } else {
          this.submitQuiz();
        }
      });
    }
  }

  private async submitQuiz() {
    const answers: QuizAnswer = {
      scentFamilies: this.selectedScents,
      vibe: this.answers.vibe!,
      intensity: this.answers.intensity!,
      recipient: this.answers.recipient!,
    };

    this.panel.innerHTML = `
      <div class="viph-header">
        <span class="viph-header-title">Find your scent</span>
        <button class="viph-close">✕</button>
      </div>
      <div class="viph-progress"><div class="viph-progress-fill" style="width:100%"></div></div>
      <div class="viph-body viph-loading">
        <div class="viph-spinner"></div>
        <div style="font-size:14px;color:#a8a29e">Finding your match...</div>
      </div>
    `;
    this.panel.querySelector(".viph-close")!.addEventListener("click", () => this.close());

    try {
      const res = await fetch(`${this.config.apiBase}/api/match`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storeId: this.config.storeId, answers }),
      });

      if (!res.ok) throw new Error("No match");

      const result: MatchResult = await res.json();
      this.renderResult(result, answers);

      // Log completion
      fetch(`${this.config.apiBase}/api/analytics/quiz-complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storeId: this.config.storeId,
          productId: result.match.id,
          answers,
          addedToCart: false,
        }),
      }).catch(() => {});
    } catch {
      this.panel.innerHTML = `
        <div class="viph-header">
          <span class="viph-header-title">Find your scent</span>
          <button class="viph-close">✕</button>
        </div>
        <div class="viph-body" style="text-align:center;padding:40px 20px">
          <div style="font-size:32px;margin-bottom:12px">✦</div>
          <div style="font-size:15px;font-weight:600;margin-bottom:8px">No matches yet</div>
          <div style="font-size:13px;color:#a8a29e;margin-bottom:20px">This store hasn't set up their product catalogue yet.</div>
          <button class="viph-restart">Try again</button>
        </div>
      `;
      this.panel.querySelector(".viph-close")!.addEventListener("click", () => this.close());
      this.panel.querySelector(".viph-restart")!.addEventListener("click", () => this.reset());
    }
  }

  private renderResult(result: MatchResult, answers: QuizAnswer) {
    const { match, crossSells, resultCopy } = result;

    this.panel.innerHTML = `
      <div class="viph-header">
        <span class="viph-header-title">Your match</span>
        <button class="viph-close">✕</button>
      </div>
      <div class="viph-progress"><div class="viph-progress-fill" style="width:100%"></div></div>
      <div class="viph-body viph-result">
        <div class="viph-result-badge">Your match</div>
        ${match.imageUrl
          ? `<img class="viph-result-img" src="${this.escapeAttr(match.imageUrl)}" alt="${this.escapeAttr(match.name)}" />`
          : `<div class="viph-result-img-placeholder"></div>`
        }
        <div class="viph-result-name">${this.escapeHTML(match.name)}</div>
        <div class="viph-result-copy">${this.escapeHTML(resultCopy)}</div>
        <a
          class="viph-add-cart"
          href="${this.escapeAttr(match.url)}"
          target="_blank"
          rel="noopener"
          data-match-id="${this.escapeAttr(match.id)}"
        >View product →</a>
        ${crossSells.length > 0 ? `
          <div class="viph-crosssells">
            <div class="viph-crosssells-title">You might also like</div>
            ${crossSells.map(
              (p) => `
              <a class="viph-crosssell-item" href="${this.escapeAttr(p.url)}" target="_blank" rel="noopener">
                ${p.imageUrl
                  ? `<img class="viph-crosssell-img" src="${this.escapeAttr(p.imageUrl)}" alt="${this.escapeAttr(p.name)}" />`
                  : `<div class="viph-crosssell-img"></div>`
                }
                <div class="viph-crosssell-name">${this.escapeHTML(p.name)}</div>
              </a>`
            ).join("")}
          </div>
        ` : ""}
        <button class="viph-restart">Start over</button>
      </div>
    `;

    this.panel.querySelector(".viph-close")!.addEventListener("click", () => this.close());
    this.panel.querySelector(".viph-restart")!.addEventListener("click", () => this.reset());

    const addCartBtn = this.panel.querySelector(".viph-add-cart");
    if (addCartBtn) {
      addCartBtn.addEventListener("click", () => {
        fetch(`${this.config.apiBase}/api/analytics/quiz-complete`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            storeId: this.config.storeId,
            productId: match.id,
            answers,
            addedToCart: true,
          }),
        }).catch(() => {});
      });
    }
  }

  private escapeHTML(str: string): string {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  private escapeAttr(str: string): string {
    return str.replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
}

function init() {
  const scripts = document.querySelectorAll<HTMLScriptElement>(
    'script[data-store-id]'
  );

  scripts.forEach((script) => {
    const storeId = script.dataset.storeId;
    if (!storeId) return;

    const accentColor = script.dataset.accentColor || "#c8956c";
    const widgetPosition = (script.dataset.position as WidgetConfig["widgetPosition"]) || "bottom-right";
    const buttonText = script.dataset.buttonText || "Not sure if this scent is for you?";
    const apiBase = script.dataset.apiBase || "https://viph.co";

    new ViphWidget({ storeId, accentColor, widgetPosition, buttonText, apiBase });
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
