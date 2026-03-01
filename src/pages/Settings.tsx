import { useState } from "react";
import { Page } from "../App";
import { useSettingsStore } from "../store/settingsStore";

interface ToggleProps {
  enabled: boolean;
  onToggle: () => void;
}

function Toggle({ enabled, onToggle }: ToggleProps) {
  return (
    <button
      onClick={onToggle}
      role="switch"
      aria-checked={enabled}
      style={{
        position: "relative",
        width: "50px",
        height: "28px",
        borderRadius: "14px",
        background: enabled ? "var(--signal)" : "var(--neutral-200)",
        border: "none",
        cursor: "pointer",
        transition: "background 0.2s ease",
        flexShrink: 0,
        padding: 0,
      }}
    >
      <span
        style={{
          position: "absolute",
          top: "4px",
          left: enabled ? "26px" : "4px",
          width: "20px",
          height: "20px",
          borderRadius: "50%",
          background: "white",
          transition: "left 0.2s ease",
          boxShadow: "0 1px 4px rgba(0,0,0,0.22)",
          display: "block",
        }}
      />
    </button>
  );
}

interface SettingCardProps {
  title: string;
  label: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
  children?: React.ReactNode;
}

function SettingCard({
  title,
  label,
  description,
  enabled,
  onToggle,
  children,
}: SettingCardProps) {
  return (
    <div
      style={{
        background: "var(--white)",
        borderRadius: "14px",
        padding: "24px",
        border: "1px solid var(--neutral-200)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "20px",
        }}
      >
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontFamily: "'Sora', sans-serif",
              fontSize: "15px",
              fontWeight: "600",
              color: "var(--ink)",
              marginBottom: "3px",
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontFamily: "'Sora', sans-serif",
              fontSize: "13px",
              color: "var(--neutral-600)",
              fontWeight: "500",
              marginBottom: "8px",
            }}
          >
            {label}
          </div>
          <div
            style={{
              fontFamily: "'Sora', sans-serif",
              fontSize: "13px",
              color: "var(--neutral-600)",
              lineHeight: 1.65,
              maxWidth: "520px",
            }}
          >
            {description}
          </div>
          {enabled && children && (
            <div style={{ marginTop: "18px" }}>{children}</div>
          )}
        </div>
        <Toggle enabled={enabled} onToggle={onToggle} />
      </div>
    </div>
  );
}

interface SettingsProps {
  onNavigate: (page: Page) => void;
}

export default function Settings({ onNavigate }: SettingsProps) {
  const {
    rsiEnabled,
    rsiThreshold,
    smaEnabled,
    macdEnabled,
    toggleRsi,
    setRsiThreshold,
    toggleSma,
    toggleMacd,
  } = useSettingsStore();
  const [saved, setSaved] = useState(false);
  const [rawRsi, setRawRsi] = useState(String(rsiThreshold));

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div style={{ padding: "36px 40px", maxWidth: "760px" }}>
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <h1
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "32px",
            color: "var(--white)",
            marginBottom: "8px",
          }}
        >
          Signal Settings
        </h1>
        <p
          style={{
            fontFamily: "'Sora', sans-serif",
            fontSize: "15px",
            color: "var(--neutral-400)",
            marginBottom: "4px",
          }}
        >
          Configure which conditions must be met to trigger a buy signal.
        </p>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            background: "var(--ink-mid)",
            border: "1px solid var(--ink-soft)",
            borderRadius: "7px",
            padding: "6px 12px",
            marginTop: "8px",
          }}
        >
          <span
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "var(--signal)",
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontFamily: "'Sora', sans-serif",
              fontSize: "12px",
              color: "var(--neutral-400)",
            }}
          >
            All enabled conditions must be met simultaneously.
          </span>
        </div>
      </div>

      {/* Setting cards */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "14px",
          marginBottom: "32px",
        }}
      >
        {/* RSI */}
        <SettingCard
          title="RSI Threshold"
          label="RSI below threshold"
          description="Triggers when RSI drops below the value you set — indicating oversold conditions."
          enabled={rsiEnabled}
          onToggle={toggleRsi}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <label
              htmlFor="rsi-input"
              style={{
                fontFamily: "'Sora', sans-serif",
                fontSize: "13px",
                color: "var(--neutral-600)",
              }}
            >
              Trigger when RSI falls below
            </label>
            <input
              id="rsi-input"
              type="number"
              value={rawRsi}
              onChange={(e) => setRawRsi(e.target.value)}
              onBlur={() => {
                const n = Math.max(1, Math.min(100, Number(rawRsi) || 1))
                setRsiThreshold(n)
                setRawRsi(String(n))
              }}
              min={1}
              max={100}
              style={{
                padding: "7px 12px",
                background: "var(--neutral-100)",
                border: "1.5px solid var(--neutral-200)",
                borderRadius: "8px",
                fontFamily: "'DM Mono', monospace",
                fontSize: "15px",
                fontWeight: "500",
                color: "var(--ink)",
                width: "72px",
                outline: "none",
                textAlign: "center",
              }}
            />
          </div>
        </SettingCard>

        {/* 50-day MA */}
        <SettingCard
          title="50-Day Moving Average"
          label="Price above 50-day MA"
          description="Triggers when the stock price crosses above its 50-day moving average."
          enabled={smaEnabled}
          onToggle={toggleSma}
        />

        {/* MACD */}
        <SettingCard
          title="MACD Crossover"
          label="MACD bullish crossover"
          description="Triggers when the MACD line crosses above the signal line."
          enabled={macdEnabled}
          onToggle={toggleMacd}
        />
      </div>

      {/* Active summary */}
      <div
        style={{
          background: "var(--ink-mid)",
          borderRadius: "12px",
          padding: "16px 20px",
          border: "1px solid var(--ink-soft)",
          marginBottom: "28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "'Sora', sans-serif",
              fontSize: "12px",
              color: "var(--neutral-400)",
              marginBottom: "4px",
            }}
          >
            Active conditions
          </div>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {rsiEnabled && (
              <span
                style={{
                  background: "rgba(0,229,160,0.12)",
                  border: "1px solid rgba(0,229,160,0.3)",
                  color: "var(--signal)",
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "11px",
                  padding: "3px 9px",
                  borderRadius: "5px",
                }}
              >
                RSI &lt; {rsiThreshold}
              </span>
            )}
            {smaEnabled && (
              <span
                style={{
                  background: "rgba(0,229,160,0.12)",
                  border: "1px solid rgba(0,229,160,0.3)",
                  color: "var(--signal)",
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "11px",
                  padding: "3px 9px",
                  borderRadius: "5px",
                }}
              >
                Price &gt; 50-day MA
              </span>
            )}
            {macdEnabled && (
              <span
                style={{
                  background: "rgba(0,229,160,0.12)",
                  border: "1px solid rgba(0,229,160,0.3)",
                  color: "var(--signal)",
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "11px",
                  padding: "3px 9px",
                  borderRadius: "5px",
                }}
              >
                MACD Cross
              </span>
            )}
            {!rsiEnabled && !smaEnabled && !macdEnabled && (
              <span
                style={{
                  fontFamily: "'Sora', sans-serif",
                  fontSize: "12px",
                  color: "var(--warn)",
                }}
              >
                No conditions active — signals are disabled
              </span>
            )}
          </div>
        </div>
        <div
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "28px",
            color:
              [rsiEnabled, smaEnabled, macdEnabled].filter(Boolean).length > 0
                ? "var(--signal)"
                : "var(--warn)",
            fontWeight: "500",
          }}
        >
          {[rsiEnabled, smaEnabled, macdEnabled].filter(Boolean).length}
          <span
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "13px",
              color: "var(--neutral-600)",
              marginLeft: "4px",
            }}
          >
            / 3
          </span>
        </div>
      </div>

      {/* Save button */}
      <button
        onClick={handleSave}
        className="signal-btn"
        style={{
          padding: "13px 32px",
          background: saved ? "var(--signal-dim)" : "var(--signal)",
          color: "var(--ink)",
          border: "none",
          borderRadius: "10px",
          fontFamily: "'DM Mono', monospace",
          fontSize: "12px",
          fontWeight: "500",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          cursor: "pointer",
          transition: "background 0.2s",
        }}
      >
        {saved ? "✓ Saved" : "Save Settings"}
      </button>

      {/* Resources */}
      <div style={{ marginTop: "40px" }}>
        <div
          style={{
            fontFamily: "'Sora', sans-serif",
            fontSize: "11px",
            fontWeight: "600",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--neutral-600)",
            marginBottom: "12px",
          }}
        >
          Resources
        </div>
        <button
          onClick={() => onNavigate("brand-kit")}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            background: "var(--ink-mid)",
            border: "1px solid var(--ink-soft)",
            borderRadius: "12px",
            padding: "16px 20px",
            cursor: "pointer",
            textAlign: "left",
            transition: "border-color 0.15s",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "9px",
                background: "rgba(0,229,160,0.12)",
                border: "1px solid rgba(0,229,160,0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--signal)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4M12 16h.01" />
              </svg>
            </div>
            <div>
              <div
                style={{
                  fontFamily: "'Sora', sans-serif",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "var(--white)",
                  marginBottom: "2px",
                }}
              >
                Brand Kit
              </div>
              <div
                style={{
                  fontFamily: "'Sora', sans-serif",
                  fontSize: "12px",
                  color: "var(--neutral-600)",
                }}
              >
                Colors, typography, and logo assets
              </div>
            </div>
          </div>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--neutral-600)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
