import { Switch } from "@/components/ui/switch"
import { useEffect, useState } from "react"
import { MoonIcon, SunIcon } from "@radix-ui/react-icons"

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>(
    (localStorage.getItem('theme') as 'light' | 'dark') || 'light'
  )

  useEffect(() => {
    localStorage.setItem('theme', theme)
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2">
      <SunIcon className="h-4 w-4" />
      <Switch 
        checked={theme === 'dark'}
        onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
        className="data-[state=checked]:bg-indigo-600"
      />
      <MoonIcon className="h-4 w-4" />
    </div>
  )
}
