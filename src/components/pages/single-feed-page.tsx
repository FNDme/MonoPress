import { AlertCircle, ArrowLeft } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { VirtuosoGrid } from "react-virtuoso";

import PostCard from "@/components/container/post-card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useRss } from "@/context/rss-context";
import Header from "../shared/layout/header";
import Footer from "../shared/layout/footer";
import { useMemo } from "react";
import { useStore } from "@/store/store";

export default function SingleFeedPage() {
  const { url } = useParams<{ url: string }>();
  const navigate = useNavigate();
  const { discardedIds } = useStore();
  const { postsByFeed, loading, error } = useRss();

  const decodedUrl = url ? decodeURIComponent(url) : "";
  const feedPosts = useMemo(() => {
    return postsByFeed[decodedUrl].filter(
      (post) => !discardedIds.includes(post.id)
    );
  }, [postsByFeed, decodedUrl, discardedIds]);
  const feedName =
    feedPosts[0]?.source?.sourceName ||
    feedPosts[0]?.source?.title ||
    decodedUrl;

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
          <div className="flex flex-row flex-wrap justify-center gap-6 p-8">
            {Array.from({ length: 10 }).map((_, index) => (
              <div
                key={index}
                className="w-full md:max-w-md h-[500px] bg-muted animate-pulse rounded-lg"
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
      <VirtuosoGrid
        className="w-full max-w-[888px] mx-auto"
        listClassName="flex flex-row flex-wrap gap-6 w-full justify-center"
        totalCount={feedPosts.length}
        data={feedPosts}
        computeItemKey={(index) => feedPosts[index].id}
        itemContent={(_index, data) => (
          <PostCard post={data} className="w-[400px] h-[500px]" />
        )}
        components={{
          Header: () => (
            <div className="px-4 py-8 flex items-center gap-4 max-w-[888px] mx-auto">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/")}
                className="shrink-0"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-2xl font-bold">{feedName}</h1>
            </div>
          ),
          Footer: () => <div className="h-6" />,
          ScrollSeekPlaceholder: () => (
            <div className="w-full h-[500px] bg-muted animate-pulse rounded-lg" />
          ),
        }}
      />
      <Footer />
    </div>
  );
}
