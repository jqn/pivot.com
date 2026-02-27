import { useState } from 'react'
import { Page } from '../App'

interface BrandKitProps {
  onNavigate: (page: Page) => void
}

const colors = [
  { name: 'Ink', variable: '--ink', hex: '#0B0F1A', description: 'Primary background' },
  { name: 'Ink Mid', variable: '--ink-mid', hex: '#1E2535', description: 'Card / surface' },
  { name: 'Ink Soft', variable: '--ink-soft', hex: '#2E3A50', description: 'Borders & dividers' },
  { name: 'Signal', variable: '--signal', hex: '#00E5A0', description: 'Primary accent' },
  { name: 'Signal Dim', variable: '--signal-dim', hex: '#00C48A', description: 'Hover / pressed' },
  { name: 'Warn', variable: '--warn', hex: '#FF6B35', description: 'Negative / alert' },
  { name: 'Neutral 100', variable: '--neutral-100', hex: '#F4F6FA', description: 'Light surface' },
  { name: 'Neutral 200', variable: '--neutral-200', hex: '#E2E8F0', description: 'Borders on light' },
  { name: 'Neutral 400', variable: '--neutral-400', hex: '#94A3B8', description: 'Secondary text' },
  { name: 'Neutral 600', variable: '--neutral-600', hex: '#64748B', description: 'Muted text' },
  { name: 'White', variable: '--white', hex: '#FFFFFF', description: 'Pure white' },
]

const typefaces = [
  {
    name: 'DM Serif Display',
    role: 'Display / Headings',
    stack: "'DM Serif Display', serif",
    sample: 'Buy signal triggered.',
    sizes: ['48px', '32px', '24px'],
  },
  {
    name: 'Sora',
    role: 'Body / UI',
    stack: "'Sora', sans-serif",
    sample: 'Configure your signal conditions.',
    sizes: ['16px', '14px', '12px'],
  },
  {
    name: 'DM Mono',
    role: 'Data / Monospace',
    stack: "'DM Mono', monospace",
    sample: 'RSI < 30 · NVDA · $892.40',
    sizes: ['18px', '14px', '11px'],
  },
]

const PivotLogo = () => (
  <svg width="48" height="48" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="36" height="36" rx="9" fill="#00E5A0" />
    <g transform="translate(6, 30) scale(0.025)">
      <path d="m136-240-56-56 296-298 160 160 208-206H640v-80h240v240h-80v-104L536-320 376-480 136-240Z" fill="#0B0F1A" />
    </g>
  </svg>
)

function CopyChip({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  function handleCopy() {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  return (
    <button
      onClick={handleCopy}
      title="Copy to clipboard"
      style={{
        background: 'none',
        border: '1px solid var(--ink-soft)',
        borderRadius: '5px',
        color: copied ? 'var(--signal)' : 'var(--neutral-400)',
        fontFamily: "'DM Mono', monospace",
        fontSize: '11px',
        padding: '2px 8px',
        cursor: 'pointer',
        transition: 'color 0.15s, border-color 0.15s',
        borderColor: copied ? 'var(--signal)' : 'var(--ink-soft)',
      }}
    >
      {copied ? 'Copied!' : text}
    </button>
  )
}

export default function BrandKit({ onNavigate }: BrandKitProps) {
  return (
    <div style={{ padding: '36px 40px', maxWidth: '880px' }}>

      {/* Back link */}
      <button
        onClick={() => onNavigate('settings')}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          color: 'var(--neutral-400)',
          fontFamily: "'Sora', sans-serif",
          fontSize: '13px',
          padding: '0 0 24px',
          marginLeft: '-2px',
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Settings
      </button>

      {/* Header */}
      <div style={{ marginBottom: '40px' }}>
        <h1
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: '32px',
            color: 'var(--white)',
            marginBottom: '8px',
          }}
        >
          Brand Kit
        </h1>
        <p
          style={{
            fontFamily: "'Sora', sans-serif",
            fontSize: '15px',
            color: 'var(--neutral-400)',
          }}
        >
          Colors, typography, and logo assets for Pivot.
        </p>
      </div>

      {/* Logo */}
      <section style={{ marginBottom: '48px' }}>
        <SectionLabel>Logo</SectionLabel>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          {/* Dark variant */}
          <LogoCard bg="var(--ink-mid)" border="var(--ink-soft)" label="Dark">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <PivotLogo />
              <span
                style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: '28px',
                  color: 'var(--white)',
                  letterSpacing: '-0.01em',
                  lineHeight: 1,
                }}
              >
                Pivot
              </span>
            </div>
          </LogoCard>

          {/* Light variant */}
          <LogoCard bg="#F4F6FA" border="#E2E8F0" label="Light">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <PivotLogo />
              <span
                style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: '28px',
                  color: '#0B0F1A',
                  letterSpacing: '-0.01em',
                  lineHeight: 1,
                }}
              >
                Pivot
              </span>
            </div>
          </LogoCard>

          {/* Icon only */}
          <LogoCard bg="var(--ink-mid)" border="var(--ink-soft)" label="Mark only">
            <PivotLogo />
          </LogoCard>
        </div>
      </section>

      {/* Colors */}
      <section style={{ marginBottom: '48px' }}>
        <SectionLabel>Color Palette</SectionLabel>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '12px',
          }}
        >
          {colors.map((color) => {
            const isLight = ['#F4F6FA', '#E2E8F0', '#94A3B8', '#FFFFFF'].includes(color.hex)
            return (
              <div
                key={color.variable}
                style={{
                  background: 'var(--ink-mid)',
                  border: '1px solid var(--ink-soft)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '64px',
                    background: color.hex,
                    borderBottom: isLight ? '1px solid #E2E8F0' : 'none',
                  }}
                />
                <div style={{ padding: '12px 14px' }}>
                  <div
                    style={{
                      fontFamily: "'Sora', sans-serif",
                      fontSize: '13px',
                      fontWeight: '600',
                      color: 'var(--white)',
                      marginBottom: '2px',
                    }}
                  >
                    {color.name}
                  </div>
                  <div
                    style={{
                      fontFamily: "'Sora', sans-serif",
                      fontSize: '11px',
                      color: 'var(--neutral-600)',
                      marginBottom: '8px',
                    }}
                  >
                    {color.description}
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    <CopyChip text={color.hex} />
                    <CopyChip text={`var(${color.variable})`} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Typography */}
      <section style={{ marginBottom: '48px' }}>
        <SectionLabel>Typography</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {typefaces.map((face) => (
            <div
              key={face.name}
              style={{
                background: 'var(--ink-mid)',
                border: '1px solid var(--ink-soft)',
                borderRadius: '14px',
                padding: '24px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <div
                    style={{
                      fontFamily: "'Sora', sans-serif",
                      fontSize: '13px',
                      fontWeight: '600',
                      color: 'var(--white)',
                      marginBottom: '2px',
                    }}
                  >
                    {face.name}
                  </div>
                  <div
                    style={{
                      fontFamily: "'Sora', sans-serif",
                      fontSize: '12px',
                      color: 'var(--neutral-600)',
                    }}
                  >
                    {face.role}
                  </div>
                </div>
                <CopyChip text={face.stack} />
              </div>

              {/* Size specimens */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {face.sizes.map((size) => (
                  <div key={size} style={{ display: 'flex', alignItems: 'baseline', gap: '14px' }}>
                    <span
                      style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: '10px',
                        color: 'var(--neutral-600)',
                        width: '32px',
                        flexShrink: 0,
                      }}
                    >
                      {size}
                    </span>
                    <span
                      style={{
                        fontFamily: face.stack,
                        fontSize: size,
                        color: 'var(--white)',
                        lineHeight: 1.2,
                      }}
                    >
                      {face.sample}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Design tokens */}
      <section style={{ marginBottom: '16px' }}>
        <SectionLabel>Design Tokens</SectionLabel>
        <div
          style={{
            background: 'var(--ink-mid)',
            border: '1px solid var(--ink-soft)',
            borderRadius: '14px',
            padding: '24px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px 32px',
          }}
        >
          {[
            { token: 'Border radius — card', value: '14px' },
            { token: 'Border radius — button', value: '10px' },
            { token: 'Border radius — pill', value: '5px' },
            { token: 'Page padding', value: '36px 40px' },
            { token: 'Card padding', value: '24px' },
            { token: 'Transition speed', value: '0.2s ease' },
          ].map(({ token, value }) => (
            <div key={token} style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
              <span
                style={{
                  fontFamily: "'Sora', sans-serif",
                  fontSize: '12px',
                  color: 'var(--neutral-600)',
                }}
              >
                {token}
              </span>
              <span
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: '13px',
                  color: 'var(--signal)',
                }}
              >
                {value}
              </span>
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontFamily: "'Sora', sans-serif",
        fontSize: '11px',
        fontWeight: '600',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: 'var(--neutral-600)',
        marginBottom: '14px',
      }}
    >
      {children}
    </div>
  )
}

function LogoCard({ bg, border, label, children }: { bg: string; border: string; label: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        background: bg,
        border: `1px solid ${border}`,
        borderRadius: '14px',
        padding: '28px 32px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px',
        minWidth: '200px',
      }}
    >
      {children}
      <span
        style={{
          fontFamily: "'Sora', sans-serif",
          fontSize: '11px',
          color: '#94A3B8',
        }}
      >
        {label}
      </span>
    </div>
  )
}
