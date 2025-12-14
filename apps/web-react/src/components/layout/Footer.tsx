export function Footer() {
  return (
    <footer className="h-8 border-t flex items-center justify-center text-xs text-muted-foreground bg-muted/30">
      <span>
        Made with ❤️ by{' '}
        <a 
          href="https://github.com/doocs" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:text-foreground underline-offset-4 hover:underline"
        >
          Doocs
        </a>
      </span>
    </footer>
  )
}
