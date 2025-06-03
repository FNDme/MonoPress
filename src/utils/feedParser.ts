import type { Post } from "../types/feed";

const stripHtml = (html: string): string => {
  const tmp = document.createElement("DIV");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
};

export const parseFeed = (xmlDoc: Document): Post[] => {
  const isAtom = xmlDoc.querySelector("feed") !== null;
  const isRss = xmlDoc.querySelector("rss") !== null;

  if (!isAtom && !isRss) {
    console.error("Unsupported feed format");
    return [];
  }

  let title = "";
  let logoUrl = "";
  let sourceName = "";
  let sourceUrl = "";
  let entries: Element[] = [];

  if (isAtom) {
    const feed = xmlDoc.querySelector("feed");
    if (!feed) return [];

    title =
      feed
        .querySelector("title")
        ?.textContent?.replace(/<!\[CDATA\[|\]\]>/g, "") || "";
    title = stripHtml(title);
    logoUrl = feed.querySelector("logo")?.textContent || "";
    sourceName =
      feed
        .querySelector("author > name")
        ?.textContent?.replace(/<!\[CDATA\[|\]\]>/g, "") || "";
    sourceName = stripHtml(sourceName);
    sourceUrl = feed.querySelector("author > uri")?.textContent || "";
    entries = Array.from(feed.querySelectorAll("entry"));
  } else {
    const channel = xmlDoc.querySelector("channel");
    if (!channel) return [];

    title =
      channel
        .querySelector("title")
        ?.textContent?.replace(/<!\[CDATA\[|\]\]>/g, "") || "";
    title = stripHtml(title);
    logoUrl = channel.querySelector("image > url")?.textContent || "";
    sourceName = title;
    sourceUrl = channel.querySelector("link")?.textContent || "";
    entries = Array.from(channel.querySelectorAll("item"));
  }

  return entries.map((entry) => {
    const id =
      entry.querySelector("guid")?.textContent ||
      entry.querySelector("id")?.textContent ||
      entry.querySelector("link")?.textContent ||
      "";

    if (!id) {
      console.error("No ID found for post");
    }

    let image = "";
    if (isAtom) {
      image =
        entry.querySelector("link[rel='enclosure']")?.getAttribute("href") ||
        entry
          .querySelector("media\\:content[type^='image']")
          ?.getAttribute("url") ||
        "";
    } else {
      const mediaContent = entry.getElementsByTagNameNS(
        "http://search.yahoo.com/mrss/",
        "content"
      )[0];

      image =
        mediaContent?.getAttribute("url") ||
        entry.querySelector("enclosure")?.getAttribute("url") ||
        entry.querySelector("image")?.getAttribute("url") ||
        entry
          .querySelector("description")
          ?.querySelector("img")
          ?.getAttribute("src") ||
        "";
    }

    let author = isAtom
      ? entry
          .querySelector("author > name")
          ?.textContent?.replace(/<!\[CDATA\[|\]\]>/g, "") || ""
      : entry.querySelector("author")?.textContent || "";
    author = stripHtml(author);

    const content = isAtom
      ? entry
          .querySelector("content")
          ?.textContent?.replace(/<!\[CDATA\[|\]\]>/g, "") || ""
      : "";
    let description = isAtom
      ? entry
          .querySelector("summary")
          ?.textContent?.replace(/<!\[CDATA\[|\]\]>/g, "") || content
      : entry
          .querySelector("description")
          ?.textContent?.replace(/<!\[CDATA\[|\]\]>/g, "") || "";
    description = stripHtml(description);

    const link = isAtom
      ? entry.querySelector("link[rel='alternate']")?.getAttribute("href") || ""
      : entry.querySelector("link")?.textContent || "";

    const date = isAtom
      ? entry.querySelector("published")?.textContent ||
        entry.querySelector("updated")?.textContent ||
        ""
      : entry.querySelector("pubDate")?.textContent || "";

    const tags = isAtom
      ? []
      : Array.from(entry.querySelectorAll("category"))
          .map(
            (cat) => cat.textContent?.replace(/<!\[CDATA\[|\]\]>/g, "") || ""
          )
          .filter(Boolean);

    return {
      id,
      title: stripHtml(
        entry
          .querySelector("title")
          ?.textContent?.replace(/<!\[CDATA\[|\]\]>/g, "") || ""
      ),
      description,
      image,
      link,
      date,
      author,
      tags: tags.map((tag) => stripHtml(tag)),
      source: {
        title,
        logoUrl,
        sourceName,
        sourceUrl,
      },
    };
  });
};
