import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useI18nStore, languages, type Language } from '@/store/i18n-store'

export function LanguageSelector() {
  const { currentLanguage, setLanguage } = useI18nStore()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-xs rounded-sm border border-transparent text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/10 font-mono"
        >
          [ {currentLanguage} ]
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[150px] font-mono">
        {Object.entries(languages).map(([code, { name, flag }]) => (
          <DropdownMenuItem
            key={code}
            onClick={() => setLanguage(code as Language)}
            className="flex items-center gap-3 cursor-pointer"
          >
            <span className="text-base">{flag}</span>
            <span className={currentLanguage === code ? 'text-primary font-bold' : ''}>
              {name}
            </span>
            {currentLanguage === code && <span className="ml-auto text-primary">✓</span>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
