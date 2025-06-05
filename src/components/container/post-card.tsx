import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useStore } from "@/store/store"
import type { Post } from "@/types/feed"
import { CalendarDays, EyeOff, Globe, User } from "lucide-react"
import { Link } from "react-router-dom"

export default function PostCard({
  post,
  className
}: {
  post: Post
  className?: string
}) {
  const { link, title, description, image, tags, date, author, source } = post
  const { discardId, undiscardId, discardedIds } = useStore()

  const handleToggleDiscard = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (discardedIds.includes(link)) {
      undiscardId(link)
    } else {
      discardId(link)
    }
  }

  return (
    <Card
      className={cn(
        "group max-h-[500px] gap-0 overflow-hidden p-0 transition-all duration-300 hover:shadow-lg md:max-w-md",
        className
      )}>
      <CardHeader className="relative p-0">
        <Link
          to={`/reader/${encodeURIComponent(link)}`}
          rel="noopener noreferrer"
          className="relative">
          {!!image && (
            <img
              src={image}
              alt={title}
              className="h-40 w-full object-cover sm:h-48"
            />
          )}
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          onClick={handleToggleDiscard}
          title="Discard post">
          <EyeOff className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="relative flex max-h-[446px] flex-1 flex-col overflow-hidden p-4 sm:p-6">
        <Link
          to={`/reader/${encodeURIComponent(link)}`}
          rel="noopener noreferrer"
          className="pr-8 hover:underline">
          <h3 className="mb-2 line-clamp-3 text-lg font-semibold sm:text-xl">
            {title}
          </h3>
        </Link>
        {tags.length > 0 && (
          <div className="mb-2 flex flex-wrap items-center gap-2">
            {tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
        <p className="max-h-full break-words text-sm text-muted-foreground sm:text-base">
          {description}
        </p>
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent opacity-30" />
      </CardContent>
      <CardFooter className="bg-muted/50 flex flex-col items-stretch justify-between gap-2 px-4 py-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:gap-4 sm:px-6 sm:py-4">
        <div className="flex w-full flex-wrap items-center gap-2">
          {date && (
            <div
              className="flex min-w-0 items-center gap-2"
              title={new Date(date).toLocaleString()}>
              <CalendarDays className="h-4 w-4 shrink-0" />
              <span className="whitespace-nowrap">
                {new Date(date).toLocaleDateString()}
              </span>
            </div>
          )}
          {author && (
            <div className="flex min-w-0 items-center gap-2" title={author}>
              <User className="h-4 w-4 shrink-0" />
              <span className="w-full truncate">{author}</span>
            </div>
          )}
          {source && (
            <Link
              to={`/feed/${encodeURIComponent(source.sourceUrl)}`}
              className="flex min-w-0 items-center gap-2 transition-colors hover:text-foreground"
              title={source.sourceName || source.title}>
              <Globe className="h-4 w-4 shrink-0" />
              <span className="w-full truncate">
                {source.sourceName || source.title}
              </span>
            </Link>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}
