import Layout from "@/components/shared/layout/layout"
import { ThemeSelector } from "@/components/shared/theme-selector"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useStore } from "@/store/store"
import { Trash2 } from "lucide-react"
import { useState } from "react"

export default function ConfigPage() {
  const { urls, addUrl, removeUrl } = useStore()
  const [newUrl, setNewUrl] = useState("")

  const handleAddUrl = (e: React.FormEvent) => {
    e.preventDefault()
    if (newUrl.trim()) {
      addUrl(newUrl.trim())
      setNewUrl("")
    }
  }

  const handleRemoveUrl = (url: string) => {
    removeUrl(url)
  }

  return (
    <Layout>
      <div className="space-y-6">
        <Card>
          <CardHeader className="flex flex-row justify-between">
            <CardTitle>Theme</CardTitle>

            <p className="text-sm text-muted-foreground">
              Themes by{" "}
              <a
                href="https://tweakcn.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-primary">
                Tweakcn
              </a>
            </p>
          </CardHeader>
          <CardContent>
            <ThemeSelector />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Add RSS Feed</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddUrl} className="flex gap-2">
              <Input
                type="url"
                placeholder="Enter RSS feed URL"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                required
              />
              <Button type="submit">Add</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your RSS Feeds</CardTitle>
          </CardHeader>
          <CardContent>
            {urls.length === 0 ? (
              <p className="text-muted-foreground">No RSS feeds added yet.</p>
            ) : (
              <ul className="space-y-2">
                {urls.map((url) => (
                  <li
                    key={url}
                    className="group flex items-center justify-between rounded-lg border p-3">
                    <span className="truncate">{url}</span>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleRemoveUrl(url)}
                      className="opacity-0 transition-opacity group-hover:opacity-100">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
