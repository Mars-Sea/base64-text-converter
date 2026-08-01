import { useState, useCallback, useMemo } from 'react'
import { Sun, Moon } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useI18nStore } from '@/store/i18n-store'
import { useThemeStore } from '@/store/theme-store'
import { LanguageSelector } from '@/components/LanguageSelector'
import { CmdButton, TerminalPanel } from '@/components/terminal-panel'
import { encodeTextToBase64, decodeBase64ToText } from '@/lib/base64'
import { cn } from '@/lib/utils'

// Text metrics calculator (pure function)
function getMetrics(val: string) {
  const chars = val.length
  const lines = val === '' ? 0 : val.split('\n').length
  const bytes = new TextEncoder().encode(val).length
  return { chars, lines, bytes }
}

type StatusType = 'ready' | 'success' | 'error'

interface Status {
  type: StatusType
  text: string
}

function HomePage() {
  const [textInput, setTextInput] = useState('')
  const [base64Input, setBase64Input] = useState('')
  const [copiedText, setCopiedText] = useState(false)
  const [copiedBase64, setCopiedBase64] = useState(false)
  const [isLiveConvert, setIsLiveConvert] = useState(true)
  const [status, setStatus] = useState<Status | null>(null)

  const { toast } = useToast()
  const { t } = useI18nStore()
  const { theme, toggleTheme } = useThemeStore()

  const textMetrics = useMemo(() => getMetrics(textInput), [textInput])
  const base64Metrics = useMemo(() => getMetrics(base64Input), [base64Input])

  const elapsed = (start: number) => (performance.now() - start).toFixed(2)

  // Plain text changed (live encode)
  const handleTextChange = useCallback((value: string) => {
    setTextInput(value)
    if (!isLiveConvert) {
      setStatus(null)
      return
    }
    if (!value) {
      setBase64Input('')
      setStatus(null)
      return
    }
    const start = performance.now()
    try {
      const encoded = encodeTextToBase64(value)
      setBase64Input(encoded)
      setStatus({ type: 'success', text: t.statusEncoded(value.length, encoded.length, elapsed(start)) })
    } catch {
      setStatus({ type: 'error', text: t.statusEncodeFailed })
    }
  }, [isLiveConvert, t])

  // Base64 changed (live decode)
  const handleBase64Change = useCallback((value: string) => {
    setBase64Input(value)
    if (!isLiveConvert) {
      setStatus(null)
      return
    }
    if (!value) {
      setTextInput('')
      setStatus(null)
      return
    }
    const start = performance.now()
    try {
      const decoded = decodeBase64ToText(value)
      setTextInput(decoded)
      setStatus({ type: 'success', text: t.statusDecoded(value.length, decoded.length, elapsed(start)) })
    } catch {
      setStatus({ type: 'error', text: t.statusDecodeFailedShort })
    }
  }, [isLiveConvert, t])

  // Manual encode
  const handleConvertToBase64 = useCallback(() => {
    if (!textInput.trim()) {
      toast({ title: t.emptyInput, description: t.emptyInputDesc, variant: 'destructive' })
      return
    }
    const start = performance.now()
    try {
      const encoded = encodeTextToBase64(textInput)
      setBase64Input(encoded)
      setStatus({ type: 'success', text: t.statusEncoded(textInput.length, encoded.length, elapsed(start)) })
    } catch {
      setStatus({ type: 'error', text: t.statusEncodeFailed })
      toast({ title: t.convertFailed, description: t.convertFailedDesc, variant: 'destructive' })
    }
  }, [textInput, toast, t])

  // Manual decode
  const handleConvertToText = useCallback(() => {
    if (!base64Input.trim()) {
      toast({ title: t.emptyInput, description: t.emptyInputDesc, variant: 'destructive' })
      return
    }
    const start = performance.now()
    try {
      const decoded = decodeBase64ToText(base64Input)
      setTextInput(decoded)
      setStatus({ type: 'success', text: t.statusDecoded(base64Input.length, decoded.length, elapsed(start)) })
    } catch {
      setStatus({ type: 'error', text: t.statusDecodeFailedShort })
      toast({ title: t.decodeFailed, description: t.decodeFailedDesc, variant: 'destructive' })
    }
  }, [base64Input, toast, t])

  // Clipboard helpers
  const copyValue = useCallback(async (value: string, which: 'text' | 'base64') => {
    if (!value) {
      toast({ title: t.noContentToCopy, description: t.noContentToCopyDesc, variant: 'destructive' })
      return
    }
    try {
      await navigator.clipboard.writeText(value)
      if (which === 'text') {
        setCopiedText(true)
        setTimeout(() => setCopiedText(false), 1600)
      } else {
        setCopiedBase64(true)
        setTimeout(() => setCopiedBase64(false), 1600)
      }
    } catch {
      toast({ title: t.copyFailed, description: t.copyFailedDesc, variant: 'destructive' })
    }
  }, [toast, t])

  const pasteInto = useCallback(async (which: 'text' | 'base64') => {
    try {
      const clipboardText = await navigator.clipboard.readText()
      if (which === 'text') {
        handleTextChange(clipboardText)
      } else {
        handleBase64Change(clipboardText)
      }
    } catch {
      toast({ title: t.copyFailed, description: t.copyFailedDesc, variant: 'destructive' })
    }
  }, [handleTextChange, handleBase64Change, toast, t])

  // Clear all
  const clearAll = useCallback(() => {
    setTextInput('')
    setBase64Input('')
    setStatus(null)
    toast({ title: t.cleared, description: t.clearedDesc })
  }, [toast, t])

  const toggleLiveConvert = useCallback(() => {
    setIsLiveConvert(prev => !prev)
  }, [])

  // Memoized per-panel callbacks
  const copyTextCb = useCallback(() => copyValue(textInput, 'text'), [copyValue, textInput])
  const copyBase64Cb = useCallback(() => copyValue(base64Input, 'base64'), [copyValue, base64Input])
  const pasteTextCb = useCallback(() => pasteInto('text'), [pasteInto])
  const pasteBase64Cb = useCallback(() => pasteInto('base64'), [pasteInto])
  const clearTextCb = useCallback(() => handleTextChange(''), [handleTextChange])
  const clearBase64Cb = useCallback(() => handleBase64Change(''), [handleBase64Change])

  const statusType: StatusType = status?.type ?? 'ready'
  const statusText = status?.text ?? t.statusReady

  return (
    <div className="min-h-screen bg-background text-foreground relative flex flex-col transition-colors duration-300">
      {/* CRT scanlines — dark theme only */}
      <div className="scanlines pointer-events-none fixed inset-0 z-0 hidden dark:block" />
      {/* Faint dot grid */}
      <div className="bg-dot-grid pointer-events-none fixed inset-0 z-0 opacity-40" />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 md:px-8 lg:px-6 py-6 md:py-10 flex flex-col flex-grow">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-5 border-b border-border">
          <div className="min-w-0">
            <p className="text-xs md:text-sm text-primary select-none">
              $ base64 --encode --decode
              <span className="cursor-blink ml-1">▌</span>
            </p>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight mt-1.5">
              {t.title}
            </h1>
            <p className="text-muted-foreground text-xs md:text-sm mt-1">
              {t.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Live convert toggle */}
            <CmdButton onClick={toggleLiveConvert} active={isLiveConvert} title={t.liveConvert} className="w-[104px]">
              [ {t.liveConvert}: {isLiveConvert ? 'on' : 'off'} ]
            </CmdButton>

            <LanguageSelector />

            <button
              type="button"
              onClick={toggleTheme}
              title={theme === 'dark' ? t.themeLight : t.themeDark}
              className="h-7 w-7 inline-flex items-center justify-center rounded-sm border border-transparent text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/10 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </header>

        {/* Workspace */}
        <main className="relative grid lg:grid-cols-2 gap-4 mt-6 items-stretch">
          <TerminalPanel
            fileName="input.txt"
            title={t.plainText}
            value={textInput}
            placeholder={t.textPlaceholder}
            onChange={handleTextChange}
            onPaste={pasteTextCb}
            onCopy={copyTextCb}
            onClear={clearTextCb}
            copied={copiedText}
            pasteTooltip={t.pasteTooltip}
            copyLabel={t.copy}
            copiedLabel={t.copied}
            metrics={textMetrics}
            convertLabel={!isLiveConvert ? t.convertToBase64 : undefined}
            onConvert={!isLiveConvert ? handleConvertToBase64 : undefined}
          />

          <TerminalPanel
            fileName="output.b64"
            title={t.base64Encoded}
            value={base64Input}
            placeholder={t.base64Placeholder}
            onChange={handleBase64Change}
            onPaste={pasteBase64Cb}
            onCopy={copyBase64Cb}
            onClear={clearBase64Cb}
            copied={copiedBase64}
            pasteTooltip={t.pasteTooltip}
            copyLabel={t.copy}
            copiedLabel={t.copied}
            metrics={base64Metrics}
            convertLabel={!isLiveConvert ? t.convertToText : undefined}
            onConvert={!isLiveConvert ? handleConvertToText : undefined}
          />
        </main>

        {/* Command status line */}
        <div className="mt-4 flex items-center gap-2 border border-border bg-card rounded-sm px-3 py-2 text-xs md:text-sm overflow-hidden">
          <span className="text-primary select-none shrink-0">❯</span>
          {statusType === 'success' && <span className="text-primary shrink-0">✓</span>}
          {statusType === 'error' && <span className="text-destructive shrink-0">✗</span>}
          <span
            className={cn(
              'truncate',
              statusType === 'success' && 'text-primary',
              statusType === 'error' && 'text-destructive',
              statusType === 'ready' && 'text-muted-foreground'
            )}
          >
            {statusText}
          </span>
          {statusType === 'ready' && <span className="cursor-blink text-primary shrink-0">▌</span>}

          {/* Global clear */}
          <div className="ml-auto shrink-0">
            <CmdButton onClick={clearAll} disabled={!textInput && !base64Input} danger>
              [ {t.clearAll} ]
            </CmdButton>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 w-full text-center text-[11px] md:text-xs text-muted-foreground py-5 border-t border-border select-none">
        <span className="text-primary">$</span> echo "{t.footerText}"
      </footer>
    </div>
  )
}

export default HomePage
