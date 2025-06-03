export type Post = {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
  date: string;
  author: string;
  tags: string[];
  source: {
    title: string;
    logoUrl: string;
    sourceName: string;
    sourceUrl: string;
  };
};

export interface FeedCache {
  [url: string]: {
    data: Post[];
    timestamp: number;
  };
}
