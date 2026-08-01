import type { ReactNode } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

/* Terminal-style command button:  [ cmd ] */
export function CmdButton({
  children,
  onClick,
  disabled,
  title,
  danger,
  active,
  className,
}: {
  children: ReactNode
  onClick?: () => void
  disabled?: boolean
  title?: string
  danger?: boolean
  active?: boolean
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        'h-7 px-2 text-xs max-sm:h-6 max-sm:px-1 max-sm:text-[11px] rounded-sm border border-transparent transition-colors duration-150',
        'inline-flex items-center justify-center whitespace-nowrap shrink-0',
        'text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/10',
        'disabled:opacity-40 disabled:pointer-events-none',
        active && 'text-primary border-primary/40 bg-primary/10',
        danger && 'hover:text-destructive hover:border-destructive/40 hover:bg-destructive/10',
        className
      )}
    >
      {children}
    </button>
  )
}

/* Terminal window panel */
export interface TerminalPanelProps {
  fileName: string
  title: string
  value: string
  placeholder: string
  onChange: (value: string) => void
  onPaste: () => void
  onCopy: () => void
  onClear: () => void
  copied: boolean
  pasteTooltip: string
  copyLabel: string
  copiedLabel: string
  metrics: { chars: number; lines: number; bytes: number }
  convertLabel?: string
  onConvert?: () => void
}

export function TerminalPanel({
  fileName,
  title,
  value,
  placeholder,
  onChange,
  onPaste,
  onCopy,
  onClear,
  copied,
  pasteTooltip,
  copyLabel,
  copiedLabel,
  metrics,
  convertLabel,
  onConvert,
}: TerminalPanelProps) {
  return (
    <section className="flex flex-col border border-border bg-card rounded-sm overflow-hidden shadow-sm transition-colors focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20">
      {/* Window title bar */}
      <div className="flex items-center gap-3 px-3 py-2 border-b border-border bg-muted/50 select-none">
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
        </div>
        <span className="text-xs text-muted-foreground truncate">~/{fileName}</span>
        <span className="ml-auto text-[10px] text-muted-foreground/60 tabular-nums sm:hidden shrink-0">
          {metrics.chars}c · {metrics.bytes}b
        </span>
        <span className="ml-auto text-[10px] text-muted-foreground/60 border border-border rounded-sm px-1.5 py-0.5 shrink-0 max-sm:hidden">
          utf-8
        </span>
      </div>

      {/* Editor area */}
      <Textarea
        aria-label={title}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
        className="h-[260px] md:h-[320px] resize-none border-0 rounded-none bg-transparent px-4 py-3 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-0 focus-visible:ring-offset-0"
      />

      {/* Status + action bar */}
      <div className="flex flex-wrap items-center gap-x-1 gap-y-1 px-1.5 py-1.5 border-t border-border bg-muted/30">
        <div className="flex items-center gap-1.5 pl-1 text-[10px] md:text-xs text-muted-foreground whitespace-nowrap min-w-0 tabular-nums max-sm:hidden">
          <span>{metrics.chars}c</span>
          <span className="text-border">|</span>
          <span>{metrics.lines}l</span>
          <span className="text-border">|</span>
          <span>{metrics.bytes}b</span>
        </div>

        <div className="flex items-center ml-auto max-w-full overflow-x-auto">
          <CmdButton onClick={onPaste} title={pasteTooltip}>
            [ paste ]
          </CmdButton>
          {convertLabel && onConvert && (
            <CmdButton onClick={onConvert} disabled={!value} active>
              [ {convertLabel} ]
            </CmdButton>
          )}
          <CmdButton onClick={onCopy} disabled={!value} active={copied} className="w-[104px] max-sm:w-[88px]">
            [ {copied ? `${copiedLabel} ✓` : copyLabel} ]
          </CmdButton>
          <CmdButton onClick={onClear} disabled={!value} danger>
            [ clear ]
          </CmdButton>
        </div>
      </div>
    </section>
  )
}
