import { useState, useRef, useEffect, useCallback, useMemo, DragEvent, ChangeEvent } from 'react'
import { 
  Copy, 
  RotateCcw, 
  ArrowLeftRight, 
  Check, 
  Hash, 
  Sun, 
  Moon, 
  Upload, 
  Clipboard, 
  Trash2, 
  Sparkles,
  ArrowUpDown
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { useI18nStore } from '@/store/i18n-store'
import { useThemeStore } from '@/store/theme-store'
import { LanguageSelector } from '@/components/LanguageSelector'
import { encodeTextToBase64, decodeBase64ToText } from '@/lib/base64'

// Text metrics calculator (pure function, moved outside component)
function getMetrics(val: string) {
  const chars = val.length
  const lines = val === '' ? 0 : val.split('\n').length
  const words = val.trim() === '' ? 0 : val.trim().split(/\s+/).length
  const bytes = new TextEncoder().encode(val).length
  return { chars, lines, words, bytes }
}

function HomePage() {
  const [textInput, setTextInput] = useState('')
  const [base64Input, setBase64Input] = useState('')
  const [copiedText, setCopiedText] = useState(false)
  const [copiedBase64, setCopiedBase64] = useState(false)
  const [isLiveConvert, setIsLiveConvert] = useState(true)
  const [textareaHeight, setTextareaHeight] = useState(250)
  
  // Drag and drop states
  const [textDragActive, setTextDragActive] = useState(false)
  const [base64DragActive, setBase64DragActive] = useState(false)

  const { toast } = useToast()
  const { t } = useI18nStore()
  const { theme, toggleTheme } = useThemeStore()
  
  const textAreaRef = useRef<HTMLTextAreaElement>(null)
  const base64AreaRef = useRef<HTMLTextAreaElement>(null)
  const textFileInputRef = useRef<HTMLInputElement>(null)
  const base64FileInputRef = useRef<HTMLInputElement>(null)

  // Memoize metrics calculations
  const textMetrics = useMemo(() => getMetrics(textInput), [textInput])
  const base64Metrics = useMemo(() => getMetrics(base64Input), [base64Input])

  // Synchronize textarea heights
  useEffect(() => {
    const textArea = textAreaRef.current
    const base64Area = base64AreaRef.current
    
    if (!textArea || !base64Area) return

    let isResizing = false

    const syncHeight = (sourceElement: HTMLTextAreaElement, targetElement: HTMLTextAreaElement) => {
      if (isResizing) return
      
      isResizing = true
      const newHeight = sourceElement.offsetHeight
      
      if (Math.abs(newHeight - textareaHeight) > 5) {
        setTextareaHeight(newHeight)
        targetElement.style.height = `${newHeight}px`
      }
      isResizing = false
    }

    const handleTextAreaResize = (entries: ResizeObserverEntry[]) => {
      for (const entry of entries) {
        if (entry.target === textArea) {
          syncHeight(textArea, base64Area)
        }
      }
    }

    const handleBase64AreaResize = (entries: ResizeObserverEntry[]) => {
      for (const entry of entries) {
        if (entry.target === base64Area) {
          syncHeight(base64Area, textArea)
        }
      }
    }

    const textAreaObserver = new ResizeObserver(handleTextAreaResize)
    const base64AreaObserver = new ResizeObserver(handleBase64AreaResize)
    
    textAreaObserver.observe(textArea)
    base64AreaObserver.observe(base64Area)

    return () => {
      textAreaObserver.disconnect()
      base64AreaObserver.disconnect()
    }
  }, [textareaHeight])

  // Initialize constraints
  useEffect(() => {
    const textArea = textAreaRef.current
    const base64Area = base64AreaRef.current
    
    if (textArea && base64Area) {
      const initialHeight = `${textareaHeight}px`
      textArea.style.height = initialHeight
      base64Area.style.height = initialHeight
      
      textArea.style.minHeight = '200px'
      textArea.style.maxHeight = '600px'
      base64Area.style.minHeight = '200px'
      base64Area.style.maxHeight = '600px'
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Handle Plain Text Changes (with Auto-Convert)
  const handleTextChange = useCallback((value: string) => {
    setTextInput(value)
    if (isLiveConvert) {
      if (!value) {
        setBase64Input('')
        return
      }
      try {
        const encoded = encodeTextToBase64(value)
        setBase64Input(encoded)
      } catch {
        // Silently capture invalid characters during typing
      }
    }
  }, [isLiveConvert])

  // Handle Base64 Changes (with Auto-Convert)
  const handleBase64Change = useCallback((value: string) => {
    setBase64Input(value)
    if (isLiveConvert) {
      if (!value) {
        setTextInput('')
        return
      }
      try {
        const decoded = decodeBase64ToText(value)
        setTextInput(decoded)
      } catch {
        // Silently capture invalid base64 segments during typing
      }
    }
  }, [isLiveConvert])

  // Manual convert Text to Base64
  const handleConvertToBase64 = useCallback(() => {
    if (!textInput.trim()) {
      toast({
        title: t.emptyInput,
        description: t.emptyInputDesc,
        variant: "destructive"
      })
      return
    }
    
    try {
      const encoded = encodeTextToBase64(textInput)
      setBase64Input(encoded)
      toast({
        title: t.convertSuccess,
        description: t.convertSuccessDesc,
      })
    } catch {
      toast({
        title: t.convertFailed,
        description: t.convertFailedDesc,
        variant: "destructive"
      })
    }
  }, [textInput, toast, t])

  // Manual convert Base64 to Text
  const handleConvertToText = useCallback(() => {
    if (!base64Input.trim()) {
      toast({
        title: t.emptyInput,
        description: t.emptyInputDesc,
        variant: "destructive"
      })
      return
    }
    
    try {
      const decoded = decodeBase64ToText(base64Input)
      setTextInput(decoded)
      toast({
        title: t.decodeSuccess,
        description: t.decodeSuccessDesc,
      })
    } catch {
      toast({
        title: t.decodeFailed,
        description: t.decodeFailedDesc,
        variant: "destructive"
      })
    }
  }, [base64Input, toast, t])

  // Copy plain text to clipboard
  const copyText = useCallback(async () => {
    if (!textInput) {
      toast({
        title: t.noContentToCopy,
        description: t.noContentToCopyDesc,
        variant: "destructive"
      })
      return
    }
    
    try {
      await navigator.clipboard.writeText(textInput)
      setCopiedText(true)
      setTimeout(() => setCopiedText(false), 2000)
      toast({
        title: t.copySuccess,
        description: t.copySuccessDesc,
      })
    } catch {
      toast({
        title: t.copyFailed,
        description: t.copyFailedDesc,
        variant: "destructive"
      })
    }
  }, [textInput, toast, t])

  // Copy Base64 to clipboard
  const copyBase64 = useCallback(async () => {
    if (!base64Input) {
      toast({
        title: t.noContentToCopy,
        description: t.noContentToCopyDesc,
        variant: "destructive"
      })
      return
    }
    
    try {
      await navigator.clipboard.writeText(base64Input)
      setCopiedBase64(true)
      setTimeout(() => setCopiedBase64(false), 2000)
      toast({
        title: t.copySuccess,
        description: t.copySuccessDesc,
      })
    } catch {
      toast({
        title: t.copyFailed,
        description: t.copyFailedDesc,
        variant: "destructive"
      })
    }
  }, [base64Input, toast, t])

  // Paste into Plain Text
  const pasteText = useCallback(async () => {
    try {
      const clipboardText = await navigator.clipboard.readText()
      handleTextChange(clipboardText)
      toast({
        title: t.copySuccess,
        description: t.copySuccessDesc,
      })
    } catch {
      toast({
        title: t.copyFailed,
        description: t.copyFailedDesc,
        variant: "destructive"
      })
    }
  }, [handleTextChange, toast, t])

  // Paste into Base64
  const pasteBase64 = useCallback(async () => {
    try {
      const clipboardText = await navigator.clipboard.readText()
      handleBase64Change(clipboardText)
      toast({
        title: t.copySuccess,
        description: t.copySuccessDesc,
      })
    } catch {
      toast({
        title: t.copyFailed,
        description: t.copyFailedDesc,
        variant: "destructive"
      })
    }
  }, [handleBase64Change, toast, t])

  // Swap outputs
  const handleSwap = useCallback(() => {
    const tempText = textInput
    setTextInput(base64Input)
    setBase64Input(tempText)
    
    if (isLiveConvert) {
      // Re-trigger encode/decode with new inputs
      try {
        const decoded = decodeBase64ToText(tempText)
        setTextInput(decoded)
      } catch {
        try {
          const encoded = encodeTextToBase64(tempText)
          setBase64Input(encoded)
        } catch {
          // If neither works, just leave swapped values as is
        }
      }
    }
  }, [textInput, base64Input, isLiveConvert])

  // Clear all content
  const clearAll = useCallback(() => {
    setTextInput('')
    setBase64Input('')
    toast({
      title: t.cleared,
      description: t.clearedDesc,
    })
  }, [toast, t])

  // Toggle live convert
  const toggleLiveConvert = useCallback(() => {
    setIsLiveConvert(prev => !prev)
  }, [])

  // File Drag & Drop handlers
  const handleDrag = useCallback((e: DragEvent<HTMLElement>, type: 'text' | 'base64', active: boolean) => {
    e.preventDefault()
    e.stopPropagation()
    if (type === 'text') {
      setTextDragActive(active)
    } else {
      setBase64DragActive(active)
    }
  }, [])

  const readFileContents = useCallback((file: File, type: 'text' | 'base64') => {
    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      if (type === 'text') {
        handleTextChange(content)
      } else {
        handleBase64Change(content.trim())
      }
      toast({
        title: t.importSuccess,
        description: t.importSuccessDesc,
      })
    }
    reader.readAsText(file)
  }, [handleTextChange, handleBase64Change, toast, t])

  const handleDrop = useCallback((e: DragEvent<HTMLElement>, type: 'text' | 'base64') => {
    e.preventDefault()
    e.stopPropagation()
    
    if (type === 'text') {
      setTextDragActive(false)
    } else {
      setBase64DragActive(false)
    }

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      readFileContents(file, type)
    }
  }, [readFileContents])

  const handleFileChange = useCallback((e: ChangeEvent<HTMLInputElement>, type: 'text' | 'base64') => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      readFileContents(file, type)
    }
  }, [readFileContents])

  // Memoize click handlers for file inputs
  const handleTextFileClick = useCallback(() => textFileInputRef.current?.click(), [])
  const handleBase64FileClick = useCallback(() => base64FileInputRef.current?.click(), [])
  
  // Memoize clear handlers for textareas
  const handleClearText = useCallback(() => handleTextChange(''), [handleTextChange])
  const handleClearBase64 = useCallback(() => handleBase64Change(''), [handleBase64Change])

  // Memoize drag event handlers for text panel
  const handleTextDragEnter = useCallback((e: DragEvent<HTMLElement>) => handleDrag(e, 'text', true), [handleDrag])
  const handleTextDragOver = useCallback((e: DragEvent<HTMLElement>) => handleDrag(e, 'text', true), [handleDrag])
  const handleTextDragLeave = useCallback((e: DragEvent<HTMLElement>) => handleDrag(e, 'text', false), [handleDrag])
  const handleTextDrop = useCallback((e: DragEvent<HTMLElement>) => handleDrop(e, 'text'), [handleDrop])

  // Memoize drag event handlers for base64 panel
  const handleBase64DragEnter = useCallback((e: DragEvent<HTMLElement>) => handleDrag(e, 'base64', true), [handleDrag])
  const handleBase64DragOver = useCallback((e: DragEvent<HTMLElement>) => handleDrag(e, 'base64', true), [handleDrag])
  const handleBase64DragLeave = useCallback((e: DragEvent<HTMLElement>) => handleDrag(e, 'base64', false), [handleDrag])
  const handleBase64Drop = useCallback((e: DragEvent<HTMLElement>) => handleDrop(e, 'base64'), [handleDrop])

  // Memoize textarea change handlers
  const handleTextChangeHandler = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => handleTextChange(e.target.value), [handleTextChange])
  const handleBase64ChangeHandler = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => handleBase64Change(e.target.value), [handleBase64Change])

  // Memoize file input change handlers
  const handleTextFileChange = useCallback((e: ChangeEvent<HTMLInputElement>) => handleFileChange(e, 'text'), [handleFileChange])
  const handleBase64FileChange = useCallback((e: ChangeEvent<HTMLInputElement>) => handleFileChange(e, 'base64'), [handleFileChange])

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col justify-between transition-colors duration-300">
      {/* Background Decorative Blur Blobs */}
      <div className="glow-blob-1" />
      <div className="glow-blob-2" />
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-100 pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-6xl w-full mx-auto px-4 md:px-6 py-6 md:py-12 z-10 flex-grow flex flex-col justify-center space-y-8">
        
        {/* Navigation & Header */}
        <header className="flex flex-col md:flex-row items-center justify-between gap-6 pb-4 border-b border-border/40 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 dark:bg-primary/20 rounded-2xl border border-primary/20 shadow-inner">
              <Sparkles className="w-6 h-6 text-primary animate-pulse" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-foreground via-foreground to-primary bg-clip-text text-transparent">
                {t.title}
              </h1>
              <p className="text-muted-foreground text-xs md:text-sm mt-0.5 max-w-md">
                {t.subtitle}
              </p>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="flex items-center gap-3">
            {/* Live Convert Toggle */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border bg-card/40 backdrop-blur-sm">
              <span className="text-xs font-semibold text-muted-foreground">{t.liveConvert}</span>
              <button 
                onClick={toggleLiveConvert}
                className={`w-10 h-6 rounded-full p-1 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 ${isLiveConvert ? 'bg-primary' : 'bg-muted-foreground/30'}`}
              >
                <div className={`bg-white dark:bg-slate-900 w-4 h-4 rounded-full shadow-md transform duration-200 ${isLiveConvert ? 'translate-x-4' : 'translate-x-0'}`} />
              </button>
            </div>

            {/* Language Selector */}
            <LanguageSelector />

            {/* Dark Mode Toggle */}
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              className="rounded-xl hover:bg-accent hover:text-accent-foreground border-border bg-card/40 backdrop-blur-sm shadow-sm"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4.5 h-4.5 text-yellow-400 fill-yellow-400" />
              ) : (
                <Moon className="w-4.5 h-4.5 text-primary" />
              )}
            </Button>
          </div>
        </header>

        {/* Workspace Panels */}
        <main className="grid md:grid-cols-2 gap-6 relative items-stretch">
          
          {/* Plain Text Panel */}
          <section 
            className="flex flex-col relative"
            onDragEnter={handleTextDragEnter}
            onDragOver={handleTextDragOver}
            onDragLeave={handleTextDragLeave}
            onDrop={handleTextDrop}
          >
            {/* Drag & Drop Overlay */}
            <div className={`absolute inset-0 z-50 bg-background/90 dark:bg-slate-900/90 border-2 border-dashed border-primary rounded-2xl flex flex-col items-center justify-center gap-3 transition-all duration-300 pointer-events-none ${textDragActive ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}`}>
              <Upload className="w-10 h-10 text-primary animate-bounce" />
              <p className="text-sm font-semibold text-foreground">{t.dragActive}</p>
            </div>

            <div className="glass-card rounded-2xl flex-grow flex flex-col overflow-hidden transition-all duration-200 focus-within:ring-2 focus-within:ring-primary/20">
              
              {/* Panel Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-muted/40 dark:bg-slate-900/40 border-b border-border/50">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                  <h2 className="text-sm font-bold text-foreground tracking-wide">{t.plainText}</h2>
                </div>
                
                {/* Statistics Tooltip-style info */}
                <div className="flex items-center gap-3 text-[10px] md:text-xs text-muted-foreground font-medium">
                  <span>{textMetrics.chars} {t.chars}</span>
                  <span>{textMetrics.lines} {t.lines}</span>
                  <span>{textMetrics.bytes} {t.bytes}</span>
                </div>
              </div>

              {/* Textarea Area */}
              <div className="relative flex-grow flex flex-col">
                <Textarea
                  ref={textAreaRef}
                  placeholder={t.textPlaceholder}
                  value={textInput}
                  onChange={handleTextChangeHandler}
                  className="w-full flex-grow resize-y border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent rounded-none p-4 text-sm font-mono text-foreground placeholder:text-muted-foreground/60 leading-relaxed"
                  style={{ height: `${textareaHeight}px` }}
                />
                
                {/* Drag hint when empty */}
                {!textInput && (
                  <div className="absolute bottom-3 left-4 text-[10px] text-muted-foreground/50 pointer-events-none flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{t.dragHint} <span className="underline cursor-pointer pointer-events-auto" onClick={handleTextFileClick}>{t.uploadFile}</span></span>
                    <input 
                      type="file" 
                      ref={textFileInputRef} 
                      className="hidden" 
                      accept=".txt,.json,.xml,.csv,.html,.js,.ts"
                      onChange={handleTextFileChange}
                    />
                  </div>
                )}
              </div>

              {/* Panel Footer Toolbar */}
              <div className="flex items-center justify-between px-4 py-2 border-t border-border/50 bg-muted/20">
                <div className="flex items-center gap-1">
                  {/* File Upload Icon */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleTextFileClick}
                    className="h-8 w-8 rounded-lg hover:bg-accent"
                    title={t.uploadFile}
                  >
                    <Upload className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                  </Button>

                  {/* Paste Icon */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={pasteText}
                    className="h-8 w-8 rounded-lg hover:bg-accent"
                    title={t.pasteTooltip}
                  >
                    <Clipboard className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                  </Button>

                  {/* Clear Icon */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleClearText}
                    disabled={!textInput}
                    className="h-8 w-8 rounded-lg hover:bg-accent text-destructive hover:text-destructive"
                    title={t.clearAll}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  {!isLiveConvert && (
                    <Button 
                      size="sm"
                      onClick={handleConvertToBase64}
                      className="h-8 px-4 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg shadow-sm font-semibold text-xs"
                      disabled={!textInput}
                    >
                      <ArrowUpDown className="w-3.5 h-3.5 mr-1.5" />
                      {t.convertToBase64}
                    </Button>
                  )}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyText}
                    disabled={!textInput}
                    className="h-8 px-3 rounded-lg border-border hover:bg-accent text-xs font-semibold"
                  >
                    {copiedText ? (
                      <span className="flex items-center text-primary gap-1"><Check className="w-3.5 h-3.5" />{t.copied}</span>
                    ) : (
                      <span className="flex items-center gap-1"><Copy className="w-3.5 h-3.5" />{t.copy}</span>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Central Absolute Swap Button (Desktop) */}
          <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
            <Button
              variant="outline"
              size="icon"
              onClick={handleSwap}
              className="w-11 h-11 rounded-full border border-border shadow-lg bg-card hover:bg-accent text-primary hover:text-primary transition-all duration-300 active:scale-95 group hover:rotate-180"
              title={t.swapTooltip}
            >
              <ArrowLeftRight className="w-5 h-5 transition-transform duration-200" />
            </Button>
          </div>

          {/* Mobile Swap Button (Responsive layout) */}
          <div className="flex md:hidden justify-center my-1 z-20">
            <Button
              variant="outline"
              size="icon"
              onClick={handleSwap}
              className="w-10 h-10 rounded-full border border-border shadow-md bg-card hover:bg-accent text-primary transition-all duration-300"
              title={t.swapTooltip}
            >
              <ArrowUpDown className="w-4.5 h-4.5" />
            </Button>
          </div>

          {/* Base64 Encoded Panel */}
          <section 
            className="flex flex-col relative"
            onDragEnter={handleBase64DragEnter}
            onDragOver={handleBase64DragOver}
            onDragLeave={handleBase64DragLeave}
            onDrop={handleBase64Drop}
          >
            {/* Drag & Drop Overlay */}
            <div className={`absolute inset-0 z-50 bg-background/90 dark:bg-slate-900/90 border-2 border-dashed border-primary rounded-2xl flex flex-col items-center justify-center gap-3 transition-all duration-300 pointer-events-none ${base64DragActive ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}`}>
              <Upload className="w-10 h-10 text-primary animate-bounce" />
              <p className="text-sm font-semibold text-foreground">{t.dragActive}</p>
            </div>

            <div className="glass-card rounded-2xl flex-grow flex flex-col overflow-hidden transition-all duration-200 focus-within:ring-2 focus-within:ring-primary/20">
              
              {/* Panel Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-muted/40 dark:bg-slate-900/40 border-b border-border/50">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-violet-500" />
                  <h2 className="text-sm font-bold text-foreground tracking-wide">{t.base64Encoded}</h2>
                </div>
                
                {/* Statistics Tooltip-style info */}
                <div className="flex items-center gap-3 text-[10px] md:text-xs text-muted-foreground font-medium">
                  <span>{base64Metrics.chars} {t.chars}</span>
                  <span>{base64Metrics.lines} {t.lines}</span>
                  <span>{base64Metrics.bytes} {t.bytes}</span>
                </div>
              </div>

              {/* Textarea Area */}
              <div className="relative flex-grow flex flex-col">
                <Textarea
                  ref={base64AreaRef}
                  placeholder={t.base64Placeholder}
                  value={base64Input}
                  onChange={handleBase64ChangeHandler}
                  className="w-full flex-grow resize-y border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent rounded-none p-4 text-sm font-mono text-foreground placeholder:text-muted-foreground/60 leading-relaxed"
                  style={{ height: `${textareaHeight}px` }}
                />
                
                {/* Drag hint when empty */}
                {!base64Input && (
                  <div className="absolute bottom-3 left-4 text-[10px] text-muted-foreground/50 pointer-events-none flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{t.dragHint} <span className="underline cursor-pointer pointer-events-auto" onClick={handleBase64FileClick}>{t.uploadFile}</span></span>
                    <input 
                      type="file" 
                      ref={base64FileInputRef} 
                      className="hidden" 
                      accept=".txt,.json,.xml,.csv,.html,.js,.ts,.b64,.base64"
                      onChange={handleBase64FileChange}
                    />
                  </div>
                )}
              </div>

              {/* Panel Footer Toolbar */}
              <div className="flex items-center justify-between px-4 py-2 border-t border-border/50 bg-muted/20">
                <div className="flex items-center gap-1">
                  {/* File Upload Icon */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleBase64FileClick}
                    className="h-8 w-8 rounded-lg hover:bg-accent"
                    title={t.uploadFile}
                  >
                    <Upload className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                  </Button>

                  {/* Paste Icon */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={pasteBase64}
                    className="h-8 w-8 rounded-lg hover:bg-accent"
                    title={t.pasteTooltip}
                  >
                    <Clipboard className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                  </Button>

                  {/* Clear Icon */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleClearBase64}
                    disabled={!base64Input}
                    className="h-8 w-8 rounded-lg hover:bg-accent text-destructive hover:text-destructive"
                    title={t.clearAll}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  {!isLiveConvert && (
                    <Button 
                      size="sm"
                      onClick={handleConvertToText}
                      className="h-8 px-4 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg shadow-sm font-semibold text-xs"
                      disabled={!base64Input}
                    >
                      <ArrowUpDown className="w-3.5 h-3.5 mr-1.5 rotate-180" />
                      {t.convertToText}
                    </Button>
                  )}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyBase64}
                    disabled={!base64Input}
                    className="h-8 px-3 rounded-lg border-border hover:bg-accent text-xs font-semibold"
                  >
                    {copiedBase64 ? (
                      <span className="flex items-center text-primary gap-1"><Check className="w-3.5 h-3.5" />{t.copied}</span>
                    ) : (
                      <span className="flex items-center gap-1"><Copy className="w-3.5 h-3.5" />{t.copy}</span>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </section>

        </main>

        {/* Global Toolbar Action Bar */}
        <div className="flex justify-center pt-2">
          <Button
            variant="outline"
            onClick={clearAll}
            className="px-6 rounded-xl hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-colors bg-card/30 backdrop-blur-sm border-border text-xs font-bold shadow-sm"
            disabled={!textInput && !base64Input}
          >
            <RotateCcw className="w-3.5 h-3.5 mr-2" />
            {t.clearAll}
          </Button>
        </div>

        {/* Features Cards Redesigned */}
        <section className="mt-8 border border-border/40 bg-card/20 dark:bg-card/10 backdrop-blur-md rounded-3xl p-6 md:p-8">
          <h3 className="font-extrabold text-center text-foreground tracking-wide mb-6">{t.featuresTitle}</h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div className="group bg-card/40 dark:bg-slate-900/30 border border-border/50 rounded-2xl p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
              <div className="w-10 h-10 bg-primary/10 dark:bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-primary/15 transition-transform duration-300 group-hover:scale-110">
                <Hash className="w-5 h-5 text-primary" />
              </div>
              <p className="font-bold text-sm mb-1">{t.localProcessing}</p>
              <p className="text-muted-foreground text-xs leading-relaxed">{t.localProcessingDesc}</p>
            </div>

            <div className="group bg-card/40 dark:bg-slate-900/30 border border-border/50 rounded-2xl p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
              <div className="w-10 h-10 bg-violet-500/10 dark:bg-violet-500/20 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-violet-500/15 transition-transform duration-300 group-hover:scale-110">
                <ArrowLeftRight className="w-5 h-5 text-violet-500" />
              </div>
              <p className="font-bold text-sm mb-1">{t.bidirectionalConversion}</p>
              <p className="text-muted-foreground text-xs leading-relaxed">{t.bidirectionalConversionDesc}</p>
            </div>

            <div className="group bg-card/40 dark:bg-slate-900/30 border border-border/50 rounded-2xl p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
              <div className="w-10 h-10 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-emerald-500/15 transition-transform duration-300 group-hover:scale-110">
                <Copy className="w-5 h-5 text-emerald-500" />
              </div>
              <p className="font-bold text-sm mb-1">{t.oneClickCopy}</p>
              <p className="text-muted-foreground text-xs leading-relaxed">{t.oneClickCopyDesc}</p>
            </div>

            <div className="group bg-card/40 dark:bg-slate-900/30 border border-border/50 rounded-2xl p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
              <div className="w-10 h-10 bg-rose-500/10 dark:bg-rose-500/20 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-rose-500/15 transition-transform duration-300 group-hover:scale-110">
                <RotateCcw className="w-5 h-5 text-rose-500" />
              </div>
              <p className="font-bold text-sm mb-1">{t.quickClear}</p>
              <p className="text-muted-foreground text-xs leading-relaxed">{t.quickClearDesc}</p>
            </div>
          </div>
        </section>
      </div>

      {/* Footer Section */}
      <footer className="w-full text-center text-xs text-muted-foreground py-6 border-t border-border/30 bg-card/10 backdrop-blur-sm z-10">
        <p className="tracking-wide">{t.footerText}</p>
      </footer>
    </div>
  )
}

export default HomePage
