import { useStore } from "@/store/store"
import debounce from "lodash.debounce"
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
} from "react"

import type { FeedCache, Post } from "../types/feed"
import { parseFeed } from "../utils/feedParser"

// Cache duration in milliseconds (5 minutes)
const CACHE_DURATION = 5 * 60 * 1000

interface RssContextType {
  posts: Post[]
  postsByFeed: Record<string, Post[]>
  loading: boolean
  error: string | null
  refreshFeeds: () => Promise<void>
}

const RssContext = createContext<RssContextType | undefined>(undefined)

export function RssProvider({ children }: { children: React.ReactNode }) {
  const { urls } = useStore()
  const [posts, setPosts] = useState<Post[]>([])
  const [postsByFeed, setPostsByFeed] = useState<Record<string, Post[]>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [feedCache, setFeedCache] = useState<FeedCache>({})

  const fetchSingleFeed = useCallback(
    async (url: string): Promise<Post[]> => {
      // Check cache first
      const cachedData = feedCache[url]
      if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
        return cachedData.data
      }

      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`Failed to fetch feed: ${response.statusText}`)
      }

      const xml = await response.text()
      const parser = new DOMParser()
      const xmlDoc = parser.parseFromString(xml, "text/xml")
      const posts = parseFeed(xmlDoc)

      // Update cache
      setFeedCache((prev) => ({
        ...prev,
        [url]: {
          data: posts,
          timestamp: Date.now()
        }
      }))

      return posts
    },
    [feedCache]
  )

  const fetchFeeds = useCallback(async () => {
    if (urls.length === 0) return

    setLoading(true)
    setError(null)

    try {
      const feedPromises = urls.map((url) =>
        fetchSingleFeed(url).catch((error) => {
          console.error(`Error fetching feed from ${url}:`, error)
          return [] // Return empty array for failed feeds
        })
      )

      const results = await Promise.all(feedPromises)

      // Create a map of posts by feed URL
      const postsByFeedMap: Record<string, Post[]> = {}
      urls.forEach((url, index) => {
        postsByFeedMap[url] = results[index]
      })

      // Update posts by feed
      setPostsByFeed(postsByFeedMap)

      // Combine and sort all posts
      const allPosts = results.flat()
      setPosts(
        allPosts.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )
      )
    } catch (error) {
      setError("Failed to fetch feeds")
      console.error("Error fetching feeds:", error)
    } finally {
      setLoading(false)
    }
  }, [urls, fetchSingleFeed])

  // Debounce the fetch operation
  const debouncedFetch = useCallback(() => {
    const debounced = debounce(fetchFeeds, 500)
    debounced()
    return () => debounced.cancel()
  }, [fetchFeeds])

  useEffect(() => {
    const cleanup = debouncedFetch()
    return cleanup
  }, [debouncedFetch])

  const value = {
    posts,
    postsByFeed,
    loading,
    error,
    refreshFeeds: fetchFeeds
  }

  return <RssContext.Provider value={value}>{children}</RssContext.Provider>
}

export function useRss() {
  const context = useContext(RssContext)
  if (context === undefined) {
    throw new Error("useRss must be used within a RssProvider")
  }
  return context
}
