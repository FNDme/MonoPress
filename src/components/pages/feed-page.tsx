import { AlertCircle } from "lucide-react";
import { VirtuosoGrid } from "react-virtuoso";

import PostCard from "@/components/container/post-card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useStore } from "@/store/store";
import { useRss } from "@/context/rss-context";
import { useMemo } from "react";
import Header from "../shared/layout/header";
import Footer from "../shared/layout/footer";

export default function FeedPage() {
  const { discardedIds, showDiscarded } = useStore();
  const { posts, loading, error } = useRss();

  const visiblePosts = useMemo(() => {
    if (showDiscarded)
      return posts.filter((post) => discardedIds.includes(post.id));
    return posts.filter((post) => !discardedIds.includes(post.id));
  }, [posts, discardedIds, showDiscarded]);

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (loading) {
    return (
      <div className="h-screen flex flex-col bg-background">
        <Header />
        <div className="flex-1 overflow-auto">
          <div className="flex flex-row flex-wrap justify-center gap-6 p-8 max-w-[888px] mx-auto">
            {Array.from({ length: 10 }).map((_, index) => (
              <div
                key={index}
                className="w-full max-w-[450px] lg:w-[400px] h-[500px] bg-muted animate-pulse rounded-lg"
              />
            ))}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      <Header />
      {visiblePosts.length === 0 ? (
        <div className="flex-1 overflow-auto my-12 mx-auto w-full max-w-[888px] flex  justify-center">
          <Alert className="w-full max-w-[250px] h-fit">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>No posts found</AlertDescription>
          </Alert>
        </div>
      ) : (
        <VirtuosoGrid
          className="w-full max-w-[888px] mx-auto"
          listClassName="flex flex-row flex-wrap gap-6 w-full justify-center"
          totalCount={visiblePosts.length}
          data={visiblePosts}
          computeItemKey={(index) => visiblePosts[index].id}
          itemContent={(_index, data) => (
            <PostCard post={data} className="w-[400px] h-[500px]" />
          )}
          components={{
            Header: () => <div className="h-6" />,
            Footer: () => <div className="h-6" />,
            ScrollSeekPlaceholder: () => (
              <div className="w-full h-[500px] bg-muted animate-pulse rounded-lg" />
            ),
          }}
        />
      )}
      <Footer />
    </div>
  );
}
