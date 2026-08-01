import { useNavigate } from 'react-router-dom'

function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
      <div className="border border-border bg-card rounded-sm p-8 max-w-md w-full text-center">
        <p className="text-xs text-primary select-none">$ open ./page</p>
        <h1 className="text-5xl font-bold text-destructive mt-4">404</h1>
        <p className="text-sm text-muted-foreground mt-3">
          ✗ error: no such file or directory
        </p>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="mt-6 h-8 px-3 text-xs rounded-sm border border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
        >
          [ cd ~/home ]
        </button>
      </div>
    </div>
  )
}

export default NotFoundPage
