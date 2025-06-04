import { Favicon } from "@/assets/favicon"
import { ThemeToggle } from "@/components/shared/theme-toggle"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { useRss } from "@/context/rss-context"
import { useStore } from "@/store/store"
import { Eye, EyeOff, Globe, Newspaper, Settings } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"

function Header({ isFeedPage = false }: { isFeedPage?: boolean }) {
  const navigate = useNavigate()
  const { showDiscarded, toggleDiscarded, discardedIds } = useStore()
  const { postsByFeed } = useRss()

  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 mx-auto w-full border-b shadow-sm backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-screen-md items-center justify-between px-4 md:px-8">
        <Link to="/" className="flex items-center space-x-2">
          <Favicon className="h-8 w-8" />
          <span className="font-mono text-lg font-extrabold tracking-tight">
            RSS Feed
          </span>
        </Link>
        <div className="flex items-center gap-2">
          {isFeedPage && (discardedIds.length > 0 || showDiscarded) && (
            <Button variant="ghost" size="icon" onClick={toggleDiscarded}>
              {showDiscarded ? (
                <Eye className="h-4 w-4" />
              ) : (
                <EyeOff className="h-4 w-4" />
              )}
            </Button>
          )}
          {Object.keys(postsByFeed).length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Globe className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {Object.entries(postsByFeed).map(([url, posts]) => {
                  const sourceName =
                    posts[0]?.source?.sourceName ||
                    posts[0]?.source?.title ||
                    url
                  return (
                    <DropdownMenuItem
                      key={url}
                      onClick={() =>
                        navigate(`/feed/${encodeURIComponent(url)}`)
                      }>
                      {sourceName}
                    </DropdownMenuItem>
                  )
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          {isFeedPage ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                navigate("/config")
              }}>
              <Settings className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                navigate("/")
              }}>
              <Newspaper className="h-4 w-4" />
            </Button>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}

export default Header
