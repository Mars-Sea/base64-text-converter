import { useState, useRef, useEffect } from 'react'
import { Copy, RotateCcw, ArrowUpDown, Check, Hash } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { useI18nStore } from '@/store/i18n-store'
import { LanguageSelector } from '@/components/LanguageSelector'

function HomePage() {
  const [textInput, setTextInput] = useState('')
  const [base64Input, setBase64Input] = useState('')
  const [copiedText, setCopiedText] = useState(false)
  const [copiedBase64, setCopiedBase64] = useState(false)
  const [textareaHeight, setTextareaHeight] = useState(200)
  const { toast } = useToast()
  const { t } = useI18nStore()
  
  const textAreaRef = useRef<HTMLTextAreaElement>(null)
  const base64AreaRef = useRef<HTMLTextAreaElement>(null)

  // Synchronize textarea heights with enhanced feedback
  useEffect(() => {
    const textArea = textAreaRef.current
    const base64Area = base64AreaRef.current
    
    if (!textArea || !base64Area) return

    let isResizing = false

    const syncHeight = (sourceElement: HTMLTextAreaElement, targetElement: HTMLTextAreaElement) => {
      if (isResizing) return
      
      isResizing = true
      const newHeight = sourceElement.offsetHeight
      
      if (Math.abs(newHeight - textareaHeight) > 5) { // Threshold to prevent micro-adjustments
        setTextareaHeight(newHeight)
        
        // Add visual feedback during sync
        targetElement.classList.add('syncing')
        targetElement.style.height = `${newHeight}px`
        
        // Remove visual feedback after animation
        setTimeout(() => {
          targetElement.classList.remove('syncing')
          isResizing = false
        }, 150)
      } else {
        isResizing = false
      }
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

    // Use ResizeObserver for better performance and accuracy
    const textAreaObserver = new ResizeObserver(handleTextAreaResize)
    const base64AreaObserver = new ResizeObserver(handleBase64AreaResize)
    
    textAreaObserver.observe(textArea)
    base64AreaObserver.observe(base64Area)

    return () => {
      textAreaObserver.disconnect()
      base64AreaObserver.disconnect()
    }
  }, [textareaHeight])

  // Initialize both textareas with the same height
  useEffect(() => {
    const textArea = textAreaRef.current
    const base64Area = base64AreaRef.current
    
    if (textArea && base64Area) {
      const initialHeight = `${textareaHeight}px`
      textArea.style.height = initialHeight
      base64Area.style.height = initialHeight
      
      // Ensure both textareas have the same min and max height constraints
      textArea.style.minHeight = '200px'
      textArea.style.maxHeight = '600px'
      base64Area.style.minHeight = '200px'
      base64Area.style.maxHeight = '600px'
    }
  }, [])

  // Convert text to Base64
  const convertToBase64 = () => {
    if (!textInput.trim()) {
      toast({
        title: t.emptyInput,
        description: t.emptyInputDesc,
        variant: "destructive"
      })
      return
    }
    
    try {
      const encoded = btoa(unescape(encodeURIComponent(textInput)))
      setBase64Input(encoded)
      toast({
        title: t.convertSuccess,
        description: t.convertSuccessDesc,
      })
    } catch (error) {
      toast({
        title: t.convertFailed,
        description: t.convertFailedDesc,
        variant: "destructive"
      })
    }
  }

  // Convert Base64 to text
  const convertToText = () => {
    if (!base64Input.trim()) {
      toast({
        title: t.emptyInput,
        description: t.emptyInputDesc,
        variant: "destructive"
      })
      return
    }
    
    try {
      const decoded = decodeURIComponent(escape(atob(base64Input)))
      setTextInput(decoded)
      toast({
        title: t.decodeSuccess,
        description: t.decodeSuccessDesc,
      })
    } catch (error) {
      toast({
        title: t.decodeFailed,
        description: t.decodeFailedDesc,
        variant: "destructive"
      })
    }
  }

  // Copy text to clipboard
  const copyText = async () => {
    if (!textInput.trim()) {
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
    } catch (error) {
      toast({
        title: t.copyFailed,
        description: t.copyFailedDesc,
        variant: "destructive"
      })
    }
  }

  // Copy Base64 to clipboard
  const copyBase64 = async () => {
    if (!base64Input.trim()) {
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
    } catch (error) {
      toast({
        title: t.copyFailed,
        description: t.copyFailedDesc,
        variant: "destructive"
      })
    }
  }

  // Clear all content
  const clearAll = () => {
    setTextInput('')
    setBase64Input('')
    toast({
      title: t.cleared,
      description: t.clearedDesc,
    })
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 pt-8">
          <div className="flex items-center justify-center gap-3">
            <div className="p-2 bg-accent/10 rounded-lg">
              <Hash className="w-6 h-6 text-accent" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              {t.title}
            </h1>
            <div className="ml-4">
              <LanguageSelector />
            </div>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Text Input Section */}
          <Card className="shadow-sm border-border">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl flex items-center gap-2">
                <span className="w-2 h-2 bg-accent rounded-full"></span>
                {t.plainText}
              </CardTitle>
              <CardDescription>
                {t.plainTextDesc}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                ref={textAreaRef}
                placeholder={t.textPlaceholder}
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                className="min-h-[200px] max-h-[600px] resize-y resizable-textarea text-sm font-mono bg-input border-border focus:ring-2 focus:ring-ring focus:border-transparent"
                style={{ height: `${textareaHeight}px` }}
              />
              <div className="flex gap-2">
                <Button 
                  onClick={convertToBase64}
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                  disabled={!textInput.trim()}
                >
                  <ArrowUpDown className="w-4 h-4 mr-2" />
                  {t.convertToBase64}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={copyText}
                  disabled={!textInput.trim()}
                  className="hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  {copiedText ? (
                    <Check className="w-4 h-4 text-accent" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Base64 Input Section */}
          <Card className="shadow-sm border-border">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl flex items-center gap-2">
                <span className="w-2 h-2 bg-primary rounded-full"></span>
                {t.base64Encoded}
              </CardTitle>
              <CardDescription>
                {t.base64EncodedDesc}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                ref={base64AreaRef}
                placeholder={t.base64Placeholder}
                value={base64Input}
                onChange={(e) => setBase64Input(e.target.value)}
                className="min-h-[200px] max-h-[600px] resize-y resizable-textarea text-sm font-mono bg-input border-border focus:ring-2 focus:ring-ring focus:border-transparent"
                style={{ height: `${textareaHeight}px` }}
              />
              <div className="flex gap-2">
                <Button
                  onClick={convertToText}
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                  disabled={!base64Input.trim()}
                >
                  <ArrowUpDown className="w-4 h-4 mr-2 rotate-180" />
                  {t.convertToText}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={copyBase64}
                  disabled={!base64Input.trim()}
                  className="hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  {copiedBase64 ? (
                    <Check className="w-4 h-4 text-accent" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Bar */}
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={clearAll}
            className="px-6 hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-colors"
            disabled={!textInput.trim() && !base64Input.trim()}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            {t.clearAll}
          </Button>
        </div>

        {/* Features Info */}
        <div className="bg-muted/30 rounded-lg p-6 mt-8">
          <h3 className="font-semibold text-foreground mb-4 text-center">{t.featuresTitle}</h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center space-y-1">
              <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
                <Hash className="w-4 h-4 text-accent" />
              </div>
              <p className="font-medium">{t.localProcessing}</p>
              <p className="text-muted-foreground text-xs">{t.localProcessingDesc}</p>
            </div>
            <div className="text-center space-y-1">
              <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
                <ArrowUpDown className="w-4 h-4 text-accent" />
              </div>
              <p className="font-medium">{t.bidirectionalConversion}</p>
              <p className="text-muted-foreground text-xs">{t.bidirectionalConversionDesc}</p>
            </div>
            <div className="text-center space-y-1">
              <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
                <Copy className="w-4 h-4 text-accent" />
              </div>
              <p className="font-medium">{t.oneClickCopy}</p>
              <p className="text-muted-foreground text-xs">{t.oneClickCopyDesc}</p>
            </div>
            <div className="text-center space-y-1">
              <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
                <RotateCcw className="w-4 h-4 text-accent" />
              </div>
              <p className="font-medium">{t.quickClear}</p>
              <p className="text-muted-foreground text-xs">{t.quickClearDesc}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground py-8">
          <p>{t.footerText}</p>
        </div>
      </div>
    </div>
  )
}

export default HomePage 