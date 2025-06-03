import Layout from "@/components/shared/layout/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useRss } from "@/context/rss-context"
import type { Post } from "@/types/feed"
import { ArrowLeft, Calendar, ExternalLink, Globe, User } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import { parseArticle } from "~utils/articleParse"

import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Separator } from "../ui/separator"

interface Article {
  title: string
  content: string
  url: string
  image: string
}

function BackButton() {
  const navigate = useNavigate()
  return (
    <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
      <ArrowLeft className="h-4 w-4" />
    </Button>
  )
}

export default function ReaderPage() {
  const { url } = useParams()
  const { posts } = useRss()
  const [post, setPost] = useState<Post | null>(null)
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    const getPostFromUrl = async () => {
      const post = posts.find((post) => post.link === url)
      if (post) {
        setPost(post)
      }
    }

    getPostFromUrl()
  }, [url, posts])

  useEffect(() => {
    const fetchArticle = async () => {
      if (!url) return

      try {
        setLoading(true)
        setError(null)

        // Decode the URL parameter
        const decodedUrl = decodeURIComponent(url)

        // Fetch and parse the article using our server endpoint
        const response = await parseArticle(decodedUrl)

        if (!response.title || !response.content) {
          throw new Error("Invalid article data received")
        }

        setArticle(response)
      } catch (error) {
        console.error("Error fetching article:", error)
        setError(
          error instanceof Error ? error.message : "Failed to load article"
        )
      } finally {
        setLoading(false)
      }
    }

    fetchArticle()
  }, [url])

  return (
    <Layout>
      <div className="container flex w-full flex-col gap-4">
        <BackButton />
        <Card className="relative">
          <CardHeader>
            {loading && (
              <>
                <div className="overflow-hidden rounded-lg">
                  <Skeleton className="h-48 w-full" />
                </div>
                <Skeleton className="mb-2 h-4 w-1/4" />
                <Skeleton className="mb-2 h-8 w-3/4" />
                <Skeleton className="h-8 w-2/3" />
              </>
            )}
            {error && <CardTitle>Error</CardTitle>}
            {!loading && !error && article && (
              <div className="flex flex-col gap-4">
                {article.image && (
                  <div className="overflow-hidden rounded-lg">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="h-auto w-full object-cover"
                    />
                  </div>
                )}
                {post?.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
                <CardTitle className="text-2xl font-bold">
                  {article.title}
                </CardTitle>
                <div className="rounded-lg bg-muted/50 p-4">
                  <div className="flex flex-col gap-3">
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
                      <ExternalLink className="h-4 w-4" />
                      Read original article
                    </a>
                    {post && (
                      <>
                        <Separator />
                        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                          {post.date && (
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              <span>
                                Published:{" "}
                                {new Date(post.date).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                          {post.author && (
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              <span>Author: {post.author}</span>
                            </div>
                          )}
                          {post.source && (
                            <div className="flex items-center gap-2">
                              <Globe className="h-4 w-4" />
                              <span>Source: </span>
                              <a
                                href={post.source.sourceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="transition-colors hover:text-foreground">
                                {post.source.sourceName || post.source.title}
                              </a>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </CardHeader>
          <CardContent>
            {loading && (
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/6" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            )}
            {error && <CardTitle>Error</CardTitle>}
            {!loading && !error && article && (
              <div
                className="prose dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
