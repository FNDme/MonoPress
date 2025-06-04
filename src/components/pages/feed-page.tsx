import PostCard from "@/components/container/post-card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useRss } from "@/context/rss-context"
import { useStore } from "@/store/store"
import { AlertCircle, ArrowLeft } from "lucide-react"
import { useEffect, useMemo } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { VirtuosoGrid } from "react-virtuoso"

import { Button } from "~components/ui/button"

import Footer from "../shared/layout/footer"
import Header from "../shared/layout/header"

export default function FeedPage() {
  const navigate = useNavigate()
  const { url } = useParams<{ url: string }>()
  const { discardedIds, showDiscarded, setShowDiscarded } = useStore()
  const { posts, postsByFeed, loading, error } = useRss()

  const decodedUrl = url ? decodeURIComponent(url) : ""

  const visiblePosts = useMemo(() => {
    if (url) {
      return postsByFeed[decodedUrl].filter(
        (post) => !discardedIds.includes(post.id)
      )
    }
    if (showDiscarded)
      return posts.filter((post) => discardedIds.includes(post.id))
    return posts.filter((post) => !discardedIds.includes(post.id))
  }, [posts, discardedIds, showDiscarded, decodedUrl, postsByFeed])

  useEffect(() => {
    setShowDiscarded(false)
  }, [])

  const feedName =
    visiblePosts[0]?.source?.sourceName ||
    visiblePosts[0]?.source?.title ||
    decodedUrl

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (loading) {
    return (
      <div className="flex h-screen flex-col bg-background">
        <Header />
        <div className="flex-1 overflow-auto">
          <div className="mx-auto flex w-full max-w-[888px] flex-row flex-wrap justify-center gap-6 p-8 pt-6">
            {Array.from({ length: 10 }).map((_, index) => (
              <div
                key={index}
                className="h-[500px] w-full max-w-[450px] animate-pulse rounded-xl bg-muted lg:w-[400px]"
              />
            ))}
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      <Header type={!url ? "main" : "singleFeed"} />
      {visiblePosts.length === 0 ? (
        <div className="mx-auto my-12 flex w-full max-w-[888px] flex-1 justify-center overflow-auto">
          <Alert className="h-fit w-fit max-w-[400px]">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              No posts found.
              <br />
              Please add a feed or check your internet connection
            </AlertDescription>
          </Alert>
        </div>
      ) : (
        <VirtuosoGrid
          className="mx-auto w-full max-w-[888px]"
          listClassName="flex flex-row flex-wrap gap-6 w-full justify-center"
          totalCount={visiblePosts.length}
          data={visiblePosts}
          computeItemKey={(index) => visiblePosts[index].id}
          itemContent={(_index, data) => (
            <PostCard post={data} className="h-[500px] w-[400px]" />
          )}
          components={{
            Header: () => {
              if (!url) {
                return <div className="h-6" />
              }
              return (
                <div className="mx-auto flex max-w-[888px] items-center gap-4 px-4 py-8">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate("/")}
                    className="shrink-0">
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <h1 className="text-2xl font-bold">{feedName}</h1>
                </div>
              )
            },
            Footer: () => <div className="h-6" />,
            ScrollSeekPlaceholder: () => (
              <div className="h-[500px] w-full animate-pulse rounded-lg bg-muted" />
            )
          }}
        />
      )}
      <Footer />
    </div>
  )
}
